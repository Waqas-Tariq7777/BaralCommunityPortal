import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuthStore } from "./AuthStore";

const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const useMessageStore = create((set) => ({
  loading: false,
  messages: [],

  sendMessage: async (messageContent, callback) => {
    try {
      set({ loading: true });
      const res = await axios.post(
        `${baseUrl}/api/message/send`,
        { message: messageContent },
        { withCredentials: true }
      );
      toast.success(res.data.message || "Message sent");
      if (callback) callback();
      return res.data.data;
    } catch (err) {
      const msg = err?.response?.data?.message || err.message;
      toast.error(msg);
      throw new Error(msg);
    } finally {
      set({ loading: false });
    }
  },

 fetchInbox: async (search = "", date = "", type = "", status = "") => {
  try {
    set({ loading: true });

    const res = await axios.get(`${baseUrl}/api/message/inbox`, {
      params: { search, date, type, status },
      withCredentials: true,
    });

    // 🔥 ensure sorted
    const sortedMessages = res.data.data.sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );

    set({ messages: sortedMessages });

    return sortedMessages;
  } catch (err) {
    const msg = err?.response?.data?.message || err.message;
    toast.error(msg);
    throw new Error(msg);
  } finally {
    set({ loading: false });
  }
},

editMessage: async (messageId, newContent, callback) => {
  try {
    set({ loading: true });
    const res = await axios.put(
      `${baseUrl}/api/message/edit/${messageId}`,
      { message: newContent },
      { withCredentials: true }
    );
    toast.success(res.data.message || "Message updated");
    if (callback) callback();
    return res.data.data;
  } catch (err) {
    const msg = err?.response?.data?.message || err.message;
    toast.error(msg);
    throw new Error(msg);
  } finally {
    set({ loading: false });
  }
},

deleteMessage: async (messageId, callback) => {
  try {
    set({ loading: true });
    const res = await axios.delete(`${baseUrl}/api/message/delete/${messageId}`, {
      withCredentials: true,
    });
    toast.success(res.data.message || "Message deleted");
    if (callback) callback();
    return true;
  } catch (err) {
    const msg = err?.response?.data?.message || err.message;
    toast.error(msg);
    throw new Error(msg);
  } finally {
    set({ loading: false });
  }
},

fetchAdminMessages: async (search = "", date = "") => {
  try {
    set({ loading: true });

    const res = await axios.get(`${baseUrl}/api/message/adminGetMessages`, {
      params: { search, date },
      withCredentials: true,
    });

    set({ messages: res.data.data });
    return res.data.data;
  } catch (err) {
    const msg = err?.response?.data?.message || err.message;
    toast.error(msg);
    throw new Error(msg);
  } finally {
    set({ loading: false });
  }
},
unreadCount: 0,
fetchUnreadCount: async () => {
  try {
    const res = await axios.get(`${baseUrl}/api/message/unread-count`, {
      withCredentials: true,
    });

    set({ unreadCount: res.data.data });
    return res.data.data;
  } catch (err) {
    console.error(err);
  }
},

replyToMessage: async (messageId, replyText, callback) => {
  try {
    set({ loading: true });

    const res = await axios.post(
      `${baseUrl}/api/message/admin/reply/${messageId}`,
      { message: replyText },
      { withCredentials: true }
    );

    toast.success(res.data.message || "Reply sent");
    if (callback) callback();

    return res.data.data;
  } catch (err) {
    const msg = err?.response?.data?.message || err.message;
    toast.error(msg);
    throw new Error(msg);
  } finally {
    set({ loading: false });
  }
},

editReply: async (replyId, newContent, callback) => {
  try {
    set({ loading: true });
    const res = await axios.put(
      `${baseUrl}/api/message/admin/reply/edit/${replyId}`,
      { message: newContent },
      { withCredentials: true }
    );
    toast.success(res.data.message || "Reply updated");
    if (callback) callback();
    return res.data.data;
  } catch (err) {
    const msg = err?.response?.data?.message || err.message;
    toast.error(msg);
    throw new Error(msg);
  } finally {
    set({ loading: false });
  }
},

deleteReply: async (replyId, callback) => {
  try {
    set({ loading: true });
    const res = await axios.delete(
      `${baseUrl}/api/message/admin/reply/delete/${replyId}`,
      { withCredentials: true }
    );
    toast.success(res.data.message || "Reply deleted");
    if (callback) callback();
    return true;
  } catch (err) {
    const msg = err?.response?.data?.message || err.message;
    toast.error(msg);
    throw new Error(msg);
  } finally {
    set({ loading: false });
  }
},

// Store/MessageStore.js
softDeleteMessage: async (messageId, callback) => {
  try {
    set({ loading: true });
    const res = await axios.patch(
      `${baseUrl}/api/message/admin/delete/${messageId}`,
      {},
      { withCredentials: true }
    );
    toast.success(res.data.message || "Message soft-deleted");
    if (callback) callback();
    return true;
  } catch (err) {
    const msg = err?.response?.data?.message || err.message;
    toast.error(msg);
    throw new Error(msg);
  } finally {
    set({ loading: false });
  }
},
}));