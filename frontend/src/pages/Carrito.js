import React, { useContext, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import CarritoItem from "../components/CarritoItem";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import dataStore from "../data/dataStore";

const Carrito = () => {
  const { cart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("carrito");

  // Verificar si viene desde el dropdown del header
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('tab') === 'miscompras') {
      setActiveTab("compras");
    }
  }, []);
  // Calcular totales en pesos chilenos usando useMemo para optimización
  const { subtotal, iva, total, descuentoDuoc, envio } = React.useMemo(() => {
    const subtotalCalc = user && user.hasDuocDiscount
      ? cart.reduce((acc, item) => acc + (Math.round((item.precioOriginal || item.price || item.precio || 0) * 0.8) * item.cantidad), 0)
      : cart.reduce((acc, item) => acc + ((item.precioFinal || item.price || item.precio || 0) * item.cantidad), 0);
    const ivaCalc = Math.round(subtotalCalc * 0.19); // 19% IVA, redondeado
    const envioCalc = 2500; // Costo de envío fijo en pesos chilenos
    const totalCalc = subtotalCalc + ivaCalc + envioCalc;
    const descuentoDuocCalc = user && user.hasDuocDiscount ? cart.reduce((acc, item) => acc + (Math.round((item.precioOriginal || item.price || item.precio || 0) * 0.2) * item.cantidad), 0) : 0;

    return {
      subtotal: subtotalCalc,
      iva: ivaCalc,
      total: totalCalc,
      descuentoDuoc: descuentoDuocCalc,
      envio: envioCalc
    };
  }, [cart, user]);

  const handleContinueShopping = () => {
    navigate("/productos");
  };

  if (cart.length === 0) {
    return (
      <div style={{ minHeight: '100vh', color: 'var(--text)' }}>
        <div className="container mt-5">
          <div className="text-center py-5">
            <div className="mb-4">
              <i className="bi bi-cart-x display-1" style={{ color: 'var(--accent)' }}></i>
            </div>
            <h2 className="mb-3" style={{ color: 'var(--text)' }}>Tu carrito está vacío</h2>
            <p style={{ color: 'var(--muted)' }} className="mb-4">
              ¡Agrega algunos productos para comenzar tu compra!
            </p>
            <button
              className="btn-neon btn-lg"
              onClick={handleContinueShopping}
            >
              Continuar Comprando
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Obtener órdenes del usuario actual
  const userOrders = user ? dataStore.getOrders().filter(order => order.userId === user.id) : [];

  return (
    <div style={{ minHeight: '100vh', color: 'var(--text)' }}>
      <div className="container mt-4">
        {/* Tabs de navegación */}
        {user && (
          <ul className="nav nav-tabs mb-4" style={{ borderBottom: '1px solid var(--border)' }}>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "carrito" ? "active" : ""}`}
                onClick={() => setActiveTab("carrito")}
                style={activeTab === "carrito" ? { background: 'var(--surface)', color: 'var(--accent)', borderColor: 'var(--accent)' } : { color: 'var(--text)' }}
              >
                <i className="bi bi-cart me-1"></i>
                Carrito
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "compras" ? "active" : ""}`}
                onClick={() => setActiveTab("compras")}
                style={activeTab === "compras" ? { background: 'var(--surface)', color: 'var(--accent)', borderColor: 'var(--accent)' } : { color: 'var(--text)' }}
              >
                <i className="bi bi-receipt me-1"></i>
                Mis Compras ({userOrders.length})
              </button>
            </li>
          </ul>
        )}

        {activeTab === "carrito" && (
          <>
            <h2 className="mb-4" style={{ color: 'var(--text)', fontFamily: 'var(--font-head)' }}>Carrito de Compras</h2>

            <div className="row">
              {/* Lista de productos */}
              <div className="col-lg-8">
                <div className="card" style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}>
                  <div className="card-header" style={{ background: 'var(--surface)', color: 'var(--text)', borderBottom: '1px solid var(--border)' }}>
                    <h5 className="mb-0" style={{ fontFamily: 'var(--font-head)', color: 'var(--text)' }}>Productos en tu carrito</h5>
                  </div>
                  <div className="card-body">
                    {cart.map(item => (
                      <CarritoItem key={item.id} item={item} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Resumen de compra */}
              <div className="col-lg-4">
                <div className="card" style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', position: 'sticky', top: '20px' }}>
                  <div className="card-header" style={{ background: 'var(--surface)', color: 'var(--text)', borderBottom: '1px solid var(--border)' }}>
                    <h5 className="mb-0" style={{ fontFamily: 'var(--font-head)', color: 'var(--text)' }}>Resumen de Compra</h5>
                  </div>
                  <div className="card-body">
                    {user && user.hasDuocDiscount && (
                      <div className="alert mb-3" style={{ background: 'var(--accent)', color: 'var(--text)', border: '1px solid var(--accent)' }}>
                        <i className="bi bi-star-fill me-2"></i>
                        ¡Descuento DUOC UC aplicado! 20% OFF en todos los productos
                      </div>
                    )}

                    <div className="d-flex justify-content-between mb-2">
                      <span style={{ color: 'var(--text)' }}>Subtotal:</span>
                      <span style={{ color: 'var(--text)' }}>${subtotal.toLocaleString('es-CL')}</span>
                    </div>

                    {user && user.hasDuocDiscount && descuentoDuoc > 0 && (
                      <div className="d-flex justify-content-between mb-2">
                        <span style={{ color: 'var(--accent)' }}>Descuento DUOC (20%):</span>
                        <span style={{ color: 'var(--accent)' }}>-${descuentoDuoc.toLocaleString('es-CL')}</span>
                      </div>
                    )}

                    <div className="d-flex justify-content-between mb-2">
                      <span style={{ color: 'var(--text)' }}>IVA (19%):</span>
                      <span style={{ color: 'var(--text)' }}>${iva.toLocaleString('es-CL')}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span style={{ color: 'var(--text)' }}>Envío:</span>
                      <span style={{ color: 'var(--text)' }}>${envio.toLocaleString('es-CL')}</span>
                    </div>
                    <hr style={{ borderColor: 'var(--border)' }} />
                    <div className="d-flex justify-content-between mb-3">
                      <strong style={{ color: 'var(--text)' }}>Total:</strong>
                      <strong style={{ color: 'var(--accent)' }}>${total.toLocaleString('es-CL')}</strong>
                    </div>

                    <div className="d-grid gap-2">
                      <Link
                        to={user ? "/checkout" : "/login"}
                        className="btn-neon text-center d-block"
                        onClick={(e) => {
                          if (cart.length === 0) {
                            e.preventDefault();
                            alert("El carrito está vacío");
                            return;
                          }
                          if (!user) {
                            e.preventDefault();
                            alert("Debes iniciar sesión para realizar la compra");
                            // El Link ya redirige a /login
                          }
                        }}
                      >
                        Finalizar Compra
                      </Link>

                      <button
                        className="btn-outline"
                        onClick={handleContinueShopping}
                      >
                        Continuar Comprando
                      </button>
                    </div>

                    {!user && (
                      <div className="alert mt-3 small" style={{ background: 'var(--surface)', border: '1px solid var(--accent)', color: 'var(--text)' }}>
                        <i className="bi bi-info-circle me-1"></i>
                        Debes iniciar sesión para completar tu compra.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "compras" && user && (
          <div>
            <h2 className="mb-4" style={{ color: 'var(--text)', fontFamily: 'var(--font-head)' }}>Mis Compras</h2>

            {userOrders.length === 0 ? (
              <div className="text-center py-5">
                <div className="mb-4">
                  <i className="bi bi-receipt-x display-1" style={{ color: 'var(--accent)' }}></i>
                </div>
                <h3 style={{ color: 'var(--text)' }}>No tienes compras realizadas</h3>
                <p style={{ color: 'var(--muted)' }}>¡Realiza tu primera compra para ver tu historial aquí!</p>
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
                            Orden #{order.id}
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
                                  src={item.imagen}
                                  alt={item.nombre}
                                  style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', marginRight: '10px' }}
                                  onError={(e) => e.target.src = "https://via.placeholder.com/40x40/6c757d/ffffff?text=Img"}
                                />
                                <div>
                                  <span style={{ color: '#000', fontWeight: 'bold' }}>{item.nombre}</span>
                                  <br />
                                  <small style={{ color: '#000' }}>Cant: {item.cantidad}</small>
                                </div>
                              </div>
                              <span style={{ color: '#000', fontWeight: 'bold' }}>
                                ${(item.precio * item.cantidad).toLocaleString('es-CL')}
                              </span>
                            </div>
                          ))}
                        </div>

                        <hr style={{ borderColor: 'var(--border)' }} />

                        <div className="d-flex justify-content-between mb-2">
                          <span style={{ color: 'var(--text)' }}>Subtotal:</span>
                          <span style={{ color: 'var(--text)' }}>${order.subtotal?.toLocaleString('es-CL') || '0'}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span style={{ color: 'var(--text)' }}>IVA (19%):</span>
                          <span style={{ color: 'var(--text)' }}>${order.iva?.toLocaleString('es-CL') || '0'}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span style={{ color: 'var(--text)' }}>Envío:</span>
                          <span style={{ color: 'var(--text)' }}>${order.shippingCost?.toLocaleString('es-CL') || '0'}</span>
                        </div>
                        <hr style={{ borderColor: 'var(--border)' }} />
                        <div className="d-flex justify-content-between">
                          <strong style={{ color: 'var(--text)' }}>Total:</strong>
                          <strong style={{ color: 'var(--accent)' }}>${order.total?.toLocaleString('es-CL') || '0'}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Carrito;