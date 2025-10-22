import React, { createContext, useState, useContext, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import dataStore from "../data/dataStore";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { user } = useContext(AuthContext);

  // Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    const loadCart = () => {
      try {
        if (user) {
          // Cargar carrito específico del usuario
          const userCartKey = `cart_${user.id}`;
          const savedCart = localStorage.getItem(userCartKey);
          if (savedCart) {
            const parsedCart = JSON.parse(savedCart);
            setCart(parsedCart);
          } else {
            // Usuario nuevo, intentar cargar carrito temporal
            const tempCart = localStorage.getItem('cart_temp');
            if (tempCart) {
              const parsedTempCart = JSON.parse(tempCart);
              setCart(parsedTempCart);
              // Mover carrito temporal al usuario
              localStorage.setItem(userCartKey, tempCart);
              localStorage.removeItem('cart_temp');
            } else {
              setCart([]);
            }
          }
        } else {
          // No hay usuario logueado, cargar carrito temporal
          const tempCart = localStorage.getItem('cart_temp');
          if (tempCart) {
            const parsedTempCart = JSON.parse(tempCart);
            setCart(parsedTempCart);
          } else {
            setCart([]);
          }
        }
      } catch (error) {
        console.warn('Error loading cart from localStorage:', error);
        setCart([]);
      }
    };

    // Cargar carrito inmediatamente al montar
    loadCart();

    // También cargar después de un pequeño delay para asegurar que se cargue correctamente
    const timeoutId = setTimeout(loadCart, 50);

    return () => clearTimeout(timeoutId);
  }, [user]);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    const saveCart = () => {
      try {
        if (user) {
          const userCartKey = `cart_${user.id}`;
          localStorage.setItem(userCartKey, JSON.stringify(cart));
        } else {
          // Usuario no logueado, guardar en carrito temporal
          localStorage.setItem('cart_temp', JSON.stringify(cart));
        }
      } catch (error) {
        console.warn('Error saving cart to localStorage:', error);
      }
    };

    // Guardar inmediatamente
    saveCart();

    // También guardar después de delays progresivos para asegurar persistencia
    const timeoutId1 = setTimeout(saveCart, 100);
    const timeoutId2 = setTimeout(saveCart, 500);
    const timeoutId3 = setTimeout(saveCart, 1000);

    return () => {
      clearTimeout(timeoutId1);
      clearTimeout(timeoutId2);
      clearTimeout(timeoutId3);
    };
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
