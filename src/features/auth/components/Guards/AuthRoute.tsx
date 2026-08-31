import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Loader2 } from "lucide-react";
import AuthPage from "@/features/auth/pages/LoginPage";

export const AuthRoute = () => {
  const { isAuthenticated, user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      // Redirigir según el rol
      if (user.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/client", { replace: true });
      }
    }
  }, [isAuthenticated, user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[#080616] text-gray-400">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="text-sm">Cargando...</p>
      </div>
    );
  }

  // Si está autenticado, no muestres nada (se redirija en el useEffect)
  if (isAuthenticated && user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[#080616] text-gray-400">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="text-sm">Redirigiendo...</p>
      </div>
    );
  }

  // Si no está autenticado, muestra la página de login/registro
  return <AuthPage />;
};
