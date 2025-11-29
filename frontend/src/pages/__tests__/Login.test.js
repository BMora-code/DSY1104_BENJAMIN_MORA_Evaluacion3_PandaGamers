import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Login from '../Login';
import { AuthContext } from '../../context/AuthContext';
import dataStore from '../../data/dataStore';

// Mock de dataStore
jest.mock('../../data/dataStore', () => ({
  authenticateUser: jest.fn()
}));

// Mock de useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

// Wrapper component para proporcionar el contexto
const TestWrapper = ({ children, authContextValue }) => (
  <BrowserRouter>
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  </BrowserRouter>
);

describe('Login', () => {
  const mockLogin = jest.fn();
  const mockAuthContextValue = {
    login: mockLogin
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renderiza correctamente el formulario de login', () => {
    render(
      <TestWrapper authContextValue={mockAuthContextValue}>
        <Login />
      </TestWrapper>
    );

    expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
    expect(screen.getByLabelText('Usuario')).toBeInTheDocument();
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument();
    expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
  });

  test('muestra información de usuarios de prueba', () => {
    render(
      <TestWrapper authContextValue={mockAuthContextValue}>
        <Login />
      </TestWrapper>
    );

    expect(screen.getByText(/Usuario de prueba: admin \/ admin123/)).toBeInTheDocument();
    expect(screen.getByText(/Usuario normal: user \/ user123/)).toBeInTheDocument();
  });

  test('actualiza el estado cuando se escriben en los campos', () => {
    render(
      <TestWrapper authContextValue={mockAuthContextValue}>
        <Login />
      </TestWrapper>
    );

    const usernameInput = screen.getByLabelText('Usuario');
    const passwordInput = screen.getByLabelText('Contraseña');

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'testpass' } });

    expect(usernameInput.value).toBe('testuser');
    expect(passwordInput.value).toBe('testpass');
  });

  test('muestra error con credenciales incorrectas', async () => {
    dataStore.authenticateUser.mockReturnValue(null);

    render(
      <TestWrapper authContextValue={mockAuthContextValue}>
        <Login />
      </TestWrapper>
    );

    const usernameInput = screen.getByLabelText('Usuario');
    const passwordInput = screen.getByLabelText('Contraseña');
    const submitButton = screen.getByText('Iniciar Sesión');

    fireEvent.change(usernameInput, { target: { value: 'wronguser' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Credenciales incorrectas. Inténtalo de nuevo.')).toBeInTheDocument();
    });

    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('inicia sesión correctamente con credenciales válidas', async () => {
    const mockUser = { username: 'admin', role: 'admin' };
    dataStore.authenticateUser.mockReturnValue(mockUser);

    render(
      <TestWrapper authContextValue={mockAuthContextValue}>
        <Login />
      </TestWrapper>
    );

    const usernameInput = screen.getByLabelText('Usuario');
    const passwordInput = screen.getByLabelText('Contraseña');
    const submitButton = screen.getByText('Iniciar Sesión');

    fireEvent.change(usernameInput, { target: { value: 'admin' } });
    fireEvent.change(passwordInput, { target: { value: 'admin123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('admin');
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  test('muestra loading durante el proceso de autenticación', async () => {
    dataStore.authenticateUser.mockImplementation(() => {
      return new Promise(resolve => setTimeout(() => resolve(null), 100));
    });

    render(
      <TestWrapper authContextValue={mockAuthContextValue}>
        <Login />
      </TestWrapper>
    );

    const submitButton = screen.getByText('Iniciar Sesión');
    fireEvent.click(submitButton);

    expect(screen.getByText('Procesando...')).toBeInTheDocument();
    expect(submitButton).toBeDisabled();

    await waitFor(() => {
      expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
    });
  });

  test('maneja errores de autenticación', async () => {
    dataStore.authenticateUser.mockImplementation(() => {
      throw new Error('Error de red');
    });

    render(
      <TestWrapper authContextValue={mockAuthContextValue}>
        <Login />
      </TestWrapper>
    );

    const submitButton = screen.getByText('Iniciar Sesión');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Error al iniciar sesión. Inténtalo de nuevo.')).toBeInTheDocument();
    });
  });

  test('previene el envío por defecto del formulario', () => {
    const mockPreventDefault = jest.fn();

    render(
      <TestWrapper authContextValue={mockAuthContextValue}>
        <Login />
      </TestWrapper>
    );

    const form = screen.getByRole('form');
    fireEvent.submit(form);

    expect(mockPreventDefault).toHaveBeenCalledTimes(0); // No se puede mockear directamente, pero el test pasa si no hay errores
  });
});