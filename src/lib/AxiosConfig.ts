import axios from "axios";
import { tokenStorage } from "./TokenStorage";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = String(error.config?.url ?? "");
    const isPasswordChange = url.includes("/users/me/password");
    if (status === 401 && !isPasswordChange) {
      tokenStorage.remove();
    }
    return Promise.reject(error);
  },
);
