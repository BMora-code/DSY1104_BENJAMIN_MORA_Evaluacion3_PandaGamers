import axios from 'axios';

const DEFAULT_BASE = process.env.REACT_APP_API_URL || 'http://localhost:4000';

const instance = axios.create({
  baseURL: DEFAULT_BASE,
  headers: { 'Content-Type': 'application/json' }
});

// Dev debugging: mostrar baseURL en la consola
if (process.env.NODE_ENV !== 'production') {
  console.log('[api] baseURL =', DEFAULT_BASE);
}

// Log requests for debugging network errors in dev
instance.interceptors.request.use(req => {
  if (process.env.NODE_ENV !== 'production') {
    try {
      console.log('[api] request:', (req.method || '').toUpperCase(), req.baseURL + req.url, 'headers:', req.headers);
    } catch (e) {}
  }
  return req;
}, err => {
  if (process.env.NODE_ENV !== 'production') console.error('[api] request error', err && err.message);
  return Promise.reject(err);
});

let onUnauthorizedCb = null;

instance.interceptors.response.use(
  res => res,
  err => {
    const status = err?.response?.status;
    if ((status === 401 || status === 403) && typeof onUnauthorizedCb === 'function') {
      onUnauthorizedCb();
    }
    return Promise.reject(err);
  }
);

export function setToken(token) {
  if (token) {
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('auth_token', token);
  } else {
    delete instance.defaults.headers.common['Authorization'];
    localStorage.removeItem('auth_token');
  }
}

export function setOnUnauthorized(cb) {
  onUnauthorizedCb = cb;
}

export async function register(payload) {
  const res = await instance.post('/api/auth/register', payload);
  return res.data;
}

export async function login(payload) {
  const res = await instance.post('/api/auth/login', payload);
  return res.data;
}

export async function createVenta(payload) {
  const res = await instance.post('/api/sales', payload);
  return res.data;
}

export async function getMisVentas() {
  const res = await instance.get('/api/sales');
  return res.data;
}

export async function getMyPayments() {
  const res = await instance.get('/api/payment');
  return res.data;
}

// Debug endpoints (no auth) to help admin panel display server-side data
export async function getDebugVentas() {
  const res = await instance.get('/api/debug/ventas');
  return res.data;
}

export async function getDebugUsers() {
  const res = await instance.get('/api/debug/users');
  return res.data;
}

// Productos API helpers
export async function getAllProducts(query = {}) {
  // Si no se pasan parámetros, pedir una página grande para traer "todos" los productos
  const hasParams = query && Object.keys(query).length > 0;
  const params = hasParams ? query : { page: 1, limit: 1000 };
  const res = await instance.get('/api/products', { params });
  return res.data;
}

export async function getProductByName(name) {
  const res = await instance.get('/api/products/find', { params: { name } });
  return res.data;
}

export async function updateProductStock(id, stock) {
  const res = await instance.patch(`/api/products/${id}/stock`, { stock });
  return res.data;
}

export async function pago(total, items = [], shippingCost = 0, shippingInfo = null) {
  // Enviar total, items y shipping al backend para que registre el intento y simule pago.
  const payload = { total, items, shippingCost };
  if (shippingInfo) payload.shippingInfo = shippingInfo;
  const res = await instance.post('/api/payment', payload).catch(e => {
    // si falla la petición (backend no disponible), simular resultado exitoso para evitar bloquear UI
    return { data: { success: true, simulated: true } };
  });
  return res.data;
}

export default instance;
