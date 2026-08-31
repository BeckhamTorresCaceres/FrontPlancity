import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { EventFormModal } from './EventFormModal';

const getCategories = vi.hoisted(() => vi.fn());
vi.mock('@/services/CategoryService', () => ({ getCategories }));

describe('EventFormModal', () => {
  it('valida el nombre antes de enviar', async () => {
    getCategories.mockResolvedValue([]);
    const { container } = render(
      <EventFormModal isOpen onClose={vi.fn()} onSubmit={vi.fn()} />,
    );
    await screen.findByText('Selecciona una categoría');
    fireEvent.submit(container.querySelector('form')!);
    expect(await screen.findByText('El nombre es requerido')).toBeInTheDocument();
  });

  it('envía un evento válido con sus datos normalizados', async () => {
    getCategories.mockResolvedValue([{ id: 'music', name: 'Música' }]);
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const { container } = render(
      <EventFormModal isOpen onClose={vi.fn()} onSubmit={onSubmit} />,
    );

    await screen.findByRole('option', { name: 'Música' });
    fireEvent.change(screen.getByPlaceholderText('Nombre del evento'), { target: { value: ' Concierto ' } });
    fireEvent.change(screen.getByPlaceholderText('Descripción del evento'), { target: { value: ' En vivo ' } });
    const dateInput = container.querySelector<HTMLInputElement>('input[name="date"]');
    expect(dateInput).not.toBeNull();
    fireEvent.change(dateInput!, { target: { value: '2026-10-10' } });
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'music' } });
    fireEvent.change(screen.getByPlaceholderText('Ubicación del evento'), { target: { value: ' Bogotá ' } });
    const numbers = screen.getAllByRole('spinbutton');
    fireEvent.change(numbers[0], { target: { value: '25000' } });
    fireEvent.change(numbers[1], { target: { value: '100' } });
    fireEvent.click(screen.getByRole('button', { name: 'Guardar' }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({
      name: 'Concierto', description: 'En vivo', date: '2026-10-10',
      location: 'Bogotá', price: 25000, capacity: 100, categoryId: 'music', images: [],
    }));
  });
});
