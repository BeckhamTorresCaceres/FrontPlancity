import { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { CreateEventDto, Event } from "@/types/eventsType";
import type { Category } from "@/types/categoryType";
import { getCategories } from "@/services/CategoryService";

type EventFormData = CreateEventDto & { images: string[] };

function toDateInputValue(value?: string): string {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value.slice(0, 10);
  }
  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getInitialFormData(event?: Event | null): EventFormData {
  if (!event) {
    return {
      name: "",
      description: "",
      date: "",
      location: "",
      price: 0,
      capacity: 0,
      categoryId: "",
      images: [],
    };
  }

  return {
    name: event.name,
    description: event.description ?? "",
    date: toDateInputValue(event.date),
    location: event.location,
    price: Number(event.price) || 0,
    capacity: Number(event.capacity) || 0,
    categoryId: event.category?.id || event.categoryId || "",
    images: event.images ?? [],
  };
}

interface EventFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateEventDto) => Promise<void>;
  initialEvent?: Event | null;
}

export function EventFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialEvent,
}: EventFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [formData, setFormData] = useState<EventFormData>(() =>
    getInitialFormData(initialEvent),
  );

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setCategoriesLoading(true);
        const data = await getCategories();
        setCategories(data);
      } catch {
        setCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    loadCategories();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const addImageUrl = () => {
    if (!imageUrl.trim()) {
      setError("Ingresa una URL válida");
      return;
    }

    if (formData.images.includes(imageUrl.trim())) {
      setError("Esta URL ya fue agregada");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, imageUrl.trim()],
    }));
    setImageUrl("");
    setError(null);
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const name = formData.name.trim();
    const description = (formData.description ?? "").trim();
    const location = formData.location.trim();
    const price = Number(formData.price);
    const capacity = Number(formData.capacity);

    if (!name) {
      setError("El nombre es requerido");
      return;
    }
    if (!formData.date) {
      setError("La fecha es requerida");
      return;
    }
    if (!location) {
      setError("La ubicación es requerida");
      return;
    }
    if (Number.isNaN(price) || price < 0) {
      setError("El precio no puede ser negativo");
      return;
    }
    if (Number.isNaN(capacity) || capacity <= 0) {
      setError("La capacidad debe ser mayor a 0");
      return;
    }
    if (!formData.categoryId) {
      setError("Debes seleccionar una categoría");
      return;
    }

    const payload: CreateEventDto = {
      name,
      description,
      date: formData.date,
      location,
      price,
      capacity,
      categoryId: formData.categoryId,
      images: formData.images,
    };

    try {
      setLoading(true);
      await onSubmit(payload);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al guardar el evento";
      setError(errorMessage);
      console.error("Error en handleSubmit:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-[#162E93]/30 bg-[#080616] p-6">
        {/* Encabezado */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">
            {initialEvent ? "Editar Evento" : "Crear Evento"}
          </h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-400 transition-colors hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Errores */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-800/50 bg-red-950/30 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Nombre *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
              className="mt-1 w-full rounded-lg border border-[#162E93]/30 bg-[#0d0a24] px-3 py-2 text-white placeholder-gray-500 transition-colors focus:border-blue-500 focus:outline-none disabled:opacity-50"
              placeholder="Nombre del evento"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">
              Descripción *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              disabled={loading}
              rows={3}
              className="mt-1 w-full rounded-lg border border-[#162E93]/30 bg-[#0d0a24] px-3 py-2 text-white placeholder-gray-500 transition-colors focus:border-blue-500 focus:outline-none disabled:opacity-50 resize-none"
              placeholder="Descripción del evento"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Fecha *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                disabled={loading}
                className="mt-1 w-full rounded-lg border border-[#162E93]/30 bg-[#0d0a24] px-3 py-2 text-white transition-colors focus:border-blue-500 focus:outline-none disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Categoría *
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                disabled={loading || categoriesLoading}
                className="mt-1 w-full rounded-lg border border-[#162E93]/30 bg-[#0d0a24] px-3 py-2 text-white transition-colors focus:border-blue-500 focus:outline-none disabled:opacity-50"
              >
                <option value="">
                  {categoriesLoading
                    ? "Cargando categorías..."
                    : "Selecciona una categoría"}
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">
              Ubicación *
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              disabled={loading}
              className="mt-1 w-full rounded-lg border border-[#162E93]/30 bg-[#0d0a24] px-3 py-2 text-white placeholder-gray-500 transition-colors focus:border-blue-500 focus:outline-none disabled:opacity-50"
              placeholder="Ubicación del evento"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Precio *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                disabled={loading}
                min="0"
                step="0.01"
                className="mt-1 w-full rounded-lg border border-[#162E93]/30 bg-[#0d0a24] px-3 py-2 text-white placeholder-gray-500 transition-colors focus:border-blue-500 focus:outline-none disabled:opacity-50"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">
                Capacidad *
              </label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                disabled={loading}
                min="1"
                className="mt-1 w-full rounded-lg border border-[#162E93]/30 bg-[#0d0a24] px-3 py-2 text-white placeholder-gray-500 transition-colors focus:border-blue-500 focus:outline-none disabled:opacity-50"
                placeholder="Personas"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">
              URLs de Imágenes (opcional)
            </label>
            <div className="mt-1 flex gap-2">
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addImageUrl()}
                disabled={loading}
                className="flex-1 rounded-lg border border-[#162E93]/30 bg-[#0d0a24] px-3 py-2 text-white placeholder-gray-500 transition-colors focus:border-blue-500 focus:outline-none disabled:opacity-50"
                placeholder="https://ejemplo.com/imagen.jpg"
              />
              <button
                type="button"
                onClick={addImageUrl}
                disabled={loading}
                className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
              >
                Agregar
              </button>
            </div>
            {formData.images.length > 0 && (
              <div className="mt-3 space-y-2">
                {formData.images.map((url, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 rounded-lg bg-[#0d0a24] p-2"
                  >
                    <img
                      src={url}
                      alt={`Preview ${index}`}
                      className="h-10 w-10 rounded-md border border-[#162E93]/30 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23333' width='100' height='100'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' fill='%23999' font-size='12'%3EError%3C/text%3E%3C/svg%3E";
                      }}
                    />
                    <span className="flex-1 truncate text-sm text-gray-400">
                      {url.length > 50 ? url.substring(0, 50) + "..." : url}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      disabled={loading}
                      className="rounded-lg bg-red-600/20 p-1 text-red-400 transition-colors hover:bg-red-600/30 disabled:opacity-50"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 rounded-lg border border-[#162E93]/30 px-4 py-2 font-medium text-gray-300 transition-colors hover:bg-[#0d0a24] disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
