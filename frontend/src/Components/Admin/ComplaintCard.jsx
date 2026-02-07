import React, { useState } from "react";
import { AiOutlineEye } from "react-icons/ai";
import { FiUser, FiMail, FiPhone, FiClock, FiLayers } from "react-icons/fi";
import moment from "moment";

const ComplaintCard = ({ complaint, onView, markComplaintAsRead }) => {
  const [isRead, setIsRead] = useState(complaint.isReadByAdmin);

  const handleView = async () => {
    onView(complaint);
    if (!isRead) {
      try {
        await markComplaintAsRead(complaint._id);
        setIsRead(true); // only local state
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 dark:border dark:border-[#748dff] shadow-md rounded-lg p-6 space-y-3 transform hover:scale-105 transition-transform duration-300 relative">
      <div className="space-y-3 text-gray-700 dark:text-gray-200">
        <p className="flex text-sm items-center gap-2"><FiUser className="text-indigo-300 text-lg dark:text-[#748dff]" /> {complaint.userId?.userName}</p>
        <p className="flex text-sm items-center gap-2"><FiMail className="text-orange-300 text-lg dark:text-[#748dff]" /> {complaint.userId?.email}</p>
        <p className="flex text-sm items-center gap-2"><FiPhone className="text-green-300 text-lg dark:text-[#748dff]" /> {complaint.userId?.mobileNumber}</p>
        <p className="flex text-sm items-center gap-2"><FiClock className="text-pink-300 text-lg dark:text-[#748dff]" /> {moment(complaint.createdAt).format("MMMM D, YYYY")}</p>
        <div className="flex flex-col w-[100%] gap-2 mt-2">
          <div className="flex items-center gap-2"><FiLayers className="text-lg text-[#6e11b0]" /><span className="px-2 py-1 rounded-full text-[#6e11b0] bg-[#f3e8ff] text-xs font-semibold">{complaint.complaintType}</span></div>
        </div>
        <div>
          <p className="flex items-center gap-2 mt-6 text-sm">Reason:</p>
          <p className="flex items-center gap-2 mb-6 text-sm font-medium">{complaint.reason}</p>
        </div>
      </div>

      <div className="flex justify-center mt-2 relative">
        <button
          onClick={handleView}
          className="cursor-pointer w-full flex justify-center items-center gap-2 px-3 py-2 bg-[#eff6ff] hover:bg-indigo-200 text-[#155dfc] rounded-lg transition dark:bg-transparent dark:border dark:border-[#748dff] dark:text-[#748dff] dark:hover:bg-indigo-400 dark:hover:text-white"
        >
          <AiOutlineEye />
          <span>View</span>
        </button>

        {!isRead && (
          <span className="absolute top-1 right-3 px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-red-500 text-white animate-pulse">
            New
          </span>
        )}
      </div>
    </div>
  );
};

export default ComplaintCard;
