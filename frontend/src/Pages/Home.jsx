import React, { useState } from 'react'
import { motion, AnimatePresence } from "framer-motion";
import Header from '../Components/Header.jsx'
import Footer from '../Components/Footer.jsx';
import LoginPopup from "../Components/LoginPopup.jsx";
import { useAuthStore } from "../Store/AuthStore.js";
import { useLanguageStore } from '../Store/LanguageStore.js';
import { useTranslation } from "react-i18next";

import WapdaLogo from '../assets/images/wapda_logo_bg.png'
import WapdaLogoTransparent from '../assets/images/wapda_logo_transparent.png'
import LegacyImg from "../assets/images/colony-1.jpeg";
import VisionImg from "../assets/images/colony-2.jpeg";
import MissionImg from "../assets/images/colony-3.webp";

import { 
  FiAward, 
  FiEye, 
  FiStar, 
  FiChevronDown, 
  FiChevronUp, 
  FiUsers, 
  FiClock, 
  FiActivity, 
  FiPhoneCall,
  FiArrowRight,
  FiArrowLeft
} from "react-icons/fi";
import { GoDotFill } from "react-icons/go";
import { CiCircleInfo as InfoIcon } from "react-icons/ci";
import { MdKeyboardArrowDown } from "react-icons/md";
import { MdOutlineFlashOn, MdOutlineWaterDrop, MdOutlineSecurity, MdOutlineCleaningServices } from "react-icons/md";

