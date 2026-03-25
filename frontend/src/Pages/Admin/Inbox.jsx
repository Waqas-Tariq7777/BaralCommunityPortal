// AdminInbox.jsx
import React, { useEffect, useState } from "react";
import { useMessageStore } from "../../Store/MessageStore";
import { FiSearch, FiCalendar, FiMail, FiUser, FiHome } from "react-icons/fi";
import { motion } from "framer-motion";
import ConfirmDeleteModal from "../../Components/Admin/ConfirmDeleteModal";

const AdminInbox = () => {
  const {
    messages,
    fetchAdminMessages,
    loading,
    replyToMessage,
    editReply,
    deleteReply,
    softDeleteMessage,
    markMessageAsRead,
  } = useMessageStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [searchDate, setSearchDate] = useState("");

  // Reply states
  const [replyText, setReplyText] = useState("");
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [showReplies, setShowReplies] = useState({}); // Track replies visibility per message

  // Inline edit states for replies
  const [editingReplyId, setEditingReplyId] = useState(null);
  const [editingContent, setEditingContent] = useState("");

  // Delete Reply modal
  const [showDeleteReplyModal, setShowDeleteReplyModal] = useState(false);
  const [deleteReplyId, setDeleteReplyId] = useState(null);

  // Delete Message modal
  const [showDeleteMessageModal, setShowDeleteMessageModal] = useState(false);
  const [deleteMessageId, setDeleteMessageId] = useState(null);

  useEffect(() => {
    fetchAdminMessages(searchTerm, searchDate);
  }, [searchTerm, searchDate]);

  const toggleReplies = (msgId) => {
    setShowReplies((prev) => ({ ...prev, [msgId]: !prev[msgId] }));
  };

  // Reply editing
  const handleEditReply = (reply) => {
    setEditingReplyId(reply._id);
    setEditingContent(reply.message);
  };

  const handleSaveEdit = async (replyId) => {
    if (editingContent.trim() === "") return;
    await editReply(replyId, editingContent, () => {
      fetchAdminMessages(searchTerm, searchDate);
      setEditingReplyId(null);
      setEditingContent("");
    });
  };

  // Delete Reply
  const handleDeleteReplyClick = (replyId) => {
    setDeleteReplyId(replyId);
    setShowDeleteReplyModal(true);
  };

  const handleConfirmDeleteReply = async () => {
    if (!deleteReplyId) return;
    await deleteReply(deleteReplyId, () => {
      fetchAdminMessages(searchTerm, searchDate);
      setShowDeleteReplyModal(false);
      setDeleteReplyId(null);
    });
  };

  // Soft Delete Message
  const handleDeleteMessageClick = (messageId) => {
    setDeleteMessageId(messageId);
    setShowDeleteMessageModal(true);
  };

  const handleConfirmDeleteMessage = async () => {
    if (!deleteMessageId) return;
    await softDeleteMessage(deleteMessageId, () => {
      fetchAdminMessages(searchTerm, searchDate);
      setShowDeleteMessageModal(false);
      setDeleteMessageId(null);
    });
  };

  // Handle Reply + Mark as Read
  const handleReply = async (msgId) => {
    if (replyText.trim() === "") return;
    await replyToMessage(msgId, replyText, () => {
      setReplyText("");
      setActiveReplyId(null);
      fetchAdminMessages(searchTerm, searchDate);
    });
  };

  // Handle manual mark as read
  const handleMarkAsRead = async (msgId) => {
    await markMessageAsRead(msgId, () => {
      // update local state immediately
      setShowReplies((prev) => ({ ...prev })); // optional if replies visible
      useMessageStore.setState((state) => ({
        messages: state.messages.map((msg) =>
          msg._id === msgId ? { ...msg, hasAdminReply: true, read: true } : msg
        ),
      }));
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Header */}
      <h2 className="text-2xl font-bold mb-6 dark:text-gray-200">Community Inbox</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <FiSearch className="absolute left-3 top-3 text-[#748dff]" />
          <input
            type="text"
            placeholder="Search messages by email / house number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 p-2 border bg-white border-gray-300 dark:bg-transparent dark:border-slate-700 rounded placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#748dff]"
          />
        </div>

        <div className="relative min-w-[180px]">
          <FiCalendar className="absolute left-3 top-3 text-[#748dff]" />
          <input
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            className="cursor-pointer w-full pl-10 p-2 border bg-white dark:text-gray-300 border-gray-300 dark:bg-transparent dark:border-slate-700 rounded focus:outline-none focus:ring-2 focus:ring-[#748dff]"
          />
        </div>
      </div>

      {/* Loader */}
      {loading && (
        <div className="flex justify-center py-6">
          <div className="w-10 h-10 border-4 border-[#748dff] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* No Messages */}
      {!loading && messages.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          <FiMail className="text-5xl mx-auto mb-3 text-[#748dff]" />
          <p>No messages found</p>
        </div>
      )}

      {/* Messages List */}
      <div className="grid gap-4">
        {messages
          .filter((msg) => !msg.isReply)
          .map((msg) => {
            const replies = messages.filter(
              (r) => (r.parentMessage?._id || r.parentMessage)?.toString() === msg._id.toString()
            );

            return (
              <motion.div
                key={msg._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-md border border-gray-200 dark:border-slate-700 hover:shadow-lg transition relative"
              >
                {/* Top Section */}
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={msg.sender?.profilePicture?.url || "/default.png"}
                    alt="profile"
                    loading="lazy"
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#748dff]"
                  />
                  {/* Unread Pill + Mark as Read */}
                  {/* Unread Pill + Mark as Read */}
                  {!msg.read && !msg.hasAdminReply && (
                    <div className="absolute -top-1 right-3 flex gap-1 items-center">
                      <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full shadow">
                        Unread
                      </span>
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        <FiUser className="text-[#748dff]" />
                        {msg.sender?.userName || "Unknown User"}
                      </h3>
                      <span className="text-xs text-gray-400">
                        {new Date(msg.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                      <FiMail className="text-[#748dff]" />
                      {msg.sender?.email}
                    </p>

                    <p className="text-xs text-gray-400 flex items-center gap-2 mt-1">
                      <FiHome className="text-[#748dff]" />
                      House No: {msg.sender?.houseNumber || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Message Content Box */}
                <div className="bg-[#f5f7ff] dark:bg-slate-900 p-4 rounded-lg border border-[#e0e7ff] dark:border-slate-600 relative">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 flex items-center justify-center bg-[#748dff] text-white rounded-md">
                      <FiMail />
                    </div>
                    <h4 className="font-semibold text-gray-800 dark:text-white">Message Content</h4>
                  </div>
                  <p className="text-gray-700 dark:text-gray-200 leading-relaxed pl-1 mb-2">{msg.message}</p>

                  {/* Reply input + buttons */}
                  {activeReplyId === msg._id && (
                    <div className="flex gap-2 mt-2">
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder={`Reply to ${msg.sender?.userName || "User"}...`}
                        className="flex-1 p-2 border rounded resize-none dark:text-white border-gray-300 dark:border-slate-600 focus:outline-none focus:border-[#748dff] focus:ring-1 focus:ring-[#748dff]"
                      />
                      <button
                        onClick={() => handleReply(msg._id)}
                        className="bg-[#748dff] cursor-pointer text-white px-4 py-2 rounded"
                      >
                        Send
                      </button>
                      <button
                        onClick={() => setActiveReplyId(null)}
                        className="text-red-500 cursor-pointer text-xl font-bold hover:text-red-700"
                        title="Cancel Reply"
                      >
                        ×
                      </button>
                    </div>
                  )}

                  {/* Reply / View Replies / Reply Button */}
                  <div className="mt-2 flex flex-wrap gap-2 items-center">
                    {activeReplyId !== msg._id && (
                      <button
                        onClick={() => setActiveReplyId(msg._id)}
                        className="text-sm text-[#748dff] cursor-pointer hover:underline"
                      >
                        Reply
                      </button>
                    )}

                    {replies.length > 0 && (
                      <button
                        onClick={() => toggleReplies(msg._id)}
                        className="text-sm text-[#748dff] cursor-pointer hover:underline"
                      >
                        {showReplies[msg._id] ? "Hide Replies" : "View Replies"}
                      </button>
                    )}
                  </div>

                  {/* Show Replies */}
                  {showReplies[msg._id] && replies.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {replies.map((reply) => (
                        <div
                          key={reply._id}
                          className="bg-green-50 dark:bg-slate-900 p-3 dark:border-[#748dff] rounded border"
                        >
                          <p className="text-sm text-green-600 font-semibold">
                            Reply to {msg.sender?.userName || "User"}
                          </p>

                          {/* Inline Editing */}
                          {editingReplyId === reply._id ? (
                            <div className="mt-1 flex gap-2">
                              <textarea
                                value={editingContent}
                                onChange={(e) => setEditingContent(e.target.value)}
                                className="flex-1 p-2 border rounded resize-none dark:text-white border-gray-300 dark:border-slate-600 focus:outline-none focus:border-[#748dff] focus:ring-1 focus:ring-[#748dff]"
                              />
                              <button
                                onClick={() => handleSaveEdit(reply._id)}
                                className="bg-[#748dff] cursor-pointer text-white px-3 py-1 rounded"
                              >
                                Send
                              </button>
                              <button
                                onClick={() => setEditingReplyId(null)}
                                className="text-red-500 text-xl cursor-pointer font-bold hover:text-red-700"
                              >
                                ×
                              </button>
                            </div>
                          ) : (
                            <>
                              <p className="text-gray-700 dark:text-gray-200 mt-1">{reply.message}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <button
                                  onClick={() => handleEditReply(reply)}
                                  className="text-xs cursor-pointer text-blue-500 hover:underline"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteReplyClick(reply._id)}
                                  className="text-xs cursor-pointer text-red-500 hover:underline"
                                >
                                  Delete
                                </button>
                              </div>
                            </>
                          )}

                          <span className="text-xs text-gray-400 block mt-1">
                            {new Date(reply.createdAt).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Soft Delete Message Button */}
                  <div className="flex justify-end mt-2">
                    {!msg.read && !msg.hasAdminReply && (
                      <button
                        onClick={() => handleMarkAsRead(msg._id)}
                        className=" text-green-400 text-sm px-3 py-1 rounded hover:underline cursor-pointer"
                        title="Mark as read"
                      >
                        Mark as Read
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteMessageClick(msg._id)}
                      className="text-red-500 cursor-pointer text-sm hover:underline"
                    >
                      Delete Message
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
      </div>

      {/* Delete Reply Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={showDeleteReplyModal}
        onClose={() => setShowDeleteReplyModal(false)}
        onConfirm={handleConfirmDeleteReply}
        loading={loading}
        titleKey="Delete Reply"
        messageKey="Are you sure to delete this reply?"
      />

      {/* Delete Message Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={showDeleteMessageModal}
        onClose={() => setShowDeleteMessageModal(false)}
        onConfirm={handleConfirmDeleteMessage}
        loading={loading}
        titleKey="Delete Message"
        messageKey="Are you sure you want to delete this message?"
      />
    </div>
  );
};

export default AdminInbox;