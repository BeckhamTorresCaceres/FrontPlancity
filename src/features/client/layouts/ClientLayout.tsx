import { useAuth } from "@/features/auth/hooks/useAuth";
import { useNavigate, Outlet, Link, useLocation } from "react-router-dom";
import { Heart, KeyRound, LogOut } from "lucide-react";

export const ClientLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/auth");
  };

  const isEventsActive =
    location.pathname === "/client" || location.pathname === "/client/";
  const isFavoritesActive = location.pathname.startsWith("/client/favorites");
  const isPasswordActive = location.pathname === "/client/password";

  return (
    <div className="min-h-screen bg-[#080616]">
      <nav className="border-b border-[#162E93]/30 bg-[#0d0a24] shadow-lg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-6">
              <Link to="/client" className="flex items-center gap-3">
                <span className="text-xl font-bold text-white">PlanCity</span>
              </Link>
              <div className="flex items-center gap-1">
                <Link
                  to="/client"
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isEventsActive
                      ? "bg-[#162E93] text-white"
                      : "text-gray-300 hover:bg-[#162E93]/20"
                  }`}
                >
                  Eventos
                </Link>
                <Link
                  to="/client/favorites"
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isFavoritesActive
                      ? "bg-[#162E93] text-white"
                      : "text-gray-300 hover:bg-[#162E93]/20"
                  }`}
                >
                  <Heart
                    size={16}
                    className={isFavoritesActive ? "fill-current" : ""}
                  />
                  Favoritos
                </Link>
                <Link
                  to="/client/password"
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isPasswordActive
                      ? "bg-[#162E93] text-white"
                      : "text-gray-300 hover:bg-[#162E93]/20"
                  }`}
                >
                  <KeyRound size={16} />
                  <span className="hidden md:inline">Contraseña</span>
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-white">{user?.name}</p>
                <p className="text-xs text-gray-400">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-lg bg-red-600/20 px-3 py-2 text-red-400 transition-colors hover:bg-red-600/30"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline text-sm font-medium">
                  Salir
                </span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <Outlet />
    </div>
  );
};
