import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";

const CarritoItem = ({ item }) => {
  const { eliminarDelCarrito } = useContext(CartContext);

  const handleRemove = () => {
    eliminarDelCarrito(item.id);
  };

  const itemTotal = (item.precio * item.cantidad).toFixed(2);

  return (
    <div className="d-flex align-items-center border-bottom py-3">
      <img
        src={item.imagen}
        alt={item.nombre}
        className="rounded me-3"
        style={{ width: '80px', height: '80px', objectFit: 'cover' }}
        onError={(e) => {
          e.target.src = "https://via.placeholder.com/80x80/6c757d/ffffff?text=Img";
        }}
      />
      <div className="flex-grow-1">
        <h6 className="mb-1">{item.nombre}</h6>
        <p className="text-muted small mb-1">Precio unitario: ${item.precio}</p>
        <p className="text-muted small mb-0">Cantidad: {item.cantidad}</p>
      </div>
      <div className="text-end me-3">
        <strong className="text-primary">${itemTotal}</strong>
      </div>
      <button
        className="btn btn-outline-danger btn-sm"
        onClick={handleRemove}
        title="Eliminar del carrito"
      >
        <i className="bi bi-trash"></i>
      </button>
    </div>
  );
};

export default CarritoItem;
