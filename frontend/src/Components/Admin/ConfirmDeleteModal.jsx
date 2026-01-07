import React from "react";

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, title = "Are you sure?", message = "This action cannot be undone." }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl shadow-xl p-6 relative animate-fadeIn">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">{title}</h2>
        <p className="text-gray-700 dark:text-gray-200 mb-6">{message}</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="cursor-pointer px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="cursor-pointer px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
