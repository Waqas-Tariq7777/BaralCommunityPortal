// imports
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../Store/AuthStore.js";
import LoadingSpinner from "./LoadingSpinner.jsx";
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineClose, AiOutlineMail, AiOutlineLock } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

// login popup component
export default function LoginPopup({ open, onClose }) {
  const authStore = useAuthStore();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  // reset form fields when popup opens
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
    if (!email) validationErrors.email = "Email is required";
    else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) validationErrors.email = "Enter a valid email";

    if (!password) validationErrors.password = "Password is required";
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) validationErrors.password = "Password must contain at least 1 uppercase, 1 lowercase, and 1 number";

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      authStore.loginUser({ email, password }, () => {
        onClose();       
        navigate("/");   
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      {/* popup container */}
      <motion.div initial={{ opacity: 0, scale: 0.6, y: -40 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.45, ease: "easeOut" }} className="bg-white rounded-3xl w-[90%] max-w-md p-8 shadow-2xl relative border border-[#748dff]/30 dark:bg-slate-900">

        {/* close button */}
        <button onClick={onClose} className="cursor-pointer absolute top-4 right-4 text-gray-500 hover:text-black transition dark:hover:text-white">
          <AiOutlineClose size={25} />
        </button>

        {/* title */}
        <h2 className="text-3xl font-bold text-center text-[#748dff]">Welcome Back</h2>
        <p className="text-center text-gray-500 mt-1 mb-6">Login to access your Baral Community WAPDA Portal</p>

        {/* login form */}
        <form onSubmit={handleSubmit}>
          {/* email input */}
          <div className="mb-4 relative">
            <label className="block text-sm font-medium mb-1 dark:text-white">Email</label>
            <span className="absolute left-3 top-10 text-[#748dff]"><AiOutlineMail size={20} /></span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className="w-full pl-10 p-3 border rounded-xl outline-none border-[#748dff] focus:ring-2 focus:ring-[#748dff] dark:text-white" />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* password input */}
          <div className="mb-2 relative">
            <label className="block text-sm font-medium mb-1 dark:text-white">Password</label>
            <span className="absolute left-3 top-10 text-[#748dff]"><AiOutlineLock size={20} /></span>
            <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" className="w-full pl-10 pr-12 p-3 border rounded-xl outline-none border-[#748dff] focus:ring-2 focus:ring-[#748dff] dark:text-white" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="cursor-pointer absolute right-3 top-[38px] text-gray-500 hover:text-black dark:hover:text-white">
              {showPassword ? <AiOutlineEyeInvisible size={23} /> : <AiOutlineEye size={23} />}
            </button>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          {/* forgot password */}
          <div className="text-right mb-6"><button className="cursor-pointer text-sm text-[#748dff] hover:underline">Forgot Password?</button></div>

          {/* login button or loader */}
          {authStore.loading ? (
            <div className="flex justify-center"><LoadingSpinner size={35} /></div>
          ) : (
            <button type="submit" className="cursor-pointer w-full bg-[#748dff] hover:bg-[#5e73ff] text-white p-3 rounded-xl transition font-semibold text-lg shadow-md hover:shadow-lg">Login</button>
          )}
        </form>
      </motion.div>
    </div>
  );
}
