import type { Category, CreateCategoryPayload, UpdateCategoryPayload } from "@/types/categoryType";
import { api } from "@/lib/AxiosConfig";

// GET /categories
export const getCategories = async (): Promise<Category[]> => {
  const { data } = await api.get<Category[]>("/categories");
  return data;
};

// GET /categories/:id
export const getCategoryById = async (id: string): Promise<Category> => {
  const { data } = await api.get<Category>(`/categories/${id}`);
  return data;
};

// POST /categories (Requiere Auth + Admin)
export const createCategory = async (
  categoryData: CreateCategoryPayload,
): Promise<Category> => {
  const { data } = await api.post<Category>("/categories", categoryData);
  return data;
};

// PATCH /categories/:id (Requiere Auth + Admin)
export const updateCategory = async (
  id: string,
  categoryData: UpdateCategoryPayload,
): Promise<Category> => {
  const { data } = await api.patch<Category>(`/categories/${id}`, categoryData);
  return data;
};

// DELETE /categories/:id (Requiere Auth + Admin)
export const deleteCategory = async (id: string): Promise<void> => {
  await api.delete(`/categories/${id}`);
};
