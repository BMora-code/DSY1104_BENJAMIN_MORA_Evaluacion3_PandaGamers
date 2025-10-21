import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Home from '../Home';
import dataStore from '../../data/dataStore';

// Mock de dataStore
jest.mock('../../data/dataStore', () => ({
  getProducts: jest.fn()
}));

// Mock de useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

// Wrapper component para proporcionar router
const TestWrapper = ({ children }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
);

describe('Home', () => {
  const mockProducts = [
    {
      id: 1,
      name: 'Producto 1',
      description: 'Descripción del producto 1',
      price: 29.99,
      category: 'Electrónicos',
      image: '/images/product1.jpg',
      stock: 10
    },
    {
      id: 2,
      name: 'Producto 2',
      description: 'Descripción del producto 2',
      price: 49.99,
      category: 'Ropa',
      image: '/images/product2.jpg',
      stock: 5
    },
    {
      id: 3,
      name: 'Producto 3',
      description: 'Descripción del producto 3',
      price: 19.99,
      category: 'Hogar',
      image: '/images/product3.jpg',
      stock: 20
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    dataStore.getProducts.mockReturnValue(mockProducts);
  });

  test('renderiza correctamente el título principal', () => {
    render(
      <TestWrapper>
        <Home />
      </TestWrapper>
    );

    expect(screen.getByText('Bienvenido a la Tienda React')).toBeInTheDocument();
  });

  test('renderiza la descripción de la tienda', () => {
    render(
      <TestWrapper>
        <Home />
      </TestWrapper>
    );

    expect(screen.getByText('Descubre una amplia variedad de productos de calidad con la mejor experiencia de compra en línea.')).toBeInTheDocument();
  });

  test('muestra estadísticas de productos', () => {
    render(
      <TestWrapper>
        <Home />
      </TestWrapper>
    );

    expect(screen.getByText('3')).toBeInTheDocument(); // Total productos
    expect(screen.getByText('3')).toBeInTheDocument(); // Total categorías
  });

  test('renderiza productos destacados', () => {
    render(
      <TestWrapper>
        <Home />
      </TestWrapper>
    );

    expect(screen.getByText('Producto 1')).toBeInTheDocument();
    expect(screen.getByText('Producto 2')).toBeInTheDocument();
    expect(screen.getByText('Producto 3')).toBeInTheDocument();
  });

  test('muestra precios de productos destacados', () => {
    render(
      <TestWrapper>
        <Home />
      </TestWrapper>
    );

    expect(screen.getByText('$29.99')).toBeInTheDocument();
    expect(screen.getByText('$49.99')).toBeInTheDocument();
    expect(screen.getByText('$19.99')).toBeInTheDocument();
  });

  test('muestra sección de productos destacados', () => {
    render(
      <TestWrapper>
        <Home />
      </TestWrapper>
    );

    expect(screen.getByText('Productos Destacados')).toBeInTheDocument();
  });

  test('muestra botones de acción principales', () => {
    render(
      <TestWrapper>
        <Home />
      </TestWrapper>
    );

    expect(screen.getByText('Explorar Productos')).toBeInTheDocument();
    expect(screen.getByText('Ver Todos los Productos')).toBeInTheDocument();
    expect(screen.getByText('Ver Ofertas')).toBeInTheDocument();
  });

  test('muestra sección de llamada a acción', () => {
    render(
      <TestWrapper>
        <Home />
      </TestWrapper>
    );

    expect(screen.getByText('¿Listo para comprar?')).toBeInTheDocument();
    expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
    expect(screen.getByText('Comprar Ahora')).toBeInTheDocument();
  });

  test('llama a getProducts al cargar el componente', () => {
    render(
      <TestWrapper>
        <Home />
      </TestWrapper>
    );

    expect(dataStore.getProducts).toHaveBeenCalledTimes(1);
  });

  test('muestra categorías únicas de productos', () => {
    render(
      <TestWrapper>
        <Home />
      </TestWrapper>
    );

    // Verificar que se muestran las categorías
    expect(screen.getByText('Electrónicos')).toBeInTheDocument();
    expect(screen.getByText('Ropa')).toBeInTheDocument();
    expect(screen.getByText('Hogar')).toBeInTheDocument();
  });

  test('renderiza correctamente cuando no hay productos', () => {
    dataStore.getProducts.mockReturnValue([]);

    render(
      <TestWrapper>
        <Home />
      </TestWrapper>
    );

    expect(screen.getByText('0')).toBeInTheDocument(); // Total productos = 0
    expect(screen.getByText('0')).toBeInTheDocument(); // Total categorías = 0
  });

  test('muestra información de atención al cliente', () => {
    render(
      <TestWrapper>
        <Home />
      </TestWrapper>
    );

    expect(screen.getByText('24/7')).toBeInTheDocument();
    expect(screen.getByText('Atención al Cliente')).toBeInTheDocument();
  });
});