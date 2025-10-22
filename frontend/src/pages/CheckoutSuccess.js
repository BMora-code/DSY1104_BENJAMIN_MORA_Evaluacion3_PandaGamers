import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import dataStore from "../data/dataStore";

const CheckoutSuccess = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      const foundOrder = dataStore.getOrderById(parseInt(orderId));
      setOrder(foundOrder);
    }
    setLoading(false);
  }, [orderId]);

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger text-center">
          <h4>Orden no encontrada</h4>
          <p>No se pudo encontrar la información de la orden.</p>
          <Link to="/" className="btn btn-primary">Volver al Inicio</Link>
        </div>
      </div>
    );
  }

  const deliveryOptions = {
    standard: "Envío estándar (2-3 días)",
    express: "Envío express (24 horas)",
    pickup: "Retiro en tienda"
  };

  return (
    <div style={{ minHeight: '100vh', color: 'var(--text)' }}>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            {/* Mensaje de éxito */}
            <div className="text-center mb-5">
              <div className="success-icon mb-4">
                <i className="bi bi-check-circle-fill" style={{ fontSize: '4rem', color: 'var(--accent)' }}></i>
              </div>
              <h1 style={{ color: 'var(--accent)', fontFamily: 'var(--font-head)' }}>¡Compra Exitosa!</h1>
              <p style={{ color: 'var(--muted)' }}>
                Gracias por tu compra. Tu pedido ha sido procesado correctamente.
              </p>
              <div className="alert" style={{ background: 'rgba(57, 255, 20, 0.1)', border: '2px solid var(--accent)', color: 'var(--text)' }}>
                <strong>Orden #{order.id}</strong> - Estado: {order.status === 'completed' ? 'Completada' : order.status}
              </div>
            </div>

            {/* Resumen de la orden */}
            <div className="card" style={{ background: 'var(--surface)', border: '2px solid var(--border)', color: 'var(--text)' }}>
              <div className="card-header" style={{ background: 'var(--surface)', borderBottom: '2px solid var(--border)', color: 'var(--text)' }}>
                <h5 className="mb-0" style={{ fontFamily: 'var(--font-head)', color: 'var(--text)' }}>
                  <i className="bi bi-receipt me-2"></i>
                  Resumen de la Orden
                </h5>
              </div>
              <div className="card-body">
                {/* Productos */}
                <div className="mb-4">
                  <h6 style={{ color: 'var(--text)' }}>Productos Comprados:</h6>
                  <div className="table-responsive">
                    <table className="table" style={{
                      background: '#1a1f3a',
                      color: '#ffffff',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                      border: '1px solid #39FF14',
                      width: '100%'
                    }}>
                      <thead style={{
                        background: '#2d3748',
                        color: '#ffffff',
                        border: 'none'
                      }}>
                        <tr>
                          <th style={{ padding: '1rem', fontWeight: '700', border: 'none', fontSize: '0.9rem', background: '#2d3748', color: '#ffffff' }}>Producto</th>
                          <th className="text-center" style={{ padding: '1rem', fontWeight: '700', border: 'none', fontSize: '0.9rem', background: '#2d3748', color: '#ffffff' }}>Cantidad</th>
                          <th className="text-end" style={{ padding: '1rem', fontWeight: '700', border: 'none', fontSize: '0.9rem', background: '#2d3748', color: '#ffffff' }}>Precio</th>
                          <th className="text-end" style={{ padding: '1rem', fontWeight: '700', border: 'none', fontSize: '0.9rem', background: '#2d3748', color: '#ffffff' }}>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items.map((item, index) => (
                          <tr key={index} style={{
                            background: index % 2 === 0 ? '#121827' : '#0d1f4a',
                            borderBottom: '1px solid #1e293b',
                            transition: 'all 0.2s ease'
                          }}>
                            <td style={{ padding: '1rem', border: 'none', background: index % 2 === 0 ? '#121827' : '#0d1f4a' }}>
                              <div className="d-flex align-items-center">
                                <img
                                  src={item.imagen}
                                  alt={item.nombre}
                                  className="rounded me-3"
                                  style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                  onError={(e) => {
                                    e.target.src = "https://via.placeholder.com/50x50/6c757d/ffffff?text=Img";
                                  }}
                                />
                                <span style={{ color: '#ffffff' }}>{item.nombre}</span>
                              </div>
                            </td>
                            <td className="text-center" style={{ padding: '1rem', color: '#ffffff', border: 'none', fontSize: '0.9rem', background: index % 2 === 0 ? '#121827' : '#0d1f4a' }}>{item.cantidad}</td>
                            <td className="text-end" style={{ padding: '1rem', color: '#39FF14', border: 'none', fontWeight: '600', fontSize: '0.9rem', background: index % 2 === 0 ? '#121827' : '#0d1f4a' }}>
                              ${item.precio.toLocaleString()}
                            </td>
                            <td className="text-end fw-bold" style={{ padding: '1rem', color: '#39FF14', border: 'none', fontWeight: '600', fontSize: '0.9rem', background: index % 2 === 0 ? '#121827' : '#0d1f4a' }}>
                              ${(item.precio * item.cantidad).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <hr style={{ borderColor: 'var(--border)' }} />

                {/* Totales */}
                <div className="row">
                  <div className="col-md-6">
                    <h6 style={{ color: 'var(--text)' }}>Información de Envío:</h6>
                    <address className="mb-3" style={{ color: 'var(--text)' }}>
                      <strong>{order.shippingInfo.firstName} {order.shippingInfo.lastName}</strong><br />
                      {order.shippingInfo.address}<br />
                      {order.shippingInfo.city}, {order.shippingInfo.region}<br />
                      {order.shippingInfo.postalCode}<br />
                      <i className="bi bi-telephone me-1"></i>{order.shippingInfo.phone}<br />
                      <i className="bi bi-envelope me-1"></i>{order.shippingInfo.email}
                    </address>

                    <p style={{ color: 'var(--text)' }}><strong>Opción de entrega:</strong> {deliveryOptions[order.deliveryOption]}</p>
                  </div>

                  <div className="col-md-6">
                    <div className="text-end">
                      <div className="mb-2">
                        <span style={{ color: 'var(--text)' }}>Subtotal: </span>
                        <span style={{ color: 'var(--text)' }}>${order.subtotal.toLocaleString()}</span>
                      </div>
                      <div className="mb-2">
                        <span style={{ color: 'var(--text)' }}>Envío: </span>
                        <span style={{ color: 'var(--text)' }}>${order.shippingCost.toLocaleString()}</span>
                      </div>
                      <div className="mb-2">
                        <span style={{ color: 'var(--text)' }}>IVA (19%): </span>
                        <span style={{ color: 'var(--text)' }}>${order.iva.toLocaleString()}</span>
                      </div>
                      <hr style={{ borderColor: 'var(--border)' }} />
                      <div className="h5 mb-0">
                        <span style={{ color: 'var(--text)' }}>Total: </span>
                        <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>${order.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Información adicional */}
            <div className="row" style={{ marginTop: '2rem', gap: '2rem 0' }}>
              <div className="col-md-6">
                <div className="card" style={{ background: 'var(--surface)', border: '2px solid var(--border)', color: 'var(--text)', marginBottom: '1rem' }}>
                  <div className="card-body text-center" style={{ padding: '2rem' }}>
                    <i className="bi bi-truck" style={{ fontSize: '2rem', color: 'var(--accent)', marginBottom: '1rem' }}></i>
                    <h6 style={{ color: 'var(--text)', marginBottom: '1rem' }}>Seguimiento de Envío</h6>
                    <p style={{ color: 'var(--muted)', marginBottom: '0' }}>
                      Recibirás un email con el código de seguimiento cuando tu pedido sea enviado.
                    </p>
                  </div>
                </div>
              </div>
  
              <div className="col-md-6">
                <div className="card" style={{ background: 'var(--surface)', border: '2px solid var(--border)', color: 'var(--text)', marginBottom: '1rem' }}>
                  <div className="card-body text-center" style={{ padding: '2rem' }}>
                    <i className="bi bi-headset" style={{ fontSize: '2rem', color: 'var(--accent)', marginBottom: '1rem' }}></i>
                    <h6 style={{ color: 'var(--text)', marginBottom: '1rem' }}>¿Necesitas Ayuda?</h6>
                    <p style={{ color: 'var(--muted)', marginBottom: '1rem' }}>
                      Contacta nuestro soporte al cliente si tienes alguna pregunta.
                    </p>
                    <a href="mailto:soporte@tiendareact.com" className="btn btn-outline-primary btn-sm" style={{ marginTop: '0.5rem' }}>
                      Contactar Soporte
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Acciones */}
            <div className="text-center" style={{ marginTop: '3rem', marginBottom: '2rem' }}>
              <Link to="/productos" className="btn btn-primary me-3">
                <i className="bi bi-arrow-left me-1"></i>
                Continuar Comprando
              </Link>
              <Link to="/" className="btn btn-outline-primary">
                <i className="bi bi-house me-1"></i>
                Volver al Inicio
              </Link>
            </div>
  
            {/* Información de seguridad */}
            <div className="alert" style={{ background: 'rgba(13, 110, 253, 0.1)', border: '2px solid #0dcaf0', color: 'var(--text)', marginTop: '2rem', padding: '1.5rem' }}>
              <i className="bi bi-shield-check me-2"></i>
              <strong>Compra Segura:</strong> Tu información de pago fue procesada de forma segura.
              Solo guardamos los últimos 4 dígitos de tu tarjeta para referencia.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;