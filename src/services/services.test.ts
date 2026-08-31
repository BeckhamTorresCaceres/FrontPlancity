import { beforeEach, describe, expect, it, vi } from 'vitest';

const api = vi.hoisted(() => ({
  delete: vi.fn(),
  get: vi.fn(),
  patch: vi.fn(),
  post: vi.fn(),
}));

vi.mock('@/lib/AxiosConfig', () => ({ api }));

import {
  createEvent,
  getEvents,
  normalizeEvent,
  updateEvent,
} from './EventsService';
import { addFavorite, getFavorites, removeFavorite } from './FavoritesService';
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from './CategoryService';

const apiEvent = {
  id: 'event-1',
  name: 'Concierto',
  description: null,
  date: '2026-10-10',
  location: 'Bogotá',
  price: '25000',
  capacity: 100,
  categoryId: 'music',
  images: [{ url: 'cover.jpg' }, 'gallery.jpg'],
  createdAt: '2026-01-01',
  updatedAt: '2026-01-01',
};

describe('servicios API', () => {
  beforeEach(() => vi.clearAllMocks());

  it('normaliza eventos y consulta los eventos con filtros', async () => {
    api.get.mockResolvedValue({ data: [apiEvent] });

    const events = await getEvents({ search: 'concierto', categoryId: 'music' });

    expect(api.get).toHaveBeenCalledWith('/events', {
      params: { search: 'concierto', categoryId: 'music' },
    });
    expect(events[0]).toMatchObject({
      description: '',
      price: 25000,
      images: ['cover.jpg', 'gallery.jpg'],
    });
    expect(normalizeEvent({ ...apiEvent, description: undefined, images: null })).toMatchObject({
      description: '',
      images: [],
    });
  });

  it('crea y actualiza eventos y conserva el mensaje de error del servidor', async () => {
    api.post.mockResolvedValue({ data: apiEvent });
    await expect(
      createEvent({
        name: 'Concierto', description: 'En vivo', date: '2026-10-10',
        location: 'Bogotá', price: 25000, capacity: 100, categoryId: 'music',
      }),
    ).resolves.toMatchObject({ price: 25000 });

    api.patch.mockRejectedValue({ response: { data: { message: 'Sin permisos' } } });
    await expect(updateEvent('event-1', { name: 'Otro' })).rejects.toThrow('Sin permisos');
  });

  it('gestiona categorías con los métodos HTTP correctos', async () => {
    const category = { id: 'music', name: 'Música', createdAt: '', updatedAt: '' };
    api.get.mockResolvedValue({ data: [category] });
    api.post.mockResolvedValue({ data: category });
    api.patch.mockResolvedValue({ data: category });

    await expect(getCategories()).resolves.toEqual([category]);
    await createCategory({ name: 'Música' });
    await updateCategory('music', { name: 'Conciertos' });
    await deleteCategory('music');

    expect(api.post).toHaveBeenCalledWith('/categories', { name: 'Música' });
    expect(api.patch).toHaveBeenCalledWith('/categories/music', { name: 'Conciertos' });
    expect(api.delete).toHaveBeenCalledWith('/categories/music');
  });

  it('normaliza favoritos y convierte errores del servidor en mensajes útiles', async () => {
    api.get.mockResolvedValue({ data: [apiEvent] });
    await expect(getFavorites()).resolves.toMatchObject([{ price: 25000 }]);

    api.post.mockRejectedValue({ response: { data: { message: ['Evento', 'no encontrado'] } } });
    await expect(addFavorite('missing')).rejects.toThrow('Evento, no encontrado');

    api.delete.mockResolvedValue({});
    await expect(removeFavorite('event-1')).resolves.toBeUndefined();
    expect(api.delete).toHaveBeenCalledWith('/favorites/event-1');
  });
});
