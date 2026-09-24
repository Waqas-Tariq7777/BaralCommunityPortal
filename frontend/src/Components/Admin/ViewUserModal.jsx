import React, { useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { FiX, FiMail, FiPhone, FiHome, FiCalendar, FiUser, FiKey, FiEye, FiEyeOff } from "react-icons/fi";
import moment from "moment";

const ViewUserModal = ({ isOpen, user, onClose }) => {
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen || !user) return null;

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
        className="relative z-10 bg-white dark:bg-slate-900 mx-4 rounded-2xl shadow-2xl w-[480px] p-7"
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
            <FiUser />
          </div>
          <h2 className="text-2xl font-bold text-black dark:text-white">User Details</h2>
        </div>

        {/* PROFILE SECTION */}
        <div className="flex flex-col items-center text-center mb-6">
          <img
            src={user.profilePicture?.url || "/default-avatar.png"}
            alt={user.userName}
            className="w-24 h-24 rounded-full object-cover border-2 border-[#748dff]"
          />
          <h3 className="mt-3 text-xl font-semibold text-black dark:text-white">
            {user.userName}
          </h3>
          <p className="text-[#748dff] text-sm truncate max-w-[120px]">{user.designation || "User"}</p>
        </div>

        {/* USER DETAILS */}
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
            <FiMail className="text-[#748dff] text-xl shrink-0" />
            <span className="text-black dark:text-white truncate">{user.email}</span>
          </div>

          <div className="flex items-center justify-between gap-3 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <FiKey className="text-yellow-500 text-xl shrink-0" />
              <span className="text-black dark:text-white font-mono text-sm truncate">
                {showPassword ? (user.rawPassword || user.password || "••••••••") : "••••••••"}
              </span>
            </div>
            <button
              type="button"
              onMouseDown={() => setShowPassword(true)}
              onMouseUp={() => setShowPassword(false)}
              onMouseLeave={() => setShowPassword(false)}
              onTouchStart={() => setShowPassword(true)}
              onTouchEnd={() => setShowPassword(false)}
              onTouchCancel={() => setShowPassword(false)}
              onContextMenu={(e) => e.preventDefault()}
              className="cursor-pointer p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition select-none active:scale-95 shrink-0"
              title="Click and hold to reveal password"
            >
              {showPassword ? <FiEyeOff size={18} className="text-blue-500" /> : <FiEye size={18} />}
            </button>
          </div>

          <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
            <FiPhone className="text-green-500 text-xl" />
            <span className="text-black dark:text-white">{user.mobileNumber || "N/A"}</span>
          </div>

          <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
            <FiHome className="text-purple-500 text-xl" />
            <span className="text-black dark:text-white">House No: {user.houseNumber || "N/A"}</span>
          </div>

          <div className="flex items-start gap-3 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
            <FiUser className="text-orange-500 text-xl flex-shrink-0 mt-1" />
            <span className="text-black dark:text-white max-h-20 overflow-y-auto block">
              Designation: {user.designation || "User"}
            </span>
          </div>




          <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
            <FiCalendar className="text-pink-500 text-xl" />
            <span className="text-black dark:text-white">
              Joined: {moment(user.createdAt).format("MMMM D, YYYY")}
            </span>
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="cursor-pointer bg-[#748dff] hover:bg-indigo-500 text-white px-6 py-2 rounded-lg shadow-md transition"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>,
    document.body
  );
};

export default ViewUserModal;
