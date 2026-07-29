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

  // ✅ Route → i18n key mapping
  const pageTitles = {
    "/user/communityHub": "community_hub",
    "/user/myProfile": "my_profile",
    "/user/submitComplaint": "submit_complaint",
    "/user/viewComplaintList": "complaint_list"
  };

  const currentPage = pageTitles[location.pathname] || "dashboard";

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
      <Sidebar open={open} setOpen={setOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar open={open} setOpen={setOpen} currentPage={currentPage} />

        <main ref={scrollContainerRef} className="flex-1 overflow-auto p-3 sm:p-6 relative">
          <Outlet />
        </main>

        {showScrollTop && (
  <button
    onClick={() =>
      scrollContainerRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    }
    className="cursor-pointer fixed top-15/16 left-1/2 z-50 
               -translate-x-1/2 
               bg-[#748dff] hover:bg-indigo-500 text-white 
               p-3 rounded-full shadow-lg transition 
               transform hover:scale-110 animate-bounce"
    title="Scroll to top"
  >
    <AiOutlineArrowUp size={24} />
  </button>
)}
      </div>
    </div>
  );
}