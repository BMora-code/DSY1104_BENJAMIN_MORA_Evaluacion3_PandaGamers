import React from "react";
import { Link } from "react-router-dom";

const CheckoutError = () => {
  return (
    <div style={{ minHeight: '100vh', color: 'var(--text)' }}>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            {/* Mensaje de error */}
            <div className="text-center mb-5">
              <div className="error-icon mb-4">
                <i className="bi bi-x-circle-fill text-danger" style={{ fontSize: '4rem' }}></i>
              </div>
              <h1 className="text-danger mb-3">Error en el Pago</h1>
              <p className="lead" style={{ color: 'var(--text)' }}>
                Lo sentimos, no se pudo procesar tu pago. Por favor, intenta nuevamente.
              </p>
            </div>

            {/* Posibles razones del error */}
            <div className="card shadow mb-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}>
              <div className="card-header" style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', color: 'var(--text)' }}>
                <h5 className="mb-0">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  ¿Qué pudo haber salido mal?
                </h5>
              </div>
              <div className="card-body">
                <ul className="list-unstyled">
                  <li className="mb-3" style={{ color: 'var(--text)' }}>
                    <i className="bi bi-credit-card text-danger me-2"></i>
                    <strong>Fondos insuficientes:</strong> Verifica que tu tarjeta tenga saldo disponible.
                  </li>
                  <li className="mb-3" style={{ color: 'var(--text)' }}>
                    <i className="bi bi-shield-x text-danger me-2"></i>
                    <strong>Datos incorrectos:</strong> Revisa que la información de tu tarjeta sea correcta.
                  </li>
                  <li className="mb-3" style={{ color: 'var(--text)' }}>
                    <i className="bi bi-clock text-danger me-2"></i>
                    <strong>Tarjeta expirada:</strong> Verifica la fecha de expiración de tu tarjeta.
                  </li>
                  <li className="mb-3" style={{ color: 'var(--text)' }}>
                    <i className="bi bi-wifi-off text-danger me-2"></i>
                    <strong>Problemas de conexión:</strong> Intenta nuevamente con una conexión estable.
                  </li>
                  <li className="mb-0" style={{ color: 'var(--text)' }}>
                    <i className="bi bi-bank text-danger me-2"></i>
                    <strong>Bloqueo bancario:</strong> Contacta a tu banco si sospechas de un bloqueo.
                  </li>
                </ul>
              </div>
            </div>

            {/* Opciones para resolver */}
            <div className="card shadow mb-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}>
              <div className="card-header" style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', color: 'var(--text)' }}>
                <h5 className="mb-0">¿Qué puedes hacer ahora?</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <div className="text-center">
                      <i className="bi bi-arrow-repeat text-primary mb-3" style={{ fontSize: '2rem' }}></i>
                      <h6 style={{ color: 'var(--text)' }}>Intentar de Nuevo</h6>
                      <p className="small" style={{ color: 'var(--text)' }}>
                        Revisa tus datos y vuelve a intentar el pago.
                      </p>
                      <Link to="/checkout" className="btn btn-primary">
                        Reintentar Pago
                      </Link>
                    </div>
                  </div>

                  <div className="col-md-6 mb-3">
                    <div className="text-center">
                      <i className="bi bi-cart text-primary mb-3" style={{ fontSize: '2rem' }}></i>
                      <h6 style={{ color: 'var(--text)' }}>Revisar Carrito</h6>
                      <p className="small" style={{ color: 'var(--text)' }}>
                        Verifica los productos en tu carrito.
                      </p>
                      <Link to="/carrito" className="btn btn-outline-primary">
                        Ir al Carrito
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Información de contacto */}
            <div className="card shadow mb-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}>
              <div className="card-body text-center">
                <i className="bi bi-headset text-primary mb-3" style={{ fontSize: '2rem' }}></i>
                <h6 style={{ color: 'var(--text)' }}>¿Necesitas Ayuda?</h6>
                <p style={{ color: 'var(--text)' }}>
                  Nuestro equipo de soporte está aquí para ayudarte.
                </p>
                <div className="row">
                  <div className="col-6">
                    <a href="tel:+56912345678" className="btn btn-outline-primary w-100 mb-2">
                      <i className="bi bi-telephone me-1"></i>
                      Llamar
                    </a>
                  </div>
                  <div className="col-6">
                    <a href="mailto:soporte@tiendareact.com" className="btn btn-outline-primary w-100 mb-2">
                      <i className="bi bi-envelope me-1"></i>
                      Email
                    </a>
                  </div>
                </div>
                <small style={{ color: 'var(--text)' }}>
                  Horario de atención: Lunes a Viernes, 9:00 - 18:00
                </small>
              </div>
            </div>

            {/* Acciones principales */}
            <div className="text-center">
              <Link to="/productos" className="btn btn-secondary me-3">
                <i className="bi bi-arrow-left me-1"></i>
                Continuar Comprando
              </Link>
              <Link to="/" className="btn btn-outline-secondary">
                <i className="bi bi-house me-1"></i>
                Volver al Inicio
              </Link>
            </div>

            {/* Información de seguridad */}
            <div className="alert mt-4" style={{ background: 'rgba(255, 193, 7, 0.1)', border: '2px solid #ffc107', color: 'var(--text)' }}>
              <i className="bi bi-info-circle me-2"></i>
              <strong>Información de Seguridad:</strong> No se realizó ningún cargo a tu tarjeta.
              Puedes intentar el pago nuevamente de forma segura.
            </div>

          </div> {/* col-lg-6 */}
        </div> {/* row justify-content-center */}
      </div> {/* container */}
    </div>
  );
};

export default CheckoutError;