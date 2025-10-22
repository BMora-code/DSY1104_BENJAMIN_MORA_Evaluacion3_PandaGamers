import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";

const ProductoCard = ({ producto }) => {
  const { agregarAlCarrito } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Evitar navegación al hacer clic en el botón
    // Adaptar el formato del producto para el carrito
    const cartItem = {
      id: producto.id,
      nombre: producto.name,
      precio: producto.price,
      imagen: producto.image,
      cantidad: 1
    };
    agregarAlCarrito(cartItem);
  };

  const handleCardClick = () => {
    navigate(`/productos/${producto.id}`);
  };

  return (
    <div className="card h-100 shadow-sm" onClick={handleCardClick} style={{ cursor: 'pointer', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}>
      <img
        src={producto.image || producto.imagen}
        className="card-img-top"
        alt={producto.name || producto.nombre}
        style={{ height: '200px', objectFit: 'cover' }}
        onError={(e) => {
          e.target.src = "https://via.placeholder.com/300x200/6c757d/ffffff?text=Producto";
        }}
      />
      <div className="card-body d-flex flex-column" style={{ paddingBottom: '1rem' }}>
        <h5 className="card-title" style={{ color: 'var(--text)', marginBottom: '0.25rem' }}>{producto.name || producto.nombre}</h5>
        <p className="card-text small" style={{ color: 'var(--muted)', minHeight: '3.2rem', marginBottom: '0.5rem' }}>{producto.description}</p>

        {/* Mostrar precio con descuento si el usuario es DUOC */}
        {user && user.hasDuocDiscount ? (
          <div className="mb-2">
            <p className="card-text small mb-0" style={{ color: 'var(--muted)', textDecoration: 'line-through' }}>
              Precio original: ${(producto.price || producto.precio).toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
            </p>
            <p className="card-text fw-bold h5 mb-0" style={{ color: 'var(--accent)' }}>
              Precio con descuento DUOC: ${Math.round((producto.price || producto.precio) * 0.8).toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).replace(/\B(?=(\d{3})+(?!\d))/g, '.')} (20% OFF)
            </p>
          </div>
        ) : (
          <p className="card-text fw-bold h5 mb-1" style={{ color: 'var(--accent)' }}>
            ${(producto.price || producto.precio).toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
          </p>
        )}

        {/* Stock: inmediatamente debajo del precio */}
        <div
          className="product-stock mb-1"
          style={{
            fontSize: '0.9rem',
            fontWeight: 600,
            color: 'var(--text)',
            textAlign: 'left'
          }}
          aria-live="polite"
        >
          Disponible: {typeof producto?.stock !== 'undefined' ? producto.stock : 0}
        </div>

        {/* Categoría */}
        <div className="mb-2">
          <span className="badge" style={{ background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)' }}>{producto.category}</span>
        </div>

        <div className="mt-auto">
          <div className="d-grid gap-2">
            <button
              className="btn-neon"
              onClick={handleAddToCart}
              disabled={producto.stock <= 0}
            >
              {producto.stock > 0 ? 'Agregar al carrito' : 'Agotado'}
            </button>
            <button className="btn-outline btn-sm">
              Ver detalles
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductoCard;
