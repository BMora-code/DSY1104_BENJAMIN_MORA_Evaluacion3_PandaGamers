import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CartProvider, CartContext } from '../CartContext';

// Componente de prueba para acceder al contexto
const TestComponent = () => {
  const { cart, agregarAlCarrito, eliminarDelCarrito } = React.useContext(CartContext);

  return (
    <div>
      <div data-testid="cart-length">{cart.length}</div>
      <button onClick={() => agregarAlCarrito({ id: 1, nombre: 'Producto 1', precio: 10 })}>
        Agregar Producto
      </button>
      <button onClick={() => eliminarDelCarrito(1)}>
        Eliminar Producto
      </button>
      {cart.map(item => (
        <div key={item.id} data-testid={`cart-item-${item.id}`}>
          {item.nombre} - Cantidad: {item.cantidad}
        </div>
      ))}
    </div>
  );
};

describe('CartContext', () => {
  test('inicializa con un carrito vacío', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    expect(screen.getByTestId('cart-length')).toHaveTextContent('0');
  });

  test('agrega un producto al carrito', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    const addButton = screen.getByText('Agregar Producto');
    fireEvent.click(addButton);

    expect(screen.getByTestId('cart-length')).toHaveTextContent('1');
    expect(screen.getByTestId('cart-item-1')).toHaveTextContent('Producto 1 - Cantidad: 1');
  });

  test('incrementa la cantidad cuando se agrega el mismo producto', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    const addButton = screen.getByText('Agregar Producto');
    fireEvent.click(addButton);
    fireEvent.click(addButton);

    expect(screen.getByTestId('cart-length')).toHaveTextContent('1');
    expect(screen.getByTestId('cart-item-1')).toHaveTextContent('Producto 1 - Cantidad: 2');
  });

  test('elimina un producto del carrito', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    // Agregar producto
    const addButton = screen.getByText('Agregar Producto');
    fireEvent.click(addButton);

    // Verificar que se agregó
    expect(screen.getByTestId('cart-length')).toHaveTextContent('1');

    // Eliminar producto
    const removeButton = screen.getByText('Eliminar Producto');
    fireEvent.click(removeButton);

    // Verificar que se eliminó
    expect(screen.getByTestId('cart-length')).toHaveTextContent('0');
    expect(screen.queryByTestId('cart-item-1')).not.toBeInTheDocument();
  });

  test('agrega diferentes productos al carrito', () => {
    const TestComponentMultiple = () => {
      const { cart, agregarAlCarrito } = React.useContext(CartContext);

      return (
        <div>
          <div data-testid="cart-length">{cart.length}</div>
          <button onClick={() => agregarAlCarrito({ id: 1, nombre: 'Producto 1', precio: 10 })}>
            Agregar Producto 1
          </button>
          <button onClick={() => agregarAlCarrito({ id: 2, nombre: 'Producto 2', precio: 20 })}>
            Agregar Producto 2
          </button>
          {cart.map(item => (
            <div key={item.id} data-testid={`cart-item-${item.id}`}>
              {item.nombre} - Cantidad: {item.cantidad}
            </div>
          ))}
        </div>
      );
    };

    render(
      <CartProvider>
        <TestComponentMultiple />
      </CartProvider>
    );

    const addButton1 = screen.getByText('Agregar Producto 1');
    const addButton2 = screen.getByText('Agregar Producto 2');

    fireEvent.click(addButton1);
    fireEvent.click(addButton2);

    expect(screen.getByTestId('cart-length')).toHaveTextContent('2');
    expect(screen.getByTestId('cart-item-1')).toHaveTextContent('Producto 1 - Cantidad: 1');
    expect(screen.getByTestId('cart-item-2')).toHaveTextContent('Producto 2 - Cantidad: 1');
  });
});