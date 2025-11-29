import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductoCard from '../ProductoCard';
import { CartContext } from '../../context/CartContext';

// Mock del contexto del carrito
const mockAgregarAlCarrito = jest.fn();
const mockCartContextValue = {
  agregarAlCarrito: mockAgregarAlCarrito
};

// Mock de useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate
}));

// Wrapper component para proporcionar el contexto
const TestWrapper = ({ children }) => (
  <CartContext.Provider value={mockCartContextValue}>
    {children}
  </CartContext.Provider>
);

describe('ProductoCard', () => {
  const mockProducto = {
    id: 1,
    name: 'Producto de Prueba',
    description: 'Descripción del producto de prueba',
    price: 29.99,
    category: 'Electrónicos',
    image: 'https://via.placeholder.com/300x200',
    stock: 10
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renderiza correctamente el producto', () => {
    render(
      <TestWrapper>
        <ProductoCard producto={mockProducto} />
      </TestWrapper>
    );

    expect(screen.getByText('Producto de Prueba')).toBeInTheDocument();
    expect(screen.getByText('Descripción del producto de prueba')).toBeInTheDocument();
    expect(screen.getByText('$29.99')).toBeInTheDocument();
    expect(screen.getByText('Electrónicos')).toBeInTheDocument();
    expect(screen.getByText('Agregar al carrito')).toBeInTheDocument();
  });

  test('muestra "Agotado" cuando el stock es 0', () => {
    const productoSinStock = { ...mockProducto, stock: 0 };

    render(
      <TestWrapper>
        <ProductoCard producto={productoSinStock} />
      </TestWrapper>
    );

    expect(screen.getByText('Agotado')).toBeInTheDocument();
    expect(screen.getByText('Producto Agotado')).toBeInTheDocument();
  });

  test('llama a agregarAlCarrito cuando se hace clic en el botón', () => {
    render(
      <TestWrapper>
        <ProductoCard producto={mockProducto} />
      </TestWrapper>
    );

    const button = screen.getByText('Agregar al carrito');
    fireEvent.click(button);

    expect(mockAgregarAlCarrito).toHaveBeenCalledWith({
      id: 1,
      nombre: 'Producto de Prueba',
      precio: 29.99,
      imagen: 'https://via.placeholder.com/300x200',
      cantidad: 1
    });
  });

  test('no llama a agregarAlCarrito cuando el producto está agotado', () => {
    const productoSinStock = { ...mockProducto, stock: 0 };

    render(
      <TestWrapper>
        <ProductoCard producto={productoSinStock} />
      </TestWrapper>
    );

    const button = screen.getByText('Producto Agotado');
    expect(button).toBeDisabled();
    fireEvent.click(button);

    expect(mockAgregarAlCarrito).not.toHaveBeenCalled();
  });

  test('navega a la página de detalles cuando se hace clic en la card', () => {
    render(
      <TestWrapper>
        <ProductoCard producto={mockProducto} />
      </TestWrapper>
    );

    const card = screen.getByText('Producto de Prueba').closest('.card');
    fireEvent.click(card);

    expect(mockNavigate).toHaveBeenCalledWith('/productos/1');
  });

  test('no navega cuando se hace clic en el botón del carrito', () => {
    render(
      <TestWrapper>
        <ProductoCard producto={mockProducto} />
      </TestWrapper>
    );

    const button = screen.getByText('Agregar al carrito');
    fireEvent.click(button);

    // Verificar que agregarAlCarrito fue llamado pero navigate no
    expect(mockAgregarAlCarrito).toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('muestra imagen por defecto cuando falla la carga', () => {
    render(
      <TestWrapper>
        <ProductoCard producto={mockProducto} />
      </TestWrapper>
    );

    const img = screen.getByAltText('Producto de Prueba');
    fireEvent.error(img);

    expect(img).toHaveAttribute('src', 'https://via.placeholder.com/300x200/6c757d/ffffff?text=Producto');
  });
});