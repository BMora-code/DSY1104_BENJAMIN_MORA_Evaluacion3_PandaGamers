import React, { createContext, useState, useContext, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import dataStore from "../data/dataStore";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { user } = useContext(AuthContext);

  // Cargar carrito desde localStorage al iniciar o cuando cambie el usuario
  useEffect(() => {
    if (user) {
      // Cargar carrito específico del usuario
      const userCartKey = `cart_${user.id}`;
      const savedCart = localStorage.getItem(userCartKey);
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch (error) {
          console.warn('Error loading user cart from localStorage:', error);
          localStorage.removeItem(userCartKey);
          setCart([]);
        }
      } else {
        // Usuario nuevo, carrito vacío
        setCart([]);
      }
    } else {
      // No hay usuario logueado, carrito vacío
      setCart([]);
    }
  }, [user]);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    if (user) {
      const userCartKey = `cart_${user.id}`;
      if (cart.length > 0) {
        localStorage.setItem(userCartKey, JSON.stringify(cart));
      } else {
        localStorage.removeItem(userCartKey);
      }
    }
  }, [cart, user]);

  // Actualizar precios del carrito cuando cambien los productos
  useEffect(() => {
    const handleProductsUpdated = () => {
      setCart(prevCart =>
        prevCart.map(cartItem => {
          const updatedProduct = dataStore.getProductById(cartItem.id);
          if (updatedProduct) {
            // Aplicar descuento DUOC si corresponde
            const precioFinal = user && user.hasDuocDiscount ? updatedProduct.price * 0.8 : updatedProduct.price;

            return {
              ...cartItem,
              name: updatedProduct.name,
              description: updatedProduct.description,
              category: updatedProduct.category,
              image: updatedProduct.image,
              precioOriginal: updatedProduct.price,
              precioFinal: precioFinal,
              tieneDescuentoDuoc: user && user.hasDuocDiscount
            };
          }
          return cartItem;
        })
      );
    };

    // Escuchar el evento de actualización de productos
    window.addEventListener('productsUpdated', handleProductsUpdated);

    return () => {
      window.removeEventListener('productsUpdated', handleProductsUpdated);
    };
  }, [user]);

  const agregarAlCarrito = (producto) => {
    // Aplicar descuento DUOC si corresponde
    const precioFinal = user && user.hasDuocDiscount ? producto.price * 0.8 : producto.price;

    const cartItem = {
      ...producto,
      precioOriginal: producto.price,
      precioFinal: precioFinal,
      tieneDescuentoDuoc: user && user.hasDuocDiscount
    };

    const existing = cart.find(item => item.id === producto.id);
    if (existing) {
      setCart(cart.map(item => item.id === producto.id ? {...item, cantidad: item.cantidad + 1} : item));
    } else {
      setCart([...cart, { ...cartItem, cantidad: 1 }]);
    }
  };

  const eliminarDelCarrito = (id) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === id);
      if (existingItem && existingItem.cantidad > 1) {
        // Si hay más de 1, reducir la cantidad en 1
        return prevCart.map(item =>
          item.id === id ? { ...item, cantidad: item.cantidad - 1 } : item
        );
      } else {
        // Si hay solo 1 o no existe, eliminar completamente
        return prevCart.filter(item => item.id !== id);
      }
    });
  };

  return (
    <CartContext.Provider value={{ cart, agregarAlCarrito, eliminarDelCarrito }}>
      {children}
    </CartContext.Provider>
  );
};
