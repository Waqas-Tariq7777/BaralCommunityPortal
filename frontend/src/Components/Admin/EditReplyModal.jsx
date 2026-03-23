import React, { useState } from "react";
import { useMessageStore } from "../../Store/MessageStore";
import { AiOutlineClose, AiOutlineEdit } from "react-icons/ai"; // Added edit icon

const EditReplyModal = ({ reply, onClose, refreshMessages }) => {
  const { editReply } = useMessageStore();
  const [content, setContent] = useState(reply.message);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (content.trim() === "") return;
    try {
      setLoading(true);
      await editReply(reply._id, content, () => {
        refreshMessages();
        onClose();
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 p-5 rounded-xl w-full max-w-md relative">
        {/* Header with edit icon and close icon */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {/* Edit icon for heading */}
            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#748dff] text-white">
              <AiOutlineEdit size={20} />
            </div>
            <h3 className="font-bold text-lg dark:text-white">Edit Reply</h3>
          </div>

          {/* Close icon */}
          <div
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center  text-gray-500 cursor-pointer "
          >
            <AiOutlineClose size={18} />
          </div>
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={5}
          className="w-full p-3 border dark:text-white border-gray-300 dark:border-slate-600 rounded focus:outline-none focus:ring-1 focus:ring-[#748dff]"
        />

        {/* Save button */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 rounded bg-[#748dff] text-white hover:bg-[#5a6edc] transition"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditReplyModal;