import React, { useContext, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import CarritoItem from "../components/CarritoItem";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

const Carrito = () => {
  const { cart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("carrito");

  // Estado para controlar el modal de login requerido
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Verificar si hay usuario activo al cargar el componente
  useEffect(() => {
    if (!user) {
      setShowLoginModal(true);
      // Redirigir automáticamente después de 3 segundos
      const timer = setTimeout(() => {
        navigate('/login');
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setShowLoginModal(false);
    }
  }, [user, navigate]);

  // Verificar si viene desde el dropdown del header
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('tab') === 'miscompras') {
      setActiveTab("compras");
    }
  }, []);
  // Calcular totales en pesos chilenos usando useMemo para optimización
  const { subtotal, iva, total, descuentoDuoc, envio } = React.useMemo(() => {
    // Para el subtotal, siempre usar el precio original (sin descuento aplicado)
    const subtotalCalc = cart.reduce((acc, item) => acc + ((item.precioOriginal || item.price || item.precio || 0) * item.cantidad), 0);
    const descuentoDuocCalc = user && user.hasDuocDiscount ? Math.round(subtotalCalc * 0.2) : 0;
    const subtotalConDescuento = user && user.hasDuocDiscount ? subtotalCalc - descuentoDuocCalc : subtotalCalc;
    const ivaCalc = Math.round(subtotalConDescuento * 0.19); // IVA sobre subtotal con descuento
    const envioCalc = 2500; // Costo de envío fijo en pesos chilenos
    const totalCalc = subtotalConDescuento + ivaCalc + envioCalc;

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

  // Obtener órdenes del usuario actual desde la API (mis ventas)
  const [userOrdersState, setUserOrdersState] = useState([]);

  useEffect(() => {
    let mounted = true;
    const loadOrders = async () => {
      if (!user) return;
      try {
        const ventas = await api.getMisVentas();
        if (!mounted) return;
        const mapped = (Array.isArray(ventas) ? ventas : []).sort((a,b) => new Date(b.date) - new Date(a.date)).map((order, idx, arr) => ({
          id: order.id || order._id || order._id,
          date: order.date || order.createdAt,
          items: order.items || [],
          subtotal: order.subtotal || 0,
          iva: order.iva || 0,
          shippingCost: order.shippingCost || 0,
          total: order.total || 0,
          status: order.status || 'completed',
          displayId: arr.length - idx
        }));
        setUserOrdersState(mapped);
      } catch (err) {
        console.error('Error cargando órdenes desde backend', err && err.message);
      }
    };
    loadOrders();
    const handler = () => loadOrders();
    window.addEventListener('ordersUpdated', handler);
    return () => { mounted = false; window.removeEventListener('ordersUpdated', handler); };
  }, [user]);

  return (
    <>
      {/* Modal de login requerido */}
      {showLoginModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            animation: 'fadeIn 0.5s ease-out'
          }}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, #FF4500, #FFD700)',
              color: '#000',
              padding: '30px',
              borderRadius: '15px',
              boxShadow: '0 8px 32px rgba(255, 69, 0, 0.4)',
              textAlign: 'center',
              maxWidth: '400px',
              width: '90%'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
              <span style={{ fontSize: '3rem' }}>🔒</span>
              <h3>Debes iniciar sesión para tener tu carrito</h3>
              <button
                onClick={() => navigate('/login')}
                style={{
                  background: '#39FF14',
                  color: '#000',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '1rem'
                }}
              >
                Ir a Iniciar Sesión
              </button>
            </div>
          </div>
        </div>
      )}

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
                Mis Compras ({userOrdersState.length})
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
                        to="/checkout"
                        className="btn-neon text-center d-block"
                        onClick={(e) => {
                          if (!Array.isArray(cart) || cart.length === 0) {
                            e.preventDefault();
                            alert("El carrito está vacío");
                            return;
                          }
                          // No bloqueamos ni forzamos login aquí: permitimos checkout como invitado.
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
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "compras" && user && (
          <div>
            <h2 className="mb-4" style={{ color: 'var(--text)', fontFamily: 'var(--font-head)' }}>Mis Compras</h2>

            {userOrdersState.length === 0 ? (
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
                {userOrdersState.map(order => (
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
    </>
  );
};

export default Carrito;