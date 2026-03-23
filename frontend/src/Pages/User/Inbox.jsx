import React, { useEffect, useState } from "react";
import { useMessageStore } from "../../Store/MessageStore";
import { useAuthStore } from "../../Store/AuthStore";
import { FiPlusCircle, FiX, FiFilter, FiSearch, FiMail } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmDeleteModal from "../../Components/Admin/ConfirmDeleteModal";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from '../../Store/LanguageStore.js';

const Inbox = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const { messages, fetchInbox, sendMessage, editMessage, loading } = useMessageStore();

  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editMessageId, setEditMessageId] = useState(null);
  const { language } = useLanguageStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteMessageId, setDeleteMessageId] = useState(null);

  // ✅ NEW STATE → toggle replies per message
  const [openReplies, setOpenReplies] = useState({});

  useEffect(() => {
    fetchInbox(searchTerm, searchDate, typeFilter, statusFilter);
  }, [searchTerm, searchDate, typeFilter, statusFilter]);

  const handleSend = async () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage) {
      toast.error(t("message_empty_error"));
      return;
    }
    if (trimmedMessage.length < 20) {
      toast.error(t("message_length_error"));
      return;
    }

    try {
      if (editMode) {
        await editMessage(editMessageId, trimmedMessage, () => {
          setMessage("");
          setShowModal(false);
          setEditMode(false);
          setEditMessageId(null);
          fetchInbox(searchTerm, searchDate, typeFilter, statusFilter);
        });
      } else {
        await sendMessage(trimmedMessage, () => {
          setMessage("");
          setShowModal(false);
          fetchInbox(searchTerm, searchDate, typeFilter, statusFilter);
        });
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error(error);
    }
  };

  const handleEditClick = (msg) => {
    setEditMode(true);
    setEditMessageId(msg._id);
    setMessage(msg.message);
    setShowModal(true);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 relative">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <div dir={language === "ur" ? "rtl" : "ltr"} className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3 sm:gap-0">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{t("inbox")}</h2>
        <button
          className="cursor-pointer flex items-center gap-2 bg-[#748dff] text-white px-4 py-2 rounded hover:bg-[#5f77e0] w-full sm:w-auto justify-center"
          onClick={() => {
            setShowModal(true);
            setEditMode(false);
            setMessage("");
          }}
        >
          <FiPlusCircle /> {t("new_message")}
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6 items-center">
        <div dir={language === "ur" ? "rtl" : "ltr"} className="relative flex-1 min-w-[180px]">
          <FiSearch className="absolute left-3 top-3 text-[#748dff]" />
          <input
            type="text"
            placeholder={t("Search_placeholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 p-2 border bg-white border-gray-300 dark:bg-transparent dark:border-slate-700 rounded placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#748dff]"
          />
        </div>

        <div className="cursor-pointer relative min-w-[150px]">
          <FiFilter className="cursor-pointer absolute left-3 top-3 text-[#748dff]" />
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
        <div className="flex justify-center items-center py-6">
          <div className="w-12 h-12 border-4 border-[#748dff] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Messages */}
      {!loading && messages.length === 0 ? (
        <div className="flex flex-col justify-center items-center py-12 text-gray-500 dark:text-gray-400">
          <FiMail className="text-[#748dff] text-6xl mb-4" />
          <p className="text-xl font-semibold text-center">{t("no_messages_found")}</p>
          <p className="text-sm mt-1 text-center">{t("no_messages_subtext")}</p>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1">
          {[...messages]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // latest first
            .map((msg) => {
              const isSent = msg.sender?._id === user._id;
              const topText = isSent
                ? t("to_text", { name: msg.recipient?.userName || "Unknown" })
                : t("from_text", { name: msg.sender?.userName || "Unknown" });

              return (
                <motion.div
                  key={msg._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border-l-4 border-[#748dff] bg-white dark:bg-slate-800 p-4 rounded-lg shadow hover:shadow-lg transition break-words"
                >
                  <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
                    <h3 className="text-md font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2 flex-1">
                      <FiMail className="text-[#748dff]" /> {topText}
                    </h3>
                    <span className="text-xs text-gray-400">{new Date(msg.createdAt).toLocaleString()}</span>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 break-words">
                    {msg.message}
                    {msg.editedAt && (
                      <span className="text-xs text-gray-400 ml-2">(edited)</span>
                    )}
                  </p>

                  {/* Buttons on same line */}
                  <div className="flex gap-3 mt-2 flex-wrap">
                    {msg.replies && msg.replies.length > 0 && (
                      <button
                        onClick={() =>
                          setOpenReplies((prev) => ({
                            ...prev,
                            [msg._id]: !prev[msg._id],
                          }))
                        }
                        className=" cursor-pointer text-sm text-green-600 hover:underline"
                      >
                       {openReplies[msg._id] ? t("hideReplies") : t("viewReplies")}
                      </button>
                    )}

                    {isSent && (
                      <>
                        <button
                          onClick={() => handleEditClick(msg)}
                          className="cursor-pointer text-sm text-[#748dff] hover:text-indigo-600"
                        >
                          {t("edit_message")}
                        </button>

                        <button
                          onClick={() => {
                            setDeleteMessageId(msg._id);
                            setShowDeleteModal(true);
                          }}
                          className="cursor-pointer text-sm text-red-500 hover:text-red-600"
                        >
                          {t("delete")}
                        </button>
                      </>
                    )}
                  </div>

                  {/* Replies */}
                  {openReplies[msg._id] && msg.replies && (
                    <div className="mt-3 space-y-2 border-l-2 border-green-400 pl-3">
                      {[...msg.replies]
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                        .map((reply) => (
                          <div
                            key={reply._id}
                            className="bg-green-50 dark:bg-green-900/20 p-3 rounded-md"
                          >
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm font-semibold text-green-600">
                                From: {msg.recipient?.userName || "Admin"}
                              </span>
                              <span className="text-xs text-gray-400">
                                {new Date(reply.createdAt).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-200">
                              {reply.message}
                            </p>
                          </div>
                        ))}
                    </div>
                  )}

                  {msg.type && (
                    <span className="inline-block mt-2 px-2 py-1 text-xs font-semibold text-white bg-[#748dff] rounded">
                      {msg.type.toUpperCase()}
                    </span>
                  )}
                </motion.div>
              );
            })}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white dark:bg-slate-900 p-6 rounded-xl w-full max-w-full sm:max-w-md shadow-2xl border-2 border-[#748dff]/40"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center bg-[#748dff] rounded-lg text-white">
                    <FiMail className="text-xl" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                    {editMode ? t("edit_message") : t("new_message")}
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditMode(false);
                    setMessage("");
                  }}
                  className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 cursor-pointer"
                >
                  <FiX size={22} />
                </button>
              </div>

              <div className="flex flex-col gap-4">
                <div className="relative flex items-center">
                  <FiMail className="absolute left-3 text-[#748dff] top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={user.email}
                    readOnly
                    className="w-full pl-10 p-3 rounded-xl border border-gray-300 dark:border-slate-800 dark:bg-slate-800 dark:text-white cursor-pointer focus:ring-2 focus:ring-[#748dff]/50 outline-none"
                  />
                </div>

                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t("type_message_here")}
                  className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-slate-800 dark:text-white min-h-[120px] focus:ring-2 focus:ring-[#748dff]/50 outline-none resize-none"
                />

                <button
                  onClick={handleSend}
                  disabled={loading}
                  className="bg-[#748dff] hover:bg-[#5f77e0] text-white py-2 px-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold shadow-md hover:shadow-lg cursor-pointer transition w-full"
                >
                  {loading
                    ? editMode
                      ? t("Updating")
                      : t("Sending")
                    : editMode
                    ? t("update_message")
                    : t("send_message")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeleteMessageId(null);
        }}
        onConfirm={async () => {
          if (!deleteMessageId) return;
          try {
            await useMessageStore.getState().deleteMessage(deleteMessageId, () => {
             
              fetchInbox(searchTerm, searchDate, typeFilter, statusFilter);
            });
          } catch (err) {
            console.error(err);
          } finally {
            setShowDeleteModal(false);
            setDeleteMessageId(null);
          }
        }}
      />
    </div>
  );
};

export default Inbox;