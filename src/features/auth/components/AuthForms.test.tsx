import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Login } from './Login';
import { Register } from './Register';

const navigate = vi.fn();
const login = vi.fn();
const register = vi.fn();

vi.mock('react-router', async (importOriginal) => ({
  ...(await importOriginal<typeof import('react-router')>()),
  useNavigate: () => navigate,
}));

vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({ login, register }),
}));

describe('formularios de autenticación', () => {
  afterEach(() => vi.clearAllMocks());

  it('inicia sesión y dirige a un cliente a su catálogo', async () => {
    login.mockResolvedValue({ role: 'user' });
    render(<Login />);

    fireEvent.change(screen.getByLabelText('Correo'), { target: { value: 'cliente@plan.city' } });
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'secreto' } });
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith({ email: 'cliente@plan.city', password: 'secreto' });
      expect(navigate).toHaveBeenCalledWith('/client');
    });
  });

  it('muestra el error recibido al registrar una cuenta', async () => {
    register.mockRejectedValue({ response: { data: { message: 'El correo ya existe' } } });
    render(<Register />);

    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Ana' } });
    fireEvent.change(screen.getByLabelText('Correo'), { target: { value: 'ana@plan.city' } });
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'secreto' } });
    fireEvent.click(screen.getByRole('button', { name: 'Registrarme' }));

    expect(await screen.findByText('El correo ya existe')).toBeInTheDocument();
    expect(navigate).not.toHaveBeenCalled();
  });
});
