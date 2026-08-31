import { useState } from "react";
import { useLocation } from "react-router";
import { Login } from "../components/Login";
import { Register } from "../components/Register";

function LoginPage() {
  const location = useLocation();
  const modeFromNav = location.state?.mode as string | undefined;
  const [isLogin, setIsLogin] = useState(modeFromNav !== "register");
  const [lastMode, setLastMode] = useState(modeFromNav);

  if (modeFromNav !== lastMode) {
    setLastMode(modeFromNav);
    if (modeFromNav === "login" || modeFromNav === "register") {
      setIsLogin(modeFromNav === "login");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#080616] px-4 py-12 sm:px-6 lg:px-8 text-white">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-[#162E93]/30 bg-[#080616]/90 p-8 shadow-2xl backdrop-blur-md">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
            Catálogo
          </span>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
            {isLogin ? "Iniciar sesión" : "Crear cuenta"}
          </h1>
        </div>

        {isLogin ? <Login /> : <Register />}

        <p className="mt-4 text-center text-sm text-gray-400">
          {isLogin ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="font-medium text-blue-400 hover:text-blue-300 focus:outline-none underline ml-1"
          >
            {isLogin ? "Regístrate" : "Inicia sesión"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
