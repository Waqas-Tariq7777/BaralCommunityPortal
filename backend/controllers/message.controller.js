import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";

// 1️⃣ Send message from user to admin
const sendMessage = asyncHandler(async (req, res) => {
  const { message } = req.body;
  const userId = req.user._id;

  if (!message || message.trim() === "") {
    throw new ApiError(400, "Message cannot be empty");
  }

  // Find admin user
  const admin = await User.findOne({ isAdmin: true });
  if (!admin) throw new ApiError(404, "Admin not found");

  const newMessage = await Message.create({
    sender: userId,
    recipient: admin._id,
    email: req.user.email,
    message: message.trim(),
  });

  res.status(201).json(new ApiResponse(201, newMessage, "Message sent successfully"));
});

// 2️⃣ Get inbox messages for logged-in user
// 10️⃣ Get user inbox with replies
const getInbox = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const { search, date, type, status } = req.query;

  const query = { 
    sender: userId, 
    isReply: false,   // only original messages
    deletedAt: null 
  };

  if (search && search.trim() !== "") {
    query.message = { $regex: search.trim(), $options: "i" };
  }

  if (date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    query.createdAt = { $gte: start, $lte: end };
  }

  if (type) query.type = type;
  if (status) query.status = status;

  // ✅ FETCH USER MESSAGES
  const messages = await Message.find(query)
    .populate("recipient", "userName email")
    .sort({ createdAt: -1 });

  // ✅ ATTACH REPLIES
  const messagesWithReplies = await Promise.all(
    messages.map(async (msg) => {
      const replies = await Message.find({
        parentMessage: msg._id,
        isReply: true,
      })
        .populate("sender", "userName email")
        .sort({ createdAt: 1 });

      return {
        ...msg.toObject(),
        replies,
      };
    })
  );

  res.status(200).json(
    new ApiResponse(200, messagesWithReplies, "Inbox with replies fetched")
  );
});

// 3️⃣ Edit message (user can only edit their own messages)
const editMessage = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { messageId } = req.params;
  const { message } = req.body;

  if (!message || message.trim() === "") {
    throw new ApiError(400, "Message cannot be empty");
  }

  // Find the message
  const existingMessage = await Message.findById(messageId);
  if (!existingMessage) throw new ApiError(404, "Message not found");

  // Only sender can edit
  if (existingMessage.sender.toString() !== userId.toString()) {
    throw new ApiError(403, "You can only edit your own messages");
  }

  existingMessage.message = message.trim();
  existingMessage.editedAt = new Date(); // optional, track edits
  await existingMessage.save();

  res.status(200).json(new ApiResponse(200, existingMessage, "Message updated successfully"));
});

// 4️⃣ Delete message (user can only delete their own messages)
const deleteMessage = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { messageId } = req.params;

  // Find the message
  const message = await Message.findById(messageId);
  if (!message) throw new ApiError(404, "Message not found");

  // Only sender can delete
  if (message.sender.toString() !== userId.toString()) {
    throw new ApiError(403, "You can only delete your own messages");
  }

  // Delete permanently
  await Message.findByIdAndDelete(messageId);

  res.status(200).json(new ApiResponse(200, null, "Message deleted successfully"));
});

