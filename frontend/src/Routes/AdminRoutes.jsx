import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../Store/AuthStore";

export default function ProtectedAdminRoutes() {
  const { user, isAdmin } = useAuthStore();

  if (!user) return <Navigate to="/" replace />;
  if (!isAdmin) return <Navigate to="/user/dashboard" replace />;

  return <Outlet />;
}
