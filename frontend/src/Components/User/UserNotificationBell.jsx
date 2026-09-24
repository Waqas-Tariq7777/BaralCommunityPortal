import React, { useState, useEffect, useRef } from "react";
import { FiBell, FiShield, FiX, FiCheckCircle } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { useAuthStore } from "../../Store/AuthStore.js";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "../../Store/LanguageStore.js";

const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

const UserNotificationBell = ({ className = "" }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const { language } = useLanguageStore();

  const fetchNotifications = async () => {
    if (!user || user.isAdmin) return;
    try {
      const res = await axios.get(`${baseUrl}/api/message/user-notifications`, {
        withCredentials: true,
      });
      const data = res.data?.data || {};
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (err) {
      console.error("Failed to fetch user notifications:", err);
    }
  };

  useEffect(() => {
    if (user && !user.isAdmin) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 10000);
      return () => clearInterval(interval);
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = async (notif) => {
    if (!notif.read) {
      try {
        await axios.patch(
          `${baseUrl}/api/message/user-notifications/${notif._id}/read`,
          {},
          { withCredentials: true }
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
        setNotifications((prev) =>
          prev.map((n) => (n._id === notif._id ? { ...n, read: true } : n))
        );
      } catch (err) {
        console.error("Failed to mark notification as read:", err);
      }
    }
    setOpen(false);
    if (notif.isReply || notif.parentMessage) {
      navigate("/user/communityInbox");
    } else {
      navigate("/user/communityHub");
    }
  };

  if (!user || user.isAdmin) return null;

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => {
          setOpen(!open);
          if (!open) fetchNotifications();
        }}
        className="relative cursor-pointer p-2 rounded-xl text-slate-600 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-center focus:outline-none"
        title={t("notifications") || "Notifications"}
      >
        <FiBell size={20} className="text-[#748dff]" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse shadow-md">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Popup */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="fixed xs:absolute right-3 xs:right-0 top-14 xs:top-auto xs:mt-2 w-[calc(100vw-1.5rem)] xs:w-80 sm:w-96 max-w-[420px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="p-3 sm:p-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
              <div className="flex items-center gap-2 min-w-0">
                <FiBell className="text-[#748dff] text-base shrink-0" />
                <span className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-100 truncate">
                  {t("notifications") || "Notifications"}
                </span>
                {unreadCount > 0 && (
                  <span className="text-[10px] sm:text-[11px] font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 px-2 py-0.5 rounded-full shrink-0">
                    {unreadCount} {t("unread") || "unread"}
                  </span>
                )}
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 cursor-pointer rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition shrink-0 ml-1"
                aria-label="Close Notifications"
              >
                <FiX size={16} />
              </button>
            </div>

            {/* List */}
            <div className="max-h-[60vh] sm:max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-xs font-medium">
                  {t("no_notifications_yet") || "No notifications yet"}
                </div>
              ) : (
                notifications.map((n) => {
                  const isProofNotif = n.message?.toLowerCase().includes("proof");
                  const displayMessage = isProofNotif
                    ? (language === "ur"
                        ? "آپ کی شکایت کے لیے ثبوت اپ لوڈ کر دیا گیا ہے۔ براہ کرم اسے چیک کریں اور تصدیق کریں۔"
                        : n.message)
                    : n.message;

                  return (
                    <div
                      key={n._id}
                      onClick={() => handleNotificationClick(n)}
                      className={`p-3 sm:p-3.5 cursor-pointer transition flex items-start gap-2.5 sm:gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                        !n.read
                          ? "bg-indigo-50/40 dark:bg-indigo-950/20 font-medium"
                          : ""
                      }`}
                    >
                      <div
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          isProofNotif
                            ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400"
                            : "bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400"
                        }`}
                      >
                        {isProofNotif ? (
                          <FiShield className="text-sm sm:text-base" />
                        ) : (
                          <FiCheckCircle className="text-sm sm:text-base" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-800 dark:text-slate-200 leading-snug break-words" dir={language === "ur" ? "rtl" : "ltr"}>
                          {displayMessage}
                        </p>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">
                          {moment(n.createdAt).fromNow()}
                        </span>
                      </div>

                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-[#748dff] shrink-0 mt-1.5" />
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserNotificationBell;
