import React from 'react'
import { motion } from "framer-motion";
import Header from '../Components/Header.jsx'
import WapdaLogo from '../assets/images/wapda_logo_bg.png'
import LegacyImg from "../assets/images/colony-1.jpeg";
import VisionImg from "../assets/images/colony-2.jpeg";
import MissionImg from "../assets/images/colony-3.webp";
import { FiAward, FiEye, FiStar } from "react-icons/fi";
import { GoDotFill } from "react-icons/go";
import { CiCircleInfo } from "react-icons/ci";
import { MdKeyboardArrowDown } from "react-icons/md";
import { useState } from 'react';
import Footer from '../Components/Footer.jsx';
import { useAuthStore } from "../Store/AuthStore.js";
import LoginPopup from "../Components/LoginPopup.jsx";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from '../Store/LanguageStore.js';
export default function Home() {
  const [openLogin, setOpenLogin] = useState(false);
  const authStore = useAuthStore();
  const { t } = useTranslation();
  const { language } = useLanguageStore();

  return (
    <>
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            style={{ filter: "brightness(50%)" }}
          >
            <source src="video.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-200/50 to-indigo-400/30"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0], y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50"
          >
            <MdKeyboardArrowDown className="text-white text-5xl md:text-6xl drop-shadow-lg" />
          </motion.div>
        </div>

        <div className="relative z-50 min-h-screen flex flex-col items-center justify-center px-4">
          <Header />
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center space-y-4"
          >
            <img src={WapdaLogo} alt="Wapda Logo" className="w-52 h-auto mx-auto" />
            <h1 className="text-4xl font-bold text-center text-white sm:text-5xl md:text-7xl">{t("welcome_to")}</h1>
            <h1 className="text-4xl font-bold text-center text-[#748dff] sm:text-5xl md:text-7xl">{t("community_name")}</h1>
            <hr className="border-t-5 border-[#748dff] w-28 mx-auto my-4 rounded-full" />
            <p className="text-lg text-center text-gray-300 dark:text-gray-300 leading-relaxed">{t("hero_text")}</p>
          </motion.section>
        </div>
      </div>

      {/* Community Services Section */}
      <motion.section
      dir={language === "ur" ? "rtl" : "ltr"}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 max-w-[1300px] mx-auto px-4 py-20 md:flex md:items-center md:justify-between gap-12"
      >
        <div className="md:w-[55%] lg:w-[58%] space-y-8 w-full">
          <div className="flex items-center rounded-full bg-indigo-100 text-[#748dff] w-fit px-4 py-2 font-bold text-sm md:text-base">
            <GoDotFill className="mr-2" />
            {t("community_services")}
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold leading-tight text-gray-900 dark:text-white">
            {t("empowering_services")}
          </h2>

          <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg w-full md:max-w-xl">
            {t("services_text")}
          </p>

          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 space-y-4 w-full md:max-w-xl dark:bg-transparent dark:border-[#748dff]">
            <h3 className="font-bold text-lg text-gray-900 dark:text-gray-200">{t("account_access")}</h3>
            <p className="text-gray-600 text-sm md:text-base dark:text-gray-300">{t("account_text")}</p>

            {authStore.user ? (
              <p className="font-medium text-gray-800 dark:text-gray-200">Welcome, {authStore.user.userName}</p>
            ) : (
              <button
                onClick={() => setOpenLogin(true)}
                className="px-4 py-2 rounded-lg font-bold transition border-2 cursor-pointer bg-[#748dff] text-white border-[#748dff] hover:bg-transparent hover:text-[#748dff]"
              >
                {t("login_now")}
              </button>
            )}

            <p className="text-gray-600 flex items-start text-sm md:text-base dark:text-gray-400">
              <CiCircleInfo className="mr-2 mt-1 text-[#748dff]" />
              {t("credentials_info")}
            </p>
          </div>
        </div>

        <div className="md:w-[45%] lg:w-[60%] flex justify-center items-center mt-12 md:mt-0">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-2xl p-6 dark:bg-transparent dark:border dark:border-[#748dff]"
          >
            <div className="bg-[#748dff]/10 rounded-xl p-6 flex justify-center items-center">
              <img src={WapdaLogo} alt="WAPDA Logo" className="w-52 sm:w-60 md:w-64 h-auto" />
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Community Overview Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center space-y-4"
      >
        <div dir={language === "ur" ? "rtl" : "ltr"} className="relative z-10 max-w-[1300px] mx-auto px-4 py-10 flex flex-col-reverse lg:flex-row lg:items-center lg:justify-between gap-12">

          <div className="lg:w-[40%] flex justify-center mt-20 mb-40 sm:mt-50 sm:mb-50 lg:mt-0 lg:mb-0">
            <div className="relative w-72 sm:w-80 md:w-96 h-auto flex flex-col justify-center">
              <div className="relative w-full h-full flex items-center justify-center mt-10 sm:mt-30 md:mt-0">
                <img src={LegacyImg} alt="Legacy" className="absolute w-40 h-40 sm:w-64 sm:h-64 md:w-70 md:h-70 object-cover rounded-xl shadow-lg z-30 -translate-x-8 -translate-y-8 transform -rotate-8 hover:scale-105 transition-transform duration-300" />
                <img src={VisionImg} alt="Vision" className="absolute w-40 h-40 sm:w-64 sm:h-64 md:w-70 md:h-70 object-cover rounded-xl shadow-lg z-20 translate-x-4 -translate-y-4 transform rotate-6 hover:scale-105 transition-transform duration-300" />
                <img src={MissionImg} alt="Mission" className="absolute w-40 h-40 sm:w-64 sm:h-64 md:w-70 md:h-70 object-cover rounded-xl shadow-lg z-10 translate-x-12 translate-y-8 transform -rotate-4 hover:scale-105 transition-transform duration-300" />
              </div>
            </div>
          </div>

          <div className="lg:w-[50%] space-y-10 flex flex-col justify-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#748dff]">{t("community_overview")}</h2>

            <div className="space-y-8">
              <div className="flex items-start gap-4 sm:gap-6">
                <FiAward className="w-8 h-8 sm:w-10 sm:h-10 md:w-8 md:h-8 text-[#748dff] mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">{t("legacy_title")}</h3>
                  <p className="text-gray-700 dark:text-gray-300 mt-1 text-sm sm:text-base">{t("legacy_text")}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 sm:gap-6">
                <FiEye className="w-8 h-8 sm:w-10 sm:h-10 md:w-8 md:h-8 text-[#748dff] mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">{t("vision_title")}</h3>
                  <p className="text-gray-700 dark:text-gray-300 mt-1 text-sm sm:text-base">{t("vision_text")}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 sm:gap-6">
                <FiStar className="w-8 h-8 sm:w-10 sm:h-10 md:w-8 md:h-8 text-[#748dff] mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">{t("mission_title")}</h3>
                  <p className="text-gray-700 dark:text-gray-300 mt-1 text-sm sm:text-base">{t("mission_text")}</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </motion.section>
      <Footer />
      <LoginPopup open={openLogin} onClose={() => setOpenLogin(false)} />
    </>
  )
}