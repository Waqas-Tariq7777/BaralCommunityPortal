import { useState } from "react";
import { useAuthStore } from "../../Store/AuthStore";
import { toast } from "react-toastify";
import { AiOutlineClose, AiOutlineMail } from "react-icons/ai";
import { useTranslation } from "react-i18next";

export default function ForgotPasswordModal({ open, onClose }) {
  const { t } = useTranslation();
  const { forgotPassword } = useAuthStore(); // remove global loading
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false); // ✅ local loading

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) return toast.error(t("email_required"));
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return toast.error(t("email_invalid"));

    setLoading(true); // start local spinner
    try {
      await forgotPassword(email, () => {
        setEmail("");
        onClose();
      });
    } finally {
      setLoading(false); // stop spinner
    }
  };

  return (
    <div className="fixed inset-0 bg-transparent/80 backdrop-blur-1xl flex justify-center items-center z-[999]">
      <div className="bg-white dark:bg-slate-900 p-10 rounded-2xl w-[30%] max-w-md shadow-8xl border-4 border-[#748dff]/50 relative">
        <button onClick={onClose} className="absolute top-4 right-4 cursor-pointer text-gray-500 hover:text-black dark:hover:text-white transition">
          <AiOutlineClose size={22} />
        </button>

        <h2 className="text-2xl font-bold text-center text-[#748dff]">{t("forgot_password_title")}</h2>
        <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-1 mb-6">{t("forgot_password_subtitle")}</p>

        <form onSubmit={handleSubmit}>
          <div className="relative mb-5">
            <span className="absolute left-3 top-3 text-[#748dff]"><AiOutlineMail size={20} /></span>
            <input
              type="email"
              placeholder={t("enter_email")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 text-black dark:text-white outline-none focus:border-[#748dff] focus:ring-2 focus:ring-[#748dff]/40 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#748dff] hover:bg-[#5e73ff] text-white p-3 rounded-xl font-semibold transition shadow-md hover:shadow-lg cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex justify-center items-center"
          >
            {loading ? "Sending..." : t("send_reset_link")}
          </button>
        </form>
      </div>
    </div>
  );
}