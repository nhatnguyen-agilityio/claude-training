import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/Hooks/Auth";
import { useLocation } from "react-router-dom";
import Loading from "../Loading";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading />
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
