// imports
import React from "react";
import { useThemeStore } from "../Store/ThemeStore.js";
import { IoSunnyOutline } from "react-icons/io5";
import { FiMoon } from "react-icons/fi";

// theme toggle button
export default function ThemeToggle({ className = "" }) {
    const { dark, toggleTheme } = useThemeStore();

    return (
        // toggle button
        <button onClick={toggleTheme} className={`cursor-pointer flex items-center gap-2 px-3 py-2 rounded-xl border-2 transition-all duration-300 ${className} hover:scale-105 hover:shadow-lg hover:shadow-blue-300/40 active:scale-95`}>
            {dark ? <FiMoon className="w-6 h-6 transition-all duration-300" /> : <IoSunnyOutline className="w-6 h-6 transition-all duration-300" />}
        </button>
    );
}
