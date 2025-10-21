import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import CarritoItem from "../components/CarritoItem";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import dataStore from "../data/dataStore";

const Carrito = () => {
  const { cart, eliminarDelCarrito } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  // Calcular totales en pesos chilenos
  const subtotal = cart.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
  const iva = Math.round(subtotal * 0.19); // 19% IVA, redondeado
  const envio = 2500; // Costo de envío fijo en pesos chilenos
  const total = subtotal + iva + envio;

  const handleCheckout = async () => {
    if (!user) {
      alert("Debes iniciar sesión para realizar la compra.");
      navigate("/login");
      return;
    }

    if (cart.length === 0) {
      alert("El carrito está vacío.");
      return;
    }

    setIsProcessing(true);

    try {
      // Crear orden en el dataStore
      const order = {
        userId: user.username, // Usando el username del usuario como ID
        items: cart,
        subtotal: subtotal,
        iva: iva,
        envio: envio,
        total: total,
        status: "pending"
      };

      const newOrder = dataStore.createOrder(order);

      // Limpiar carrito (esto debería hacerse en el contexto, pero por simplicidad)
      cart.forEach(item => eliminarDelCarrito(item.id));

      alert(`¡Compra realizada exitosamente! Orden #${newOrder.id}`);
      navigate("/");
    } catch (error) {
      alert("Error al procesar la compra. Inténtalo de nuevo.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleContinueShopping = () => {
    navigate("/productos");
  };

  if (cart.length === 0) {
    return (
      <div className="container mt-5">
        <div className="text-center py-5">
          <div className="mb-4">
            <i className="bi bi-cart-x display-1 text-muted"></i>
          </div>
          <h2 className="mb-3">Tu carrito está vacío</h2>
          <p className="text-muted mb-4">
            ¡Agrega algunos productos para comenzar tu compra!
          </p>
          <button
            className="btn btn-primary btn-lg"
            onClick={handleContinueShopping}
          >
            Continuar Comprando
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Carrito de Compras</h2>

      <div className="row">
        {/* Lista de productos */}
        <div className="col-lg-8">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Productos en tu carrito</h5>
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
          <div className="card sticky-top">
            <div className="card-header">
              <h5 className="mb-0">Resumen de Compra</h5>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>${subtotal.toLocaleString('es-CL')}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>IVA (19%):</span>
                <span>${iva.toLocaleString('es-CL')}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Envío:</span>
                <span>${envio.toLocaleString('es-CL')}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-3">
                <strong>Total:</strong>
                <strong className="text-primary">${total.toLocaleString('es-CL')}</strong>
              </div>

              <div className="d-grid gap-2">
                <Link
                  to={user ? "/checkout" : "/login"}
                  className="btn btn-success"
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
                  className="btn btn-outline-primary"
                  onClick={handleContinueShopping}
                >
                  Continuar Comprando
                </button>
              </div>

              {!user && (
                <div className="alert alert-info mt-3 small">
                  <i className="bi bi-info-circle me-1"></i>
                  Debes iniciar sesión para completar tu compra.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carrito;