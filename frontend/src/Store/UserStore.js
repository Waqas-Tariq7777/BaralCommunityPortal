import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuthStore } from "./AuthStore";

const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const useUserStore = create((set) => ({
  loading: false,

  // Upload profile picture
  uploadProfilePicture: async (userId, file) => {
    try {
      const actualUserId = userId?._id || userId?.id || userId;
      if (!actualUserId) throw new Error("User ID is missing");

      set({ loading: true });

      const formData = new FormData();
      formData.append("profilePicture", file);

      const res = await axios.put(
        `${baseUrl}/api/user/${actualUserId}/profilePicture`,
        formData,
        {
          withCredentials: true,
        }
      );

      // Update auth store user instantly
      const authStore = useAuthStore.getState();
      authStore.setUser({
        ...authStore.user,
        profilePicture: res.data.data,
      });

      toast.success(res.data.message || "Profile picture updated");
      return res.data;
    } catch (err) {
      const msg = err?.response?.data?.message || err.message;
      toast.error(msg);
      throw new Error(msg);
    } finally {
      set({ loading: false });
    }
  },

  // Change password
  changePassword: async (userId, currentPassword, newPassword) => {
    try {
      const actualUserId = userId?._id || userId?.id || userId;
      if (!actualUserId) throw new Error("User ID is missing");

      if (!currentPassword || !newPassword) {
        throw new Error("Both current and new passwords are required");
      }

      set({ loading: true });

      const res = await axios.put(
        `${baseUrl}/api/user/${actualUserId}/changePassword`,
        { currentPassword, newPassword },
        { withCredentials: true }
      );

      toast.success(res.data.message || "Password changed successfully");
      return res.data;
    } catch (err) {
      const msg = err?.response?.data?.message || err.message;
      toast.error(msg);
      throw new Error(msg);
    } finally {
      set({ loading: false });
    }
  },
}));
