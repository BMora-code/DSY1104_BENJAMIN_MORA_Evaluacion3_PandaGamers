import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import dataStore from "../data/dataStore";

const CheckoutSuccess = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
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
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          {/* Mensaje de éxito */}
          <div className="text-center mb-5">
            <div className="success-icon mb-4">
              <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '4rem' }}></i>
            </div>
            <h1 className="text-success mb-3">¡Compra Exitosa!</h1>
            <p className="lead text-muted">
              Gracias por tu compra. Tu pedido ha sido procesado correctamente.
            </p>
            <div className="alert alert-success">
              <strong>Orden #{order.id}</strong> - Estado: {order.status === 'completed' ? 'Completada' : order.status}
            </div>
          </div>

          {/* Resumen de la orden */}
          <div className="card shadow mb-4">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">
                <i className="bi bi-receipt me-2"></i>
                Resumen de la Orden
              </h5>
            </div>
            <div className="card-body">
              {/* Productos */}
              <div className="mb-4">
                <h6>Productos Comprados:</h6>
                <div className="table-responsive">
                  <table className="table table-borderless">
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th className="text-center">Cantidad</th>
                        <th className="text-end">Precio</th>
                        <th className="text-end">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item, index) => (
                        <tr key={index}>
                          <td>
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
                              <span>{item.nombre}</span>
                            </div>
                          </td>
                          <td className="text-center">{item.cantidad}</td>
                          <td className="text-end">${item.precio.toLocaleString()}</td>
                          <td className="text-end fw-bold">
                            ${(item.precio * item.cantidad).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <hr />

              {/* Totales */}
              <div className="row">
                <div className="col-md-6">
                  <h6>Información de Envío:</h6>
                  <address className="mb-3">
                    <strong>{order.shippingInfo.firstName} {order.shippingInfo.lastName}</strong><br />
                    {order.shippingInfo.address}<br />
                    {order.shippingInfo.city}, {order.shippingInfo.region}<br />
                    {order.shippingInfo.postalCode}<br />
                    <i className="bi bi-telephone me-1"></i>{order.shippingInfo.phone}<br />
                    <i className="bi bi-envelope me-1"></i>{order.shippingInfo.email}
                  </address>

                  <p><strong>Opción de entrega:</strong> {deliveryOptions[order.deliveryOption]}</p>
                </div>

                <div className="col-md-6">
                  <div className="text-end">
                    <div className="mb-2">
                      <span className="text-muted">Subtotal: </span>
                      <span>${order.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="mb-2">
                      <span className="text-muted">Envío: </span>
                      <span>${order.shippingCost.toLocaleString()}</span>
                    </div>
                    <div className="mb-2">
                      <span className="text-muted">IVA (19%): </span>
                      <span>${order.iva.toLocaleString()}</span>
                    </div>
                    <hr />
                    <div className="h5 mb-0">
                      <span className="text-muted">Total: </span>
                      <span className="text-success fw-bold">${order.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Información adicional */}
          <div className="row">
            <div className="col-md-6">
              <div className="card">
                <div className="card-body text-center">
                  <i className="bi bi-truck text-primary mb-3" style={{ fontSize: '2rem' }}></i>
                  <h6>Seguimiento de Envío</h6>
                  <p className="text-muted small">
                    Recibirás un email con el código de seguimiento cuando tu pedido sea enviado.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card">
                <div className="card-body text-center">
                  <i className="bi bi-headset text-primary mb-3" style={{ fontSize: '2rem' }}></i>
                  <h6>¿Necesitas Ayuda?</h6>
                  <p className="text-muted small">
                    Contacta nuestro soporte al cliente si tienes alguna pregunta.
                  </p>
                  <a href="mailto:soporte@tiendareact.com" className="btn btn-outline-primary btn-sm">
                    Contactar Soporte
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className="text-center mt-4">
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
          <div className="alert alert-info mt-4">
            <i className="bi bi-shield-check me-2"></i>
            <strong>Compra Segura:</strong> Tu información de pago fue procesada de forma segura.
            Solo guardamos los últimos 4 dígitos de tu tarjeta para referencia.
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;