import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { EventCard } from './EventCard';

const event = {
  id: 'event-1', name: 'Concierto', description: 'Música en vivo',
  date: '2026-10-10T00:00:00.000Z', location: 'Bogotá', price: 25000,
  capacity: 100, categoryId: 'music', category: { id: 'music', name: 'Música' },
  images: ['cover.jpg'], createdAt: '2026-01-01', updatedAt: '2026-01-01',
};

describe('EventCard', () => {
  it('muestra la información del evento y permite agregarlo a favoritos', () => {
    const onToggleFavorite = vi.fn();
    render(<EventCard event={event} onToggleFavorite={onToggleFavorite} />);

    expect(screen.getByRole('img', { name: 'Concierto' })).toHaveAttribute('src', 'cover.jpg');
    expect(screen.getByText('Música')).toBeInTheDocument();
    expect(screen.getByText('$25000.00')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Agregar a favoritos' }));
    expect(onToggleFavorite).toHaveBeenCalledWith(event);
  });

  it('muestra un marcador si no hay imagen y bloquea el botón mientras actualiza', () => {
    render(<EventCard event={{ ...event, images: [] }} isFavorite isToggling onToggleFavorite={vi.fn()} />);
    expect(screen.getByText('Evento')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Quitar de favoritos' })).toBeDisabled();
  });
});
