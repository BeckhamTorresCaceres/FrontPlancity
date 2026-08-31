import { Outlet, Link, useLocation } from "react-router";
import { LogOut } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";

export function AdminLayout() {
  const { logout } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
  };

  const isEventsActive =
    location.pathname === "/admin" || location.pathname === "/admin/events";
  const isCategoriesActive = location.pathname === "/admin/categories";

  return (
    <div className="flex min-h-screen flex-col bg-[#080616] text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[#162E93]/30 bg-[#080616]/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <Link
              to="/admin"
              className="text-xl font-bold tracking-wider text-blue-400"
            >
              PlanCity Admin
            </Link>

            {/* Navegación */}
            <nav className="flex items-center gap-1">
              <Link
                to="/admin/events"
                className={`rounded-lg px-4 py-2 font-medium transition-colors ${
                  isEventsActive
                    ? "bg-[#162E93] text-white"
                    : "text-gray-300 hover:bg-[#162E93]/20"
                }`}
              >
                Eventos
              </Link>
              <Link
                to="/admin/categories"
                className={`rounded-lg px-4 py-2 font-medium transition-colors ${
                  isCategoriesActive
                    ? "bg-[#162E93] text-white"
                    : "text-gray-300 hover:bg-[#162E93]/20"
                }`}
              >
                Categorías
              </Link>
            </nav>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-[#162E93]/20 hover:text-white"
          >
            <LogOut size={16} />
            Salir
          </button>
        </div>
      </header>

      {/* Contenido */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
