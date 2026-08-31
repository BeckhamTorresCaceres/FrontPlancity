import { Calendar, MapPin, Tag, DollarSign, Users, Heart } from "lucide-react";
import type { Event } from "@/types/eventsType";

interface EventCardProps {
  event: Event;
  isFavorite?: boolean;
  onToggleFavorite?: (event: Event) => void;
  isToggling?: boolean;
}

export function EventCard({
  event,
  isFavorite = false,
  onToggleFavorite,
  isToggling = false,
}: EventCardProps) {
  const formattedDate = new Date(event.date).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const coverImage = event.images?.[0];

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-[#162E93]/30 bg-[#080616]/80 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-900/10">
      <div className="relative h-48 w-full overflow-hidden bg-[#0d0a24]">
        {coverImage ? (
          <img
            src={coverImage}
            alt={event.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-500 bg-black/30">
            <div className="text-center">
              <Calendar size={32} className="mx-auto mb-2" />
              <p className="text-xs">Evento</p>
            </div>
          </div>
        )}
        {event.category && (
          <span className="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-[#162E93]/90 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            <Tag size={12} />
            {event.category.name}
          </span>
        )}
        {onToggleFavorite && (
          <button
            type="button"
            onClick={() => onToggleFavorite(event)}
            disabled={isToggling}
            aria-label={
              isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"
            }
            className="absolute top-3 right-3 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/70 disabled:opacity-50"
          >
            <Heart
              size={18}
              className={isFavorite ? "fill-red-500 text-red-500" : "text-white"}
            />
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between p-5">
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white line-clamp-1">
            {event.name}
          </h3>
          <p className="text-sm text-gray-400 line-clamp-2">
            {event.description}
          </p>
        </div>

        <div className="mt-4 space-y-2 border-t border-[#162E93]/20 pt-4 text-xs text-gray-300">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-blue-400" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-blue-400" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign size={14} className="text-blue-400" />
            <span>${Number(event.price).toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users size={14} className="text-blue-400" />
            <span>{event.capacity} personas</span>
          </div>
        </div>
      </div>
    </article>
  );
}
