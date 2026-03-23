import React, { useState, useEffect } from "react";
import Logo from "../assets/images/wapda_logo_bg.png";
import { NavLink, Link } from "react-router-dom";
import UserDropdown from "./UserDropDown.jsx";
import { useAuthStore } from "../Store/AuthStore.js";
import ThemeToggle from "./ThemeToggle.jsx";
import LoginPopup from "./LoginPopup.jsx";
import { AiOutlineHome, AiOutlineInfoCircle, AiOutlinePhone } from "react-icons/ai";
import { useTranslation } from "react-i18next";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const authStore = useAuthStore();
  const { t } = useTranslation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-white shadow-md dark:bg-slate-900" : "bg-black/0"}`}>
        <div className="max-w-[1300px] mx-auto flex items-center p-3 md:pl-5 md:pr-5">

          <div className="flex items-center gap-3 md:hidden">
            <button onClick={() => setOpen(!open)} className="cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke={scrolled ? "#748dff" : "white"} className="w-9 h-9">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5m-16.5 5.25h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
            <Link to="/" className={`rounded-xl transition cursor-pointer ${scrolled ? "bg-[#748dff]" : "bg-white"}`}>
              <img src={Logo} alt="logo" className="w-11 h-11 rounded-xl object-cover" />
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link to="/" className={`rounded-xl transition cursor-pointer ${scrolled ? "bg-[#748dff]" : "bg-white"}`}>
              <img src={Logo} alt="logo" className="w-12 h-12 rounded-xl object-cover" />
            </Link>
            <div>
              <h3 className={`text-xl font-bold ${scrolled ? "text-black dark:text-white" : "text-white"}`}>{t("portal_name")}</h3>
              <h4 className={`text-sm font-bold ${scrolled ? "text-gray-600" : "text-white"}`}>{t("community_services")}</h4>
            </div>
          </div>
           
          <nav className={`hidden md:flex gap-8 font-medium transition-all duration-300 justify-center flex-1 ${scrolled ? "text-gray-700 dark:text-gray-500" : "text-white"}`}>
            <NavLink to="/" className={({ isActive }) => `relative px-2 py-1 rounded-md transition-all duration-300 hover:bg-white hover:backdrop-blur-md hover:text-[#748dff] after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-0 after:transition-all after:duration-300 hover:after:w-full ${scrolled ? "after:bg-[#748dff]" : "after:bg-white"} ${isActive ? "bg-white backdrop-blur-md text-[#748dff] after:w-full" : ""}`}>{t("home")}</NavLink>
            <NavLink to="/about" className={({ isActive }) => `relative px-2 py-1 rounded-md transition-all duration-300 hover:bg-white hover:backdrop-blur-md hover:text-[#748dff] after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-0 after:transition-all after:duration-300 hover:after:w-full ${scrolled ? "after:bg-[#748dff]" : "after:bg-white"} ${isActive ? "bg-white backdrop-blur-md text-[#748dff] after:w-full" : ""}`}>{t("about_us")}</NavLink>
            <NavLink to="/contact" className={({ isActive }) => `relative px-2 py-1 rounded-md transition-all duration-300 hover:bg-white hover:backdrop-blur-md hover:text-[#748dff] after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-0 after:transition-all after:duration-300 hover:after:w-full ${scrolled ? "after:bg-[#748dff]" : "after:bg-white"} ${isActive ? "bg-white backdrop-blur-md text-[#748dff] after:w-full" : ""}`}>{t("contact_us")}</NavLink>
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <ThemeToggle className={`cursor-pointer ${scrolled ? "text-[#748dff] border-[#748dff]" : "text-white border-white"}`} />
            {authStore.user ? <UserDropdown /> : <button onClick={() => setOpenLogin(true)} className={`px-4 py-2 rounded-lg font-bold transition border-2 cursor-pointer hover:bg-transparent ${scrolled ? "bg-[#748dff] text-white border-[#748dff] hover:border-[#748dff] hover:text-[#748dff]" : "bg-white text-[#748dff] border-white hover:text-white"}`}>{t("login")}</button>}
          </div>
        </div>

        <div className={`md:hidden bg-white dark:bg-slate-900 shadow-lg transition-all duration-500 overflow-hidden ${open ? "max-h-72 opacity-100" : "max-h-0 opacity-0"}`}>
          <nav className="flex flex-col p-4 text-gray-700 dark:text-gray-300">
            <Link to="/" className="flex items-center gap-3 py-3 px-3 cursor-pointer border-b border-[#748dff] dark:border-slate-700 hover:bg-[#f0f4ff] dark:hover:bg-slate-800 transition"><AiOutlineHome size={20} className="text-[#748dff]" />{t("home")}</Link>
            <Link to="/about" className="flex items-center gap-3 py-3 px-3 cursor-pointer border-b border-[#748dff] dark:border-slate-700 hover:bg-[#f0f4ff] dark:hover:bg-slate-800 transition"><AiOutlineInfoCircle size={20} className="text-[#748dff]" />{t("about_us")}</Link>
            <Link to="/contact" className="flex items-center gap-3 py-3 px-3 cursor-pointer border-b border-[#748dff] dark:border-slate-700 hover:bg-[#f0f4ff] dark:hover:bg-slate-800 transition"><AiOutlinePhone size={20} className="text-[#748dff]" />{t("contact_us")}</Link>
          </nav>
        </div>
      </header>

      <LoginPopup open={openLogin} onClose={() => setOpenLogin(false)} />
    </>
  );
}