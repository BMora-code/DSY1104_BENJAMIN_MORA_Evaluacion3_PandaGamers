import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import * as api from '../services/api';
import dataStore from '../data/dataStore';

const MisCompras = () => {
  const { user } = useContext(AuthContext);
  const [userOrders, setUserOrders] = useState([]);

  useEffect(() => {
    if (user) {
      // Obtener pagos (orders) desde backend; cada payment puede contener varios items
      (async () => {
        try {
          const pagos = await api.getMyPayments();
          const userPayments = pagos
            .filter(p => (p.id && p.items))
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map((p, idx, arr) => mapPaymentToOrder(p, idx, arr));
          setUserOrders(userPayments);
        } catch (e) {
          console.error('Error cargando pagos', e);
        }
      })();
    }
  }, [user]);

  // Actualizar las órdenes cuando se complete una compra
  useEffect(() => {
    const handleOrdersUpdate = async () => {
      if (!user) return;
      try {
          const pagos = await api.getMyPayments();
          const userPayments = pagos
            .filter(p => (p.id && p.items))
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map((p, idx, arr) => mapPaymentToOrder(p, idx, arr));
          setUserOrders(userPayments);
      } catch (e) {
        console.error('Error actualizando ventas', e);
      }
    };

    window.addEventListener('ordersUpdated', handleOrdersUpdate);

    return () => {
      window.removeEventListener('ordersUpdated', handleOrdersUpdate);
    };
  }, [user]);

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', color: 'var(--text)' }}>
        <div className="container mt-5">
          <div className="text-center py-5">
            <div className="mb-4">
              <i className="bi bi-shield-lock display-1" style={{ color: 'var(--accent)' }}></i>
            </div>
            <h2 style={{ color: 'var(--text)' }}>Acceso Restringido</h2>
            <p style={{ color: 'var(--muted)' }}>
              Debes iniciar sesión para ver tus compras.
            </p>
            <Link to="/login" className="btn-neon">
              Iniciar Sesión
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', color: 'var(--text)' }}>
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 style={{ color: 'var(--text)', fontFamily: 'var(--font-head)' }}>
            <i className="bi bi-receipt me-2"></i>
            Mis Compras
          </h2>
          <Link to="/" className="btn btn-outline-primary">
            <i className="bi bi-house me-1"></i>
            Volver al Inicio
          </Link>
        </div>

        {userOrders.length === 0 ? (
          <div className="text-center py-5">
            <div className="mb-4">
              <i className="bi bi-receipt-x display-1" style={{ color: 'var(--accent)' }}></i>
            </div>
            <h3 style={{ color: 'var(--text)' }}>No tienes compras realizadas</h3>
            <p style={{ color: 'var(--muted)' }}>
              ¡Realiza tu primera compra para ver tu historial aquí!
            </p>
            <Link to="/productos" className="btn-neon">
              Explorar Productos
            </Link>
          </div>
        ) : (
          <div className="row">
            {userOrders.map(order => (
              <div key={order.id} className="col-lg-6 mb-4">
                <div className="card" style={{ background: 'var(--surface)', border: '2px solid var(--border)', color: 'var(--text)' }}>
                  <div className="card-header" style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', color: 'var(--text)' }}>
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="mb-0" style={{ fontFamily: 'var(--font-head)', color: 'var(--text)' }}>
                        Orden #{order.displayId}
                      </h5>
                      <span className={`badge ${order.status === 'completed' ? 'bg-success' : 'bg-warning'}`}>
                        {order.status === 'completed' ? 'Completada' : order.status}
                      </span>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="mb-3">
                      <small style={{ color: 'var(--muted)' }}>
                        Fecha: {new Date(order.date).toLocaleDateString('es-CL')}
                      </small>
                    </div>

                    <div className="mb-3">
                      <h6 style={{ color: 'var(--text)' }}>Productos:</h6>
                      {order.items.map((item, index) => (
                        <div key={index} className="d-flex justify-content-between align-items-center mb-2" style={{ padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                          <div className="d-flex align-items-center">
                            <img
                              src={
                                item.imagen
                                || ((): string => {
                                  const found = dataStore.products.find(p => (p.name || '').toLowerCase() === (item.nombre || '').toLowerCase());
                                  const local = found?.image || '';
                                  if (!local) return 'https://via.placeholder.com/40x40/6c757d/ffffff?text=Img';
                                  // si la ruta inicia con '/', anteponer PUBLIC_URL para entornos donde sea necesario
                                  return local.startsWith('/') ? `${process.env.PUBLIC_URL}${local}` : local;
                                })()
                              }
                              alt={item.nombre}
                              style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', marginRight: '10px' }}
                              onError={(e) => e.target.src = "https://via.placeholder.com/40x40/6c757d/ffffff?text=Img"}
                            />
                            <div>
                              <span style={{ color: 'var(--text)', fontWeight: 'bold' }}>{item.nombre}</span>
                              <br />
                              <small style={{ color: 'var(--muted)' }}>Cant: {item.cantidad}</small>
                              {item.tieneDescuentoDuoc && (
                                <div style={{ color: 'var(--muted)', fontSize: '0.8em', textDecoration: 'line-through' }}>
                                  Antes: ${(item.precioOriginal || item.precio).toLocaleString('es-CL')}
                                </div>
                              )}
                            </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            {item.tieneDescuentoDuoc && (
                              <div style={{ color: 'var(--accent)', fontSize: '0.9em', fontWeight: 'bold' }}>
                                ¡20% OFF DUOC!
                              </div>
                            )}
                            <span style={{ color: 'var(--text)', fontWeight: 'bold' }}>
                              ${(item.precioFinalGuardado || item.precio || 0).toLocaleString('es-CL')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <hr style={{ borderColor: 'var(--border)' }} />

                    <div className="d-flex justify-content-between mb-2">
                      <span style={{ color: 'var(--text)' }}>Subtotal:</span>
                      <span style={{ color: 'var(--text)' }}>${(order.subtotal || 0).toLocaleString('es-CL')}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span style={{ color: 'var(--text)' }}>IVA (19%):</span>
                      <span style={{ color: 'var(--text)' }}>${(order.iva || 0).toLocaleString('es-CL')}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span style={{ color: 'var(--text)' }}>Envío:</span>
                      <span style={{ color: 'var(--text)' }}>${(order.shippingCost || 0).toLocaleString('es-CL')}</span>
                    </div>
                    <hr style={{ borderColor: 'var(--border)' }} />
                    <div className="d-flex justify-content-between">
                      <strong style={{ color: 'var(--text)' }}>Total:</strong>
                      <strong style={{ color: 'var(--accent)' }}>${((Number(order.subtotal || 0) + Number(order.iva || 0) + Number(order.shippingCost || 0))).toLocaleString('es-CL')}</strong>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MisCompras;

// Helper: normaliza un payment del backend a la estructura usada por la UI
function mapPaymentToOrder(p, idx, arr) {
  const subtotal = (typeof p.subtotal !== 'undefined') ? p.subtotal : (p.total || 0);
  const iva = (typeof p.iva !== 'undefined') ? p.iva : 0;
  let shippingCost = (typeof p.shippingCost !== 'undefined') ? p.shippingCost : 0;
  if ((!shippingCost || shippingCost === 0) && typeof p.total === 'number') {
    const inferred = Number(p.total) - Number(subtotal) - Number(iva || 0);
    if (!isNaN(inferred) && inferred > 0) shippingCost = inferred;
  }

  const items = (p.items || []).map(it => {
    // Nuevo formato: item.producto es objeto con _id,nombre,stock,precio
    const prod = it.producto || null;
    const nombre = prod?.nombre || it.nombre || 'Producto';
    const imagen = prod?.imagen || ((): string => 'https://via.placeholder.com/40x40/6c757d/ffffff?text=Img')();
    const precioFinal = Number(it.precioFinalGuardado ?? it.precioTrasOferta ?? it.precio ?? prod?.precio ?? 0);
    return {
      id: prod?._id || it.id || it.productoId || null,
      nombre,
      cantidad: it.cantidad || 1,
      imagen,
      precioFinalGuardado: precioFinal,
      precioTrasOferta: Number(it.precioTrasOferta || 0),
      offerPrice: Number(it.offerPrice || 0),
      discountPct: Number(it.discountPct || 0),
      status: it.status || (p.status === 'success' || p.status === 'completed' ? 'sold' : 'not_sold'),
      tieneDescuentoDuoc: !!it.tieneDescuentoDuoc,
      precioOriginal: it.precio || prod?.precio || 0
    };
  });

  return {
    id: p.id,
    date: p.date,
    items,
    subtotal,
    iva,
    shippingCost,
    total: (typeof p.total !== 'undefined') ? p.total : (subtotal + iva + shippingCost),
    status: p.status === 'success' || p.status === 'completed' ? 'completed' : (p.status || 'completed'),
    displayId: arr.length - idx
  };
}