import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { User } from '../models/user.model.js';
import fs from "fs";
import xlsx from "xlsx";
import { Post } from '../models/post.model.js';
import { Complaint } from "../models/complaint.model.js";
import mongoose from "mongoose"; // make sure mongoose is imported at the top
import { UserDeletionLog } from "../models/userDeletionLog.model.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

const addUser = asyncHandler(async (req, res) => {
    const { userName, email, password, houseNumber, mobileNumber, designation } = req.body;
    if (!userName || !email || !password || !houseNumber || !mobileNumber || !designation) {
        throw new ApiError(400, 'All fields must be required.');
    }

    const existedUser = await User.findOne({ $or: [{ email }, { houseNumber }, { mobileNumber }] });
    if (existedUser) {
        let conflictField = "";
        if (existedUser.email === email) conflictField = "email";
        else if (existedUser.houseNumber === houseNumber) conflictField = "house number";
        else if (existedUser.mobileNumber === mobileNumber) conflictField = "mobile number";
        throw new ApiError(409, `User with this ${conflictField} already exists`);
    }

    const user = await User.create({ userName, email, password, houseNumber, mobileNumber, designation });
    return res.status(200).json(new ApiResponse(200, user, 'User added successfully'));
});

const uploadUserViaCSV = asyncHandler(async (req, res) => {
    if (!req.file) throw new ApiError(400, "CSV/Excel file is required");
    const filePath = req.file.path;

    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const rows = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    if (!rows.length) throw new ApiError(400, "Uploaded file is empty");

    const validUsers = [];
    const rejectedUsers = [];

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const { userName, email, password, houseNumber, mobileNumber, designation } = row;
        if (!userName || !email || !password || !houseNumber || !mobileNumber || !designation) {
            rejectedUsers.push({ row, reason: "Missing required fields" });
            continue;
        }
        if (!emailRegex.test(email)) {
            rejectedUsers.push({ row, reason: "Invalid email format" });
            continue;
        }
        if (!passwordRegex.test(password)) {
            rejectedUsers.push({ row, reason: "Password must contain uppercase, lowercase, number & minimum 6 characters" });
            continue;
        }

        const duplicate = await User.findOne({ $or: [{ email }, { houseNumber }, { mobileNumber }] });
        if (duplicate) {
            rejectedUsers.push({ row, reason: "Duplicate email, house number or mobile number" });
            continue;
        }

        validUsers.push({ userName, email, password, houseNumber, mobileNumber, designation });
    }

    if (!validUsers.length) throw new ApiError(400, "No valid users found in uploaded file");
    await User.insertMany(validUsers);

    res.status(201).json(new ApiResponse(201, { insertedCount: validUsers.length, rejectedCount: rejectedUsers.length, rejectedUsers }, "Users uploaded successfully"));
    if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
});

const getUsers = asyncHandler(async (req, res) => {
    const { limit = 25, lastId, search } = req.query;
    const query = { isAdmin: false };
    if (lastId) query._id = { $lt: lastId };
    if (search) query.$or = [{ userName: new RegExp(search, "i") }, { email: new RegExp(search, "i") }, { houseNumber: new RegExp(search, "i") }];

    const users = await User.find(query).sort({ _id: -1 }).limit(parseInt(limit));
    if (!users.length) return res.status(200).json(new ApiResponse(200, [], "No users found", { hasMore: false }));

    const lastUserId = users[users.length - 1]._id;
    const hasMore = users.length === parseInt(limit);
    return res.status(200).json(new ApiResponse(200, users, "Users fetched successfully", { lastId: lastUserId, hasMore }));
});

const updateUsers = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!req.body || Object.keys(req.body).length === 0) throw new ApiError(400, "No data provided for update");

    const { userName, email, houseNumber, mobileNumber, designation, password } = req.body;
    if (email && !emailRegex.test(email)) throw new ApiError(400, "Invalid email format");

    const user = await User.findById(id);
    if (!user) throw new ApiError(404, "User not found");

    if (email || houseNumber || mobileNumber) {
        const duplicateUser = await User.findOne({ _id: { $ne: id }, $or: [{ email }, { houseNumber }, { mobileNumber }].filter(Boolean) });
        if (duplicateUser) {
            let conflictField = "";
            if (duplicateUser.email === email) conflictField = "email";
            else if (duplicateUser.houseNumber === houseNumber) conflictField = "house number";
            else if (duplicateUser.mobileNumber === mobileNumber) conflictField = "mobile number";
            throw new ApiError(409, `User with this ${conflictField} already exists`);
        }
    }

    if (userName) user.userName = userName;
    if (email) user.email = email;
    if (houseNumber) user.houseNumber = houseNumber;
    if (mobileNumber) user.mobileNumber = mobileNumber;
    if (designation) user.designation = designation;
    if (password) user.password = password;

    await user.save();
    return res.status(200).json(new ApiResponse(200, user, "User updated successfully"));
});

const deleteUsers = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) throw new ApiError(404, "User not found");

  // ✅ Log deletion BEFORE removing
  await UserDeletionLog.create({
    userId: user._id,
  });

  // ✅ Permanently delete
  await user.deleteOne();

  res.status(200).json(new ApiResponse(200, null, "User deleted successfully"));
});

const getUsersCount = asyncHandler(async (req, res) => {
    const totalUsers = await User.countDocuments({ isAdmin: false });

    return res.status(200).json(
        new ApiResponse(200, { totalUsers }, "Total users fetched successfully")
    );
});

const getAnnouncementsCount = asyncHandler(async (req, res) => {
  const count = await Post.countDocuments({ isImportant: true });
  return res.status(200).json({ count });
});

const getComplaintStats = asyncHandler(async (req, res) => {
  const pendingCount = await Complaint.countDocuments({ status: "pending" });
  const resolvedCount = await Complaint.countDocuments({ status: "resolved" });

  return res.status(200).json({
    pending: pendingCount,
    resolved: resolvedCount,
  });
});

const getUserStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments({ isAdmin: false });

  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const weekStart = new Date(now.setDate(diff));
  weekStart.setHours(0, 0, 0, 0);

  const addedUsers = await User.countDocuments({
    isAdmin: false,
    createdAt: { $gte: weekStart },
  });

  const deletedUsers = await UserDeletionLog.countDocuments({
    deletedAt: { $gte: weekStart },
  });

  res.status(200).json({
    totalUsers,
    addedUsers,
    deletedUsers,
  });
});

export { addUser, uploadUserViaCSV, getUsers, updateUsers, deleteUsers, getUsersCount, getAnnouncementsCount, getComplaintStats, getUserStats};
