import { api } from "@/lib/AxiosConfig";
import type { Event } from "@/types/eventsType";
import { normalizeEvent, type ApiEvent } from "@/services/EventsService";

function getApiErrorMessage(error: unknown, fallback: string): string {
  if (typeof error === "object" && error !== null && "response" in error) {
    const data = (error as { response?: { data?: { message?: unknown } } })
      .response?.data;
    if (typeof data?.message === "string") return data.message;
    if (Array.isArray(data?.message)) return data.message.join(", ");
  }
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

export const getFavorites = async (): Promise<Event[]> => {
  const { data } = await api.get<ApiEvent[]>("/favorites");
  return (data ?? []).map(normalizeEvent);
};

export const addFavorite = async (eventId: string): Promise<void> => {
  try {
    await api.post(`/favorites/${eventId}`);
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "No se pudo agregar a favoritos"),
      { cause: error },
    );
  }
};

export const removeFavorite = async (eventId: string): Promise<void> => {
  try {
    await api.delete(`/favorites/${eventId}`);
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "No se pudo quitar de favoritos"),
      { cause: error },
    );
  }
};
