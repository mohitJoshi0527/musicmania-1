import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../stores/useAuthStore";

const AdminRoute = () => {
  const { user, loading } = useAuthStore();

  if (loading) return <div className="text-center p-8 text-white">Loading...</div>;
  if (!user || user.role !== "admin") return <Navigate to="/login" replace />;

  return <Outlet />; // This allows child routes to render
};

export default AdminRoute;
