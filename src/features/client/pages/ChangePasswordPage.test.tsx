import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ChangePasswordPage } from './ChangePasswordPage';
import { changePassword } from '@/services/AuthService';

vi.mock('@/services/AuthService', () => ({
  changePassword: vi.fn(),
}));

const mockedChangePassword = vi.mocked(changePassword);

describe('ChangePasswordPage', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('envía las contraseñas y confirma la actualización', async () => {
    mockedChangePassword.mockResolvedValue({
      message: 'Contraseña actualizada correctamente',
    });

    render(<ChangePasswordPage />);

    fireEvent.change(screen.getByLabelText('Contraseña actual'), {
      target: { value: 'actual123' },
    });
    fireEvent.change(screen.getByLabelText('Nueva contraseña'), {
      target: { value: 'nueva123' },
    });
    fireEvent.change(screen.getByLabelText('Confirmar nueva contraseña'), {
      target: { value: 'nueva123' },
    });
    fireEvent.click(
      screen.getByRole('button', { name: 'Actualizar contraseña' }),
    );

    await waitFor(() => {
      expect(mockedChangePassword).toHaveBeenCalledWith({
        currentPassword: 'actual123',
        newPassword: 'nueva123',
      });
    });

    expect(
      await screen.findByText('Contraseña actualizada correctamente'),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Contraseña actual')).toHaveValue('');
  });

  it('no envía el formulario si la confirmación no coincide', () => {
    render(<ChangePasswordPage />);

    fireEvent.change(screen.getByLabelText('Contraseña actual'), {
      target: { value: 'actual123' },
    });
    fireEvent.change(screen.getByLabelText('Nueva contraseña'), {
      target: { value: 'nueva123' },
    });
    fireEvent.change(screen.getByLabelText('Confirmar nueva contraseña'), {
      target: { value: 'distinta123' },
    });
    fireEvent.click(
      screen.getByRole('button', { name: 'Actualizar contraseña' }),
    );

    expect(
      screen.getByText('La confirmación no coincide con la nueva contraseña.'),
    ).toBeInTheDocument();
    expect(mockedChangePassword).not.toHaveBeenCalled();
  });
});
