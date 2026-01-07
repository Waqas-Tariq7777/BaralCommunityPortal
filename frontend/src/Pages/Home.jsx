import React from 'react'
import { motion } from "framer-motion";
import Header from '../Components/Header.jsx'
import WapdaLogo from '../assets/images/wapda_logo_bg.png'
import LegacyImg from "../assets/images/colony-1.jpeg";
import VisionImg from "../assets/images/colony-2.jpeg";
import MissionImg from "../assets/images/colony-3.webp";
import { FiAward, FiEye, FiStar } from "react-icons/fi";

export default function Home() {
  return (
    <>
      <div className="relative">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            style={{ filter: "brightness(50%)" }}>
            <source src="video.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-200/50 to-indigo-400/30"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        </div>

        {/* All content above video */}
        <div className="relative z-50 min-h-screen flex flex-col items-center justify-center px-4">
          <Header />
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center space-y-4">
            <img src={WapdaLogo} alt="Wapda Logo" className="w-52 h-auto mx-auto" />
            <h1 className="text-4xl font-bold text-center text-white sm:text-5xl md:text-7xl">Welcome To</h1>
            <h1 className="text-4xl font-bold text-center text-[#748dff] sm:text-5xl md:text-7xl">Baral WAPDA Community</h1>
            <hr className="border-t-5 border-[#748dff] w-28 mx-auto my-4 rounded-full" />
            <p className="text-lg text-center text-gray-300 dark:text-gray-300 leading-relaxed">
              Your trusted platform for staying connected, sharing updates, and managing community services — all in one place.
            </p>
          </motion.section>
        </div>
      </div>

      {/* Community Overview */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}    
        viewport={{ once: true, amount: 0.2 }}  
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center space-y-4">
        <section className="relative z-10 max-w-[1300px] mx-auto px-4 py-20 md:flex md:items-center md:justify-between gap-12">
          <div className="md:w-[50%] lg:w-[50%] space-y-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#748dff]">Community Overview</h2>

            <div className="space-y-8">
              <div className="flex items-start gap-4 sm:gap-6">
                <FiAward className="w-8 h-8 sm:w-10 sm:h-10 md:w-8 md:h-8 text-[#748dff] mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">LEGACY</h3>
                  <p className="text-gray-700 dark:text-gray-300 mt-1 text-sm sm:text-base">
                    Leading the way for years, Baral Mangla WAPDA Community has fostered a strong, well-connected neighborhood, building trust, unity, and sustainable community growth.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 sm:gap-6">
                <FiEye className="w-8 h-8 sm:w-10 sm:h-10 md:w-8 md:h-8 text-[#748dff] mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">VISION</h3>
                  <p className="text-gray-700 dark:text-gray-300 mt-1 text-sm sm:text-base">
                    Baral Mangla WAPDA Community strives to provide a safe, vibrant, and thriving environment where residents enjoy comfort, convenience, and a strong sense of belonging.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 sm:gap-6">
                <FiStar className="w-8 h-8 sm:w-10 sm:h-10 md:w-8 md:h-8 text-[#748dff] mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">MISSION</h3>
                  <p className="text-gray-700 dark:text-gray-300 mt-1 text-sm sm:text-base">
                    Our mission is to enhance community living through efficient services, transparency, resident engagement, and the empowerment of every member to contribute to a better neighborhood.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="md:w-[50%] lg:w-[50%] relative mt-10 md:mt-0 flex justify-center items-center">
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96">
              <img
                src={LegacyImg}
                alt="Legacy"
                className="absolute top-0 left-0 w-40 h-40 sm:w-64 sm:h-64 md:w-60 md:h-60 object-cover rounded-xl shadow-lg z-30 transform rotate-[-8deg] hover:scale-105 transition-transform duration-300"
              />
              <img
                src={VisionImg}
                alt="Vision"
                className="absolute top-8 left-16 w-40 h-40 sm:w-64 sm:h-64 md:w-60 md:h-60 object-cover rounded-xl shadow-lg z-20 transform rotate-[6deg] hover:scale-105 transition-transform duration-300"
              />
              <img
                src={MissionImg}
                alt="Mission"
                className="absolute top-16 left-32 w-40 h-40 sm:w-64 sm:h-64 md:w-60 md:h-60 object-cover rounded-xl shadow-lg z-10 transform rotate-[-4deg] hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </section>
      </motion.section>
    </>
  )
}
