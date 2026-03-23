import React from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { FiX, FiMail, FiInfo, FiLayers, FiCheckCircle, FiClock, FiAlertTriangle } from "react-icons/fi";
import moment from "moment";
import { AiOutlineCalendar } from "react-icons/ai";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "../../Store/LanguageStore.js";

const ViewComplaintModal = ({ isOpen, complaint, onClose }) => {
  const { t } = useTranslation();
  const { language } = useLanguageStore();

  if (!isOpen || !complaint) return null;

  // --- Icons ---
  const statusIcon = {
    pending: <FiClock className="text-yellow-500 text-xl" />,
    resolved: <FiCheckCircle className="text-green-500 text-xl" />,
    rejected: <FiAlertTriangle className="text-red-500 text-xl" />,
    "in progress": <FiInfo className="text-blue-500 text-xl" />,
  };

  // --- Dynamic translations for DB values ---
  const translations = {
    complaintType: {
      general: language === "ur" ? "عام" : "General",
      special: language === "ur" ? "خصوصی" : "Special",
    },
    status: {
      pending: language === "ur" ? "زیر التوا" : "Pending",
      resolved: language === "ur" ? "حل شدہ" : "Resolved",
      rejected: language === "ur" ? "رد شدہ" : "Rejected",
      "in progress": language === "ur" ? "عمل میں" : "In Progress",
    },
    category: {
      electrician: language === "ur" ? "الیکٹریشن" : "Electrician",
      plumber: language === "ur" ? "پلمبر" : "Plumber",
      masonry: language === "ur" ? "مستری" : "Masonry",
      carpenter: language === "ur" ? "بڑھئی" : "Carpenter",
      painter: language === "ur" ? "پینٹر" : "Painter",
    },
  };

  // --- Date formatting ---
  const formattedDate =
    language === "ur"
      ? moment(complaint.createdAt).locale("ur").format("D MMMM, YYYY")
      : moment(complaint.createdAt).format("MMMM D, YYYY");

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* BACKDROP */}
      <div onClick={onClose} className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      {/* MODAL */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.25 }}
        className="max-w-[480px] mx-4 relative z-10 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-[480px] p-7"
        dir={language === "ur" ? "rtl" : "ltr"}
      >
        {/* CLOSE */}
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition"
        >
          <FiX size={20} />
        </button>

        {/* HEADING */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#748dff] flex items-center justify-center text-white shadow-lg">
            <FiLayers />
          </div>
          <h2 className="text-2xl font-bold text-black dark:text-white">{t("complaint_details")}</h2>
        </div>

        {/* USER INFO */}
        <div className="flex flex-col items-center text-center mb-6">
          <h3 className="mt-3 text-xl font-semibold text-black dark:text-white">
            {complaint.userId?.userName || t("user_default")}
          </h3>
          <p className="text-[#748dff] text-sm">{complaint.userId?.email || t("no_email")}</p>
        </div>

        {/* COMPLAINT DETAILS */}
        <div className="space-y-3 text-sm">
          {/* Type */}
          <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
            <FiLayers className="text-[#748dff] text-xl" />
            <span className="text-black dark:text-white">
              {t("type")}: {translations.complaintType[complaint.complaintType]}
            </span>
          </div>

          {/* Status */}
          <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
            {statusIcon[complaint.status]}
            <span className="text-black dark:text-white">
              {t("status")}: {translations.status[complaint.status]}
            </span>
          </div>

          {/* Category */}
          {complaint.category && (
            <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
              <FiInfo className="text-purple-500 text-xl" />
              <span className="text-black dark:text-white">
                {t("category")}: {translations.category[complaint.category]}
              </span>
            </div>
          )}

          {/* Reason */}
          {complaint.reason && (
            <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
              <FiInfo className="text-purple-500 text-xl" />
              <span className="text-black dark:text-white">
                {t("reason")}: {complaint.reason}
              </span>
            </div>
          )}

          {/* Message */}
          <div className="flex gap-3 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
            <FiMail className="text-[#748dff] text-xl mt-1" />
            <div className="w-full">
              <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">{t("complaint_message")}</p>
              <p className="text-black dark:text-white break-words whitespace-pre-wrap max-h-32 overflow-y-auto pr-1">
                {complaint.message}
              </p>
            </div>
          </div>

          {/* Date */}
          <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
            <AiOutlineCalendar className="text-pink-500 text-xl" />
            <span className="text-black dark:text-white">{t("submitted")}: {formattedDate}</span>
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="cursor-pointer bg-[#748dff] hover:bg-indigo-500 text-white px-6 py-2 rounded-lg shadow-md transition"
          >
            {t("close")}
          </button>
        </div>
      </motion.div>
    </div>,
    document.body
  );
};

export default ViewComplaintModal;