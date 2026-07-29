import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useLanguageStore } from '../Store/LanguageStore.js'
import Header from '../Components/Header.jsx'
import Footer from '../Components/Footer.jsx'

import DamImg from '../assets/images/dam1.jpg'

import { 
  FiShield, 
  FiUsers, 
  FiAward, 
  FiHeart
} from 'react-icons/fi'

export default function About() {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const isRtl = language === 'ur';

  // ⭐ Generate stars only once (matching Contact.jsx)
  const stars = useMemo(() => {
    return [...Array(120)].map((_, i) => {
      const size = Math.random() * 3 + 4;
      const delay = Math.random() * 20;
      const duration = Math.random() * 8 + 6;
      const left = Math.random() * 100;
      const opacity = Math.random() * 0.4 + 0.6;
      const floatX = Math.random() * 30 - 15;
      return { size, delay, duration, left, opacity, floatX, key: i };
    });
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <>
      <Header />

      {/* ⭐ Star Animation */}
      <style>
        {`
          @keyframes fall {
            0% { transform: translateY(0) translateX(0); opacity: 1; }
            100% { transform: translateY(100vh) translateX(20px); opacity: 0; }
          }
        `}
      </style>

      <div className="min-h-screen bg-white dark:bg-slate-900 relative overflow-hidden transition-colors duration-300">
        
        {/* Hero Section (Matching Contact.jsx) */}
        <div className="relative z-10 h-80 sm:h-72 md:h-96">
          <img src={DamImg} alt="bg" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/60 dark:bg-black/70"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-6 md:px-8 lg:px-12 pt-20 sm:pt-24 md:pt-32 lg:pt-36 pb-16 sm:pb-20 md:pb-28 lg:pb-32">
            <h1 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-wide drop-shadow-lg">
              {t('about_hero_title')}
            </h1>
            <div className="w-16 h-1 bg-[#748dff] rounded-full mt-3 mb-2 sm:mb-3"></div>
            <p className="text-gray-200 text-sm sm:text-base md:text-lg max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
              {t('about_hero_subtitle')}
            </p>
          </div>
        </div>

        {/* ⭐ Falling Stars Background (Matching Contact.jsx) */}
        <div className="absolute inset-x-0 top-[calc(20rem)] bottom-0 pointer-events-none z-0">
          {stars.map(star => (
            <span
              key={star.key}
              className="absolute bg-[#748dff] rounded-full"
              style={{
                width: `${star.size}px`,
                height: `${star.size}px`,
                top: 0,
                left: `${star.left}%`,
                opacity: star.opacity,
                animation: `fall ${star.duration}s linear ${star.delay}s infinite`,
                transform: `translateX(${star.floatX}px)`,
              }}
            />
          ))}
        </div>

        {/* Our Story / Story Block */}
        <section className="relative z-10 py-24 max-w-7xl mx-auto px-4" dir={isRtl ? 'rtl' : 'ltr'}>
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: isRtl ? 40 : -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-6 relative rounded-3xl overflow-hidden shadow-2xl group border border-slate-200/50 dark:border-slate-800/80"
            >
              <div className="absolute inset-0 bg-indigo-900/10 z-10 mix-blend-multiply"></div>
              <img 
                src={DamImg} 
                alt="Mangla Dam WAPDA" 
                className="w-full h-[320px] sm:h-[420px] object-cover transform group-hover:scale-105 transition-transform duration-500" 
              />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: isRtl ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-6 space-y-6"
            >
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                {t('our_story_title')}
              </h2>
              <div className="w-16 h-1 bg-[#748dff] rounded-full"></div>
              <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed font-light">
                {t('our_story_p1')}
              </p>
              <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed font-light">
                {t('our_story_p2')}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Core Values Section */}
        <section className="relative z-10 bg-slate-100/50 dark:bg-slate-900/30 py-24 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4" dir={isRtl ? 'rtl' : 'ltr'}>
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                {t('our_values_title')}
              </h2>
              <div className="w-16 h-1 bg-[#748dff] rounded-full mx-auto"></div>
            </div>

            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {/* Integrity */}
              <motion.div 
                variants={itemVariants}
                className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-md hover:shadow-xl transition-all hover:-translate-y-1 duration-300 flex flex-col items-start gap-4"
              >
                <div className="p-3 bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-2xl">
                  <FiShield className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-850 dark:text-white">{t('val_integrity_title')}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-light">{t('val_integrity_desc')}</p>
              </motion.div>

              {/* Resident Welfare */}
              <motion.div 
                variants={itemVariants}
                className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-md hover:shadow-xl transition-all hover:-translate-y-1 duration-300 flex flex-col items-start gap-4"
              >
                <div className="p-3 bg-rose-100 dark:bg-rose-950/40 text-rose-500 rounded-2xl">
                  <FiHeart className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-850 dark:text-white">{t('val_service_title')}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-light">{t('val_service_desc')}</p>
              </motion.div>

              {/* Unity / Collaboration */}
              <motion.div 
                variants={itemVariants}
                className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-md hover:shadow-xl transition-all hover:-translate-y-1 duration-300 flex flex-col items-start gap-4"
              >
                <div className="p-3 bg-indigo-100 dark:bg-indigo-950/40 text-indigo-500 rounded-2xl">
                  <FiUsers className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-850 dark:text-white">{t('val_collaboration_title')}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-light">{t('val_collaboration_desc')}</p>
              </motion.div>

              {/* Excellence */}
              <motion.div 
                variants={itemVariants}
                className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-md hover:shadow-xl transition-all hover:-translate-y-1 duration-300 flex flex-col items-start gap-4"
              >
                <div className="p-3 bg-amber-100 dark:bg-amber-950/40 text-amber-500 rounded-2xl">
                  <FiAward className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-850 dark:text-white">{t('val_excellence_title')}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-light">{t('val_excellence_desc')}</p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Amenities & Infrastructure Directory Section */}
        <section className="relative z-10 py-24 max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4" dir={isRtl ? 'rtl' : 'ltr'}>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
              {t('amenities_title')}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              {t('amenities_subtitle')}
            </p>
            <div className="w-16 h-1.5 bg-[#748dff] rounded-full mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8" dir={isRtl ? 'rtl' : 'ltr'}>
            {/* Mangla Power Station */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 p-8 shadow-xl flex flex-col items-center text-center space-y-6 hover:border-[#748dff] dark:hover:border-[#748dff]/50 hover:shadow-2xl transition-all duration-300"
            >
              <div className="p-4 bg-amber-50 dark:bg-amber-950/30 text-amber-500 rounded-3xl">
                <FiAward className="w-10 h-10" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-slate-850 dark:text-white">{t('amenity_power_title')}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-light">{t('amenity_power_desc')}</p>
              </div>
            </motion.div>

            {/* WAPDA Hospital */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 p-8 shadow-xl flex flex-col items-center text-center space-y-6 hover:border-[#748dff] dark:hover:border-[#748dff]/50 hover:shadow-2xl transition-all duration-300"
            >
              <div className="p-4 bg-red-50 dark:bg-red-950/30 text-red-500 rounded-3xl">
                <FiHeart className="w-10 h-10" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-slate-850 dark:text-white">{t('amenity_health_title')}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-light">{t('amenity_health_desc')}</p>
              </div>
            </motion.div>

            {/* Recreation & Parks */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 p-8 shadow-xl flex flex-col items-center text-center space-y-6 hover:border-[#748dff] dark:hover:border-[#748dff]/50 hover:shadow-2xl transition-all duration-300"
            >
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500 rounded-3xl">
                <FiUsers className="w-10 h-10" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-slate-850 dark:text-white">{t('amenity_sports_title')}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-light">{t('amenity_sports_desc')}</p>
              </div>
            </motion.div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  )
}
