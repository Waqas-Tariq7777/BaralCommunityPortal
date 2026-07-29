// imports
import React from "react";
import { useThemeStore } from "../Store/ThemeStore.js";
import { IoSunnyOutline } from "react-icons/io5";
import { FiMoon } from "react-icons/fi";

// theme toggle button
export default function ThemeToggle({ className = "", size = "md" }) {
    const { dark, toggleTheme } = useThemeStore();

    const isSmall = size === "sm";
    const paddingClass = isSmall ? "p-1.5 rounded-lg" : "px-3 py-2 rounded-xl";
    const iconSizeClass = isSmall ? "w-4 h-4" : "w-6 h-6";

    return (
        // toggle button
        <button onClick={toggleTheme} className={`cursor-pointer flex items-center justify-center border-2 transition-all duration-300 ${paddingClass} ${className} hover:scale-105 hover:shadow-lg hover:shadow-blue-300/40 active:scale-95`}>
            {dark ? <FiMoon className={`${iconSizeClass} transition-all duration-300`} /> : <IoSunnyOutline className={`${iconSizeClass} transition-all duration-300`} />}
        </button>
    );
}
