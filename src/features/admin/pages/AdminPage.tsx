import { useEffect, useState } from "react";
import { Loader2, AlertCircle, Plus, Trash2, Edit2 } from "lucide-react";
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from "@/services/EventsService";
import type { Event, CreateEventDto } from "@/types/eventsType";
import { EventFormModal } from "../components/EventFormModal.tsx";

export function AdminPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await getEvents();
      setEvents(data);
    } catch {
      setError("Error al cargar eventos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await getEvents();
        setEvents(data);
      } catch {
        setError("Error al cargar eventos");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleCreateEvent = async (formData: CreateEventDto) => {
    try {
      await createEvent(formData);
      await loadEvents();
      setShowModal(false);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al crear evento";
      setError(errorMessage);
      console.error("Error creating event:", err);
      throw err;
    }
  };

  const handleUpdateEvent = async (
    eventId: string,
    formData: CreateEventDto,
  ) => {
    try {
      await updateEvent(eventId, formData);
      await loadEvents();
      setEditingEvent(null);
      setShowModal(false);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al actualizar evento";
      setError(errorMessage);
      console.error("Error updating event:", err);
      throw err;
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este evento?")) return;
    try {
      await deleteEvent(id);
      await loadEvents();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al eliminar evento";
      setError(errorMessage);
      console.error("Error deleting event:", err);
    }
  };

  const handleOpenCreate = () => {
    setEditingEvent(null);
    setShowModal(true);
  };

  const handleOpenEdit = (event: Event) => {
    setEditingEvent(event);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-[#080616] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Encabezado */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Gestión de Eventos
            </h1>
            <p className="mt-2 text-sm text-gray-400">
              Crear, editar y eliminar eventos
            </p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
          >
            <Plus size={18} />
            Nuevo Evento
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-center gap-2 rounded-xl border border-red-800/50 bg-red-950/30 p-4 text-sm text-red-400">
            <AlertCircle size={18} />
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-400 hover:text-red-300"
            >
              ✕
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex min-h-96 flex-col items-center justify-center gap-3 text-gray-400">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <p className="text-sm">Cargando eventos...</p>
          </div>
        )}

        {/* Sin eventos */}
        {!loading && events.length === 0 && (
          <div className="rounded-xl border border-[#162E93]/20 bg-[#080616]/50 p-12 text-center text-gray-400">
            <p className="text-base">No hay eventos. Crea uno nuevo.</p>
          </div>
        )}

        {/* Tabla de eventos */}
        {!loading && events.length > 0 && (
          <div className="overflow-x-auto rounded-xl border border-[#162E93]/30 bg-[#080616]/80">
            <table className="w-full">
              <thead className="border-b border-[#162E93]/30 bg-[#0d0a24]">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">
                    Ubicación
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">
                    Precio
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">
                    Capacidad
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-300">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#162E93]/20">
                {events.map((event) => (
                  <tr
                    key={event.id}
                    className="hover:bg-[#0d0a24]/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-white">
                      {event.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {event.location}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      ${event.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {event.capacity}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {new Date(event.date).toLocaleDateString("es-ES")}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {event.category?.name || "—"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(event)}
                          className="rounded-lg bg-blue-600/20 p-2 text-blue-400 transition-colors hover:bg-blue-600/30"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="rounded-lg bg-red-600/20 p-2 text-red-400 transition-colors hover:bg-red-600/30"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <EventFormModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setEditingEvent(null);
          }}
          onSubmit={async (formData) => {
            if (editingEvent) {
              await handleUpdateEvent(editingEvent.id, formData);
              return;
            }
            await handleCreateEvent(formData);
          }}
          initialEvent={editingEvent}
        />
      )}
    </div>
  );
}
