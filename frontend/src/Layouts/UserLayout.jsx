// UserLayout.jsx
import { useState, useEffect, useRef } from "react";
import Sidebar from "../Components/User/Sidebar.jsx";
import Topbar from "../Components/Admin/Topbar.jsx";
import { Outlet, useLocation } from "react-router-dom";
import { AiOutlineArrowUp } from "react-icons/ai";
export default function UserLayout() {
  const [open, setOpen] = useState(true);
  const location = useLocation();
  const scrollContainerRef = useRef(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const currentPage = location.pathname.split("/").pop().replace(/-/g, " ").toUpperCase();

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (container.scrollTop > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-slate-900">
      {/* Sidebar */}
      <Sidebar open={open} setOpen={setOpen} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <Topbar open={open} setOpen={setOpen} currentPage={currentPage || "Dashboard"} />

        {/* Page content scrollable */}
        <main ref={scrollContainerRef} className="flex-1 overflow-auto p-6 relative">
          <Outlet />
        </main>

        {showScrollTop && (
          <button
            onClick={() => scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" })}
            className="cursor-pointer fixed bottom-6 right-6 z-50 bg-[#748dff] hover:bg-indigo-500 text-white p-3 rounded-full shadow-lg transition transform hover:scale-110 animate-bounce"
            title="Scroll to top"
          >
            <AiOutlineArrowUp size={24} />
          </button>
        )}
      </div>
    </div>
  );
}
