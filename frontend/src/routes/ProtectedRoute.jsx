import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute() {
  const location = useLocation();
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-100 text-sm font-black text-slate-600">
        Checking session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
