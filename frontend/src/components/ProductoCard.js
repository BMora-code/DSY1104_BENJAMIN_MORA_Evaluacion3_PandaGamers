import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";

const ProductoCard = ({ producto }) => {
  const { agregarAlCarrito } = useContext(CartContext);
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
    <div className="card h-100 shadow-sm" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <img
        src={producto.image || producto.imagen}
        className="card-img-top"
        alt={producto.name || producto.nombre}
        style={{ height: '200px', objectFit: 'cover' }}
        onError={(e) => {
          e.target.src = "https://via.placeholder.com/300x200/6c757d/ffffff?text=Producto";
        }}
      />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{producto.name || producto.nombre}</h5>
        <p className="card-text text-muted small">{producto.description}</p>
        <p className="card-text fw-bold text-primary h5">${(producto.price || producto.precio).toLocaleString('es-CL')}</p>
        <div className="mt-auto">
          <span className="badge bg-secondary mb-2">{producto.category}</span>
          <div className="d-grid gap-2">
            <button
              className="btn btn-primary"
              onClick={handleAddToCart}
              disabled={producto.stock <= 0}
            >
              {producto.stock > 0 ? 'Agregar al carrito' : 'Agotado'}
            </button>
            <button className="btn btn-outline-secondary btn-sm">
              Ver detalles
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductoCard;
