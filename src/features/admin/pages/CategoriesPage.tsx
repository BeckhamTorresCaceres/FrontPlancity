import { useEffect, useState } from "react";
import { Loader2, AlertCircle, Plus, Trash2, Edit2 } from "lucide-react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/services/CategoryService";
import { getEvents } from "@/services/EventsService";
import type { Category, CreateCategoryPayload } from "@/types/categoryType";
import type { Event } from "@/types/eventsType";
import { CategoryFormModal } from "../components/CategoryFormModal.tsx";

export function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data);
    } catch {
      setError("Error al cargar categorías");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getCategories();
        setCategories(data);
      } catch {
        setError("Error al cargar categorías");
      } finally {
        setLoading(false);
      }

      try {
        const data = await getEvents();
        setEvents(data);
      } catch (loadErr) {
        console.error("Error loading events:", loadErr);
      }
    };

    fetchData();
  }, []);

  const handleCreateCategory = async (formData: CreateCategoryPayload) => {
    try {
      await createCategory(formData);
      await loadCategories();
      setShowModal(false);
    } catch {
      setError("Error al crear categoría");
    }
  };

  const handleUpdateCategory = async (formData: CreateCategoryPayload) => {
    if (!editingCategory) return;
    try {
      await updateCategory(editingCategory.id, formData);
      await loadCategories();
      setEditingCategory(null);
      setShowModal(false);
    } catch {
      setError("Error al actualizar categoría");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    // Verificar si la categoría está siendo usada por eventos
    const eventsWithCategory = events.filter(
      (event) => event.categoryId === id,
    );

    if (eventsWithCategory.length > 0) {
      setError(
        `No se puede eliminar esta categoría porque está siendo utilizada por ${eventsWithCategory.length} evento(s). Elimina los eventos primero.`,
      );
      return;
    }

    if (!confirm("¿Estás seguro de que deseas eliminar esta categoría?"))
      return;
    try {
      await deleteCategory(id);
      await loadCategories();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al eliminar categoría";
      setError(errorMessage);
    }
  };

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setShowModal(true);
  };

  const handleOpenEdit = (category: Category) => {
    setEditingCategory(category);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-[#080616] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Encabezado */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Gestión de Categorías
            </h1>
            <p className="mt-2 text-sm text-gray-400">
              Crear, editar y eliminar categorías de eventos
            </p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
          >
            <Plus size={18} />
            Nueva Categoría
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
            <p className="text-sm">Cargando categorías...</p>
          </div>
        )}

        {/* Sin categorías */}
        {!loading && categories.length === 0 && (
          <div className="rounded-xl border border-[#162E93]/20 bg-[#080616]/50 p-12 text-center text-gray-400">
            <p className="text-base">No hay categorías. Crea una nueva.</p>
          </div>
        )}

        {/* Tabla de categorías */}
        {!loading && categories.length > 0 && (
          <div className="overflow-x-auto rounded-xl border border-[#162E93]/30 bg-[#080616]/80">
            <table className="w-full">
              <thead className="border-b border-[#162E93]/30 bg-[#0d0a24]">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">
                    Descripción
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">
                    Fecha de Creación
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-300">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#162E93]/20">
                {categories.map((category) => (
                  <tr
                    key={category.id}
                    className="hover:bg-[#0d0a24]/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-white">
                      {category.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400 max-w-xs truncate">
                      {category.description || "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {new Date(category.createdAt).toLocaleDateString("es-ES")}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(category)}
                          className="rounded-lg bg-blue-600/20 p-2 text-blue-400 transition-colors hover:bg-blue-600/30"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
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

      {/* Modal de formulario */}
      {showModal && (
        <CategoryFormModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setEditingCategory(null);
          }}
          onSubmit={
            editingCategory ? handleUpdateCategory : handleCreateCategory
          }
          initialCategory={editingCategory}
        />
      )}
    </div>
  );
}
