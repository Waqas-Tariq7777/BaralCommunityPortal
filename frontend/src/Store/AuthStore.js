import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";

const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

const storedUser = localStorage.getItem("user");
const parsedUser = storedUser ? JSON.parse(storedUser) : null;

export const useAuthStore = create((set, get) => ({
  user: parsedUser,
  isAdmin: parsedUser?.isAdmin || false,
  loading: false,

  setUser: (userData) => {
    set({ user: userData, isAdmin: userData?.isAdmin || false });
    localStorage.setItem("user", JSON.stringify(userData));
  },

  // ================= LOGIN =================
  // inside useAuthStore
loginUser: async (credentials, onSuccess) => {
  set({ loading: true });
  try {
    const res = await axios.post(`${baseUrl}/api/auth/login`, credentials, { withCredentials: true });
    const data = res.data?.data;

    set({ user: data, isAdmin: data.isAdmin || false, loading: false });
    localStorage.setItem("user", JSON.stringify(data));

    // ================= SESSION TIMER =================
    setTimeout(() => {
      set({ user: null, isAdmin: false });
      localStorage.removeItem("user");
      toast.info("Session expired. Please login again.");
      window.location.href = "/sessionExpire"; // redirect to home page
    }, 20 * 24 * 60 * 60 * 1000); // 5 minutes in milliseconds

    if (onSuccess) onSuccess();
  } catch (error) {
    set({ loading: false, user: null, isAdmin: false });

    const backendMessage =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error.message;

    let friendlyMessage = "Login failed";
    if (backendMessage.toLowerCase().includes("user not found"))
      friendlyMessage = "Email is incorrect";
    else if (backendMessage.toLowerCase().includes("password"))
      friendlyMessage = "Password is incorrect";

    toast.error(friendlyMessage);
  }
},
  // ================= FORGOT PASSWORD =================
  forgotPassword: async (email, onSuccess) => {
    set({ loading: true });
    try {
      const res = await axios.post(`${baseUrl}/api/auth/forgot-password`, { email });

      set({ loading: false });
      toast.success("Reset link sent to your email");

      if (onSuccess) onSuccess();
    } catch (error) {
      set({ loading: false });

      const msg = error?.response?.data?.message || "Something went wrong";
      toast.error(msg);
    }
  },

  // ================= RESET PASSWORD =================
  resetPassword: async (token, passwords, onSuccess) => {
    set({ loading: true });
    try {
      await axios.post(`${baseUrl}/api/auth/reset-password/${token}`, passwords);

      set({ loading: false });
      toast.success("Password reset successful");

      if (onSuccess) onSuccess();
    } catch (error) {
      set({ loading: false });

      const msg = error?.response?.data?.message || "Reset failed";
      toast.error(msg);
    }
  },

  // ================= LOGOUT =================
  logoutUser: async () => {
    set({ user: null, isAdmin: false });
    localStorage.removeItem("user");
    toast.info("Logged out successfully");
  },
}));