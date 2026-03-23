import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../Store/AuthStore.js";
import LoadingSpinner from "./LoadingSpinner.jsx";
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineClose, AiOutlineMail, AiOutlineLock } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ForgotPasswordModal from "./User/ForgotPasswordModal.jsx";
import { toast } from "react-toastify"; 
export default function LoginPopup({ open, onClose }) {
  const authStore = useAuthStore();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [forgotOpen, setForgotOpen] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setEmail("");
      setPassword("");
      setErrors({});
      setShowPassword(false);
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    let validationErrors = {};
    if (!email) validationErrors.email = t("email_required");
    else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) validationErrors.email = t("email_invalid");

    if (!password) validationErrors.password = t("password_required");
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) validationErrors.password = t("Password_invalid");

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      authStore.loginUser({ email, password }, () => {
        toast.success("Login successful!");
        onClose();
        navigate("/");
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div initial={{ opacity: 0, scale: 0.6, y: -40 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.45, ease: "easeOut" }} className="bg-white rounded-3xl w-[90%] max-w-md p-8 shadow-2xl relative border border-[#748dff]/30 dark:bg-slate-900">

        <button onClick={onClose} className="cursor-pointer absolute top-4 right-4 text-gray-500 hover:text-black transition dark:hover:text-white">
          <AiOutlineClose size={25} />
        </button>

        <h2 className="text-3xl font-bold text-center text-[#748dff]">{t("welcome_back")}</h2>
        <p className="text-center text-gray-500 mt-1 mb-6">{t("login_subtitle")}</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4 relative">
            <label className="block text-sm font-medium mb-1 dark:text-white">{t("email")}</label>
            <span className="absolute left-3 top-10 text-[#748dff]"><AiOutlineMail size={20} /></span>
            <input type="email" name="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t("enter_email")} className="w-full pl-10 p-3 border rounded-xl outline-none border-[#748dff] focus:ring-2 focus:ring-[#748dff] dark:text-white" />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div className="mb-2 relative">
            <label className="block text-sm font-medium mb-1 dark:text-white">{t("password")}</label>
            <span className="absolute left-3 top-10 text-[#748dff]"><AiOutlineLock size={20} /></span>
            <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t("enter_password")} className="w-full pl-10 pr-12 p-3 border rounded-xl outline-none border-[#748dff] focus:ring-2 focus:ring-[#748dff] dark:text-white" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="cursor-pointer absolute right-3 top-[38px] text-gray-500 hover:text-black dark:hover:text-white">
              {showPassword ? <AiOutlineEyeInvisible size={23} /> : <AiOutlineEye size={23} />}
            </button>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          <button
            type="button"
            onClick={() => setForgotOpen(true)}
            className="float-right pb-1 cursor-pointer text-sm text-[#748dff] hover:underline"
          >
            {t("forgot_password")}
          </button>

          <button
    type="submit"
    className="cursor-pointer w-full bg-[#748dff] hover:bg-[#5e73ff] text-white p-3 rounded-xl transition font-semibold text-lg shadow-md hover:shadow-lg flex justify-center items-center disabled:opacity-60 disabled:cursor-not-allowed"
    disabled={authStore.loading}
  >
    {authStore.loading ? <LoadingSpinner size={25} /> : t("login")}
  </button>
        </form>
      </motion.div>
      <ForgotPasswordModal open={forgotOpen} onClose={() => setForgotOpen(false)} />
    </div>
  );
}