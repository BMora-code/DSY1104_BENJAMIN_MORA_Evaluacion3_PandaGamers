import React, { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";

const CarritoItem = ({ item }) => {
  const { eliminarDelCarrito } = useContext(CartContext);
  const [currentItem, setCurrentItem] = useState(item);

  // Actualizar el estado local cuando cambie el item
  useEffect(() => {
    setCurrentItem(item);
  }, [item]);

  const handleRemove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    eliminarDelCarrito(item.id);
  };

  const itemTotal = currentItem.tieneDescuentoDuoc
    ? (Math.round((currentItem.precioOriginal || currentItem.price || currentItem.precio || 0) * 0.8) * currentItem.cantidad).toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    : ((currentItem.precioFinal || currentItem.price || currentItem.precio || 0) * currentItem.cantidad).toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  return (
    <div className="d-flex align-items-center py-3" style={{ borderBottom: '1px solid var(--border)' }}>
      <img
        src={currentItem.image || currentItem.imagen}
        alt={currentItem.name || currentItem.nombre}
        className="rounded me-3"
        style={{ width: '80px', height: '80px', objectFit: 'cover' }}
        onError={(e) => {
          e.target.src = "https://via.placeholder.com/80x80/6c757d/ffffff?text=Img";
        }}
      />
      <div className="flex-grow-1">
        <h6 className="mb-1" style={{ color: 'var(--text)' }}>{currentItem.name || currentItem.nombre}</h6>
        <div className="mb-1">
          {currentItem.tieneDescuentoDuoc ? (
            <>
              <p className="small mb-0" style={{ color: 'var(--muted)', textDecoration: 'line-through' }}>
                Precio original: ${(currentItem.precioOriginal || currentItem.precio || 0).toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
              </p>
              <p className="small mb-0" style={{ color: 'var(--accent)' }}>
                Precio con descuento DUOC: ${Math.round((currentItem.precioOriginal || currentItem.precio || 0) * 0.8).toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).replace(/\B(?=(\d{3})+(?!\d))/g, '.')} (20% OFF)
              </p>
            </>
          ) : (
            <p className="small mb-0" style={{ color: 'var(--muted)' }}>
              Precio unitario: ${(currentItem.price || currentItem.precio || 0).toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
            </p>
          )}
        </div>
        <p className="small mb-0" style={{ color: 'var(--muted)' }}>Cantidad: {currentItem.cantidad}</p>
      </div>
      <div className="text-end me-3">
        <strong style={{ color: 'var(--accent)' }}>${itemTotal}</strong>
      </div>
      <button
        className="btn btn-sm"
        onClick={handleRemove}
        title="Eliminar del carrito"
        style={{ border: '1px solid #FF4500', background: 'transparent', color: '#FF4500' }}
      >
        🗑️
      </button>
    </div>
  );
};

export default CarritoItem;
