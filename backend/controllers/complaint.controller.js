import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { Complaint } from "../models/complaint.model.js";
import { sendComplaintConfirmation } from "../utils/NodeMailer.js";

// Submit a complaint
const submitComplaint = asyncHandler(async (req, res) => {
  const { complaintType, category, message } = req.body;

  if (!complaintType || !category || !message) {
    throw new ApiError(400, "All fields are required");
  }

  const complaint = await Complaint.create({
    userId: req.user._id,
    complaintType,
    reason: category,
    message,
    status: "pending"
  });

  sendComplaintConfirmation(req.user.email);

  res.status(201).json(
    new ApiResponse(201, complaint, "Complaint submitted successfully")
  );
});

// Get complaints for logged-in user
const getUserComplaints = asyncHandler(async (req, res) => {
  const { limit = 25, lastId, search, type, status } = req.query;

  const query = { userId: req.user._id };

  if (type && type !== "All") query.complaintType = type.toLowerCase();
  if (status && status !== "Any") query.status = status;
  if (search) query.reason = { $regex: search, $options: "i" };
  if (lastId) query._id = { $gt: lastId };

  const complaints = await Complaint.find(query)
    .populate("userId", "email mobileNumber userName")
    .sort({ _id: 1 })
    .limit(parseInt(limit));

  if (!complaints.length) {
    return res.status(200).json(
      new ApiResponse(200, [], "No complaints found", { hasMore: false })
    );
  }

  const lastComplaintId = complaints[complaints.length - 1]._id;
  const hasMore = complaints.length === parseInt(limit);

  res.status(200).json(
    new ApiResponse(200, complaints, "Complaints fetched successfully", {
      lastId: lastComplaintId,
      hasMore,
    })
  );
});

// Update complaint (user)
const updateUserComplaint = asyncHandler(async (req, res) => {
  const { complaintId } = req.params;
  const { complaintType, category, message } = req.body;

  if (!complaintType || !category || !message) {
    throw new ApiError(400, "All fields are required");
  }

  const complaint = await Complaint.findOne({
    _id: complaintId,
    userId: req.user._id,
  });

  if (!complaint) {
    throw new ApiError(404, "Complaint not found or unauthorized");
  }

  complaint.complaintType = complaintType;
  complaint.reason = category;
  complaint.message = message;

  await complaint.save();

  res.status(200).json(
    new ApiResponse(200, complaint, "Complaint updated successfully")
  );
});

// Delete complaint (user)
const deleteComplaint = asyncHandler(async (req, res) => {
  const { complaintId } = req.params;

  if (!complaintId) throw new ApiError(400, "Complaint ID is required");

  const complaint = await Complaint.findOne({ _id: complaintId, userId: req.user._id });
  if (!complaint) throw new ApiError(404, "Complaint not found or unauthorized");

  await complaint.deleteOne();

  res.status(200).json(new ApiResponse(200, null, "Complaint deleted successfully"));
});



// Get all complaints (admin)
const getAllComplaints = asyncHandler(async (req, res) => {
  const { limit = 25, lastId, search, type, status } = req.query;
  const query = {};

  if (type && type !== "All") query.complaintType = type.toLowerCase();
  if (status && status !== "Any") query.status = status;
  if (lastId) query._id = { $gt: lastId };

  const userMatch = search
    ? {
        $or: [
          { email: { $regex: search, $options: "i" } },
          { userName: { $regex: search, $options: "i" } },
          { mobileNumber: { $regex: search, $options: "i" } },
        ],
      }
    : {};

  const complaints = await Complaint.find(query)
    .populate({
      path: "userId",
      select: "email mobileNumber userName houseNumber profilePicture",
      match: userMatch,
    })
    .sort({ _id: 1 })
    .limit(parseInt(limit));

  const filteredComplaints = complaints.filter(c => c.userId);

  if (!filteredComplaints.length) {
    return res.status(200).json(
      new ApiResponse(200, [], "No complaints found", { hasMore: false })
    );
  }

  const lastComplaintId = filteredComplaints[filteredComplaints.length - 1]._id;
  const hasMore = filteredComplaints.length === parseInt(limit);

  res.status(200).json(
    new ApiResponse(200, filteredComplaints, "Complaints fetched successfully", {
      lastId: lastComplaintId,
      hasMore,
    })
  );
});

// Update complaint status (admin)
const updateComplaintStatus = asyncHandler(async (req, res) => {
  const { complaintId } = req.params;
  const { status } = req.body;

  const allowed = ["pending", "in progress", "rejected", "resolved"];
  if (!allowed.includes(status)) throw new ApiError(400, "Invalid status");

  const complaint = await Complaint.findByIdAndUpdate(
    complaintId,
    { status },
    { new: true }
  ).populate("userId", "email userName houseNumber profilePic");

  if (!complaint) throw new ApiError(404, "Complaint not found");

  res.status(200).json(
    new ApiResponse(200, complaint, "Status updated successfully")
  );
});

export {
  submitComplaint,
  getUserComplaints,
  updateUserComplaint,
  deleteComplaint,
  getAllComplaints,
  updateComplaintStatus
};
