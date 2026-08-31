import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { Loader2, AlertCircle, Search, Heart } from "lucide-react";
import { getEvents } from "@/services/EventsService";
import { getCategories } from "@/services/CategoryService";
import {
  addFavorite,
  getFavorites,
  removeFavorite,
} from "@/services/FavoritesService";
import type { Event } from "@/types/eventsType";
import type { Category } from "@/types/categoryType";
import { EventCard } from "@/features/home/components/EventCard";

export function ClientPage() {
  const location = useLocation();
  const favoritesOnly = location.pathname.startsWith("/client/favorites");

  const [events, setEvents] = useState<Event[]>([]);
  const [favoriteEvents, setFavoriteEvents] = useState<Event[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [eventsData, categoriesData, favoritesData] = await Promise.all([
          getEvents(),
          getCategories(),
          getFavorites(),
        ]);
        setEvents(eventsData);
        setCategories(categoriesData);
        setFavoriteEvents(favoritesData);
        setFavoriteIds(new Set(favoritesData.map((event) => event.id)));
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error al cargar eventos";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleToggleFavorite = async (event: Event) => {
    if (togglingId) return;

    const wasFavorite = favoriteIds.has(event.id);
    setTogglingId(event.id);
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (wasFavorite) {
        next.delete(event.id);
      } else {
        next.add(event.id);
      }
      return next;
    });
    setFavoriteEvents((prev) =>
      wasFavorite
        ? prev.filter((item) => item.id !== event.id)
        : [event, ...prev.filter((item) => item.id !== event.id)],
    );

    try {
      if (wasFavorite) {
        await removeFavorite(event.id);
      } else {
        await addFavorite(event.id);
      }
    } catch (err) {
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        if (wasFavorite) {
          next.add(event.id);
        } else {
          next.delete(event.id);
        }
        return next;
      });
      setFavoriteEvents((prev) =>
        wasFavorite
          ? [event, ...prev.filter((item) => item.id !== event.id)]
          : prev.filter((item) => item.id !== event.id),
      );
      setError(
        err instanceof Error ? err.message : "No se pudo actualizar favoritos",
      );
    } finally {
      setTogglingId(null);
    }
  };

  const sourceEvents = favoritesOnly ? favoriteEvents : events;

  const filteredEvents = sourceEvents.filter((event) => {
    const matchesSearch =
      event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.description ?? "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    const matchesCategory =
      !selectedCategory || event.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const catalogEvents = favoritesOnly
    ? filteredEvents
    : filteredEvents.filter((event) => !favoriteIds.has(event.id));

  const visibleFavorites = favoriteEvents.filter((event) => {
    const matchesSearch =
      event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.description ?? "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    const matchesCategory =
      !selectedCategory || event.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const showEmptyState =
    (favoritesOnly && filteredEvents.length === 0) ||
    (!favoritesOnly &&
      catalogEvents.length === 0 &&
      visibleFavorites.length === 0);

  return (
    <div className="min-h-screen bg-[#080616] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            {favoritesOnly ? "Mis favoritos" : "Eventos Disponibles"}
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            {favoritesOnly
              ? "Los eventos que guardaste en tu cuenta"
              : "Explora y descubre eventos en tu ciudad. Marca con el corazón los que quieras guardar."}
          </p>
        </div>

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

        <div className="mb-8 flex flex-col gap-4 rounded-xl border border-[#162E93]/30 bg-[#0d0a24] p-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Buscar eventos
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
              <input
                type="text"
                placeholder="Busca por nombre o descripción..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-[#162E93]/30 bg-[#080616] px-4 py-2 pl-10 text-white placeholder-gray-500 transition-colors focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {categories.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Categoría
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full rounded-lg border border-[#162E93]/30 bg-[#080616] px-3 py-2 text-white transition-colors focus:border-blue-500 focus:outline-none"
              >
                <option value="">Todas las categorías</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {loading && (
          <div className="flex min-h-96 flex-col items-center justify-center gap-3 text-gray-400">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <p className="text-sm">Cargando eventos...</p>
          </div>
        )}

        {!loading && !favoritesOnly && visibleFavorites.length > 0 && (
          <section className="mb-10">
            <div className="mb-4 flex items-center gap-2">
              <Heart size={18} className="fill-red-500 text-red-500" />
              <h2 className="text-xl font-bold text-white">Mis favoritos</h2>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visibleFavorites.map((event) => (
                <EventCard
                  key={`fav-${event.id}`}
                  event={event}
                  isFavorite
                  isToggling={togglingId === event.id}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
          </section>
        )}

        {!loading && showEmptyState && (
          <div className="rounded-xl border border-[#162E93]/20 bg-[#080616]/50 p-12 text-center text-gray-400">
            <p className="text-base">
              {favoritesOnly
                ? favoriteEvents.length === 0
                  ? "Aún no tienes eventos favoritos. Márcalos con el corazón desde Eventos."
                  : "No se encontraron favoritos con esos filtros"
                : events.length === 0
                  ? "No hay eventos disponibles"
                  : "No se encontraron eventos con esos filtros"}
            </p>
          </div>
        )}

        {!loading && catalogEvents.length > 0 && (
          <section>
            {!favoritesOnly && visibleFavorites.length > 0 && (
              <h2 className="mb-4 text-xl font-bold text-white">
                Todos los eventos
              </h2>
            )}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {catalogEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  isFavorite={favoriteIds.has(event.id)}
                  isToggling={togglingId === event.id}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
