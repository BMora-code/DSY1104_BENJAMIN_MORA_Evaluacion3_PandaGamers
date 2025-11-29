import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Carrito from '../Carrito';
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

describe('Carrito', () => {
  const mockCartContextValue = {
    cart: [
      { id: 1, nombre: 'Producto 1', precio: 10, cantidad: 2, imagen: 'img1.jpg' },
      { id: 2, nombre: 'Producto 2', precio: 20, cantidad: 1, imagen: 'img2.jpg' }
    ],
    eliminarDelCarrito: jest.fn()
  };

  const mockAuthContextValue = {
    user: null
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('muestra mensaje cuando el carrito está vacío', () => {
    const emptyCartContext = {
      cart: [],
      eliminarDelCarrito: jest.fn()
    };

    render(
      <TestWrapper cartContextValue={emptyCartContext} authContextValue={mockAuthContextValue}>
        <Carrito />
      </TestWrapper>
    );

    expect(screen.getByText('Tu carrito está vacío')).toBeInTheDocument();
    expect(screen.getByText('¡Agrega algunos productos para comenzar tu compra!')).toBeInTheDocument();
  });

  test('muestra botón de continuar comprando cuando está vacío', () => {
    const emptyCartContext = {
      cart: [],
      eliminarDelCarrito: jest.fn()
    };

    render(
      <TestWrapper cartContextValue={emptyCartContext} authContextValue={mockAuthContextValue}>
        <Carrito />
      </TestWrapper>
    );

    expect(screen.getByText('Continuar Comprando')).toBeInTheDocument();
  });

  test('renderiza correctamente los items del carrito', () => {
    render(
      <TestWrapper cartContextValue={mockCartContextValue} authContextValue={mockAuthContextValue}>
        <Carrito />
      </TestWrapper>
    );

    expect(screen.getByText('Producto 1')).toBeInTheDocument();
    expect(screen.getByText('Producto 2')).toBeInTheDocument();
    expect(screen.getByText('Cantidad: 2')).toBeInTheDocument();
    expect(screen.getByText('Cantidad: 1')).toBeInTheDocument();
  });

  test('calcula correctamente el subtotal', () => {
    render(
      <TestWrapper cartContextValue={mockCartContextValue} authContextValue={mockAuthContextValue}>
        <Carrito />
      </TestWrapper>
    );

    // 10 * 2 + 20 * 1 = 40
    expect(screen.getByText('$40')).toBeInTheDocument();
  });

  test('calcula correctamente el IVA', () => {
    render(
      <TestWrapper cartContextValue={mockCartContextValue} authContextValue={mockAuthContextValue}>
        <Carrito />
      </TestWrapper>
    );

    // IVA del 19% sobre subtotal + envío (2500) = 19% de 40 + 2500 = 7.6 + 2500 = 2547.6
    // Total = 40 + 2500 + 7.6 = 2547.6
    expect(screen.getByText('$7.60')).toBeInTheDocument();
  });

  test('calcula correctamente el total', () => {
    render(
      <TestWrapper cartContextValue={mockCartContextValue} authContextValue={mockAuthContextValue}>
        <Carrito />
      </TestWrapper>
    );

    expect(screen.getByText('$57.60')).toBeInTheDocument();
  });

  test('muestra información de envío', () => {
    render(
      <TestWrapper cartContextValue={mockCartContextValue} authContextValue={mockAuthContextValue}>
        <Carrito />
      </TestWrapper>
    );

    expect(screen.getByText('Envío:')).toBeInTheDocument();
    expect(screen.getByText('$2,500')).toBeInTheDocument();
  });

  test('muestra botón de finalizar compra', () => {
    render(
      <TestWrapper cartContextValue={mockCartContextValue} authContextValue={mockAuthContextValue}>
        <Carrito />
      </TestWrapper>
    );

    expect(screen.getByText('Finalizar Compra')).toBeInTheDocument();
  });

  test('muestra advertencia cuando usuario no está logueado', () => {
    render(
      <TestWrapper cartContextValue={mockCartContextValue} authContextValue={mockAuthContextValue}>
        <Carrito />
      </TestWrapper>
    );

    expect(screen.getByText('Debes iniciar sesión para completar tu compra.')).toBeInTheDocument();
  });

  test('no muestra advertencia cuando usuario está logueado', () => {
    const loggedInAuthContext = {
      user: { username: 'testuser', role: 'user' }
    };

    render(
      <TestWrapper cartContextValue={mockCartContextValue} authContextValue={loggedInAuthContext}>
        <Carrito />
      </TestWrapper>
    );

    expect(screen.queryByText('Debes iniciar sesión para completar tu compra.')).not.toBeInTheDocument();
  });

  test('llama a eliminarDelCarrito cuando se hace clic en eliminar', () => {
    render(
      <TestWrapper cartContextValue={mockCartContextValue} authContextValue={mockAuthContextValue}>
        <Carrito />
      </TestWrapper>
    );

    const eliminarButtons = screen.getAllByText('Eliminar');
    fireEvent.click(eliminarButtons[0]);

    expect(mockCartContextValue.eliminarDelCarrito).toHaveBeenCalledWith(1);
  });

  test('muestra resumen de compra correcto', () => {
    render(
      <TestWrapper cartContextValue={mockCartContextValue} authContextValue={mockAuthContextValue}>
        <Carrito />
      </TestWrapper>
    );

    expect(screen.getByText('Resumen de Compra')).toBeInTheDocument();
    expect(screen.getByText('Producto 1 x2')).toBeInTheDocument();
    expect(screen.getByText('Producto 2 x1')).toBeInTheDocument();
  });

  test('calcula totales correctamente con diferentes cantidades', () => {
    const differentCartContext = {
      cart: [
        { id: 1, nombre: 'Producto A', precio: 15, cantidad: 3, imagen: 'img1.jpg' },
        { id: 2, nombre: 'Producto B', precio: 25, cantidad: 2, imagen: 'img2.jpg' }
      ],
      eliminarDelCarrito: jest.fn()
    };

    render(
      <TestWrapper cartContextValue={differentCartContext} authContextValue={mockAuthContextValue}>
        <Carrito />
      </TestWrapper>
    );

    // Subtotal: 15*3 + 25*2 = 45 + 50 = 95
    expect(screen.getByText('$95')).toBeInTheDocument();

    // IVA: 95 * 0.19 = 18.05
    expect(screen.getByText('$18.05')).toBeInTheDocument();

    // Total: 95 + 2500 + 18.05 = 2613.05
    expect(screen.getByText('$113.05')).toBeInTheDocument();
  });
});