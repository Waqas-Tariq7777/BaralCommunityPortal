import { Navigate } from "react-router-dom";
import { useAuthStore } from "../Store/AuthStore";

export default function ProtectedRoute() {
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to="/" replace />;
  }

    return <Outlet />;
}
