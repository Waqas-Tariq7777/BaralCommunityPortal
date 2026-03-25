import { useState, useMemo } from "react";
import { FiMail } from "react-icons/fi";
import bgImage from "../assets/images/dam1.jpg";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { useGuestStore } from "../Store/GuestStore"; // ✅ Import the store
import LoadingSpinner from "../Components/LoadingSpinner";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "../Store/LanguageStore";

export default function Form() {
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState({});

  const { submitMessage, loading } = useGuestStore(); // ✅ Get submit function & loading state
  const { t } = useTranslation(); // ✅ For translations
  const { language } = useLanguageStore(); // ✅ Current language for RTL support

  // ⭐ Generate stars only once
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

  // ✅ Validation function
  const validate = () => {
    let newError = {};
    if (!email) newError.email = t("email_required");
    else if (!/\S+@\S+\.\S+/.test(email)) newError.email = t("email_invalid");

    if (!reason) newError.reason = t("reason_required");

    if (message.length < 20) newError.message = t("message_length");
    else if (message.length > 1000) newError.message = t("message_length");

    setError(newError);
    return Object.keys(newError).length === 0;
  };

  // ✅ Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await submitMessage({ email, reason, message }); // ✅ Send to backend
      setEmail("");
      setReason("");
      setMessage("");
      setError({});
    } catch (err) {
      console.error("Failed to submit message:", err);
    }
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
        {/* Hero Section */}
        <div className="relative z-10 h-80 sm:h-72 md:h-96">
          <img src={bgImage} alt="bg" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/60 dark:bg-black/70"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-6 md:px-8 lg:px-12 pt-20 sm:pt-24 md:pt-32 lg:pt-36 pb-16 sm:pb-20 md:pb-28 lg:pb-32">
            <h1 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-wide drop-shadow-lg">
              {t("contact_us")}
            </h1>
            <div className="w-16 h-1 bg-[#748dff] rounded-full mt-3 mb-2 sm:mb-3"></div>
            <p className="text-gray-200 text-sm sm:text-base md:text-lg max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
              {t("contact_hero_text")}
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

        {/* Form Section */}
        <div className="relative z-10 flex justify-center px-4 -mt-16 sm:-mt-10">
          <div
            className="w-full max-w-2xl bg-gray-100 dark:bg-slate-800/90 backdrop-blur-md rounded-2xl shadow-xl p-5 sm:p-8 mb-10 transition-colors duration-300"
            dir={language === "ur" ? "rtl" : "ltr"}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-[#748dff] p-2 rounded-lg text-white text-lg">
                <FiMail />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
                {t("submit_help_request")}
              </h2>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              {t("required_fields_text")}
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">
                  {t("email")} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("email")}
                  className="w-full border rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-900 text-gray-800 dark:text-white px-4 py-2 focus:ring-2 focus:ring-[#748dff] outline-none transition"
                />
                {error.email && <p className="text-red-500 text-sm mt-1">{error.email}</p>}
              </div>

              {/* Reason */}
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">
                  {t("reason")} <span className="text-red-500">*</span>
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full border rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-900 text-gray-800 dark:text-white px-4 py-2 focus:ring-2 focus:ring-[#748dff] outline-none transition"
                >
                  <option value="">{t("select_reason")}</option>
                  <option value="technical">{t("technical_issue")}</option>
                  <option value="account">{t("account_support")}</option>
                  <option value="feedback">{t("feedback")}</option>
                  <option value="other">{t("others")}</option>
                </select>
                {error.reason && <p className="text-red-500 text-sm mt-1">{error.reason}</p>}
              </div>

              {/* Message */}
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">
                  {t("detail")} <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows="4"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t("detail")}
                  className="w-full border rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-900 text-gray-800 dark:text-white px-4 py-2 focus:ring-2 focus:ring-[#748dff] outline-none transition"
                ></textarea>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-400">{message.length} / 1000</span>
                </div>
                {error.message && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={loading}
                className={`cursor-pointer flex items-center justify-center w-full py-3 rounded-lg font-medium transition ${
                  loading
                    ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                    : "bg-[#748dff] text-white hover:bg-[#5a73e6]"
                }`}
              >
                {loading ? <LoadingSpinner size={24} color="#fff" /> : t("submit_request")}
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}