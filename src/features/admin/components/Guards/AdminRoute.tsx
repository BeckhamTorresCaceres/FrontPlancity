import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Loader2 } from "lucide-react";

export const AdminRoute = () => {
  const { user, isAuthenticated, loading } = useAuth();

  // Esperar a que se cargue la sesión
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080616]">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="text-sm">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
