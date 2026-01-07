import React, { useState } from "react";
import { useUserStore } from "../../Store/UserStore.js";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { motion } from "framer-motion";
import LoadingSpinner from "../LoadingSpinner.jsx";

// Green Check Animation
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

  // New errors state
  const [errors, setErrors] = useState({
    current: "",
    new: "",
    confirm: "",
    submit: "",
  });

  if (!isOpen) return null;

  const validatePassword = (pw) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(pw);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset errors
    setErrors({ current: "", new: "", confirm: "", submit: "" });

    let hasError = false;

    if (!currentPassword) {
      setErrors((prev) => ({ ...prev, current: "Current password is required" }));
      hasError = true;
    }
    if (!newPassword) {
      setErrors((prev) => ({ ...prev, new: "New password is required" }));
      hasError = true;
    }
    if (!confirmPassword) {
      setErrors((prev) => ({ ...prev, confirm: "Confirm password is required" }));
      hasError = true;
    }
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      setErrors((prev) => ({ ...prev, confirm: "Passwords do not match" }));
      hasError = true;
    }
    if (newPassword && !validatePassword(newPassword)) {
      setErrors((prev) => ({
        ...prev,
        new: "Password must be 6+ chars, with uppercase, lowercase, and a number",
      }));
      hasError = true;
    }

    if (hasError) return;

    try {
      setLoading(true);
      await changePassword(userId, currentPassword, newPassword, false); // false = skip toast
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }, 1500);
    } catch (err) {
      setErrors((prev) => ({ ...prev, submit: err.message || "Failed to change password" }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-50 animate-fadeIn">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-96 p-6 relative animate-fadeIn">
        <h2 className="text-2xl font-bold text-center mb-6 dark:text-white">
          🔒 Change Password
        </h2>

        {success ? (
          <SuccessCheck />
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Current */}
            <div className="relative">
              <label className="block mb-1 dark:text-gray-300">Current Password</label>
              <input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 dark:text-white"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="cursor-pointer absolute right-3 top-[38px] text-gray-500 dark:text-gray-400"
              >
                {showCurrent ? <FiEyeOff /> : <FiEye />}
              </button>
              {errors.current && (
                <p className="text-red-500 text-sm mt-1">{errors.current}</p>
              )}
            </div>

            {/* New */}
            <div className="relative">
              <label className="block mb-1 dark:text-gray-300">New Password</label>
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 dark:text-white"
                required
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="cursor-pointer absolute right-3 top-[38px] text-gray-500 dark:text-gray-400"
              >
                {showNew ? <FiEyeOff /> : <FiEye />}
              </button>
              {errors.new && (
                <p className="text-red-500 text-sm mt-1">{errors.new}</p>
              )}
            </div>

            {/* Confirm */}
            <div className="relative">
              <label className="block mb-1 dark:text-gray-300">Confirm Password</label>
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 dark:text-white"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="cursor-pointer absolute right-3 top-[38px]  text-gray-500 dark:text-gray-400"
              >
                {showConfirm ? <FiEyeOff /> : <FiEye />}
              </button>
              {errors.confirm && (
                <p className="text-red-500 text-sm mt-1">{errors.confirm}</p>
              )}
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <p className="text-red-500 text-sm text-center">{errors.submit}</p>
            )}

            {/* Buttons */}
            <div className="flex justify-end gap-2 mt-4 items-center">
              <button
                type="button"
                onClick={onClose}
                className=" cursor-pointer px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded hover:bg-gray-400 dark:hover:bg-gray-600 transition disabled:opacity-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className=" cursor-pointer px-4 py-2 drop-shadow-xl bg-[#748dff] hover:bg-indigo-500 text-white rounded flex items-center gap-2 transition disabled:opacity-50"
                disabled={loading}
              >
                {loading && <LoadingSpinner size={18} color="#fff" />}
                {loading ? "Changing..." : "Change Password"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
