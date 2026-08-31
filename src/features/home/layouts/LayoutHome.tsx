import { LogIn, UserPlus } from "lucide-react";
import { Outlet, Link } from "react-router";

const LayoutHome = () => {
  return (
    <div className="flex min-h-screen flex-col bg-[#080616] text-white">
      {/* Topbar para visitantes */}
      <header className="sticky top-0 z-50 border-b border-[#162E93]/30 bg-[#080616]/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo / Nombre del Producto */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-wider text-blue-400">
              PlanCity
            </span>
          </Link>

          {/* Acciones de Autenticación */}
          <div className="flex items-center gap-3">
            <Link
              to="/auth"
              state={{ mode: "login" }}
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-[#162E93]/20 hover:text-white"
            >
              <LogIn size={16} />
              Iniciar Sesión
            </Link>
            <Link
              to="/auth"
              state={{ mode: "register" }}
              className="flex items-center gap-2 rounded-lg bg-[#162E93] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#162E93]/80"
            >
              <UserPlus size={16} />
              Registrarse
            </Link>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer minimalista */}
      <footer className="border-t border-[#162E93]/30 bg-[#080616] py-6 text-center text-xs text-gray-500">
        <div className="mx-auto max-w-7xl px-4">
          © {new Date().getFullYear()} PlanCity. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
};

export default LayoutHome;
