// Pequeño almacén local para ofertas y utilidades de fallback de frontend.
// Reemplaza los usos ligeros de `dataStore` que solo guardaban ofertas o buscaban
// imágenes locales. La fuente de verdad ahora es el backend (`api`).
import * as api from './api';

const OFERTAS_KEY = 'app_ofertas_v1';

export function getOfertas() {
  try {
    const raw = localStorage.getItem(OFERTAS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveOfertas(ofertas) {
  try {
    localStorage.setItem(OFERTAS_KEY, JSON.stringify(ofertas));
  } catch (e) { /* ignore */ }
}

export function createOferta(oferta) {
  const arr = getOfertas();
  const id = arr.length ? Math.max(...arr.map(o => o.id || 0)) + 1 : 1;
  const newO = { id, ...oferta };
  arr.push(newO);
  saveOfertas(arr);
  return newO;
}

export function updateOferta(id, updated) {
  const arr = getOfertas();
  const idx = arr.findIndex(o => o.id === id);
  if (idx === -1) return null;
  arr[idx] = { ...arr[idx], ...updated };
  saveOfertas(arr);
  return arr[idx];
}

export function deleteOferta(id) {
  const arr = getOfertas().filter(o => o.id !== id);
  saveOfertas(arr);
}

// Cache de productos traídos desde backend para búsquedas por nombre (imagen, stock, id)
let productsCache = null;
let productsCacheTs = 0;
const CACHE_TTL = 1000 * 60 * 2; // 2 minutos

export async function getProductsCache(force = false) {
  const now = Date.now();
  if (!force && productsCache && (now - productsCacheTs) < CACHE_TTL) return productsCache;
  try {
    const prods = await api.getAllProducts();
    productsCache = Array.isArray(prods) ? prods : [];
    productsCacheTs = Date.now();
    return productsCache;
  } catch (e) {
    // fallback a cache existente o array vacío
    return productsCache || [];
  }
}

export async function findProductByName(name) {
  if (!name) return null;
  const prods = await getProductsCache();
  const lower = name.toString().toLowerCase();
  return prods.find(p => (p.nombre || p.name || '').toString().toLowerCase() === lower) || null;
}

export async function getImageForProductName(name) {
  try {
    const prod = await findProductByName(name);
    if (!prod) return null;
    return prod.imagen || prod.image || null;
  } catch (e) {
    return null;
  }
}

// Admin-managed products (persistidos en localStorage) — para crear/editar/eliminar
// productos desde el panel administrativo cuando el backend no proporciona esas APIs.
const ADMIN_PRODUCTS_KEY = 'admin_products_v1';

export function getAdminProducts() {
  try {
    const raw = localStorage.getItem(ADMIN_PRODUCTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveAdminProducts(arr) {
  try { localStorage.setItem(ADMIN_PRODUCTS_KEY, JSON.stringify(arr)); } catch (e) { }
}

export function createAdminProduct(product) {
  const arr = getAdminProducts();
  const id = arr.length ? Math.max(...arr.map(p => p.id || 0)) + 1 : 100000; // ids grandes para evitar colisiones
  const newP = { id, ...product };
  arr.push(newP);
  saveAdminProducts(arr);
  return newP;
}

export function updateAdminProduct(id, updated) {
  const arr = getAdminProducts();
  const idx = arr.findIndex(p => p.id === id);
  if (idx === -1) return null;
  arr[idx] = { ...arr[idx], ...updated };
  saveAdminProducts(arr);
  return arr[idx];
}

export function deleteAdminProduct(id) {
  const arr = getAdminProducts().filter(p => p.id !== id);
  saveAdminProducts(arr);
}

export default {
  getOfertas,
  createOferta,
  updateOferta,
  deleteOferta,
  getProductsCache,
  findProductByName,
  getImageForProductName
};

