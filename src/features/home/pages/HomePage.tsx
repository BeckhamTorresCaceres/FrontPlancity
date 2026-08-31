import { useEffect, useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { getEvents } from "@/services/EventsService";
import type { Event } from "@/types/eventsType";
import { EventCard } from "../components/EventCard";

export default function HomePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await getEvents();
        setEvents(data);
      } catch {
        setError("Ocurrió un error al cargar la lista de eventos.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Encabezado */}
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Descubre Eventos Locales
        </h1>
        <p className="mt-2 text-sm text-gray-400">
          Explora las mejores actividades y eventos disponibles en tu ciudad.
        </p>
      </div>

      {/* Estado: Cargando */}
      {loading && (
        <div className="flex min-h-75 flex-col items-center justify-center gap-3 text-gray-400">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="text-sm">Cargando eventos...</p>
        </div>
      )}

      {/* Estado: Error */}
      {error && !loading && (
        <div className="flex items-center justify-center gap-2 rounded-xl border border-red-800/50 bg-red-950/30 p-4 text-sm text-red-400">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Estado: Sin Eventos */}
      {!loading && !error && events.length === 0 && (
        <div className="rounded-xl border border-[#162E93]/20 bg-[#080616]/50 p-12 text-center text-gray-400">
          <p className="text-base">
            No hay eventos disponibles en este momento.
          </p>
        </div>
      )}

      {/* Grilla de Eventos */}
      {!loading && !error && events.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
