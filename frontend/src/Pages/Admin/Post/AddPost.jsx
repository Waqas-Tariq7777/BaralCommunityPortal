import React, { useState, useRef } from "react";
import { usePostStore } from "../../../Store/PostStore";
import { FiUpload, FiPlusCircle, FiX, FiBold, FiItalic, FiUnderline, FiDroplet } from "react-icons/fi";
import { toast } from "react-toastify";
import LoadingSpinner from "../../../Components/LoadingSpinner";

const AddPost = () => {
  const { addPost, loading } = usePostStore();
  const [title, setTitle] = useState("");
  const [images, setImages] = useState([]);
  const contentRef = useRef(null);
  const [color, setColor] = useState("#000000");
  const [isImportant, setIsImportant] = useState(false);
  const [isResolutionProof, setIsResolutionProof] = useState(false);
  const [targetUserEmail, setTargetUserEmail] = useState("");

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      toast.error("You can upload a maximum of 5 images");
      return;
    }
    setImages((prev) => [...prev, ...files]);
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const formatText = (command, value = null) => {
    document.execCommand(command, false, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Title cannot be empty");
      return;
    }

    const content = contentRef.current.innerHTML;
    if (!content || content === "<br>") {
      toast.error("Content cannot be empty");
      return;
    }

    if (isResolutionProof && !targetUserEmail.trim()) {
      toast.error("Please enter the concerned user's email for resolution proof");
      return;
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("content", content);
    formData.append("isImportant", isImportant);
    formData.append("isResolutionProof", isResolutionProof);
    if (isResolutionProof) {
      formData.append("targetUserEmail", targetUserEmail.trim());
    }

    images.forEach((img) => {
      formData.append("images", img);
    });

    addPost(formData, () => {
      setTitle("");
      setImages([]);
      if (contentRef.current) contentRef.current.innerHTML = "";
      setColor("#000000");
      setIsImportant(false);
      setIsResolutionProof(false);
      setTargetUserEmail("");
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-900 dark:border dark:border-[#748dff] rounded-xl shadow-md">
      {/* Heading */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-[#748dff] p-3 rounded-lg text-white">
          <FiPlusCircle size={24} />
        </div>
        <h2 className="text-2xl font-bold text-black dark:text-white">Add New Post</h2>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">

        {/* ✅ IMPORTANT ANNOUNCEMENT & RESOLUTION PROOF OPTIONS */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-3.5 bg-gray-50 dark:bg-slate-800/60 rounded-xl border border-gray-200 dark:border-slate-700">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={isImportant}
              onChange={(e) => setIsImportant(e.target.checked)}
              className="w-5 h-5 accent-[#748dff] cursor-pointer"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Mark as <span className="text-red-500 font-semibold">Important Announcement</span>
            </span>
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={isResolutionProof}
              onChange={(e) => setIsResolutionProof(e.target.checked)}
              className="w-5 h-5 accent-emerald-500 cursor-pointer"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Mark as <span className="text-emerald-500 font-semibold">Resolution Proof</span>
            </span>
          </label>
        </div>

        {/* 📧 CONCERNED USER EMAIL FIELD (If Resolution Proof selected) */}
        {isResolutionProof && (
          <div className="flex flex-col gap-1.5 p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl animate-fadeIn">
            <label htmlFor="targetUserEmail" className="font-semibold text-xs sm:text-sm text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
              <span>Concerned Resident's Email</span>
              <span className="text-red-500">*</span>
            </label>
            <input
              id="targetUserEmail"
              type="email"
              placeholder="e.g. resident@example.com"
              value={targetUserEmail}
              onChange={(e) => setTargetUserEmail(e.target.value)}
              className="p-3 text-sm rounded-md border border-emerald-300 dark:border-emerald-700 dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <p className="text-[11px] sm:text-xs text-emerald-600 dark:text-emerald-400">
              This proof post will be linked to this resident's complaint so they can verify the resolution.
            </p>
          </div>
        )}
        
        {/* Title */}
        <div className="flex flex-col gap-1">
          <label htmlFor="title" className="font-medium text-gray-700 dark:text-gray-300">
            Post Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            placeholder="Enter post title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="p-3 rounded-md border border-gray-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#748dff]"
          />
        </div>

        {/* Content Editor */}
        <div className="flex flex-col gap-1">
          <label className="font-medium text-gray-700 dark:text-gray-300">
            Post Content <span className="text-red-500">*</span>
          </label>

          {/* Toolbar */}
          <div className="flex gap-2 mb-2">
            <button type="button" onClick={() => formatText("bold")} className="cursor-pointer dark:text-gray-300 p-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-800">
              <FiBold />
            </button>
            <button type="button" onClick={() => formatText("italic")} className="cursor-pointer dark:text-gray-300 p-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-800">
              <FiItalic />
            </button>
            <button type="button" onClick={() => formatText("underline")} className="cursor-pointer dark:text-gray-300 p-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-800">
              <FiUnderline />
            </button>
            <input
              type="color"
              value={color}
              onChange={(e) => { setColor(e.target.value); formatText("foreColor", e.target.value); }}
              className="w-10 h-10 p-0 border rounded cursor-pointer"
            />
          </div>

          {/* Editable content area */}
          <div
            ref={contentRef}
            contentEditable
            className="p-3 min-h-[150px] border border-gray-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#748dff] overflow-auto"
          />
        </div>

        {/* Image Upload */}
        <div className="flex flex-col gap-1">
          <label className="font-medium text-gray-700 dark:text-gray-300">Upload Images (max 5)</label>
          <label className="flex items-center gap-2 cursor-pointer p-3 border border-dashed border-gray-400 dark:border-slate-600 rounded-md hover:bg-gray-50 dark:hover:bg-slate-800 transition">
            <FiUpload className="text-[#748dff] dark:text-[#748dff]" size={20} />
            <span className="text-gray-600 dark:text-gray-300">Choose Images</span>
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>

          {images.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {images.map((img, idx) => (
                <div key={idx} className="relative w-20 h-20">
                  <img
                    src={URL.createObjectURL(img)}
                    alt="preview"
                    className="w-20 h-20 object-cover rounded-md border border-gray-300 dark:border-slate-700"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="cursor-pointer absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    <FiX size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="cursor-pointer mt-4 bg-[#748dff] hover:bg-[#5f77e0] text-white font-semibold py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition"
        >
          {loading ? <LoadingSpinner size={20} /> : "Add Post"}
        </button>
      </form>
    </div>
  );
};

export default AddPost;

