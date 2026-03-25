import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Guest } from "../models/guest.model.js";
import { sendGuestMessageConfirmation } from "../utils/NodeMailer.js"; // optional: use for email confirmation

// Submit contact message
const submitGuestMessage = asyncHandler(async (req, res) => {
  const {email, reason, message } = req.body;

  if (!email || !reason || !message) {
    throw new ApiError(400, "All fields are required");
  }

  // Create message
  const guest = await Guest.create({
    email,
    reason,
    message,
  });

  // Optional: send confirmation email to guest
  if (email) {
    sendGuestMessageConfirmation(email); // you can create a new function or reuse existing
  }

  res.status(201).json(
    new ApiResponse(201, guest, "Message submitted successfully")
  );
});

// Get all guest messages (Admin)
// Get all guest messages (Admin with filters)
const getGuestMessages = asyncHandler(async (req, res) => {
  const { search = "", date = "" } = req.query;

  let filter = {};

  // 🔍 Search by email OR reason
  if (search) {
    filter.$or = [
      { email: { $regex: search, $options: "i" } },
      { reason: { $regex: search, $options: "i" } },
    ];
  }

  // 📅 Filter by date
  if (date) {
    const start = new Date(date);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    filter.createdAt = {
      $gte: start,
      $lte: end,
    };
  }

  const messages = await Guest.find(filter).sort({ createdAt: -1 });

  res.status(200).json(
    new ApiResponse(200, messages, "Filtered guest messages fetched")
  );
});

// Delete Guest Message (Admin)
const deleteGuestMessage = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const message = await Guest.findById(id);

  if (!message) {
    throw new ApiError(404, "Message not found");
  }

  await message.deleteOne();

  res.status(200).json(
    new ApiResponse(200, null, "Message deleted successfully")
  );
});

// Mark message as read (Admin)
const markMessageAsRead = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const message = await Guest.findById(id);
  if (!message) {
    throw new ApiError(404, "Message not found");
  }

  if (!message.isReadByAdmin) {
    message.isReadByAdmin = true;
    await message.save();
  }

  res.status(200).json(new ApiResponse(200, message, "Message marked as read"));
});

export { submitGuestMessage, getGuestMessages, deleteGuestMessage, markMessageAsRead };

