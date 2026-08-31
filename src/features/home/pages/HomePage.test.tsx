import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import HomePage from './HomePage';

const getEvents = vi.hoisted(() => vi.fn());
vi.mock('@/services/EventsService', () => ({ getEvents }));

const event = {
  id: 'event-1', name: 'Feria local', description: 'Actividades',
  date: '2026-10-10', location: 'Bogotá', price: 0, capacity: 20,
  categoryId: 'culture', images: [], createdAt: '', updatedAt: '',
};

describe('HomePage', () => {
  it('presenta los eventos públicos recibidos del servicio', async () => {
    getEvents.mockResolvedValue([event]);
    render(<HomePage />);
    expect(await screen.findByText('Feria local')).toBeInTheDocument();
  });

  it('informa el fallo de carga', async () => {
    getEvents.mockRejectedValue(new Error('Sin conexión'));
    render(<HomePage />);
    expect(await screen.findByText('Ocurrió un error al cargar la lista de eventos.')).toBeInTheDocument();
  });
});
