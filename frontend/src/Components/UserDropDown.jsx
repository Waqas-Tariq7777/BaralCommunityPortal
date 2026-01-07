// imports
import React, { useState, useEffect, useRef } from "react";
import { useAuthStore } from "../Store/AuthStore.js";
import { AiOutlineLogout, AiOutlineDashboard, AiOutlineDown } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

// user dropdown component
export default function UserDropdown() {
  const authStore = useAuthStore();
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [profilePic, setProfilePic] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setOpenDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // set profile picture if exists
  useEffect(() => {
    if (authStore.user?.profilePicture?.url) setProfilePic(authStore.user.profilePicture.url);
    else setProfilePic("");
  }, [authStore.user]);

  // scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = () => {
    authStore.logoutUser();
    setOpenDropdown(false);
  };

  const getInitial = (name) => name?.[0]?.toUpperCase() || "U";

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown Button */}
      <button className={`group relative cursor-pointer flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-transparent border ${scrolled ? "border border-[#748dff] hover:text-[#748dff]" : "bg-white text-[#748dff] border-white hover:text-white"}`} onClick={() => setOpenDropdown(!openDropdown)}>
        <div className="relative">
          {authStore.isAdmin && <span className="absolute -top-4 -right-2 bg-[#748dff] text-white text-xs px-1 py-0.5 rounded-full font-semibold">ADMIN</span>}
          {profilePic ? <img src={profilePic} alt="profile" className="w-9 h-9 rounded-xl object-cover" /> : <div className="w-10 h-10 rounded-full bg-[#748dff] flex items-center justify-center text-white font-semibold text-lg">{getInitial(authStore.user?.userName)}</div>}
        </div>
        <AiOutlineDown size={18} className={`${scrolled ? "text-[#748dff]" : "text-[#748dff] group-hover:text-white transition-colors"}`} />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {openDropdown && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden px-2">

            {/* Top Section */}
            <div className="flex flex-col p-2">
              <div className="relative flex items-center">
                {profilePic ? <div className="relative"><img src={profilePic} alt="profile" className="w-12 h-12 rounded-full object-cover" /></div> : <div className="relative">{authStore.isAdmin && <span className="absolute -top-1 -right-1 bg-[#748dff] text-white text-[10px] px-1.5 py-0.5 rounded-full font-semibold">ADMIN</span>}<div className="w-12 h-12 rounded-full bg-[#748dff] flex items-center justify-center text-white font-semibold text-xl">{getInitial(authStore.user?.userName)}</div></div>}
                <div className="flex flex-col ml-2">
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{authStore.user?.userName || "User"}</span>
                  <span className="text-[#748dff] text-sm mt-1">{authStore.user?.email}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-1 pb-2">
              {/* Dashboard Button */}
              <button
                className="cursor-pointer flex items-center gap-2 px-4 py-3 font-medium text-[#748dff] rounded-md transition transform hover:scale-105 hover:ring-1 hover:ring-[#748dff] hover:bg-[#f0f4ff]"
                onClick={() =>
                  authStore.isAdmin
                    ? navigate("/admin/dashboard")
                    : navigate("/user/dashboard")
                }
              >
                <AiOutlineDashboard size={20} /> My Dashboard
              </button>


              {/* Sign Out Button */}
              <button className="cursor-pointer flex items-center gap-2 px-4 py-3 font-medium text-[#f87171] rounded-md transition transform hover:scale-105 hover:ring-1 hover:ring-[#f87171] hover:bg-[#fee2e2]" onClick={handleSignOut}>
                <AiOutlineLogout size={20} /> Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
