import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";

const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const useGuestStore = create((set) => ({
  loading: false,

  submitMessage: async (payload) => {
    try {
      set({ loading: true });
      const res = await axios.post(`${baseUrl}/api/guest/submit`, payload);
      toast.success("Message submitted successfully");
      return res.data;
    } catch (err) {
      const msg = err?.response?.data?.message || err.message;
      toast.error(msg);
      throw new Error(msg);
    } finally {
      set({ loading: false });
    }
  },

  // 👇 NEW FUNCTION
fetchMessages: async (search = "", date = "") => {
  try {
    set({ loading: true });

    const query = new URLSearchParams();

    if (search) query.append("search", search);
    if (date) query.append("date", date);

    const res = await axios.get(
      `${baseUrl}/api/guest/messages?${query.toString()}`,
      { withCredentials: true }
    );

    set({ messages: res.data.data });

  } catch (err) {
    const msg = err?.response?.data?.message || err.message;
    toast.error(msg);
  } finally {
    set({ loading: false });
  }
},

 deleteMessage: async (id) => {
    try {
      await axios.delete(`${baseUrl}/api/guest/delete/${id}`, { withCredentials: true });

      // remove from UI instantly
      set((state) => ({
        messages: state.messages.filter((msg) => msg._id !== id),
      }));

      toast.success("Message deleted successfully");
    } catch (err) {
      const msg = err?.response?.data?.message || err.message;
      toast.error(msg);
    }
  },

  markMessageAsRead: async (id) => {
  try {
    await axios.patch(`${baseUrl}/api/guest/read/${id}`, {}, { withCredentials: true });
    // update local state immediately
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg._id === id ? { ...msg, isReadByAdmin: true } : msg
      ),
    }));
  } catch (err) {
    const msg = err?.response?.data?.message || err.message;
    toast.error(msg);
  }
},

getUnreadCount: async () => {
  try {
    set({ loading: true });
    const res = await axios.get(`${baseUrl}/api/guest/messages`, { withCredentials: true });
    const unread = res.data.data.filter(msg => !msg.isReadByAdmin).length;
    set({ unreadGuestCount: unread });
    return unread;
  } catch (err) {
    const msg = err?.response?.data?.message || err.message;
    toast.error(msg);
    return 0;
  } finally {
    set({ loading: false });
  }
}, 

}));