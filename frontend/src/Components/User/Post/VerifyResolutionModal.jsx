import React, { useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { FiX, FiCheckCircle, FiStar, FiAlertCircle, FiShield } from "react-icons/fi";
import { toast } from "react-toastify";
import axios from "axios";
import LoadingSpinner from "../../LoadingSpinner";

const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

const VerifyResolutionModal = ({ isOpen, post, onClose, onVerifiedSuccess }) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSatisfied, setIsSatisfied] = useState(true);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen || !post) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || rating < 1) {
      toast.error("Please select a rating between 1 and 5 stars");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/api/post/${post._id}/verify-resolution`,
        {
          rating,
          feedback,
          isSatisfied,
        },
        { withCredentials: true }
      );

      toast.success(response.data?.message || "Resolution verification submitted successfully!");
      if (onVerifiedSuccess) {
        onVerifiedSuccess(response.data?.data || post);
      }
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit verification");
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
      ></div>

      {/* Modal */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="relative z-10 w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-7 max-h-[90vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <FiX size={20} />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <FiShield size={26} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Verify Resolution</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Review the resolution proof and rate the work done</p>
          </div>
        </div>

        {/* Post Summary Preview */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 rounded-xl mb-5">
          <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block mb-1">
            Proof Post Title
          </span>
          <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200 line-clamp-1">
            {post.title}
          </h3>
          {post.images && post.images.length > 0 && (
            <div className="mt-2.5 flex gap-2 overflow-x-auto pb-1">
              {post.images.map((img, i) => (
                <img
                  key={i}
                  src={img.url}
                  alt="Proof attachment"
                  className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border border-slate-200 dark:border-slate-700 shrink-0"
                />
              ))}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Resolution Status Choice */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
              Is your complaint fully resolved?
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setIsSatisfied(true)}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs sm:text-sm font-semibold cursor-pointer transition ${
                  isSatisfied
                    ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-300 shadow-sm"
                    : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300"
                }`}
              >
                <FiCheckCircle className="text-emerald-500 text-base" /> Yes, Resolved
              </button>
              <button
                type="button"
                onClick={() => setIsSatisfied(false)}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs sm:text-sm font-semibold cursor-pointer transition ${
                  !isSatisfied
                    ? "bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-700 dark:text-rose-300 shadow-sm"
                    : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300"
                }`}
              >
                <FiAlertCircle className="text-rose-500 text-base" /> Needs Work
              </button>
            </div>
          </div>

          {/* Star Rating */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
              Resolution Quality Rating
            </label>
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700/80">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 cursor-pointer transition-transform hover:scale-110 focus:outline-none"
                  >
                    <FiStar
                      size={26}
                      className={`${
                        star <= (hoverRating || rating)
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-300 dark:text-slate-600"
                      } transition-colors`}
                    />
                  </button>
                ))}
              </div>
              <span className="ml-auto text-xs font-bold text-amber-500 dark:text-amber-400 px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/40">
                {rating} / 5 Stars
              </span>
            </div>
          </div>

          {/* Feedback Textarea */}
          <div>
            <label htmlFor="feedback" className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
              Feedback / Remarks <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <textarea
              id="feedback"
              rows={3}
              placeholder="Share your thoughts on the resolution quality or maintenance speed..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Footer Submit */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <LoadingSpinner size={18} color="#fff" /> : "Submit Verification"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>,
    document.body
  );
};

export default VerifyResolutionModal;
