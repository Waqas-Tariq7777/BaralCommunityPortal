import { useState } from "react";
import Sidebar from "../Components/Admin/Sidebar";
import Topbar from "../Components/Admin/Topbar";
import { Outlet, useLocation } from "react-router-dom";

export default function AdminLayout() {
  const [open, setOpen] = useState(true);
  const location = useLocation();

  const currentPage = location.pathname.split("/").pop().replace(/-/g, " ").toUpperCase();

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-slate-900">
      {/* Sidebar */}
      <Sidebar open={open} setOpen={setOpen} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <Topbar open={open} setOpen={setOpen} currentPage={currentPage || "Dashboard"} />

        {/* Page content scrollable */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
