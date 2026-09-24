import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { FiX, FiUser, FiMail, FiPhone, FiHome, FiLayers, FiCheckCircle, FiClock, FiAlertTriangle, FiInfo, FiCalendar } from "react-icons/fi";
import moment from "moment";
import { useComplaintStore } from "../../Store/ComplaintStore";
import AddResourcesCostModal from "../../Components/Admin/AddResourcesCostModal";

const ViewAdminComplaintModal = ({ isOpen, complaint, onClose, onUpdate }) => {
  const [status, setStatus] = useState(complaint?.status?.toLowerCase() || "pending");
  const [loading, setLoading] = useState(false);
  const updateStatus = useComplaintStore((state) => state.updateComplaintStatus);
  const [showResourcesModal, setShowResourcesModal] = useState(false);

  const resolveComplaint = useComplaintStore(
    state => state.resolveComplaint
  );

  useEffect(() => {
    setStatus(complaint?.status?.toLowerCase() || "pending");
  }, [complaint]);

  if (!isOpen || !complaint) return null;

  // Status icons and colors with fallbacks
  const statusIcon = {
    pending: <FiClock className="text-yellow-500 text-3xl" />,
    "in progress": <FiInfo className="text-blue-500 text-3xl" />,
    rejected: <FiAlertTriangle className="text-red-500 text-3xl" />,
    resolved: <FiCheckCircle className="text-green-500 text-3xl" />,
  };
  const statusIconDefault = <FiClock className="text-gray-400 text-3xl" />;

  const statusColor = {
    pending: "bg-yellow-50 text-yellow-600",
    "in progress": "bg-blue-50 text-blue-600",
    rejected: "bg-red-50 text-red-400",
    resolved: "bg-green-50 text-green-600",
  };
  const statusColorDefault = "bg-gray-100 text-gray-600";

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value.toLowerCase();
    setStatus(newStatus);
    setLoading(true);
    try {
      const updated = await updateStatus(complaint._id, newStatus);
      setStatus(updated.status?.toLowerCase() || newStatus);
      if (onUpdate) onUpdate(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const capitalize = (t) => (t ? t.charAt(0).toUpperCase() + t.slice(1) : "");

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-auto">
      {/* BACKDROP */}
      <div onClick={onClose} className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer" />

      {/* MODAL */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.25 }}
        className="relative z-10 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl
max-w-[700px] w-full max-h-[90vh]
p-5 sm:p-6 md:p-8
flex flex-col gap-6 overflow-y-auto"

      >
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white cursor-pointer"
        >
          <FiX size={26} />
        </button>

        {/* HEADER */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#748dff] text-white">
            <FiLayers size={22} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Complaint Details</h2>
        </div>

        {/* USER INFORMATION BOX */}
        <div className="bg-gray-50 dark:bg-gray-900 dark:border dark:border-[#748dff] p-6 rounded-xl flex flex-col gap-4 shadow-sm">
          <h3 className="flex items-center gap-2 font-bold text-lg text-gray-700 dark:text-gray-200 mb-3">
            <FiUser className="text-indigo-500 text-xl" /> User Information
          </h3>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">

            {/* PROFILE PIC */}
            <img
              src={complaint.userId?.profilePicture?.url || "/default-avatar.png"}
              alt="Profile"
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-indigo-500"

            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">

              <InfoBox icon={<FiUser className="text-indigo-500 text-xl" />} label="Name" value={complaint.userId?.userName} />
              <InfoBox
                icon={<FiMail className="text-green-500 text-xl flex-shrink-0" />}
                label="Email"
                value={
                  <span className="truncate block max-w-[120px] sm:max-w-[150px] md:max-w-[180px]">
                    {complaint.userId?.email || "—"}
                  </span>
                }
              />


              <InfoBox icon={<FiPhone className="text-blue-500 text-xl" />} label="Mobile" value={complaint.userId?.mobileNumber} />
              <InfoBox icon={<FiHome className="text-purple-500 text-xl" />} label="House" value={complaint.userId?.houseNumber} />
            </div>
          </div>
        </div>

        {/* COMPLAINT INFORMATION BOX */}
        <div className="bg-gray-50 dark:bg-gray-900 dark:border dark:border-[#748dff] p-6 rounded-xl flex flex-col gap-6 shadow-sm">
          <h3 className="flex items-center gap-2 font-bold text-lg text-gray-700 dark:text-gray-200 mb-3">
            <FiLayers className="text-purple-500 text-xl" /> Complaint Information
          </h3>

          {/* TYPE & STATUS INLINE SEPARATE BOXES */}
          <div className="flex flex-col md:flex-row items-stretch gap-4 w-full">

            {/* Type Box */}
            <div className="w-full md:flex-1 flex items-start gap-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-xl shadow-sm">
              <FiLayers className="text-[#6e11b0] text-xl mt-1" />
              <div className="flex flex-col mt-1">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Type</span>
                <span className="px-3 py-1 rounded-full text-[#6e11b0] bg-[#f3e8ff] font-medium text-sm mt-1 w-fit">
                  {capitalize(complaint.complaintType)}
                </span>
              </div>
            </div>

            {/* Status Box */}
            <div
              className={`w-full md:flex-1 flex items-start gap-2 p-3 rounded-xl shadow-sm ${statusColor[status] || statusColorDefault
                }`}
            >
              {React.cloneElement(statusIcon[status] || statusIconDefault, { className: "text-xl mt-1" })}
              <div className="flex flex-col w-full mt-1">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-900">Status</span>
                <select
                  value={status}
                  onChange={handleStatusChange}
                  disabled={loading}
                  className="bg-white dark:bg-gray-200 px-2 py-1 rounded-md outline-none font-medium cursor-pointer w-full mt-1"
                >
                  <option value="pending">Pending</option>
                  <option value="in progress">In Progress</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

          </div>


          {/* Reason */}
          {complaint.reason && (
            <InfoBox icon={<FiInfo className="text-orange-500 text-xl" />} label="Reason" value={complaint.reason} />
          )}

          {/* Submitted Date */}
          <InfoBox icon={<FiCalendar className="text-indigo-500 text-xl" />} label="Submitted" value={moment(complaint.createdAt).format("MMMM D, YYYY")} />

          {/* Message */}
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-sm max-h-40 sm:max-h-48 md:max-h-56 overflow-y-auto">
            <p className="text-xs text-gray-500 mb-1 font-medium">Message</p>
            <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">
              {complaint.message || "—"}
            </p>
          </div>

          {/* RESIDENT RESOLUTION VERIFICATION & RATING BOX */}
          {(complaint.resolutionVerified || complaint.resolutionRating) && (
            <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-4 rounded-xl shadow-sm space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-xs sm:text-sm text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                  <FiStar className="fill-amber-400 text-amber-400 text-base" /> Resident Verification & Rating
                </span>
                <span className="text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/60 px-2.5 py-0.5 rounded-full">
                  ★ {complaint.resolutionRating || 5} / 5
                </span>
              </div>
              {complaint.resolutionFeedback && (
                <p className="text-xs text-amber-900 dark:text-amber-200 italic">
                  "{complaint.resolutionFeedback}"
                </p>
              )}
            </div>
          )}
        </div>

        {/* FOOTER BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-3 mt-4">

          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 dark:bg-gray-700 dark:text-gray-200 px-5 py-3 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={() => setShowResourcesModal(true)}
            // disabled={status === "resolved" || loading}
            className="flex-1 bg-green-500 text-white px-5 py-3 rounded-lg font-medium hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Mark as Resolved
          </button>

        </div>
      </motion.div>
      <AddResourcesCostModal
        isOpen={showResourcesModal}
        onClose={() => setShowResourcesModal(false)}
        onSave={async ({ resources }) => {
          try {
            setLoading(true);
            const updatedComplaint = await resolveComplaint(complaint._id, resources);

            setShowResourcesModal(false);
            onClose(); // close main modal

            // ✅ Trigger onUpdate to notify parent page
            if (onUpdate) onUpdate(updatedComplaint);
          } catch (err) {
            console.error(err);
          } finally {
            setLoading(false);
          }
        }}
      />


    </div>,
    document.body
  );

};

const InfoBox = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-md shadow-sm">
    {icon}
    <div className="flex flex-col">
      <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{label}</span>
      <span className="text-gray-600 dark:text-gray-400">{value || "—"}</span>
    </div>
  </div>


);

export default ViewAdminComplaintModal;
