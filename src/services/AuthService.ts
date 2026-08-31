import { api } from "@/lib/AxiosConfig"; // O la ruta a tu cliente de axios
import { tokenStorage } from "@/lib/TokenStorage";
import type {
  ChangePasswordRequest,
  LoginCredentials,
  RegisterCredentials,
} from "@/types/authType";

export const login = async (credentials: LoginCredentials) => {
  const { data } = await api.post("/auth/login", credentials);

  // Guardamos el accessToken que entrega NestJS
  if (data.accessToken) {
    tokenStorage.set(data.accessToken);
  }

  // Si /auth/login no retorna el perfil completo, solicitamos /users/me
  const profileResponse = await api.get("/users/me", {
    headers: { Authorization: `Bearer ${data.accessToken}` },
  });

  return { user: profileResponse.data, token: data.accessToken };
};

export const register = async (credentials: RegisterCredentials) => {
  await api.post("/auth/register", credentials);
  // Tras registrarse, se auto-loguea
  return login({ email: credentials.email, password: credentials.password });
};

export const getProfile = async () => {
  const token = tokenStorage.get();
  const { data } = await api.get("/users/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const changePassword = async (credentials: ChangePasswordRequest) => {
  const { data } = await api.patch("/users/me/password", credentials);
  return data;
};

export const logout = async () => {
  const token = tokenStorage.get();
  if (token) {
    try {
      await api.post(
        "/auth/logout",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
    } catch {
      // Si el servidor falla, el logout cliente debe continuar de todos modos
    }
  }
};
