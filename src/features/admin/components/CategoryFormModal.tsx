import { useState } from "react";
import { X } from "lucide-react";
import type { CreateCategoryPayload, Category } from "@/types/categoryType";

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCategoryPayload) => Promise<void>;
  initialCategory?: Category | null;
}

export function CategoryFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialCategory,
}: CategoryFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateCategoryPayload>({
    name: initialCategory?.name ?? "",
    description: initialCategory?.description || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError("El nombre es requerido");
      return;
    }

    try {
      setLoading(true);
      await onSubmit(formData);
    } catch {
      setError("Error al guardar la categoría");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-xl border border-[#162E93]/30 bg-[#080616] p-6">
        {/* Encabezado */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">
            {initialCategory ? "Editar Categoría" : "Crear Categoría"}
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
              placeholder="Nombre de la categoría"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">
              Descripción
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              disabled={loading}
              rows={3}
              className="mt-1 w-full rounded-lg border border-[#162E93]/30 bg-[#0d0a24] px-3 py-2 text-white placeholder-gray-500 transition-colors focus:border-blue-500 focus:outline-none disabled:opacity-50 resize-none"
              placeholder="Descripción de la categoría"
            />
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
