import React from "react";
import {
  AiOutlineMail,
  AiOutlinePhone,
  AiOutlineHome,
  AiOutlineCalendar,
  AiOutlineIdcard,
} from "react-icons/ai";
import moment from "moment";

const ViewUserModal = ({ isOpen, user, onClose }) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-2xl shadow-xl p-6 relative">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl"
        >
          ✕
        </button>

        {/* Profile Section */}
        <div className="flex flex-col items-center text-center mb-6">
          <img
            src={user.profilePicture?.url || "/default-avatar.png"}
            alt={user.userName}
            className="w-24 h-24 rounded-full object-cover border-4 border-indigo-400"
          />
          <h2 className="mt-3 text-xl font-bold text-gray-900 dark:text-white">
            {user.userName}
          </h2>
          <p className="text-indigo-500 text-sm">
            {user.designation || "N/A"}
          </p>
        </div>

        {/* Section Title */}
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 text-center">
          User Details
        </h3>

        {/* User Details Boxes */}
        <div className="space-y-3 text-sm">

          <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
            <AiOutlineMail className="text-blue-500 text-xl" />
            <span className="text-gray-800 dark:text-gray-200">
              {user.email}
            </span>
          </div>

          <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
            <AiOutlinePhone className="text-green-500 text-xl" />
            <span className="text-gray-800 dark:text-gray-200">
              {user.mobileNumber}
            </span>
          </div>

          <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
            <AiOutlineHome className="text-purple-500 text-xl" />
            <span className="text-gray-800 dark:text-gray-200">
              House No: {user.houseNumber}
            </span>
          </div>

          <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
            <AiOutlineIdcard className="text-orange-500 text-xl" />
            <span className="text-gray-800 dark:text-gray-200">
              Designation: {user.designation || "User"}
            </span>
          </div>

          <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
            <AiOutlineCalendar className="text-pink-500 text-xl" />
            <span className="text-gray-800 dark:text-gray-200">
              Joined: {moment(user.createdAt).format("MMMM D, YYYY")}
            </span>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="cursor-pointer bg-indigo-400 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

export default ViewUserModal;
