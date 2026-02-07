import React, { useState } from "react";
import { createPortal } from "react-dom";
import { useUserStore } from "../../Store/UserStore.js";
import { FiEye, FiEyeOff, FiLock, FiX } from "react-icons/fi";
import { motion } from "framer-motion";
import LoadingSpinner from "../LoadingSpinner.jsx";

function SuccessCheck() {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="text-green-500 text-3xl flex justify-center"
    >
      ✔
    </motion.div>
  );
}

export default function ChangePasswordModal({ isOpen, onClose, userId }) {
  const changePassword = useUserStore((state) => state.changePassword);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [errors, setErrors] = useState({
    current: "",
    new: "",
    confirm: "",
    submit: "",
  });

  if (!isOpen) return null;

  const validatePassword = (pw) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(pw);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({ current: "", new: "", confirm: "", submit: "" });
    let hasError = false;

    if (!currentPassword) { setErrors((prev) => ({ ...prev, current: "Current password is required" })); hasError = true; }
    if (!newPassword) { setErrors((prev) => ({ ...prev, new: "New password is required" })); hasError = true; }
    if (!confirmPassword) { setErrors((prev) => ({ ...prev, confirm: "Confirm password is required" })); hasError = true; }
    if (newPassword && confirmPassword && newPassword !== confirmPassword) { setErrors((prev) => ({ ...prev, confirm: "Passwords do not match" })); hasError = true; }
    if (newPassword && !validatePassword(newPassword)) { setErrors((prev) => ({ ...prev, new: "Password must be 6+ chars, with uppercase, lowercase, and a number" })); hasError = true; }

    if (hasError) return;

    try {
      setLoading(true);
      await changePassword(userId, currentPassword, newPassword, false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
      }, 1500);
    } catch (err) {
      setErrors((prev) => ({ ...prev, submit: err.message || "Failed to change password" }));
    } finally { setLoading(false); }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* BACKDROP: no animation, visible instantly */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      ></div>

      {/* MODAL: animated separately */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.25 }}
        className="mx-4 relative z-10 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-[480px] p-7"
      >
        {/* Close Icon */}
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition"
        >
          <FiX size={20} />
        </button>

        {/* Heading */}
        <div className="flex items-center justify-center gap-3 mb-7">
          <div className="w-10 h-10 rounded-xl bg-[#748dff] flex items-center justify-center text-white shadow-lg">
            <FiLock />
          </div>
          <h2 className="text-2xl font-bold text-black dark:text-white">Change Password</h2>
        </div>

        {success ? (
          <SuccessCheck />
        ) : (
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Current */}
            <div className="relative">
              <label className="block mb-1 text-sm font-medium dark:text-gray-300">Current Password</label>
              <input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-[#748dff] focus:outline-none transition"
              />
              <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="cursor-pointer absolute right-3 top-[42px] text-gray-500">
                {showCurrent ? <FiEyeOff /> : <FiEye />}
              </button>
              {errors.current && <p className="text-red-500 text-sm mt-1">{errors.current}</p>}
            </div>

            {/* New */}
            <div className="relative">
              <label className="block mb-1 text-sm font-medium dark:text-gray-300">New Password</label>
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-[#748dff] focus:outline-none transition"
              />
              <button type="button" onClick={() => setShowNew(!showNew)} className="cursor-pointer absolute right-3 top-[42px] text-gray-500">
                {showNew ? <FiEyeOff /> : <FiEye />}
              </button>
              {errors.new && <p className="text-red-500 text-sm mt-1">{errors.new}</p>}
            </div>

            {/* Confirm */}
            <div className="relative">
              <label className="block mb-1 text-sm font-medium dark:text-gray-300">Confirm Password</label>
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-[#748dff] focus:outline-none transition"
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="cursor-pointer absolute right-3 top-[42px] text-gray-500">
                {showConfirm ? <FiEyeOff /> : <FiEye />}
              </button>
              {errors.confirm && <p className="text-red-500 text-sm mt-1">{errors.confirm}</p>}
            </div>

            {errors.submit && <p className="text-red-500 text-sm text-center">{errors.submit}</p>}

            {/* SAVE FULL WIDTH */}
            <button
              type="submit"
              disabled={loading}
              className=" drop-shadow-xl cursor-pointer w-full px-4 py-3 bg-[#748dff] hover:bg-indigo-500 text-white rounded-lg flex items-center justify-center gap-2 shadow-lg transition mt-4"
            >
              {loading && <LoadingSpinner size={18} color="#fff" />}
              {loading ? "Changing..." : "Save Changes"}
            </button>
          </form>
        )}
      </motion.div>
    </div>,
    document.body
  );
}
