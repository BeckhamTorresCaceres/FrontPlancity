import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CategoryFormModal } from './CategoryFormModal';

describe('CategoryFormModal', () => {
  it('valida que el nombre sea obligatorio', () => {
    render(<CategoryFormModal isOpen onClose={vi.fn()} onSubmit={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: 'Guardar' }));
    expect(screen.getByText('El nombre es requerido')).toBeInTheDocument();
  });

  it('envía los datos diligenciados', () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<CategoryFormModal isOpen onClose={vi.fn()} onSubmit={onSubmit} />);

    fireEvent.change(screen.getByPlaceholderText('Nombre de la categoría'), {
      target: { value: 'Música' },
    });
    fireEvent.change(screen.getByPlaceholderText('Descripción de la categoría'), {
      target: { value: 'Conciertos y festivales' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Guardar' }));

    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Música', description: 'Conciertos y festivales',
    });
  });
});
