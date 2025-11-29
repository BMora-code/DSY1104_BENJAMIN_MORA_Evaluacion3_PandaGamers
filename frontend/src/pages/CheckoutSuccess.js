import React from 'react';
import { useLocation } from 'react-router-dom';
import * as api from '../services/api';

export default function CheckoutSuccess() {
  const location = useLocation();
  const payment = location.state && location.state.payment ? location.state.payment : null;

  // If no payment in navigation state, try to fetch last order from backend
  const [orderState, setOrderState] = React.useState(null);
  const order = payment || orderState;

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      if (payment) return;
      try {
        const ventas = await api.getMisVentas();
        if (!mounted) return;
        if (Array.isArray(ventas) && ventas.length) {
          setOrderState(ventas[ventas.length - 1]);
        }
      } catch (e) {
        // ignore
      }
    })();
    return () => { mounted = false; };
  }, [payment]);

  if (!order) {
    return (
      <div className="container py-5">
        <h2>Orden no encontrada</h2>
        <p>No se encontró información de la compra. Si creaste la orden recientemente, intenta revisar "Mis Compras".</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2>Pago {order.status === 'failed' ? 'Fallido' : 'Exitoso'}</h2>
      <p>Resumen de la orden:</p>
      <div className="list-group">
        {(order.items || []).map((item, idx) => (
          <div key={idx} className="list-group-item d-flex align-items-center">
            <img
              src={item.imagen || item.image || '/images/Logo Empresa/Logo.png'}
              alt={item.nombre || item.name || 'producto'}
              style={{ width: 80, height: 80, objectFit: 'cover', marginRight: 16 }}
              onError={(e) => { e.target.onerror = null; e.target.src = '/images/Logo Empresa/Logo.png'; }}
            />
            <div>
              <div><strong>{item.nombre || item.name}</strong></div>
              <div>Cantidad: {item.cantidad || item.qty || item.quantity || 1}</div>
              <div>Precio unitario: ${((item.precioFinalGuardado || item.price || item.precio || 0) / 100).toFixed(2)}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <p><strong>Subtotal original:</strong> ${((order.subtotalOriginal || order.subtotal || 0) / 100).toFixed(2)}</p>
        <p><strong>Descuento aplicado:</strong> ${((order.discountAmount || 0) / 100).toFixed(2)}</p>
        <p><strong>IVA:</strong> ${((order.iva || 0) / 100).toFixed(2)}</p>
        <p><strong>Total:</strong> ${((order.total || 0) / 100).toFixed(2)}</p>
      </div>
    </div>
  );
}
