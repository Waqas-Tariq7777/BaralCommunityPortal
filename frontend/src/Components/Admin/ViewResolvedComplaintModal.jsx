import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import {
    FiX,
    FiUser,
    FiMail,
    FiPhone,
    FiHome,
    FiLayers,
    FiCheckCircle,
    FiCalendar,
    FiEdit,
    FiPrinter,
    FiStar
} from "react-icons/fi";
import moment from "moment";
import { useComplaintStore } from "../../Store/ComplaintStore";
import UpdateResourcesCostModal from "./UpdateResourcesCostModal";
import AddResourcesCostModal from "./AddResourcesCostModal";
import ResolvedComplaintPrint from "./ResolvedComplaintPrint.jsx";

const ViewResolvedComplaintModal = ({ isOpen, complaint, onClose, onUpdate }) => {
    const [showResourcesModal, setShowResourcesModal] = useState(false);
    const [localComplaint, setLocalComplaint] = useState(complaint); // 🔹 Local copy to refresh instantly

    const updateResolvedResources = useComplaintStore(state => state.updateResolvedResources);

    useEffect(() => {
        // Whenever the complaint prop changes, update the local state
        setLocalComplaint(complaint);
    }, [complaint]);

    if (!isOpen || !localComplaint) return null;

    const capitalize = (t) => (t ? t.charAt(0).toUpperCase() + t.slice(1) : "");

    const totalResourceCost = localComplaint?.resources?.reduce(
        (sum, r) => sum + Number(r.cost || 0),
        0
    );

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-auto">
            {/* BACKDROP */}
            <div
                onClick={onClose}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer"
            />

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
                {/* TOP ACTIONS */}
                <div className="absolute top-4 right-4
flex flex-col sm:flex-row
items-end sm:items-center
gap-2">

                    <button
                        onClick={() => setShowResourcesModal(true)}
                        className="cursor-pointer flex items-center gap-1 px-3 py-1.5 text-sm bg-green-500 text-white rounded-md hover:bg-green-600"
                    >
                        <FiEdit /> Update Resources
                    </button>

                    <button
                        onClick={() =>
                            ResolvedComplaintPrint(localComplaint)?.handlePrint()
                        }
                        className="cursor-pointer flex items-center gap-1 px-3 py-1.5 text-sm
bg-[#748dff] text-white drop-shadow-2xl rounded-md hover:bg-indigo-500"
                    >
                        <FiPrinter /> Print Report
                    </button>


                    <button
                        onClick={onClose}
                        className="text-gray-500 cursor-pointer hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
                    >
                        <FiX size={24} />
                    </button>
                </div>

                {/* HEADER */}
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#748dff] text-white">
                        <FiLayers size={22} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Complaint Details
                    </h2>
                </div>

                {/* USER INFORMATION */}
                <div className="bg-gray-50 dark:bg-gray-900 dark:border dark:border-[#748dff] p-6 rounded-xl flex flex-col gap-4 shadow-sm">
                    <h3 className="flex items-center gap-2 font-bold text-lg text-gray-700 dark:text-gray-200">
                        <FiUser className="text-indigo-500 text-xl" /> User Information
                    </h3>

                    <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">

                        <img
                            src={localComplaint.userId?.profilePicture?.url || "/default-avatar.png"}
                            className="w-16 h-16 rounded-full border-2 border-[#748dff] self-center sm:self-start"
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                            <InfoBox icon={<FiUser className="text-indigo-500 text-xl" />} label="Name" value={localComplaint.userId?.userName} />
                            <InfoBox
                                icon={<FiMail className="text-green-500 text-xl flex-shrink-0" />}
                                label="Email"
                                value={
                                    <span className="truncate block max-w-[120px] sm:max-w-[150px] md:max-w-[180px]">
                                        {complaint.userId?.email || "—"}
                                    </span>
                                }
                            />
                            <InfoBox icon={<FiPhone className="text-blue-500 text-xl" />} label="Mobile" value={localComplaint.userId?.mobileNumber} />
                            <InfoBox icon={<FiHome className="text-purple-500 text-xl" />} label="House" value={localComplaint.userId?.houseNumber} />
                        </div>
                    </div>
                </div>

                {/* COMPLAINT INFO */}
                <div className="bg-gray-50 dark:bg-gray-900 dark:border dark:border-[#748dff] p-6 rounded-xl flex flex-col gap-6 shadow-sm">
                    <h3 className="flex items-center gap-2 font-bold text-lg text-gray-700 dark:text-gray-200">
                        <FiLayers className="text-purple-500 text-xl" /> Complaint Information
                    </h3>

                    {/* TYPE & STATUS */}
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="w-full md:flex-1 flex items-start gap-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-xl shadow-sm">
                            <FiLayers className="text-[#6e11b0] text-xl mt-1" />
                            <div className="flex flex-col mt-1">
                                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Type</span>
                                <span className="px-3 py-1 rounded-full text-[#6e11b0] bg-[#f3e8ff] font-medium text-sm mt-1 w-fit">
                                    {capitalize(localComplaint.complaintType)}
                                </span>
                            </div>
                        </div>

                        <div className="flex-1 p-3 bg-green-50 shadow-sm text-green-600 rounded-xl flex items-center gap-2">
                            <FiCheckCircle className="text-xl" />
                            <div>
                                <span className="text-sm font-semibold">Status</span>
                                <div className="font-medium mt-1">Resolved</div>
                            </div>
                        </div>
                    </div>

                    <InfoBox
                        icon={<FiCalendar className="text-indigo-500 text-xl" />}
                        label="Submitted"
                        value={moment(localComplaint.createdAt).format("MMMM D, YYYY")}
                    />

                    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-sm max-h-40 sm:max-h-48 md:max-h-56 overflow-y-auto">
                        <p className="text-xs text-gray-500 mb-1 font-medium">Message</p>
                        <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">
                            {complaint.message || "—"}
                        </p>
                    </div>

                    {/* RESIDENT RESOLUTION VERIFICATION & RATING BOX */}
                    {(localComplaint.resolutionVerified || localComplaint.resolutionRating) && (
                        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-4 rounded-xl shadow-sm space-y-2">
                            <div className="flex items-center justify-between gap-2">
                                <span className="font-bold text-xs sm:text-sm text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                                    <FiStar className="fill-amber-400 text-amber-400 text-base" /> Resident Verification & Rating
                                </span>
                                <span className="text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/60 px-2.5 py-0.5 rounded-full">
                                    ★ {localComplaint.resolutionRating || 5} / 5
                                </span>
                            </div>
                            {localComplaint.resolutionFeedback && (
                                <p className="text-xs text-amber-900 dark:text-amber-200 italic">
                                    "{localComplaint.resolutionFeedback}"
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* RESOURCES & COST */}
                <div className="bg-green-50 border border-green-200 p-6 rounded-xl flex flex-col gap-5 shadow-sm">
                    <h3 className="flex items-center gap-2 font-bold text-lg text-green-700">
                        <FiLayers className="text-green-600 text-xl" />
                        Resources & Cost
                    </h3>

                    {/* SCROLLABLE RESOURCES LIST */}
                    <div className="flex flex-col gap-4 max-h-64 sm:max-h-72 md:max-h-80 overflow-y-auto pr-1">
                        {localComplaint.resources?.length ? (
                            localComplaint.resources.map((res, i) => (
                                <div
                                    key={i}
                                    className="flex flex-col sm:flex-row gap-4
                    sm:items-start sm:justify-between
                    bg-white dark:bg-gray-900
                    border border-green-100 dark:border-green-300
                    p-4 rounded-xl shadow-sm"
                                >
                                    {/* LEFT SIDE */}
                                    <div className="flex items-start gap-4 min-w-0">
                                        <div className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-full
                        bg-green-100 text-green-700 font-bold">
                                            {i + 1}
                                        </div>

                                        <div className="flex flex-col min-w-0">
                                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                                                Resource
                                            </span>

                                            {/* LONG TEXT SAFE */}
                                            <span className="text-gray-800 dark:text-gray-100 font-medium
                            break-words whitespace-pre-wrap overflow-hidden">
                                                {res.name}
                                            </span>
                                        </div>
                                    </div>

                                    {/* RIGHT SIDE */}
                                    <div className="flex items-center gap-2 sm:justify-end w-full sm:w-auto flex-shrink-0">
                                        <FiCheckCircle className="text-green-500 text-xl" />
                                        <div className="flex flex-col text-center sm:text-left">
                                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                                                Cost
                                            </span>
                                            <span className="text-green-600 font-bold">
                                                Rs. {res.cost}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500">No resources added.</p>
                        )}
                    </div>

                    {/* TOTAL COST */}
                    <div className="flex justify-between items-center mt-4 p-4 rounded-xl
    bg-green-100 border border-green-300 font-semibold text-green-800">
                        <span>Total Cost</span>
                        <span>Rs. {totalResourceCost}</span>
                    </div>
                </div>


                {/* FOOTER */}
                <button
                    onClick={onClose}
                    className="bg-gray-200 cursor-pointer dark:text-gray-200 dark:bg-gray-700 px-5 py-3 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                    Close
                </button>
            </motion.div>

            {/* 🔹 Update Resources Modal */}
            <UpdateResourcesCostModal
                isOpen={showResourcesModal}
                initialResources={localComplaint.resources || []}
                onClose={() => setShowResourcesModal(false)}
                onSave={async (updatedResources) => {
                    try {
                        const updatedComplaint = await updateResolvedResources(localComplaint._id, updatedResources);

                        // 🔹 Immediately update local state to refresh resources
                        setLocalComplaint(prev => ({
                            ...prev,
                            resources: updatedResources
                        }));

                        setShowResourcesModal(false);

                        if (onUpdate) onUpdate(updatedComplaint); // optional parent callback
                    } catch (err) {
                        console.error(err);
                    }
                }}
            />

        </div>,
        document.body
    );
};

const InfoBox = ({ icon, label, value }) => (
    <div className="flex items-center gap-3 p-3 shadow-sm bg-gray-100 dark:bg-gray-700 rounded-md dark:text-gray-200">
        {icon}
        <div>
            <span className="text-sm font-semibold">{label}</span>
            <div>{value || "—"}</div>
        </div>
    </div>
);

export default ViewResolvedComplaintModal;
