import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useLanguageStore } from '../Store/LanguageStore.js'
import Header from '../Components/Header.jsx'
import Footer from '../Components/Footer.jsx'
import DamImg from '../assets/images/dam1.jpg'

export default function Disclaimer() {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const isRtl = language === 'ur';

  // ⭐ Generate stars
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

  return (
    <>
      <Header />

      <style>
        {`
          @keyframes fall {
            0% { transform: translateY(0) translateX(0); opacity: 1; }
            100% { transform: translateY(100vh) translateX(20px); opacity: 0; }
          }
        `}
      </style>

      <div className="min-h-screen bg-white dark:bg-slate-900 relative overflow-hidden transition-colors duration-300">
        
        {/* Hero Section */}
        <div className="relative z-10 h-80 sm:h-72 md:h-96">
          <img src={DamImg} alt="bg" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/60 dark:bg-black/70"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-6 md:px-8 lg:px-12 pt-20 sm:pt-24 md:pt-32 lg:pt-36 pb-16 sm:pb-20 md:pb-28 lg:pb-32">
            <h1 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-wide drop-shadow-lg">
              {t('disclaimer')}
            </h1>
            <div className="w-16 h-1 bg-[#748dff] rounded-full mt-3 mb-2 sm:mb-3"></div>
            <p className="text-gray-200 text-sm sm:text-base md:text-lg max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
              {isRtl ? 'پورٹل سے متعلق قانونی دستبرداری' : 'Legal statements and disclaimer notes.'}
            </p>
          </div>
        </div>

        {/* ⭐ Falling Stars Background */}
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

        {/* Content Section */}
        <div className="relative z-10 flex justify-center px-4 -mt-16 sm:-mt-10 mb-16">
          <div
            className="w-full max-w-4xl bg-gray-50/90 dark:bg-slate-800/90 backdrop-blur-md rounded-2xl shadow-xl p-6 sm:p-10 border border-slate-200/50 dark:border-slate-700/50 text-slate-700 dark:text-slate-200"
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            {isRtl ? (
              <div className="space-y-6 leading-relaxed">
                <section className="space-y-2">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">عام معلومات</h2>
                  <p>بارال واپڈا کمیونٹی پورٹل پر موجود معلومات صرف عام معلوماتی مقاصد کے لیے ہیں۔ انتظامیہ معلومات کو اپ ٹو ڈیٹ اور درست رکھنے کی کوشش کرتی ہے لیکن اس کی مکمل درستگی یا دستیابی کی کوئی ضمانت نہیں دیتی۔</p>
                </section>
                <section className="space-y-2">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">تکنیکی اور بجلی کی خدمات</h2>
                  <p>بجلی، پانی اور دیگر عوامی یوٹیلیٹی شکایات کے حل کا وقت تکنیکی اور موسمی صورتحال کے پیش نظر تبدیل ہو سکتا ہے۔ پورٹل پر ظاہر کردہ حل کی اوسط مدت محض ایک تخمینہ ہے اور حتمی کارروائی کا وقت مختلف ہو سکتا ہے۔</p>
                </section>
                <section className="space-y-2">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">بیرونی روابط</h2>
                  <p>یہ پورٹل دیگر سرکاری یا واپڈا کی بیرونی ویب سائٹس کے لنکس پر مشتمل ہو سکتا ہے جن کے مواد اور پرائیویسی پریکٹسز پر ہمارا کوئی کنٹرول نہیں ہے۔</p>
                </section>
              </div>
            ) : (
              <div className="space-y-6 leading-relaxed">
                <section className="space-y-2">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">General Information</h2>
                  <p>All information provided on the Baral WAPDA Community Portal is for general information and management purposes only. While the administration strives to keep the details accurate and updated, we make no representations or warranties of any kind regarding accuracy or completeness.</p>
                </section>
                <section className="space-y-2">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Utility & Service Resolution</h2>
                  <p>Response times for maintenance (electricity, water, security) are subject to technical availability, weather conditions, and load. Estimates displayed on the dashboard do not constitute a legally binding service-level agreement.</p>
                </section>
                <section className="space-y-2">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">External Links</h2>
                  <p>The portal may contain links to external official websites of WAPDA or other governmental bodies. We hold no control over, and assume no responsibility for, the content or practices of any third-party websites.</p>
                </section>
              </div>
            )}
          </div>
        </div>

      </div>

      <Footer />
    </>
  )
}
