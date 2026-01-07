import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import Logo from "../../assets/images/wapda_logo_bg.png";
import { useEffect, useState } from "react";
import ThemeToggle from "../ThemeToggle.jsx";
import { useThemeStore } from "../../Store/ThemeStore.js";

export default function Topbar({ open, setOpen, currentPage }) {
  const [dateTime, setDateTime] = useState(new Date());
  const dark = useThemeStore((state) => state.dark);

  // Live date & time update
  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Format date & time nicely
  const options = { weekday: "short", month: "short", day: "numeric", year: "numeric" };
  const formattedDate = dateTime.toLocaleDateString(undefined, options);
  const formattedTime = dateTime.toLocaleTimeString();

  return (
    <header className="flex justify-between items-center px-4 py-3 shadow-sm md:px-6 bg-white dark:bg-slate-900 transition-colors border-b border-[#748dff]">

      {/* Left*/}
      <div className="flex items-center gap-3">
        {/* Toggle button */}
        <button
          onClick={() => setOpen(!open)}
          className={`cursor-pointer hover:text-[#748dff] dark:hover:text-[#748dff] transition-colors ${dark ? "text-white" : "text-gray-600 dark:text-gray-300"
            }`}
        >
          {open ? <AiOutlineClose size={22} /> : <AiOutlineMenu size={22} />}
        </button>

        {/* Show logo and title only when sidebar is collapsed */}
        {!open && (
          <div className="flex items-center gap-2 ml-2">
            <img src={Logo} alt="logo" className="w-10 h-10 animate-pulse" />
            <div className="flex flex-col">
              <h1 className="hidden font-bold text-[#748dff] text-sm animate-pulse">Baral Portal</h1>
              <p className="hidden text-xs text-gray-500 dark:text-gray-400">Management System</p>
            </div>
          </div>
        )}

        {/* Current page title */}
        <span className="font-semibold text-gray-700 dark:text-gray-200">{currentPage}</span>
      </div>

      {/* Right*/}
      <div className="flex items-center gap-4">
    
        <ThemeToggle className={`cursor-pointer ${dark ? "text-white" : ""}`} />

        {/* Date & Time (hidden on mobile) */}
        <div className="hidden md:flex flex-col text-sm items-end">
          <div className="flex items-center gap-1">
            <span className="text-[#748dff] font-semibold">Date:</span>
            <span className="text-gray-600 dark:text-gray-300 font-medium">{formattedDate}</span>
          </div>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-[#748dff] font-semibold">Time:</span>
            <span className="text-gray-600 dark:text-gray-300 font-medium">{formattedTime}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
