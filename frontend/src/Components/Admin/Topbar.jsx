import React, { useState, useEffect } from "react";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { useLocation } from "react-router-dom";
import ThemeToggle from "../ThemeToggle.jsx";
import { useThemeStore } from "../../Store/ThemeStore.js";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from '../../Store/LanguageStore.js';
import { useAuthStore } from "../../Store/AuthStore.js";
import UserNotificationBell from "../User/UserNotificationBell.jsx";

export default function Topbar({ open, setOpen, currentPage }) {
  const location = useLocation();
  const [dateTime, setDateTime] = useState(new Date());
  const dark = useThemeStore((state) => state.dark);
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const { user } = useAuthStore();

  const isUserDashboard = location.pathname === "/user/communityHub" || currentPage === "community_hub";

  const isRtl = language === "ur";

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const options = { weekday: "short", month: "short", day: "numeric", year: "numeric" };
  const formattedDate = dateTime.toLocaleDateString(undefined, options);
  const formattedTime = dateTime.toLocaleTimeString();

  return (
    <header className="flex justify-between items-center h-16 px-4 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800/80 shadow-sm transition-colors duration-300">
      
      {/* Left section: Hamburger Menu → Logo → Page Name */}
      <div className="flex items-center gap-3 sm:gap-4 h-full">
        {/* 1. Hamburger Menu */}
        <button
          onClick={() => setOpen(!open)}
          className={`cursor-pointer p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center ${
            dark ? "text-slate-200 hover:text-white" : "text-slate-600 hover:text-slate-900"
          }`}
          aria-label="Toggle Sidebar"
        >
          {open ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
        </button>



        {/* 3. Page Name */}
        <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm sm:text-base capitalize whitespace-nowrap overflow-hidden text-ellipsis max-w-[100px] xs:max-w-[150px] sm:max-w-none">
          {t(currentPage)}
        </span>
      </div>

      {/* Right section: DateTime (Desktop only) → Theme Switcher Icon → User DP */}
      <div className="flex items-center gap-3 sm:gap-4 h-full">
        {/* Date and Time (hidden on mobile/tablet) */}
        <div dir={isRtl ? "rtl" : "ltr"} className="hidden lg:flex flex-col text-right leading-tight text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-[#748dff]">{t("date")}</span>
            <span className="font-medium">{formattedDate}</span>
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="font-semibold text-[#748dff]">{t("time")}</span>
            <span className="font-medium">{formattedTime}</span>
          </div>
        </div>

        {/* Divider (Desktop only) */}
        <div className="hidden lg:block h-6 w-px bg-slate-200 dark:bg-slate-800"></div>

        {/* 4. Theme Switcher Icon */}
        <div className="flex items-center justify-center p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <ThemeToggle size="sm" className="cursor-pointer text-slate-500 dark:text-slate-400 hover:text-[#748dff] dark:hover:text-[#748dff] transition-colors" />
        </div>

        {/* 🔔 User Notification Bell (Only on User Dashboard) */}
        {user && !user.isAdmin && isUserDashboard && (
          <>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800"></div>
            <UserNotificationBell />
          </>
        )}

        {/* Divider */}
        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800"></div>

        {/* 5. User DP */}
        {user && (
          <div className="flex items-center gap-2.5">
            <div className="relative w-9 h-9 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 shadow-inner flex-shrink-0 flex items-center justify-center">
              <img 
                src={user.profilePicture?.url || "/avatar.png"} 
                alt={user.userName} 
                className="w-full h-full object-cover" 
              />
            </div>
            {/* Display username/email only on large screens to keep mobile/tablet clean */}
            <div className="hidden xl:flex flex-col text-left leading-tight">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 max-w-[100px] truncate">
                {user.userName}
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-light max-w-[120px] truncate">
                {user.email}
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}