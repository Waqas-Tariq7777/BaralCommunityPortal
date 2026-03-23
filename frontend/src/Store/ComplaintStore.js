import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";

const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const useComplaintStore = create((set) => ({
  loading: false,

  // Submit complaint (user)
  submitComplaint: async (payload) => {
    try {
      set({ loading: true });
      const res = await axios.post(`${baseUrl}/api/complaint/user/submitComplaint`, payload, { withCredentials: true });
      toast.success("Complaint submitted successfully");
      return res.data;
    } catch (err) {
      const msg = err?.response?.data?.message || err.message;
      toast.error(msg);
      throw new Error(msg);
    } finally {
      set({ loading: false });
    }
  },

  // Get user's complaints
  getUserComplaints: async ({ search = "", type = "All", status = "Any", limit = 25, lastId = null }) => {
    try {
      set({ loading: true });
      const params = { search, type, status, limit };
      if (lastId) params.lastId = lastId;
      console.log("last id is:", lastId)
      const res = await axios.get(`${baseUrl}/api/complaint/user/getUserComplaint`, { params, withCredentials: true });
      return res.data; // { data: [...], message, meta: { lastId, hasMore } }
    } catch (err) {
      const msg = err?.response?.data?.message || err.message;
      toast.error(msg);
      throw new Error(msg);
    } finally {
      set({ loading: false });
    }
  },

  markComplaintAsRead: async (complaintId) => {
  try {
    await axios.patch(`${baseUrl}/api/complaint/admin/markAsRead/${complaintId}`, {}, { withCredentials: true });
  } catch (err) {
    const msg = err?.response?.data?.message || err.message;
    toast.error(msg);
    throw new Error(msg);
  }
},

  // Update complaint (user)
  updateComplaint: async (complaintId, payload) => {
    try {
      set({ loading: true });
      const res = await axios.put(`${baseUrl}/api/complaint/user/updateUserComplaint/${complaintId}`, payload, { withCredentials: true });
      toast.success("Complaint updated successfully");
      return res.data;
    } catch (err) {
      const msg = err?.response?.data?.message || err.message;
      toast.error(msg);
      throw new Error(msg);
    } finally {
      set({ loading: false });
    }
  },

  // Delete complaint
  deleteComplaint: async (complaintId) => {
    try {
      set({ loading: true });
      const res = await axios.delete(`${baseUrl}/api/complaint/deleteComplaint/${complaintId}`, { withCredentials: true });
      toast.success("Complaint deleted successfully");
      return res.data;
    } catch (err) {
      const msg = err?.response?.data?.message || err.message;
      toast.error(msg);
      throw new Error(msg);
    } finally {
      set({ loading: false });
    }
  },

  // Get all complaints (admin)
  getAllComplaints: async ({ search = "", type = "All", status = "Any", limit = 25, lastId = null }) => {
    try {
      set({ loading: true });
      const params = { search, type, status, limit };
      if (lastId) params.lastId = lastId;

      const res = await axios.get(`${baseUrl}/api/complaint/admin/getAllComplaints`, { params, withCredentials: true });
      return res.data; // { data: [...], message, meta: { lastId, hasMore } }
    } catch (err) {
      const msg = err?.response?.data?.message || err.message;
      toast.error(msg);
      throw new Error(msg);
    } finally {
      set({ loading: false });
    }
  },


  // Update complaint status (admin)
  updateComplaintStatus: async (complaintId, status) => {
    try {
      set({ loading: true });
      const res = await axios.put(`${baseUrl}/api/complaint/admin/updateStatus/${complaintId}`, { status }, { withCredentials: true });
      toast.success("Status updated successfully");
      return res.data.data; // updated complaint
    } catch (err) {
      const msg = err?.response?.data?.message || err.message;
      toast.error(msg);
      throw new Error(msg);
    } finally {
      set({ loading: false });
    }
  },

  // Resolve complaint with resources (admin)
resolveComplaint: async (complaintId, resources) => {
  try {
    set({ loading: true });
    const res = await axios.put(
      `${baseUrl}/api/complaint/admin/resolvedComplaints/${complaintId}`,
      { resources },
      { withCredentials: true }
    );
    toast.success("Complaint resolved successfully");
    return res.data.data;
  } catch (err) {
    const msg = err?.response?.data?.message || err.message;
    toast.error(msg);
    throw new Error(msg);
  } finally {
    set({ loading: false });
  }
},

// Update resolved complaint resources (admin)
updateResolvedResources: async (complaintId, resources) => {
  try {
    set({ loading: true });

    const res = await axios.put(
      `${baseUrl}/api/complaint/admin/updateResources/${complaintId}`,
      { resources },
      { withCredentials: true }
    );

    toast.success("Resources updated successfully");
    return res.data.data; // updated complaint
  } catch (err) {
    const msg = err?.response?.data?.message || err.message;
    toast.error(msg);
    throw new Error(msg);
  } finally {
    set({ loading: false });
  }
},

// Store: ComplaintStore.js
deleteResolvedComplaint: async (complaintId) => {
  try {
    set({ loading: true });
    await axios.delete(
      `${baseUrl}/api/complaint/admin/deleteResolved/${complaintId}`,
      { withCredentials: true }
    );
    toast.success("Resolved complaint deleted successfully");
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
