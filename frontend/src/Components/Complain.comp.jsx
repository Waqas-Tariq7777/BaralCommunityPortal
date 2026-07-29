import { IoAdd } from "react-icons/io5";
import { FiUpload } from "react-icons/fi";

export default function AddPost() {
  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 flex justify-center">
      
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-md p-5 sm:p-6">

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-[#748dff] text-white p-3 rounded-lg text-2xl">
            <IoAdd />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold">Add New Post</h2>
        </div>

        {/* Checkbox */}
        <div className="flex items-center gap-3 mb-5">
          <input type="checkbox" className="w-4 h-4" />
          <p className="text-sm sm:text-base">
            Mark as <span className="text-red-500 font-medium">Important Announcement</span>
          </p>
        </div>

        {/* Post Title */}
        <div className="mb-5">
          <label className="block mb-2 font-medium">
            Post Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter post title"
            className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#748dff]"
          />
        </div>

        {/* Post Content */}
        <div className="mb-5">
          <label className="block mb-2 font-medium">
            Post Content <span className="text-red-500">*</span>
          </label>

          {/* Toolbar */}
          <div className="flex gap-2 mb-3">
            <button className="border px-3 py-1 rounded">B</button>
            <button className="border px-3 py-1 rounded italic">I</button>
            <button className="border px-3 py-1 rounded underline">U</button>
            <button className="border px-3 py-1 rounded bg-black"></button>
          </div>

          {/* Textarea */}
          <textarea
            rows="5"
            className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#748dff]"
          ></textarea>
        </div>

        {/* Upload Images */}
        <div className="mb-6">
          <p className="mb-2 font-medium">Upload Images (max 5)</p>

          <div className="border-2 border-dashed rounded-lg p-5 flex items-center gap-3 text-gray-500 cursor-pointer hover:bg-gray-50">
            <FiUpload className="text-xl" />
            <span>Choose Images</span>
            <input type="file" multiple className="hidden" />
          </div>
        </div>

        {/* Button */}
        <button className="w-full bg-[#748dff] text-white py-3 rounded-lg font-medium text-lg hover:bg-[#5f75e6] transition">
          Add Post
        </button>

      </div>
    </div>
  );
}