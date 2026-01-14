import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { FiX } from "react-icons/fi";
import { AiOutlineEdit } from "react-icons/ai";
import LoadingSpinner from "../../Components/LoadingSpinner.jsx";
import { useComplaintStore } from "../../Store/ComplaintStore.js";

const EditComplaintModal = ({ isOpen, onClose, complaint, onSuccess }) => {
  const updateComplaint = useComplaintStore((state) => state.updateComplaint);

  const [formData, setFormData] = useState({ complaintType: "", category: "", message: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (complaint) {
      setFormData({
        complaintType: complaint.complaintType || "",
        category: complaint.complaintType === "special" ? "Special" : complaint.reason || "",
        message: complaint.message || "",
      });
    }
  }, [complaint]);

  if (!isOpen || !complaint) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "complaintType" && value === "special") setFormData((prev) => ({ ...prev, complaintType: value, category: "Special" }));
    else if (name === "complaintType" && value !== "special") setFormData((prev) => ({ ...prev, complaintType: value, category: "" }));
    else setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (complaint.status !== "pending") { alert("Only pending complaints can be edited."); return; }
    setLoading(true);
    try { await updateComplaint(complaint._id, formData); onSuccess(); onClose(); } 
    catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* BACKDROP */}
      <div onClick={onClose} className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      {/* MODAL */}
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.25 }} className="relative z-10 w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6">
        {/* CLOSE */}
        <button onClick={onClose} className="cursor-pointer absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition"><FiX size={20} /></button>

        {/* HEADING */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#748dff] flex items-center justify-center text-white shadow-lg"><AiOutlineEdit /></div>
          <h2 className="text-2xl font-bold text-black dark:text-white">Edit Complaint</h2>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* COMPLAINT TYPE */}
          <div>
            <label className="block mb-1 text-sm font-bold text-gray-700 dark:text-gray-300">Complaint Type</label>
            <select name="complaintType" value={formData.complaintType} onChange={handleChange} className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 dark:border-gray-700 focus:border-[#748dff] focus:ring-2 focus:ring-[#748dff] outline-none dark:bg-gray-800 dark:text-white cursor-pointer">
              <option value="">Select Type</option>
              <option value="general">General</option>
              <option value="special">Special</option>
            </select>
          </div>

          {/* CATEGORY / REASON */}
          <div>
            <label className="block mb-1 text-sm font-bold text-gray-700 dark:text-gray-300">Category / Reason</label>
            {formData.complaintType === "special" ? (
              <input name="category" value="Special" readOnly className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 cursor-not-allowed" />
            ) : (
              <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 dark:border-gray-700 focus:border-[#748dff] focus:ring-2 focus:ring-[#748dff] outline-none dark:bg-gray-800 dark:text-white cursor-pointer">
                <option value="">Select Category</option>
                <option value="Electrician">Electrician</option>
                <option value="Plumber">Plumber</option>
                <option value="Masonary">Masonary</option>
                <option value="Carpenter">Carpenter</option>
                <option value="Painter">Painter</option>
              </select>
            )}
          </div>

          {/* MESSAGE */}
          <div>
            <label className="block mb-1 text-sm font-bold text-gray-700 dark:text-gray-300">Complaint Message</label>
            <textarea name="message" value={formData.message} onChange={handleChange} rows={4} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:border-[#748dff] focus:ring-2 focus:ring-[#748dff] outline-none dark:bg-gray-800 dark:text-white resize-none" />
          </div>

          {/* SUBMIT */}
          <button type="submit" disabled={loading || complaint.status !== "pending"} className={`drop-shadow-xl cursor-pointer w-full px-4 py-3 bg-[#748dff] hover:bg-indigo-500 text-white rounded-lg flex items-center justify-center gap-2 shadow-lg transition mt-2 ${complaint.status !== "pending" ? "opacity-50 cursor-not-allowed" : ""}`}>
            {loading ? <LoadingSpinner size={20} color="#fff" /> : "Update Complaint"}
          </button>
        </form>
      </motion.div>
    </div>,
    document.body
  );
};

export default EditComplaintModal;
