import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Header from '../Header';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';

// Mock de useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

// Wrapper component para proporcionar contextos
const TestWrapper = ({ children, cartContextValue, authContextValue }) => (
  <BrowserRouter>
    <AuthContext.Provider value={authContextValue}>
      <CartContext.Provider value={cartContextValue}>
        {children}
      </CartContext.Provider>
    </AuthContext.Provider>
  </BrowserRouter>
);

describe('Header', () => {
  const mockCartContextValue = {
    cart: [
      { id: 1, nombre: 'Producto 1', precio: 10, cantidad: 2 },
      { id: 2, nombre: 'Producto 2', precio: 20, cantidad: 1 }
    ]
  };

  const mockAuthContextValue = {
    user: null,
    logout: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renderiza correctamente el título de la tienda', () => {
    render(
      <TestWrapper cartContextValue={mockCartContextValue} authContextValue={mockAuthContextValue}>
        <Header />
      </TestWrapper>
    );

    expect(screen.getByText('Tienda React')).toBeInTheDocument();
  });

  test('muestra el número total de items en el carrito', () => {
    render(
      <TestWrapper cartContextValue={mockCartContextValue} authContextValue={mockAuthContextValue}>
        <Header />
      </TestWrapper>
    );

    expect(screen.getByText('Carrito (3)')).toBeInTheDocument();
  });

  test('muestra 0 cuando el carrito está vacío', () => {
    const emptyCartContext = { cart: [] };

    render(
      <TestWrapper cartContextValue={emptyCartContext} authContextValue={mockAuthContextValue}>
        <Header />
      </TestWrapper>
    );

    expect(screen.getByText('Carrito (0)')).toBeInTheDocument();
  });

  test('muestra enlaces de navegación principales', () => {
    render(
      <TestWrapper cartContextValue={mockCartContextValue} authContextValue={mockAuthContextValue}>
        <Header />
      </TestWrapper>
    );

    expect(screen.getByText('Inicio')).toBeInTheDocument();
    expect(screen.getByText('Productos')).toBeInTheDocument();
    expect(screen.getByText('Ofertas')).toBeInTheDocument();
    expect(screen.getByText('Carrito (3)')).toBeInTheDocument();
    expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
  });

  test('muestra información del usuario cuando está logueado', () => {
    const loggedInAuthContext = {
      user: { username: 'testuser', role: 'user' },
      logout: jest.fn()
    };

    render(
      <TestWrapper cartContextValue={mockCartContextValue} authContextValue={loggedInAuthContext}>
        <Header />
      </TestWrapper>
    );

    expect(screen.getByText('testuser')).toBeInTheDocument();
    expect(screen.getByText('Cerrar Sesión')).toBeInTheDocument();
  });

  test('muestra panel de admin para usuarios administradores', () => {
    const adminAuthContext = {
      user: { username: 'admin', role: 'admin' },
      logout: jest.fn()
    };

    render(
      <TestWrapper cartContextValue={mockCartContextValue} authContextValue={adminAuthContext}>
        <Header />
      </TestWrapper>
    );

    expect(screen.getByText('Panel Admin')).toBeInTheDocument();
  });

  test('llama a logout cuando se hace clic en Cerrar Sesión', () => {
    const mockLogout = jest.fn();
    const loggedInAuthContext = {
      user: { username: 'testuser', role: 'user' },
      logout: mockLogout
    };

    render(
      <TestWrapper cartContextValue={mockCartContextValue} authContextValue={loggedInAuthContext}>
        <Header />
      </TestWrapper>
    );

    const logoutButton = screen.getByText('Cerrar Sesión');
    fireEvent.click(logoutButton);

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  test('calcula correctamente el total de items en el carrito', () => {
    const complexCartContext = {
      cart: [
        { id: 1, nombre: 'Producto 1', precio: 10, cantidad: 3 },
        { id: 2, nombre: 'Producto 2', precio: 20, cantidad: 2 },
        { id: 3, nombre: 'Producto 3', precio: 15, cantidad: 1 }
      ]
    };

    render(
      <TestWrapper cartContextValue={complexCartContext} authContextValue={mockAuthContextValue}>
        <Header />
      </TestWrapper>
    );

    expect(screen.getByText('Carrito (6)')).toBeInTheDocument();
  });
});