import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";

const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const useAdminStore = create((set, get) => ({
  loading: false,

  addUser: async (data) => {
    try {
      const res = await axios.post(`${baseUrl}/api/admin/addUser`, data, { withCredentials: true });
      toast.success(res.data.message || "User added successfully");
      return res.data;
    } catch (err) {
      const msg = err?.response?.data?.message || err.message;
      toast.error(msg);
      throw new Error(msg);
    }
  },

  uploadUsersCSV: async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post(`${baseUrl}/api/admin/uploadUserViaCSV`, formData, { withCredentials: true });
      toast.success(res.data.message || "CSV uploaded successfully");
      return res.data;
    } catch (err) {
      const msg = err?.response?.data?.message || err.message;
      toast.error(msg);
      throw { message: msg, rejectedUsers: err?.response?.data?.rejectedUsers || [] };
    }
  },

  getUsers: async ({ limit = 8, lastId = null, search = "" } = {}) => {
    try {
      const params = { limit, search };
      if (lastId) params.lastId = lastId;
      const res = await axios.get(`${baseUrl}/api/admin/getUsers`, { params, withCredentials: true });
      return res.data;
    } catch (err) {
      const msg = err?.response?.data?.message || err.message;
      toast.error(msg);
      throw new Error(msg);
    }
  },

  updateUser: async (id, data) => {
  try {
    const res = await axios.put(
      `${baseUrl}/api/admin/updateUsers/${id}`,
      data,
      { withCredentials: true }
    );

    toast.success(res.data.message || "User updated successfully");
    return res.data;
  } catch (err) {
    const msg = err?.response?.data?.message || err.message;
    toast.error(msg);
    throw new Error(msg);
  }
},

deleteUser: async (id) => {
    try {
      const res = await axios.delete(`${baseUrl}/api/admin/deleteUsers/${id}`, { withCredentials: true });
      toast.success(res.data.message || "User deleted successfully");
      return res.data;
    } catch (err) {
      const msg = err?.response?.data?.message || err.message;
      toast.error(msg);
      throw new Error(msg);
    }
  },

  getUsersCount: async () => {
  try {
    const res = await axios.get(`${baseUrl}/api/admin/getUsersCount`, {
      withCredentials: true,
    });
    return res.data.data.totalUsers;
  } catch (err) {
    const msg = err?.response?.data?.message || err.message;
    toast.error(msg);
    throw new Error(msg);
  }
},

getAnnouncementsCount: async () => {
  try {
    const res = await axios.get(`${baseUrl}/api/admin/getAnnouncementsCount`, {
      withCredentials: true,
    });
    return res.data.count;
  } catch (err) {
    toast.error(err?.response?.data?.message || err.message);
    return 0;
  }
},

getComplaintStats: async () => {
  try {
    const res = await axios.get(`${baseUrl}/api/admin/getComplaintStats`, {
      withCredentials: true,
    });
    return res.data; // { pending, resolved }
  } catch (err) {
    toast.error(err?.response?.data?.message || err.message);
    return { pending: 0, resolved: 0 };
  }
},

getUserStats: async () => {
  try {
    const res = await axios.get(`${baseUrl}/api/admin/getUserStats`, {
      withCredentials: true,
    });
    return res.data; // { totalUsers, weeklyUsers }
  } catch (err) {
    const msg = err?.response?.data?.message || err.message;
    toast.error(msg);
    return { totalUsers: 0, weeklyUsers: 0 };
  }
},

}));