// 5️⃣ Get all messages for admin
const getAdminMessages = asyncHandler(async (req, res) => {
  const adminId = req.user._id;

  const admin = await User.findById(adminId);
  if (!admin || !admin.isAdmin) throw new ApiError(403, "Access denied.");

  const { search, date } = req.query;

  let query = { 
    deletedAt: null, 
    deletedForAdmin: { $ne: adminId },
    message: { $not: { $regex: "Proof has been uploaded", $options: "i" } } 
  };

  if (search && search.trim() !== "") {
    const users = await User.find({
      $or: [
        { userName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { houseNumber: { $regex: search, $options: "i" } },
      ],
    }).select("_id");

    const userIds = users.map((u) => u._id);

    query.$or = [{ message: { $regex: search, $options: "i" } }, { sender: { $in: userIds } }];
  }

  if (date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    query.createdAt = { $gte: start, $lte: end };
  }

  const messages = await Message.find(query)
    .populate("sender", "userName email houseNumber profilePicture")
    .populate("recipient", "userName email")
    .populate("parentMessage")
    .sort({ createdAt: -1 });

    // 🔥 ADD THIS BLOCK
  const messagesWithStatus = await Promise.all(
    messages.map(async (msg) => {
      if (msg.isReply) return msg;

      const adminReply = await Message.exists({
  parentMessage: msg._id,
  isReply: true,
  sender: adminId,
});

      return {
        ...msg.toObject(),
        hasAdminReply: !!adminReply, // ✅ important
      };
    })
  );

  res.status(200).json(new ApiResponse(200, messagesWithStatus, "Admin messages fetched"));
});
// 6️⃣ Get unread messages count (Admin)
// 6️⃣ Get unread messages count (Admin) - Corrected
const getUnreadCount = asyncHandler(async (req, res) => {
  const adminId = req.user._id;

  const admin = await User.findById(adminId);
  if (!admin || !admin.isAdmin) {
    throw new ApiError(403, "Access denied");
  }

  // ✅ Only count messages that:
  // 1. Are not soft-deleted for this admin
  // 2. Are original messages (not replies)
  // 3. Have not yet been replied to by admin
  const count = await Message.countDocuments({
    isReply: false,
    deletedAt: null,
    deletedForAdmin: { $ne: adminId },
    read: false,
    message: { $not: { $regex: "Proof has been uploaded", $options: "i" } },
    // Check that no reply exists from this admin
    _id: { 
      $nin: await Message.find({
        parentMessage: { $ne: null },
        sender: adminId
      }).distinct("parentMessage")
    }
  });

  res.status(200).json(
    new ApiResponse(200, count, "Unread messages count")
  );
});

const markAsRead = asyncHandler(async (req, res) => {
  const { messageId } = req.params;

  const message = await Message.findById(messageId);
  if (!message) throw new ApiError(404, "Message not found");

  message.read = true;
  await message.save();

  res.status(200).json(new ApiResponse(200, message, "Marked as read"));
});

// 7️⃣ Admin Reply to message
const replyToMessage = asyncHandler(async (req, res) => {
  const adminId = req.user._id;
  const { messageId } = req.params;
  const { message } = req.body;

  if (!message || message.trim() === "") {
    throw new ApiError(400, "Reply cannot be empty");
  }

  // Check admin
  const admin = await User.findById(adminId);
  if (!admin || !admin.isAdmin) {
    throw new ApiError(403, "Access denied");
  }

  // Find original message
  const originalMessage = await Message.findById(messageId);
  if (!originalMessage) {
    throw new ApiError(404, "Original message not found");
  }

  // Create reply
  const reply = await Message.create({
    sender: adminId,
    recipient: originalMessage.sender, // reply goes to user
    email: admin.email,
    message: message.trim(),
    parentMessage: originalMessage._id,
    isReply: true,
  });

  res.status(201).json(
    new ApiResponse(201, reply, "Reply sent successfully")
  );
});

// 8️⃣ Edit a reply (Admin only)
const editReply = asyncHandler(async (req, res) => {
  const adminId = req.user._id;
  const { replyId } = req.params;
  const { message } = req.body;

  if (!message || message.trim() === "") {
    throw new ApiError(400, "Reply cannot be empty");
  }

  // Check admin
  const admin = await User.findById(adminId);
  if (!admin || !admin.isAdmin) {
    throw new ApiError(403, "Access denied");
  }

  // Find reply
  const reply = await Message.findById(replyId);
  if (!reply) throw new ApiError(404, "Reply not found");

  // Only admin who sent the reply can edit
  if (reply.sender.toString() !== adminId.toString()) {
    throw new ApiError(403, "You can only edit your own replies");
  }

  reply.message = message.trim();
  reply.editedAt = new Date(); // Optional: track edits
  await reply.save();

  res.status(200).json(new ApiResponse(200, reply, "Reply updated successfully"));
});

// 9️⃣ Delete a reply (Admin only)
const deleteReply = asyncHandler(async (req, res) => {
  const adminId = req.user._id;
  const { replyId } = req.params;

  // Check admin
  const admin = await User.findById(adminId);
  if (!admin || !admin.isAdmin) {
    throw new ApiError(403, "Access denied");
  }

  // Find reply
  const reply = await Message.findById(replyId);
  if (!reply) throw new ApiError(404, "Reply not found");

  // Only admin who sent the reply can delete
  if (reply.sender.toString() !== adminId.toString()) {
    throw new ApiError(403, "You can only delete your own replies");
  }

  // Delete reply
  await Message.findByIdAndDelete(replyId);

  res.status(200).json(new ApiResponse(200, null, "Reply deleted successfully"));
});

// Soft delete a message (admin can hide it without deleting from DB)
const softDeleteMessage = asyncHandler(async (req, res) => {
  const adminId = req.user._id;
  const { messageId } = req.params;

  const message = await Message.findById(messageId);
  if (!message) throw new ApiError(404, "Message not found");

  // Add adminId to deletedForAdmin array if not already there
  if (!message.deletedForAdmin.includes(adminId)) {
    message.deletedForAdmin.push(adminId);
    await message.save();
  }

  // Also hide replies for this admin
  await Message.updateMany(
    { parentMessage: messageId, deletedForAdmin: { $ne: adminId } },
    { $push: { deletedForAdmin: adminId } }
  );

  res.status(200).json(new ApiResponse(200, null, "Message soft-deleted for admin"));
});

// Get user notifications (Messages sent to logged-in user)
const getUserNotifications = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const userEmail = req.user.email;

  const notifications = await Message.find({
    sender: { $ne: userId },
    $or: [{ recipient: userId }, { email: userEmail }],
    deletedAt: null,
  })
    .sort({ createdAt: -1 })
    .populate("sender", "userName profilePicture");

  const unreadCount = notifications.filter((n) => !n.read).length;

  return res.status(200).json(
    new ApiResponse(200, { notifications, unreadCount }, "User notifications fetched successfully")
  );
});

// Mark user notification as read
const markUserNotificationAsRead = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  const notification = await Message.findById(messageId);
  if (!notification) throw new ApiError(404, "Notification not found");

  notification.read = true;
  await notification.save();

  return res.status(200).json(new ApiResponse(200, notification, "Notification marked as read"));
});

export { 
  sendMessage,
  getInbox,
  editMessage,
  deleteMessage,
  getAdminMessages,
  getUnreadCount,
  markAsRead,
  replyToMessage,
  editReply,
  deleteReply,
  softDeleteMessage,
  getUserNotifications,
  markUserNotificationAsRead
};