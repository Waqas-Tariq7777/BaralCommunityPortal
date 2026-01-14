import React from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { FiX, FiUser, FiMail, FiInfo, FiLayers, FiCheckCircle, FiClock, FiAlertTriangle } from "react-icons/fi";
import moment from "moment";

const ViewComplaintModal = ({ isOpen, complaint, onClose }) => {
  if (!isOpen || !complaint) return null;

  const statusIcon = {
    pending: <FiClock className="text-yellow-500 text-xl" />,
    resolved: <FiCheckCircle className="text-green-500 text-xl" />,
    rejected: <FiAlertTriangle className="text-red-500 text-xl" />,
    "in Progress": <FiInfo className="text-blue-500 text-xl" />,
  };

  const capitalize = text => text ? text.charAt(0).toUpperCase() + text.slice(1) : "";

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* BACKDROP */}
      <div onClick={onClose} className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      {/* MODAL */}
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.25 }} className="relative z-10 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-[480px] p-7">
        {/* CLOSE */}
        <button onClick={onClose} className="cursor-pointer absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition"><FiX size={20} /></button>

        {/* HEADING */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#748dff] flex items-center justify-center text-white shadow-lg"><FiLayers /></div>
          <h2 className="text-2xl font-bold text-black dark:text-white">Complaint Details</h2>
        </div>

        {/* USER INFO */}
        <div className="flex flex-col items-center text-center mb-6">
          <h3 className="mt-3 text-xl font-semibold text-black dark:text-white">{complaint.userId?.userName || "User"}</h3>
          <p className="text-[#748dff] text-sm">{complaint.userId?.email || "No Email"}</p>
        </div>

        {/* COMPLAINT DETAILS */}
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
            <FiLayers className="text-[#748dff] text-xl" />
            <span className="text-black dark:text-white">Type: {capitalize(complaint.complaintType)}</span>
          </div>

          <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
            {statusIcon[complaint.status]}
            <span className="text-black dark:text-white">Status: {capitalize(complaint.status)}</span>
          </div>

          {complaint.reason && (
            <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
              <FiInfo className="text-purple-500 text-xl" />
              <span className="text-black dark:text-white">Reason: {complaint.reason}</span>
            </div>
          )}

          <div className="flex gap-3 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
            <FiMail className="text-[#748dff] text-xl mt-1" />
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">Complaint Message</p>
              <p className="text-black dark:text-white">{complaint.message}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
            <FiClock className="text-pink-500 text-xl" />
            <span className="text-black dark:text-white">Submitted: {moment(complaint.createdAt).format("MMMM D, YYYY")}</span>
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-6 text-center">
          <button onClick={onClose} className="cursor-pointer bg-[#748dff] hover:bg-indigo-500 text-white px-6 py-2 rounded-lg shadow-md transition">Close</button>
        </div>
      </motion.div>
    </div>,
    document.body
  );
};

export default ViewComplaintModal;
