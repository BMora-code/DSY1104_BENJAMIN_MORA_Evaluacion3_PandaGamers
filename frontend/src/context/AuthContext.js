// src/context/AuthContext.js
import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const savedUser = localStorage.getItem('auth_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.warn('Error loading user from localStorage:', error);
        localStorage.removeItem('auth_user');
      }
    }
  }, []);

  const login = (userData) => {
    // Verificar si el usuario tiene descuento DUOC
    const hasDuocDiscount = userData.email && userData.email.toLowerCase().endsWith('@duocuc.cl');
    const userWithDiscount = {
      ...userData,
      hasDuocDiscount
    };
    setUser(userWithDiscount);
    // Guardar en localStorage
    localStorage.setItem('auth_user', JSON.stringify(userWithDiscount));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
