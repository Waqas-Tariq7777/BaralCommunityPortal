import React, { useEffect, useState, useRef } from "react";
import { useGuestStore } from "../../Store/GuestStore";
import { FiSearch, FiCalendar, FiMail } from "react-icons/fi";
import { motion } from "framer-motion";
import ConfirmDeleteModal from "../../Components/Admin/ConfirmDeleteModal";

const AdminGuestMessages = () => {
    const {
        messages = [],
        fetchMessages,
        deleteMessage,
        markMessageAsRead,
        loading,
    } = useGuestStore();

    const [searchTerm, setSearchTerm] = useState("");
    const [searchDate, setSearchDate] = useState("");

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // Track which badges should be hidden after 10s
    const [hiddenBadges, setHiddenBadges] = useState({});

    // refs for layout (optional, e.g., scrolling)
    const messageRefs = useRef({});

    // Initial load
    useEffect(() => {
        fetchMessages();
    }, []);

    // Debounced search + date filter
    useEffect(() => {
        const delay = setTimeout(() => {
            fetchMessages(searchTerm, searchDate);
        }, 500);

        return () => clearTimeout(delay);
    }, [searchTerm, searchDate]);

    // Open/Close modal
    const openDeleteModal = (id) => {
        setSelectedId(id);
        setIsModalOpen(true);
    };
    const closeDeleteModal = () => {
        if (deleteLoading) return;
        setIsModalOpen(false);
        setSelectedId(null);
    };

    // Confirm delete
    const handleConfirmDelete = async () => {
        if (!selectedId) return;
        try {
            setDeleteLoading(true);
            await deleteMessage(selectedId);
            closeDeleteModal();
        } catch (err) {
            console.error(err);
        } finally {
            setDeleteLoading(false);
        }
    };

    // Manual mark as read
    const handleMarkAsRead = (id) => {
        markMessageAsRead(id);

        // Hide badge after 10 seconds
        setTimeout(() => {
            setHiddenBadges((prev) => ({ ...prev, [id]: true }));
        }, 10000);
    };

    return (
        <div className="max-w-7xl mx-auto p-4">
            {/* HEADER */}
            <h2 className="text-2xl font-bold mb-6 dark:text-gray-200">Guest Inbox</h2>

            {/* FILTERS */}
            <div className="flex flex-wrap gap-3 mb-6">
                {/* Search */}
                <div className="relative flex-1 min-w-[200px]">
                    <FiSearch className="absolute left-3 top-3 text-[#748dff]" />
                    <input
                        type="text"
                        placeholder="Search by email or reason..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 p-2 border bg-white border-gray-300 dark:bg-transparent dark:border-slate-700 rounded placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#748dff]"
                    />
                </div>

                {/* Date Filter */}
                <div className="relative min-w-[180px]">
                    <FiCalendar className="absolute left-3 top-3 text-[#748dff]" />
                    <input
                        type="date"
                        value={searchDate}
                        onChange={(e) => setSearchDate(e.target.value)}
                        className="cursor-pointer w-full pl-10 p-2 border bg-white dark:text-gray-300 border-gray-300 dark:bg-transparent dark:border-slate-700 rounded focus:outline-none focus:ring-2 focus:ring-[#748dff]"
                    />
                </div>
            </div>

            {/* LOADER */}
            {loading && (
                <div className="flex justify-center py-6">
                    <div className="w-10 h-10 border-4 border-[#748dff] border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            {/* NO DATA */}
            {!loading && messages.length === 0 && (
                <div className="text-center py-10 text-gray-500">
                    <FiMail className="text-5xl mx-auto mb-3 text-[#748dff]" />
                    <p>No messages found</p>
                </div>
            )}

            {/* MESSAGE LIST */}
            <div className="grid gap-4">
                {!loading &&
                    messages.map((msg) => (
                        <motion.div
                            key={msg._id}
                            data-id={msg._id}
                            ref={(el) => (messageRefs.current[msg._id] = el)}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md border border-gray-200 dark:border-slate-700 hover:shadow-lg transition relative"
                        >
                            {/* UNREAD BADGE */}
                            {!msg.isReadByAdmin && !hiddenBadges[msg._id] && (
                                <span className="absolute -top-1 right-4 bg-red-500 text-white text-xs px-3 py-1 rounded-full shadow">
                                    Unread
                                </span>
                            )}


                            {/* TOP SECTION */}
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#748dff] text-white text-lg font-bold">
                                    {msg.email?.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <h3 className="font-bold text-gray-800 dark:text-white">{msg.email}</h3>
                                        <span className="text-xs text-gray-400">
                                            {new Date(msg.createdAt).toLocaleString()}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Reason:{" "}
                                        <span className="capitalize font-medium text-[#748dff]">{msg.reason}</span>
                                    </p>
                                </div>
                            </div>

                            {/* MESSAGE CONTENT */}
                            {/* MESSAGE CONTENT */}
                            <div className="bg-[#f5f7ff] dark:bg-slate-900 p-6 pb-8 rounded-lg border border-[#e0e7ff] dark:border-slate-600">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-8 h-8 flex items-center justify-center bg-[#748dff] text-white rounded-md">
                                        <FiMail />
                                    </div>
                                    <h4 className="font-semibold text-gray-800 dark:text-white">Message Content</h4>
                                </div>
                                <p className="text-gray-700 dark:text-gray-200 leading-relaxed">{msg.message}</p>

                                {/* BUTTONS: Mark as Read + Delete */}
                                <div className="flex justify-end gap-1 mt-4">
                                    {!msg.isReadByAdmin && !hiddenBadges[msg._id] && (
                                        <button
                                            onClick={() => handleMarkAsRead(msg._id)}
                                            className="text-green-500 text-sm py-1 cursor-pointer hover:underline rounded hover:text-green-700 transition"
                                        >
                                            Mark as Read
                                        </button>
                                    )}
                                    <button
                                        onClick={() => openDeleteModal(msg._id)}
                                        className="text-red-500 text-sm px-3 py-1 cursor-pointer hover:underline  rounded hover:text-red-700 transition"
                                    >
                                        Delete message
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
            </div>

            {/* CONFIRM DELETE MODAL */}
            <ConfirmDeleteModal
                isOpen={isModalOpen}
                onClose={closeDeleteModal}
                onConfirm={handleConfirmDelete}
                loading={deleteLoading}
            />
        </div>
    );
};

export default AdminGuestMessages;