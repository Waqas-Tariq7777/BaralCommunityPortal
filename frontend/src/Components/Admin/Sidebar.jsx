import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Logo from "../../assets/images/wapda_logo_bg.png";
import { useAuthStore } from "../../Store/AuthStore.js";
import { MdForum } from "react-icons/md";
import { BsFillFilePostFill } from "react-icons/bs";
import { MdOutlinePreview } from "react-icons/md";
import {
    AiOutlineDashboard,
    AiOutlineUser,
    AiOutlineFileText,
    AiOutlineNotification,
    AiOutlineMessage,
    AiOutlineRight,
    AiOutlineDown,
    AiOutlineClose,
    AiOutlineProfile,
    AiOutlineCheckCircle,
    AiOutlineHistory,
    AiOutlineInbox,
    AiOutlineLogout
} from "react-icons/ai";

export default function Sidebar({ open, setOpen }) {
    const [activeMenu, setActiveMenu] = useState(null);
    const location = useLocation();
    const authStore = useAuthStore();

    // Sign Out
    const handleSignOut = () => {
        authStore.logoutUser();
        setOpenDropdown(false);
    };

    // Auto-close sidebar on small screens
    useEffect(() => {
        if (window.innerWidth < 768) setOpen(false);
    }, []);

    // Sidebar Menu Items
    const menuItems = [
        { name: "Dashboard", icon: AiOutlineDashboard, base: "/admin/dashboard" },
        {
            name: "User Management",
            icon: AiOutlineUser,
            sub: [
                { name: "View Users", path: "/admin/viewUsers", icon: AiOutlineUser },
                { name: "Add Users", path: "/admin/addUsers", icon: AiOutlineProfile },
            ]
        },
        {
            name: "Complaints",
            icon: AiOutlineFileText,
            sub: [
                { name: "All Complaints", path: "/admin/viewAllComplaints", icon: AiOutlineFileText },
                { name: "Resolved Complaints", path: "/admin/resolvedComplaints", icon: AiOutlineCheckCircle },
            ]
        },
        {
            name: "Community Hub",
            icon: MdForum,
            sub: [
                { name: "Add Post", path: "/admin/addPost", icon: BsFillFilePostFill },
                { name: "View Posts", path: "/admin/viewPosts", icon: MdOutlinePreview  },
            ]
        },
        {
            name: "Messages",
            icon: AiOutlineMessage,
            sub: [
                { name: "Community Inbox", path: "/admin/communityinbox", icon: AiOutlineInbox },
                { name: "Guest Inbox", path: "/admin/guestInbox", icon: AiOutlineProfile },
            ]
        },
    ];

    // Sidebar Content
    const sidebarContent = (
        <div className="flex flex-col h-full p-4 dark:bg-slate-900">

            {/* Logo Section */}
            <div className="flex items-center justify-between gap-3 mb-8">
                <div className="flex items-center gap-3">
                    <img src={Logo} alt="logo" className="w-12 h-12" />
                    {(open || window.innerWidth < 768) && (
                        <div>
                            <h1 className="text-lg font-bold text-[#748dff] uppercase">Baral Portal</h1>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Management System</p>
                        </div>
                    )}
                </div>
                <button
                    className="md:hidden text-gray-600 dark:text-gray-300 hover:text-[#748dff] dark:hover:text-[#748dff]"
                    onClick={() => setOpen(false)}>
                    <AiOutlineClose size={22} />
                </button>
            </div>

            {/* Navigation Menu */}
            <nav className="flex flex-col gap-2">
                {menuItems.map((item, i) => {
                    const Icon = item.icon;
                    const hasSub = item.sub && item.sub.length > 0;
                    const isActive = location.pathname === item.base || (hasSub && item.sub.some(s => s.path === location.pathname));

                    return (
                        <div key={i}>
                            {hasSub ? (
                                <>
                                    {/* Menu Button with Dropdown */}
                                    <button
                                        onClick={() => setActiveMenu(activeMenu === i ? null : i)}
                                        className={`cursor-pointer flex items-center justify-between w-full p-3 rounded-lg font-semibold transition
                                            ${isActive ? "bg-[#f0f4ff] dark:bg-slate-700 text-[#748dff]" : "text-gray-600 dark:text-gray-300 hover:bg-[#f0f4ff] dark:hover:bg-slate-700 hover:text-[#748dff]"}`}>
                                        <div className="flex items-center gap-3">
                                            <Icon size={22} className={isActive ? "text-[#748dff]" : ""} />
                                            {open && <span>{item.name}</span>}
                                        </div>
                                        {open && (activeMenu === i ? <AiOutlineDown /> : <AiOutlineRight />)}
                                    </button>

                                    {/* Submenu */}
                                    {open && activeMenu === i && (
                                        <div className="ml-11 mt-1 flex flex-col gap-1">
                                            {item.sub.map((sub, idx) => {
                                                const SubIcon = sub.icon;
                                                return (
                                                    <NavLink
                                                        key={idx}
                                                        to={sub.path}
                                                        className={`flex items-center gap-2 text-sm font-normal p-2 rounded-md transition
                                                            ${location.pathname === sub.path
                                                                ? "bg-[#748dff] text-white"
                                                                : "text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"}`}>
                                                        <SubIcon size={16} />
                                                        {sub.name}
                                                    </NavLink>
                                                );
                                            })}
                                        </div>
                                    )}
                                </>
                            ) : (
                                /* Direct NavLink */
                                <NavLink
                                    to={item.base}
                                    className={`flex items-center gap-3 w-full p-3 rounded-lg font-semibold transition
                                        ${isActive
                                            ? "bg-[#f0f4ff] dark:bg-slate-700 text-[#748dff]"
                                            : "text-gray-600 dark:text-gray-300 hover:bg-[#f0f4ff] dark:hover:bg-slate-700 hover:text-[#748dff]"}`}
                                >
                                    <Icon size={22} className={isActive ? "text-[#748dff]" : ""} />
                                    {open && <span>{item.name}</span>}
                                </NavLink>
                            )}
                        </div>
                    );
                })}
            </nav>

            {/* Sign Out Button */}
            <button
                className=" cursor-pointer mt-auto flex items-center gap-2 px-4 py-3 font-medium text-[#f87171] rounded-md transition transform hover:scale-105 hover:ring-1 hover:ring-[#f87171] hover:bg-[#fee2e2]"
                onClick={handleSignOut}
            >
                <AiOutlineLogout size={20} /> {open && "Sign Out"}
            </button>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <motion.aside
                animate={{ width: open ? 260 : 80 }}
                transition={{ duration: 0.25 }}
                className="hidden md:flex flex-col bg-white dark:bg-slate-900 dark:border-r dark:border-[#748dff] shadow-lg min-h-screen"
            >
                {sidebarContent}
            </motion.aside>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ x: -300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -300, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="fixed top-0 left-0 w-64 h-screen bg-white dark:bg-slate-900 shadow-lg z-50"
                    >
                        {sidebarContent}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
