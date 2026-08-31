import type {
  CreateEventDto,
  EventQueryParams,
  UpdateEventDto,
  Event,
  EventImage,
} from "@/types/eventsType";
import { api } from "@/lib/AxiosConfig";

export type ApiEvent = Omit<Event, "images" | "description" | "price"> & {
  description?: string | null;
  price: number | string;
  images?: Array<string | EventImage> | null;
};

function toImageUrls(images?: Array<string | EventImage> | null): string[] {
  if (!images) return [];
  return images
    .map((image) => (typeof image === "string" ? image : image?.url))
    .filter((url): url is string => Boolean(url));
}

export function normalizeEvent(event: ApiEvent): Event {
  return {
    ...event,
    description: event.description ?? "",
    price: Number(event.price),
    images: toImageUrls(event.images),
  };
}

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

// GET /events (Público - Filtros por search y categoryId)
export const getEvents = async (
  params?: EventQueryParams,
): Promise<Event[]> => {
  const { data } = await api.get<ApiEvent[]>("/events", { params });
  return data.map(normalizeEvent);
};

// GET /events/:id (Público)
export const getEventById = async (id: string): Promise<Event> => {
  const { data } = await api.get<ApiEvent>(`/events/${id}`);
  return normalizeEvent(data);
};

// POST /events (Requiere Auth + Admin)
export const createEvent = async (
  eventData: CreateEventDto,
): Promise<Event> => {
  try {
    const { data } = await api.post<ApiEvent>("/events", eventData);
    return normalizeEvent(data);
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Error al crear evento"), {
      cause: error,
    });
  }
};

// PATCH /events/:id (Requiere Auth + Admin)
export const updateEvent = async (
  id: string,
  eventData: UpdateEventDto,
): Promise<Event> => {
  try {
    const { data } = await api.patch<ApiEvent>(`/events/${id}`, eventData);
    return normalizeEvent(data);
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Error al actualizar evento"), {
      cause: error,
    });
  }
};

// DELETE /events/:id (Requiere Auth + Admin)
export const deleteEvent = async (id: string): Promise<void> => {
  await api.delete(`/events/${id}`);
};
