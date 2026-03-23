import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../Store/AuthStore";
import { toast } from "react-toastify";
import { AiOutlineLock, AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useTranslation } from "react-i18next";

export default function ResetPassword() {
  const { t } = useTranslation();
  const { token } = useParams();
  const navigate = useNavigate();
  const { resetPassword, loading } = useAuthStore();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // 👁 states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

    if (!password || !confirmPassword) {
      return toast.error(t("all_fields_required"));
    }

    if (!passwordRegex.test(password)) {
      return toast.error(t("password_invalid"));
    }

    if (password !== confirmPassword) {
      return toast.error(t("passwords_do_not_match"));
    }

    resetPassword(token, { password, confirmPassword }, () => navigate("/"));
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-slate-950 px-4">

      <form
        onSubmit={handleSubmit}
        className="
          bg-white dark:bg-slate-900
          p-8 rounded-3xl
          shadow-2xl
          w-full max-w-md
          border border-[#748dff]/30
        "
      >

        {/* Heading */}
        <h1 className="text-2xl font-bold text-center text-[#748dff]">
          Baral Community Portal
        </h1>

        <h2 className="text-xl font-semibold text-center mt-2 dark:text-white">
          {t("reset_password_title")}
        </h2>

        <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-1 mb-6">
          {t("reset_password_subtitle")}
        </p>

        {/* Password */}
        <div className="relative mb-4">
          <span className="absolute left-3 top-3 text-[#748dff]">
            <AiOutlineLock size={20} />
          </span>

          <input
            type={showPassword ? "text" : "password"}
            placeholder={t("new_password")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="
              w-full pl-10 pr-12 p-3 rounded-xl
              border border-gray-300 dark:border-gray-700
              bg-white dark:bg-slate-800
              text-black dark:text-white
              outline-none
              focus:border-[#748dff]
              focus:ring-2 focus:ring-[#748dff]/40
              transition
            "
          />

          {/* 👁 Eye Button */}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 cursor-pointer text-gray-500 hover:text-black dark:hover:text-white"
          >
            {showPassword ? <AiOutlineEyeInvisible size={22} /> : <AiOutlineEye size={22} />}
          </button>
        </div>

        {/* Confirm Password */}
        <div className="relative mb-6">
          <span className="absolute left-3 top-3 text-[#748dff]">
            <AiOutlineLock size={20} />
          </span>

          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder={t("confirm_password")}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="
              w-full pl-10 pr-12 p-3 rounded-xl
              border border-gray-300 dark:border-gray-700
              bg-white dark:bg-slate-800
              text-black dark:text-white
              outline-none
              focus:border-[#748dff]
              focus:ring-2 focus:ring-[#748dff]/40
              transition
            "
          />

          {/* 👁 Eye Button */}
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-3 cursor-pointer text-gray-500 hover:text-black dark:hover:text-white"
          >
            {showConfirmPassword ? <AiOutlineEyeInvisible size={22} /> : <AiOutlineEye size={22} />}
          </button>
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="
            w-full bg-[#748dff] hover:bg-[#5e73ff]
            text-white p-3 rounded-xl
            font-semibold
            transition shadow-md hover:shadow-lg
            cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed
          "
        >
          {loading ? t("updating") : t("reset_password_button")}
        </button>

      </form>
    </div>
  );
}