import { createContext, useState, useEffect, useCallback, useRef, useMemo } from "react";
import * as api from '../services/api';

export const AuthContext = createContext();

function parseJwt(token) {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch (e) {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setLocalToken] = useState(null);
  const logoutTimerRef = useRef(null);

  const clearSession = useCallback(() => {
    setUser(null);
    setLocalToken(null);
    api.setToken(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }
  }, []);

  const logout = useCallback(() => clearSession(), [clearSession]);

  useEffect(() => {
    api.setOnUnauthorized(() => clearSession());
  }, [clearSession]);

  useEffect(() => {
    const savedToken = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('auth_user');
    if (savedToken && savedUser) {
      api.setToken(savedToken);
      setLocalToken(savedToken);
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
      } catch {
        localStorage.removeItem('auth_user');
      }

      const payload = parseJwt(savedToken);
      if (payload?.exp) {
        const msLeft = payload.exp * 1000 - Date.now();
        if (msLeft > 0) {
          logoutTimerRef.current = setTimeout(clearSession, msLeft);
        } else {
          clearSession();
        }
      }
    }
  }, [clearSession]);

  const login = async (credentials) => {
    const data = await api.login(credentials);
    const { token: tkn, user: userRes } = data;

    if (tkn) {
      api.setToken(tkn);
      setLocalToken(tkn);
      localStorage.setItem('auth_token', tkn);
    }

    if (userRes) {
      const hasDuocDiscount = userRes.email?.toLowerCase().endsWith('@duocuc.cl');
      const username = userRes.nombre || userRes.email;
      const withDiscount = { ...userRes, username, hasDuocDiscount };
      setUser(withDiscount);
      localStorage.setItem('auth_user', JSON.stringify(withDiscount));
    }

    if (tkn) {
      const payload = parseJwt(tkn);
      if (payload?.exp) {
        const msLeft = payload.exp * 1000 - Date.now();
        if (msLeft > 0) {
          if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
          logoutTimerRef.current = setTimeout(clearSession, msLeft);
        }
      }
    }

    return data;
  };

  const register = async (payload) => {
    const data = await api.register(payload);
    if (data?.token) await login({ email: payload.email, password: payload.password });
    return data;
  };

  // ✅ Memoizar el value para evitar renders infinitos
  const contextValue = useMemo(() => ({ user, token, login, logout, register }), [user, token, login, logout, register]);

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}