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
import { Message } from "../models/message.model.js"; 
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
    const responseUser = user.toObject();
    responseUser.password = responseUser.rawPassword || password;
    return res.status(200).json(new ApiResponse(200, responseUser, 'User added successfully'));
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
    
    for (const u of validUsers) {
        await User.create(u);
    }

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

    const formattedUsers = users.map(u => {
        const userObj = u.toObject();
        return {
            ...userObj,
            password: userObj.rawPassword || userObj.password
        };
    });

    const lastUserId = users[users.length - 1]._id;
    const hasMore = users.length === parseInt(limit);
    return res.status(200).json(new ApiResponse(200, formattedUsers, "Users fetched successfully", { lastId: lastUserId, hasMore }));
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
    const responseUser = user.toObject();
    responseUser.password = responseUser.rawPassword || responseUser.password;
    return res.status(200).json(new ApiResponse(200, responseUser, "User updated successfully"));
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
  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 7);

  // Count only important posts created in the last 7 days
  const count = await Post.countDocuments({
    isImportant: true,
    createdAt: { $gte: sevenDaysAgo }
  });

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

  const weeksCount = 5; // number of weeks to show
  const now = new Date();
  const weekStats = [];

  for (let i = weeksCount - 1; i >= 0; i--) {
    // Calculate Monday of each week
    const temp = new Date(now);
    const day = temp.getDay(); // 0 = Sunday
    const diffToMonday = temp.getDate() - day + (day === 0 ? -6 : 1); 
    temp.setDate(diffToMonday - 7 * i); // go back i weeks
    temp.setHours(0, 0, 0, 0);
    const weekStart = new Date(temp);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    const addedUsers = await User.countDocuments({
      isAdmin: false,
      createdAt: { $gte: weekStart, $lte: weekEnd },
    });

    const deletedUsers = await UserDeletionLog.countDocuments({
      deletedAt: { $gte: weekStart, $lte: weekEnd },
    });

    // Save stats with week label
    weekStats.push({
      label: `${weekStart.getDate()}/${weekStart.getMonth() + 1} - ${weekEnd.getDate()}/${weekEnd.getMonth() + 1}`,
      addedUsers,
      deletedUsers,
    });
  }

  res.status(200).json({
    totalUsers,
    weekStats,
  });
});

// controllers/complaint.controller.js
const getMonthlyComplaintStats = asyncHandler(async (req, res) => {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  const statuses = ["pending", "in progress", "rejected", "resolved"];
  const counts = {};

  for (const status of statuses) {
    counts[status] = await Complaint.countDocuments({
      status,
      createdAt: { $gte: monthStart, $lte: monthEnd },
    });
  }

  const totalComplaints = Object.values(counts).reduce((a, b) => a + b, 0);

  return res.status(200).json(
    new ApiResponse(200, { totalComplaints, counts }, "Monthly complaint stats fetched")
  );
});

const getYearlyCategoryStats = asyncHandler(async (req, res) => {
  const now = new Date();
  const year = now.getFullYear();
  const startOfYear = new Date(year, 0, 1);
  const endOfYear = new Date(year, 11, 31, 23, 59, 59, 999);

  // STEP 1: Aggregate complaints per month per normalized category
  const stats = await Complaint.aggregate([
    { $match: { createdAt: { $gte: startOfYear, $lte: endOfYear } } },
    {
      $group: {
        _id: {
          month: { $month: "$createdAt" },
          category: { $toLower: { $trim: { input: "$reason" } } }
        },
        count: { $sum: 1 },
      },
    },
  ]);

  // STEP 2: Merge certain categories
  const categoryMap = {
    "special service": "special", // merge into "special"
    "special request": "special", // merge into "special"
    // add more mappings here if needed
  };

  // STEP 3: Build final structured data
  const formatted = {};
  const months = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
  ];

  stats.forEach(item => {
    let category = item._id.category;
    if (categoryMap[category]) category = categoryMap[category]; // map similar categories

    if (!formatted[category]) formatted[category] = new Array(12).fill(0);
    const monthIndex = item._id.month - 1;
    formatted[category][monthIndex] += item.count; // add counts if merged
  });

  // Current month stats
  const currentMonth = now.getMonth();
  const currentMonthStats = {};
  Object.keys(formatted).forEach(cat => currentMonthStats[cat] = formatted[cat][currentMonth] || 0);

  res.status(200).json(
    new ApiResponse(200, {
      months,
      categoryData: formatted,
      currentMonthStats
    }, "Yearly category stats fetched successfully")
  );
});

const getMessagesCount = asyncHandler(async (req, res) => {
  const adminId = req.user._id;

  // Only count messages that:
  // 1. are not replies
  // 2. are not soft-deleted for this admin
  // 3. are not resolution proof notifications
  const totalMessages = await Message.countDocuments({
    isReply: false,
    deletedForAdmin: { $ne: adminId },
    message: { $not: { $regex: "Proof has been uploaded", $options: "i" } }
  });

  return res.status(200).json(
    new ApiResponse(200, { totalMessages }, "Total messages fetched successfully")
  );
});

const getResolutionProofStats = asyncHandler(async (req, res) => {
  const totalProofs = await Post.countDocuments({ isResolutionProof: true });
  const verifiedProofs = await Post.countDocuments({
    isResolutionProof: true,
    "resolutionVerification.isVerified": true,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      { totalProofs, verifiedProofs },
      "Resolution proof stats fetched successfully"
    )
  );
});

export {
  addUser,
  uploadUserViaCSV,
  getUsers,
  updateUsers,
  deleteUsers,
  getUsersCount,
  getAnnouncementsCount,
  getComplaintStats,
  getUserStats,
  getMonthlyComplaintStats,
  getYearlyCategoryStats,
  getMessagesCount,
  getResolutionProofStats
};