export default function Home() {
  const [openLogin, setOpenLogin] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const authStore = useAuthStore();
  const { t } = useTranslation();
  const { language } = useLanguageStore();

  const isRtl = language === "ur";

  // Generate multiple falling stars
  const stars = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 3 + Math.random() * 3,
    size: 5 + Math.random() * 3
  }));

  const handleScrollToContent = () => {
    const contentSection = document.getElementById("services-section");
    if (contentSection) {
      contentSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 overflow-hidden">
      {/* Falling Stars Container */}
      <div className="fixed inset-0 pointer-events-none z-40">
        {stars.map(star => (
          <motion.div
            key={star.id}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: "110vh", opacity: [0, 1, 0] }}
            transition={{
              delay: star.delay,
              duration: star.duration,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              position: "absolute",
              top: 0,
              left: `${star.left}%`,
              width: star.size,
              height: star.size,
              borderRadius: "50%",
              backgroundColor: "#748dff",
              boxShadow: `0 0 ${star.size}px #748dff`
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <div className="relative min-h-screen flex flex-col justify-between">
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            style={{ filter: "brightness(70%)" }}
          >
            <source src="video.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-slate-900/40 to-slate-950/60"></div>
        </div>

        <div className="relative z-50">
          <Header />
        </div>

        <div className="relative z-10 flex-grow flex flex-col items-center justify-center px-4 py-20">
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-6"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="p-2"
            >
              <img src={WapdaLogoTransparent} alt="Wapda Logo" className="w-32 h-auto sm:w-40 drop-shadow-lg" />
            </motion.div>
            
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl leading-tight">
              {t("welcome_to")} <br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-[#748dff] bg-clip-text text-transparent drop-shadow-sm">
                {t("community_name")}
              </span>
            </h1>

            <div className="w-24 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mx-auto"></div>

            <p className="text-base sm:text-lg md:text-xl text-gray-300 font-light max-w-2xl leading-relaxed">
              {t("hero_text")}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <button
                onClick={handleScrollToContent}
                className="px-8 py-3 rounded-full font-bold bg-[#748dff] text-white border-2 border-[#748dff] hover:bg-transparent hover:text-white transition-all duration-300 shadow-lg shadow-indigo-500/30 cursor-pointer flex items-center gap-2 group"
              >
                <span>{isRtl ? "خدمات دیکھیں" : "Explore Services"}</span>
                {isRtl ? <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> : <FiArrowRight className="group-hover:translate-x-1 transition-transform" />}
              </button>

              {!authStore.user && (
                <button
                  onClick={() => setOpenLogin(true)}
                  className="px-8 py-3 rounded-full font-bold bg-white/10 text-white border-2 border-white/30 backdrop-blur-sm hover:bg-white hover:text-slate-900 transition-all duration-300 cursor-pointer"
                >
                  {t("login_now")}
                </button>
              )}
            </div>
          </motion.section>
        </div>

        <div className="relative z-10 flex justify-center pb-8">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            onClick={handleScrollToContent}
            className="cursor-pointer bg-white/5 hover:bg-white/15 border border-white/10 p-3 rounded-full backdrop-blur-sm transition-all"
          >
            <MdKeyboardArrowDown className="text-white text-3xl" />
          </motion.div>
        </div>
      </div>

      {/* Metrics / Stats Showcase Section */}
      <section className="relative z-20 -mt-5 max-w-7xl mx-auto px-4">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800/80 p-8 sm:p-10 grid grid-cols-2 lg:grid-cols-4 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col items-center text-center space-y-2 border-r last:border-r-0 border-slate-100 dark:border-slate-800/80 pr-2 lg:pr-4"
          >
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl">
              <FiUsers className="w-6 h-6" />
            </div>
            <span className="text-3xl font-extrabold text-slate-800 dark:text-white">{t("stat_residents_val")}</span>
            <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">{t("stat_residents_lbl")}</span>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col items-center text-center space-y-2 lg:border-r border-slate-100 dark:border-slate-800/80 pr-2 lg:pr-4"
          >
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-[#748dff] rounded-2xl">
              <FiClock className="w-6 h-6" />
            </div>
            <span className="text-3xl font-extrabold text-slate-800 dark:text-white">{t("stat_response_val")}</span>
            <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">{t("stat_response_lbl")}</span>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col items-center text-center space-y-2 border-r last:border-r-0 border-slate-100 dark:border-slate-800/80 pr-2 lg:pr-4"
          >
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl">
              <FiActivity className="w-6 h-6" />
            </div>
            <span className="text-3xl font-extrabold text-slate-800 dark:text-white">{t("stat_resolution_val")}</span>
            <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">{t("stat_resolution_lbl")}</span>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col items-center text-center space-y-2"
          >
            <div className="p-3 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded-2xl">
              <FiAward className="w-6 h-6" />
            </div>
            <span className="text-3xl font-extrabold text-slate-800 dark:text-white">{t("stat_staff_val")}</span>
            <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">{t("stat_staff_lbl")}</span>
          </motion.div>
        </div>
      </section>

      {/* Community Services Section */}
      <section 
        id="services-section"
        dir={isRtl ? "rtl" : "ltr"}
        className="max-w-7xl mx-auto px-4 py-24 grid lg:grid-cols-12 gap-16 items-center"
      >
        <motion.div 
          initial={{ opacity: 0, x: isRtl ? 40 : -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-7 space-y-8"
        >
          <div className="flex items-center gap-2 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-[#748dff] w-fit px-4 py-1.5 font-bold text-xs uppercase tracking-wide">
            <GoDotFill className="animate-pulse" />
            {t("community_services")}
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold leading-tight text-slate-900 dark:text-white">
            {t("empowering_services")}
          </h2>

          <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed max-w-xl">
            {t("services_text")}
          </p>

          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-8 space-y-6 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-500/10 to-indigo-500/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
            <h3 className="font-bold text-xl text-slate-900 dark:text-white flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#748dff]"></span>
              {t("account_access")}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">
              {t("account_text")}
            </p>

            <div className="pt-2">
              {authStore.user ? (
                <div className="flex items-center gap-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 px-5 py-3 rounded-2xl w-fit font-medium border border-emerald-100 dark:border-emerald-900/50">
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
                  {isRtl ? `خوش آمدید، ${authStore.user.userName}` : `Welcome back, ${authStore.user.userName}`}
                </div>
              ) : (
                <button
                  onClick={() => setOpenLogin(true)}
                  className="px-8 py-3.5 rounded-2xl font-bold bg-[#748dff] text-white hover:bg-indigo-600 transition-all duration-300 shadow-md shadow-indigo-500/20 cursor-pointer text-sm"
                >
                  {t("login_now")}
                </button>
              )}
            </div>

            <div className="text-slate-500 dark:text-slate-400 flex items-start text-sm gap-2 bg-slate-50 dark:bg-slate-950/40 p-4 rounded-xl">
              <InfoIcon className="text-[#748dff] w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{t("credentials_info")}</span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-5 flex justify-center items-center"
        >
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-[#748dff] rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-10 border border-slate-100 dark:border-slate-800/80 flex justify-center items-center w-72 sm:w-80 md:w-96">
              <img src={WapdaLogo} alt="WAPDA Logo" className="w-56 sm:w-64 h-auto object-contain transform group-hover:scale-105 transition-transform duration-300" />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Community Core Pillars Section */}
      <section className="bg-slate-100 dark:bg-slate-900/50 py-5 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4" dir={isRtl ? "rtl" : "ltr"}>
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
              {t("community_pillars")}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              {t("pillars_subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Electricity */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-start gap-4"
            >
              <div className="p-4 bg-amber-100 dark:bg-amber-950/30 text-amber-500 rounded-2xl">
                <MdOutlineFlashOn className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">{t("pillar_elec_title")}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{t("pillar_elec_desc")}</p>
            </motion.div>

            {/* Clean Water */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-start gap-4"
            >
              <div className="p-4 bg-sky-100 dark:bg-sky-950/30 text-sky-500 rounded-2xl">
                <MdOutlineWaterDrop className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">{t("pillar_water_title")}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{t("pillar_water_desc")}</p>
            </motion.div>

            {/* Security */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-start gap-4"
            >
              <div className="p-4 bg-emerald-100 dark:bg-emerald-950/30 text-emerald-500 rounded-2xl">
                <MdOutlineSecurity className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">{t("pillar_sec_title")}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{t("pillar_sec_desc")}</p>
            </motion.div>

            {/* Care / Sanitation */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-start gap-4"
            >
              <div className="p-4 bg-violet-100 dark:bg-violet-950/30 text-violet-500 rounded-2xl">
                <MdOutlineCleaningServices className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">{t("pillar_maint_title")}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{t("pillar_maint_desc")}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Community Overview Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 overflow-visible">
        <div 
          dir={isRtl ? "rtl" : "ltr"}
          className="grid lg:grid-cols-12 gap-16 items-center"
        >
          <div className="lg:col-span-5 flex justify-center py-12 lg:py-0 relative min-h-[260px] xs:min-h-[320px] sm:min-h-[450px]">
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Stacked Images Animation */}
              <motion.img 
                initial={{ rotate: -8, scale: 0.95 }}
                whileInView={{ rotate: -6 }}
                viewport={{ once: true }}
                src={LegacyImg} 
                alt="Legacy" 
                className="absolute w-32 h-32 xs:w-44 xs:h-44 sm:w-64 sm:h-64 object-cover rounded-2xl sm:rounded-3xl shadow-2xl z-30 -translate-x-6 -translate-y-4 sm:-translate-x-12 sm:-translate-y-8 hover:scale-105 transition-transform duration-300 border-4 border-white dark:border-slate-900" 
              />
              <motion.img 
                initial={{ rotate: 6, scale: 0.95 }}
                whileInView={{ rotate: 4 }}
                viewport={{ once: true }}
                src={VisionImg} 
                alt="Vision" 
                className="absolute w-32 h-32 xs:w-44 xs:h-44 sm:w-64 sm:h-64 object-cover rounded-2xl sm:rounded-3xl shadow-xl z-20 translate-x-2 -translate-y-1 sm:translate-x-4 sm:-translate-y-2 hover:scale-105 transition-transform duration-300 border-4 border-white dark:border-slate-900" 
              />
              <motion.img 
                initial={{ rotate: -4, scale: 0.95 }}
                whileInView={{ rotate: -2 }}
                viewport={{ once: true }}
                src={MissionImg} 
                alt="Mission" 
                className="absolute w-32 h-32 xs:w-44 xs:h-44 sm:w-64 sm:h-64 object-cover rounded-2xl sm:rounded-3xl shadow-lg z-10 translate-x-8 translate-y-6 sm:translate-x-14 sm:translate-y-12 hover:scale-105 transition-transform duration-300 border-4 border-white dark:border-slate-900" 
              />
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: isRtl ? -40 : 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 space-y-10"
          >
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#748dff]">{t("community_overview")}</h2>

            <div className="space-y-8">
              <div className="flex gap-4 sm:gap-6 items-start">
                <div className="p-3.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex-shrink-0">
                  <FiAward className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">{t("legacy_title")}</h3>
                  <p className="text-slate-600 dark:text-slate-400 mt-2 text-base leading-relaxed">{t("legacy_text")}</p>
                </div>
              </div>

              <div className="flex gap-4 sm:gap-6 items-start">
                <div className="p-3.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex-shrink-0">
                  <FiEye className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">{t("vision_title")}</h3>
                  <p className="text-slate-600 dark:text-slate-400 mt-2 text-base leading-relaxed">{t("vision_text")}</p>
                </div>
              </div>

              <div className="flex gap-4 sm:gap-6 items-start">
                <div className="p-3.5 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-2xl flex-shrink-0">
                  <FiStar className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">{t("mission_title")}</h3>
                  <p className="text-slate-600 dark:text-slate-400 mt-2 text-base leading-relaxed">{t("mission_text")}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="bg-slate-100 dark:bg-slate-900/50 py-5 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4" dir={isRtl ? "rtl" : "ltr"}>
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
              {t("faq_title")}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              {t("faq_subtitle")}
            </p>
          </div>

          <div className="space-y-4">
            {[1, 2, 3].map((num) => (
              <motion.div 
                key={num}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: num * 0.1 }}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <button
                  onClick={() => toggleFaq(num)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left font-bold text-slate-800 dark:text-white gap-4 cursor-pointer text-base sm:text-lg"
                  dir={isRtl ? "rtl" : "ltr"}
                  style={{ textAlign: isRtl ? "right" : "left" }}
                >
                  <span>{t(`faq_q${num}`)}</span>
                  <div className="p-1.5 rounded-full bg-slate-50 dark:bg-slate-850 text-slate-500">
                    {activeFaq === num ? <FiChevronUp /> : <FiChevronDown />}
                  </div>
                </button>
                <AnimatePresence initial={false}>
                  {activeFaq === num && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/60 pt-4 text-sm sm:text-base leading-relaxed">
                        {t(`faq_a${num}`)}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Helpline Section */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <div 
          dir={isRtl ? "rtl" : "ltr"}
          className="bg-gradient-to-r from-indigo-700 via-indigo-800 to-slate-900 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden text-white"
        >
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
          <div className="relative z-10 grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/20 text-white w-fit px-4 py-1.5 font-bold text-xs uppercase tracking-wider">
                <FiActivity className="animate-pulse" />
                24/7 emergency
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight">
                {t("emergency_helpline")}
              </h2>
              <p className="text-white/80 text-base sm:text-lg">
                {t("emergency_subtitle")}
              </p>
            </div>
            
            <div className="lg:col-span-6 flex flex-col sm:flex-row gap-4 justify-end">
              <a
                href="tel:+923001234567"
                className="flex items-center justify-center gap-3 bg-white text-slate-900 px-6 py-4 rounded-2xl font-bold shadow-lg hover:bg-slate-100 transition-all text-base"
              >
                <FiPhoneCall className="text-indigo-600 w-5 h-5" />
                <div className="text-left leading-tight">
                  <div className="text-xs text-slate-500 font-medium">{t("control_room")}</div>
                  <div className="text-sm font-extrabold">+92 300 1234567</div>
                </div>
              </a>

              <a
                href="tel:+923001234567"
                className="flex items-center justify-center gap-3 bg-white/10 border border-white/20 text-white px-6 py-4 rounded-2xl font-bold backdrop-blur-sm hover:bg-white/25 transition-all text-base"
              >
                <FiPhoneCall className="text-white w-5 h-5" />
                <div className="text-left leading-tight">
                  <div className="text-xs text-white/60 font-medium">{t("security_desk")}</div>
                  <div className="text-sm font-extrabold">+92 300 1234567</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <LoginPopup open={openLogin} onClose={() => setOpenLogin(false)} />
    </div>
  )
}