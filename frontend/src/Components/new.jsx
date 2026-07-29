import { FiSearch } from "react-icons/fi";
import { FiFilter } from "react-icons/fi";
import { FiCalendar } from "react-icons/fi";
import { FiPlusCircle } from "react-icons/fi";
import { MdOutlineMailOutline } from "react-icons/md";

export default function InboxEmpty() {
  return (
    <>
      <div className="min-h-screen bg-gray-100 p-4 sm:p-6">

        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

          <h1 className="text-2xl font-bold">Inbox</h1>

          <button className="flex items-center justify-center gap-2 bg-[#748dff] text-white px-4 py-2 rounded-lg shadow hover:bg-[#5a73e6] transition">
            <FiPlusCircle />
            New Message
          </button>
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-10">

          {/* Search */}
          <div className="flex items-center w-full bg-white rounded-lg px-3 py-2 shadow">
            <FiSearch className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search messages..."
              className="w-full outline-none text-sm"
            />
          </div>

          {/* Date Filter */}
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow text-sm">
            <FiFilter className="text-gray-500" />
            <input
              type="date"
              className="outline-none"
            />
            <FiCalendar className="text-gray-500" />
          </div>
        </div>

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center text-center mt-20 text-gray-500">

          <MdOutlineMailOutline className="text-6xl text-[#748dff] mb-4" />

          <h2 className="text-lg sm:text-xl font-semibold">
            No messages found
          </h2>

          <p className="text-sm mt-2">
            You have not sent or received any messages yet.
          </p>

        </div>

      </div>
    </>
  );
}