import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../Store/AuthStore";

export default function ProtectedUserRoutes() {
  const { user, isAdmin } = useAuthStore();

  if (!user) return <Navigate to="/" replace />;
  if (isAdmin) return <Navigate to="/admin/dashboard" replace />;

  return <Outlet />;
}
