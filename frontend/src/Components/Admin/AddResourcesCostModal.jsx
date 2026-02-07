import React, { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { FiX, FiPlus, FiTrash2, FiLayers } from "react-icons/fi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingSpinner from "../LoadingSpinner";
const AddResourcesCostModal = ({ isOpen, onClose, onSave, initialResources = [] }) => {
  const [resources, setResources] = useState([{ name: "", cost: 0 }]);
  const [saving, setSaving] = useState(false);

  // Load initial resources when modal opens
  // 1. Only set initial resources when modal opens
useEffect(() => {
  if (isOpen) {
    setResources(initialResources.length ? initialResources : [{ name: "", cost: 0 }]);
  }
}, [isOpen]);




  const totalCost = useMemo(() => {
    return resources.reduce((sum, r) => sum + (Number(r.cost) || 0), 0);
  }, [resources]);

  if (!isOpen) return null;

  const addResource = () => setResources([...resources, { name: "", cost: 0 }]);

  const removeResource = (index) => {
    if (resources.length === 1) {
      toast.error("At least one resource is required");
      return;
    }
    setResources(resources.filter((_, i) => i !== index));
  };

// 2. Keep inputs as string until needed
const updateResource = (index, field, value) => {
  const updated = [...resources];
  updated[index][field] = value;
  setResources(updated);
};

  const handleSave = async () => {
  if (!resources.length) {
    toast.error("At least one resource is required to resolve the complaint");
    return;
  }

  for (let i = 0; i < resources.length; i++) {
    const r = resources[i];
    if (!r.name.trim()) {
      toast.error(`Resource No:${i + 1} name cannot be empty`);
      return;
    }
    if (r.cost === "" || r.cost <= 0) {
      toast.error(`Resource No:${i + 1} cost must be greater than 0`);
      return;
    }
  }

  try {
    setSaving(true);
    await onSave({ resources, totalCost });
  } finally {
    setSaving(false);
  }
};


  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* BACKDROP */}
      <div onClick={onClose} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* MODAL */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.25 }}
        className="mx-4 relative z-10 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-[650px] w-full p-8 flex flex-col gap-6 max-h-[90vh] overflow-y-auto sm:p-4"
      >
        {/* CLOSE */}
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-4 right-4 text-gray-500 hover:text-gray-700 sm:top-2 sm:right-2"
        >
          <FiX size={24} />
        </button>

        {/* HEADER */}
        <div className="flex items-center gap-3 sm:gap-2">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#748dff] text-white sm:w-10 sm:h-10">
            <FiLayers size={22} />
          </div>
          <div>
            <h2 className="text-xl font-bold sm:text-lg dark:text-white">
              Add Resources & Cost
            </h2>
            <p className="text-sm text-gray-500 sm:text-xs">
              Please enter the resources used and their costs before marking it as resolved.
            </p>
          </div>
        </div>

        {/* RESOURCES */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between flex-wrap">
            <h3 className="font-semibold dark:text-gray-300">Resources</h3>
            <button
              onClick={addResource}
              className="flex items-center gap-2 bg-[#748dff] drop-shadow-xl font-bold cursor-pointer text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-500 mt-2 sm:mt-1"
            >
              <FiPlus /> Add Resource
            </button>
          </div>

          {resources.map((res, index) => (
            <div
              key={index}
              className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 grid grid-cols-12 gap-4 items-end"
            >
              <div className="col-span-12 sm:col-span-7">
                <label className="text-sm font-medium dark:text-gray-200">
                  Resource Name
                </label>
                <input
                  type="text"
                  value={res.name}
                  onChange={(e) => updateResource(index, "name", e.target.value)}
                  className="mt-1 w-full px-4 py-2 dark:text-gray-200 rounded-lg border dark:border-[#748dff]"
                />
              </div>

              <div className="col-span-12 sm:col-span-4">
                <label className="text-sm font-medium dark:text-gray-200">
                  Cost (PKR)
                </label>
                <input
                  type="number"
                  value={res.cost}
                  onChange={(e) => updateResource(index, "cost", e.target.value)}
                  className="mt-1 w-full px-4 py-2 dark:text-gray-200 rounded-lg border dark:border-[#748dff]"
                />
              </div>

              {resources.length > 1 && (
                <div className=" col-span-12 sm:col-span-1 flex justify-center items-center mt-2 sm:mt-0">
                  <button onClick={() => removeResource(index)} className="text-red-500 cursor-pointer p-1">
                    <FiTrash2 size={20} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* TOTAL */}
        <div className="flex justify-between bg-blue-50 p-4 rounded-xl font-semibold">
          <span>Total Estimated Cost:</span>
          <span>Rs: {totalCost}</span>
        </div>

        {/* FOOTER */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button onClick={onClose} className="cursor-pointer flex-1 bg-gray-200 px-5 py-3 rounded-lg">
            Cancel
          </button>
          <button
  onClick={handleSave}
  disabled={saving}
  className="cursor-pointer flex-1 bg-[#748dff] hover:bg-indigo-500 drop-shadow-2xl text-white px-5 py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
>
  {saving ? (
    <>
      <LoadingSpinner size={22} color="#ffffff" />
      <span>Saving...</span>
    </>
  ) : (
    "Save & Update Status"
  )}
</button>

        </div>
      </motion.div>
    </div>,
    document.body
  );
};

export default AddResourcesCostModal;
