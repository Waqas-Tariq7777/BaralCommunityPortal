import React, { useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { FiSend, FiX } from "react-icons/fi";
import { useAuthStore } from "../../Store/AuthStore";
import { useComplaintStore } from "../../Store/ComplaintStore";
import LoadingSpinner from "../LoadingSpinner.jsx";

// Success Animation
function SuccessCheck() {
  return <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4 }} className="text-green-500 text-3xl flex justify-center">✔</motion.div>;
}

export default function ComplaintModal({ data, onClose }) {
  const { user } = useAuthStore();
  const { submitComplaint } = useComplaintStore();

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!message.trim()) {
      setError("Complaint details are required");
      return;
    }
     if (message.trim().length < 20) {
    setError("Complaint details must be at least 20 characters");
    return;
  }
    try {
      setLoading(true);
      await submitComplaint({ complaintType: data.type, category: data.category, message });
      setSuccess(true);
      setTimeout(() => { setSuccess(false); setMessage(""); onClose(); }, 1500);
    } catch (err) {
      setError(err.message || "Failed to submit complaint");
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* BACKDROP */}
      <div onClick={onClose} className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      {/* MODAL */}
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.25 }} className="max-w-[480px] mx-4 relative z-10 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-[480px] p-7">
        {/* CLOSE ICON */}
        <button onClick={onClose} className="cursor-pointer absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition"><FiX size={20} /></button>

        {/* Heading */}
        <div className="flex items-center justify-center gap-3 mb-7">
          <div className="w-10 h-10 rounded-xl bg-[#748dff] flex items-center justify-center text-white shadow-lg"><FiSend /></div>
          <h2 className="text-2xl font-bold text-black dark:text-white">Submit Complaint</h2>
        </div>

        {success ? (
          <SuccessCheck />
        ) : (
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Complaint Type */}
            <div>
              <label className="block mb-1 text-sm font-medium dark:text-gray-300">Complaint Type</label>
              <input value={data.type.toUpperCase()} readOnly className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 dark:text-white focus:outline-none" />
            </div>

            {/* Category */}
            <div>
              <label className="block mb-1 text-sm font-medium dark:text-gray-300">Category</label>
              <input value={data.category} readOnly className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 dark:text-white focus:outline-none" />
            </div>

            {/* Email */}
            <div>
              <label className="block mb-1 text-sm font-medium dark:text-gray-300">Email</label>
              <input value={user.email} readOnly className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 dark:text-white focus:outline-none" />
            </div>

            {/* Message */}
            <div>
              <label className="block mb-1 text-sm font-medium dark:text-gray-300">Details</label>
              <textarea maxLength={1000} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Enter complaint details..." className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 dark:text-white h-28 resize-none focus:ring-2 focus:ring-[#748dff] focus:outline-none transition" />
              <p className="text-sm text-gray-400 mt-1">{message.length}/1000</p>
            </div>

            {/* Error */}
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            {/* SAVE BUTTON FULL WIDTH */}
            <button type="submit" disabled={loading} className="drop-shadow-xl cursor-pointer w-full px-4 py-3 bg-[#748dff] hover:bg-indigo-500 text-white rounded-lg flex items-center justify-center gap-2 shadow-lg transition mt-4">
              {loading && <LoadingSpinner size={18} color="#fff" />}
              {loading ? "Submitting..." : "Submit Complaint"}
            </button>
          </form>
        )}
      </motion.div>
    </div>,
    document.body
  );
}
