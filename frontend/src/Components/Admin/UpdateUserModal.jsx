import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { FiX, FiEye, FiEyeOff } from "react-icons/fi";
import { AiOutlineEdit } from "react-icons/ai"; // New edit icon
import { useAdminStore } from "../../Store/AdminStore.js";

const UpdateUserModal = ({ isOpen, onClose, user, onSuccess }) => {
  const updateUser = useAdminStore((state) => state.updateUser);

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    houseNumber: "",
    mobileNumber: "",
    designation: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Prefill data
  useEffect(() => {
    if (user) {
      setFormData({
        userName: user.userName || "",
        email: user.email || "",
        houseNumber: user.houseNumber || "",
        mobileNumber: user.mobileNumber || "",
        designation: user.designation || "",
        password: "",
      });
    }
  }, [user]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = { ...formData };
      if (!payload.password) delete payload.password;

      await updateUser(user._id, payload);
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* BACKDROP */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      ></div>

      {/* MODAL CONTENT WITH FRAMER MOTION */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.25 }}
        className="relative z-10 w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6"
      >
        {/* CLOSE ICON */}
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition"
        >
          <FiX size={20} />
        </button>

        {/* HEADING */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#748dff] flex items-center justify-center text-white shadow-lg">
            <AiOutlineEdit /> {/* Updated icon */}
          </div>
          <h2 className="text-2xl font-bold text-black dark:text-white">Update User</h2>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {["userName","email","mobileNumber","houseNumber","designation"].map((field) => (
            <div key={field}>
              <label className="block mb-1 text-sm font-bold text-gray-700 dark:text-gray-300">
                {field === "userName" ? "User Name" : field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:border-[#748dff] focus:ring-2 focus:ring-[#748dff] outline-none dark:bg-gray-800 dark:text-white"
              />
            </div>
          ))}

          {/* Password */}
          <div>
            <label className="block mb-1 text-sm font-bold text-gray-700 dark:text-gray-300">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Leave empty to keep current password"
                className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 dark:border-gray-700 focus:border-[#748dff] focus:ring-2 focus:ring-[#748dff] outline-none dark:bg-gray-800 dark:text-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#748dff] transition"
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className=" drop-shadow-xl cursor-pointer w-full px-4 py-3 bg-[#748dff] hover:bg-indigo-500 text-white rounded-lg flex items-center justify-center gap-2 shadow-lg transition mt-2"
          >
            {loading ? "Updating..." : "Update User"}
          </button>
        </form>
      </motion.div>
    </div>,
    document.body
  );
};

export default UpdateUserModal;
