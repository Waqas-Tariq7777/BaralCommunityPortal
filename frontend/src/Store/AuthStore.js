  import { create } from "zustand";
  import axios from "axios";
  import { toast } from "react-toastify";

  // base API URL
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

  // Load user from localStorage on page load
  const storedUser = localStorage.getItem("user");
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;

  // Auth store
  export const useAuthStore = create((set, get) => ({
    user: parsedUser,
    isAdmin: parsedUser?.isAdmin || false,
    loading: false,

    setUser: (userData) => {
    set({ user: userData, isAdmin: userData?.isAdmin || false });
    localStorage.setItem("user", JSON.stringify(userData)); // persist
  },
  
    // login user
    loginUser: async (credentials, onSuccess) => {
      set({ loading: true });
      try {
        const res = await axios.post(`${baseUrl}/api/auth/login`, credentials, { withCredentials: true });
        const data = res.data?.data;

        if (res.status === 200) {
          set({ user: data, isAdmin: data.isAdmin || false, loading: false });
          localStorage.setItem("user", JSON.stringify(data)); 
          toast.success("Login successful");
          if (onSuccess) onSuccess(); 
        }
      } catch (error) {
        set({ loading: false, user: null, isAdmin: false });

        const backendMessage = error?.response?.data?.message || error?.response?.data?.error || error.message;

        // friendly error messages
        let friendlyMessage = "Login failed";
        if (backendMessage.toLowerCase().includes("user not found")) friendlyMessage = "Email is incorrect";
        else if (backendMessage.toLowerCase().includes("password is incorrect")) friendlyMessage = "Password is incorrect";
        else if (backendMessage.toLowerCase().includes("unauthorized")) friendlyMessage = "Email or Password is incorrect";

        toast.error(friendlyMessage);
      }
    },

    // logout user
    logoutUser: async () => {
      set({ user: null, isAdmin: false });
      localStorage.removeItem("user");
      toast.info("Logged out successfully");
    },
  }));
