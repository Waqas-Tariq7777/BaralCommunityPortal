import React from "react";
import LoadingSpinner from "../LoadingSpinner.jsx";
import { FiAlertTriangle, FiX } from "react-icons/fi";

const ConfirmDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
  title = "Delete Confirmation",
  message = "This action cannot be undone."
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      
      <div className="relative bg-white dark:bg-slate-900 w-full max-w-[480px] mx-4 rounded-2xl shadow-2xl p-7 animate-fadeIn">

        {/* CLOSE ICON */}
        <button
          onClick={onClose}
          disabled={loading}
          className="cursor-pointer absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white transition"
        >
          <FiX size={18} />
        </button>

        {/* ICON */}
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <FiAlertTriangle className="text-red-500 text-2xl" />
          </div>
        </div>

        {/* TITLE */}
        <h2 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-2">
          {title}
        </h2>

        {/* MESSAGE */}
        <p className="text-center text-gray-600 dark:text-gray-300 mb-7">
          {message}
        </p>

        {/* ACTIONS */}
        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="cursor-pointer px-5 py-2.5 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="cursor-pointer flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition shadow-md"
          >
            {loading ? <LoadingSpinner size={18} color="#fff" /> : "Yes, Delete"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
