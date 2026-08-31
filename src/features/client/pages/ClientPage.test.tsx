import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router';
import { ClientPage } from './ClientPage';

const mocks = vi.hoisted(() => ({
  getEvents: vi.fn(),
  getCategories: vi.fn(),
  getFavorites: vi.fn(),
  addFavorite: vi.fn(),
  removeFavorite: vi.fn(),
}));

vi.mock('@/services/EventsService', () => ({ getEvents: mocks.getEvents }));
vi.mock('@/services/CategoryService', () => ({ getCategories: mocks.getCategories }));
vi.mock('@/services/FavoritesService', () => ({
  addFavorite: mocks.addFavorite,
  getFavorites: mocks.getFavorites,
  removeFavorite: mocks.removeFavorite,
}));

const event = {
  id: 'event-1', name: 'Concierto', description: 'Música en vivo',
  date: '2026-10-10T00:00:00.000Z', location: 'Bogotá', price: 25000,
  capacity: 100, categoryId: 'music', images: [], createdAt: '', updatedAt: '',
};

describe('ClientPage', () => {
  it('carga el catálogo, filtra y agrega un favorito', async () => {
    mocks.getEvents.mockResolvedValue([event]);
    mocks.getCategories.mockResolvedValue([{ id: 'music', name: 'Música' }]);
    mocks.getFavorites.mockResolvedValue([]);
    mocks.addFavorite.mockResolvedValue(undefined);

    render(<MemoryRouter><ClientPage /></MemoryRouter>);

    expect(await screen.findByText('Concierto')).toBeInTheDocument();
    fireEvent.change(screen.getByPlaceholderText('Busca por nombre o descripción...'), {
      target: { value: 'teatro' },
    });
    expect(screen.getByText('No se encontraron eventos con esos filtros')).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText('Busca por nombre o descripción...'), {
      target: { value: 'concierto' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Agregar a favoritos' }));

    await waitFor(() => expect(mocks.addFavorite).toHaveBeenCalledWith('event-1'));
    expect(screen.getByRole('button', { name: 'Quitar de favoritos' })).toBeInTheDocument();
  });
});
