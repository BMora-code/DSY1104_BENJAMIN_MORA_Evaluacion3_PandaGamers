import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Productos from '../Productos';
import dataStore from '../../data/dataStore';

// Mock de dataStore
jest.mock('../../data/dataStore', () => ({
  getProducts: jest.fn(),
  getProductsByCategory: jest.fn()
}));

// Wrapper component para proporcionar router
const TestWrapper = ({ children }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
);

describe('Productos', () => {
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
      category: 'Electrónicos',
      image: '/images/product3.jpg',
      stock: 20
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    dataStore.getProducts.mockReturnValue(mockProducts);
    dataStore.getProductsByCategory.mockReturnValue([]);
  });

  test('renderiza correctamente el título de la página', () => {
    render(
      <TestWrapper>
        <Productos />
      </TestWrapper>
    );

    expect(screen.getByText('Productos')).toBeInTheDocument();
  });

  test('muestra la barra de búsqueda', () => {
    render(
      <TestWrapper>
        <Productos />
      </TestWrapper>
    );

    expect(screen.getByPlaceholderText('Buscar productos...')).toBeInTheDocument();
  });

  test('muestra el filtro de categorías', () => {
    render(
      <TestWrapper>
        <Productos />
      </TestWrapper>
    );

    expect(screen.getByText('Todas las categorías')).toBeInTheDocument();
  });

  test('carga productos al inicializar el componente', async () => {
    render(
      <TestWrapper>
        <Productos />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(dataStore.getProducts).toHaveBeenCalledTimes(1);
    });
  });

  test('muestra todos los productos inicialmente', async () => {
    render(
      <TestWrapper>
        <Productos />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Producto 1')).toBeInTheDocument();
      expect(screen.getByText('Producto 2')).toBeInTheDocument();
      expect(screen.getByText('Producto 3')).toBeInTheDocument();
    });
  });

  test('filtra productos por búsqueda de texto', async () => {
    render(
      <TestWrapper>
        <Productos />
      </TestWrapper>
    );

    const searchInput = screen.getByPlaceholderText('Buscar productos...');
    fireEvent.change(searchInput, { target: { value: 'Producto 1' } });

    await waitFor(() => {
      expect(screen.getByText('Producto 1')).toBeInTheDocument();
      expect(screen.queryByText('Producto 2')).not.toBeInTheDocument();
      expect(screen.queryByText('Producto 3')).not.toBeInTheDocument();
    });
  });

  test('filtra productos por categoría', async () => {
    render(
      <TestWrapper>
        <Productos />
      </TestWrapper>
    );

    const categorySelect = screen.getByRole('combobox');
    fireEvent.change(categorySelect, { target: { value: 'Electrónicos' } });

    await waitFor(() => {
      expect(screen.getByText('Producto 1')).toBeInTheDocument();
      expect(screen.queryByText('Producto 2')).not.toBeInTheDocument();
      expect(screen.getByText('Producto 3')).toBeInTheDocument();
    });
  });

  test('combina filtros de búsqueda y categoría', async () => {
    render(
      <TestWrapper>
        <Productos />
      </TestWrapper>
    );

    const searchInput = screen.getByPlaceholderText('Buscar productos...');
    const categorySelect = screen.getByRole('combobox');

    fireEvent.change(searchInput, { target: { value: 'Producto' } });
    fireEvent.change(categorySelect, { target: { value: 'Electrónicos' } });

    await waitFor(() => {
      expect(screen.getByText('Producto 1')).toBeInTheDocument();
      expect(screen.queryByText('Producto 2')).not.toBeInTheDocument();
      expect(screen.getByText('Producto 3')).toBeInTheDocument();
    });
  });

  test('muestra mensaje cuando no hay productos que coincidan', async () => {
    render(
      <TestWrapper>
        <Productos />
      </TestWrapper>
    );

    const searchInput = screen.getByPlaceholderText('Buscar productos...');
    fireEvent.change(searchInput, { target: { value: 'Producto Inexistente' } });

    await waitFor(() => {
      expect(screen.getByText('No se encontraron productos que coincidan con tu búsqueda.')).toBeInTheDocument();
    });
  });

  test('genera opciones de categoría dinámicamente', async () => {
    render(
      <TestWrapper>
        <Productos />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Electrónicos')).toBeInTheDocument();
      expect(screen.getByText('Ropa')).toBeInTheDocument();
    });
  });

  test('muestra precios correctamente formateados', async () => {
    render(
      <TestWrapper>
        <Productos />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('$29.99')).toBeInTheDocument();
      expect(screen.getByText('$49.99')).toBeInTheDocument();
      expect(screen.getByText('$19.99')).toBeInTheDocument();
    });
  });

  test('maneja búsqueda insensible a mayúsculas', async () => {
    render(
      <TestWrapper>
        <Productos />
      </TestWrapper>
    );

    const searchInput = screen.getByPlaceholderText('Buscar productos...');
    fireEvent.change(searchInput, { target: { value: 'PRODUCTO 1' } });

    await waitFor(() => {
      expect(screen.getByText('Producto 1')).toBeInTheDocument();
    });
  });

  test('limpia filtros correctamente', async () => {
    render(
      <TestWrapper>
        <Productos />
      </TestWrapper>
    );

    const searchInput = screen.getByPlaceholderText('Buscar productos...');
    const categorySelect = screen.getByRole('combobox');

    // Aplicar filtros
    fireEvent.change(searchInput, { target: { value: 'Producto 1' } });
    fireEvent.change(categorySelect, { target: { value: 'Electrónicos' } });

    // Limpiar filtros
    fireEvent.change(searchInput, { target: { value: '' } });
    fireEvent.change(categorySelect, { target: { value: '' } });

    await waitFor(() => {
      expect(screen.getByText('Producto 1')).toBeInTheDocument();
      expect(screen.getByText('Producto 2')).toBeInTheDocument();
      expect(screen.getByText('Producto 3')).toBeInTheDocument();
    });
  });
});