import React, { useState, useEffect } from "react";
import ProductoCard from "../components/ProductoCard";
import dataStore from "../data/dataStore";

const Ofertas = () => {
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular productos en oferta (productos con descuento)
    const allProducts = dataStore.getProducts();

    // Agregar información de descuento a algunos productos
    const productosConOferta = allProducts.map(product => ({
      ...product,
      originalPrice: product.price,
      discount: Math.floor(Math.random() * 30) + 10, // Descuento aleatorio entre 10-40%
      price: product.price * (1 - (Math.floor(Math.random() * 30) + 10) / 100)
    })).filter(product => product.discount > 15); // Solo mostrar productos con descuento > 15%

    setOfertas(productosConOferta);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando ofertas...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      {/* Header de ofertas */}
      <div className="text-center mb-5">
        <div className="ofertas-header py-5 bg-warning bg-opacity-10 rounded">
          <i className="bi bi-percent text-warning" style={{ fontSize: '3rem' }}></i>
          <h1 className="display-5 fw-bold text-warning mt-3">¡Ofertas Especiales!</h1>
          <p className="lead text-muted">
            Aprovecha estos descuentos exclusivos en productos seleccionados
          </p>
          <div className="badge bg-warning text-dark fs-6 px-3 py-2">
            ¡Hasta {Math.max(...ofertas.map(p => p.discount))}% de descuento!
          </div>
        </div>
      </div>

      {/* Estadísticas de ofertas */}
      <div className="row text-center mb-5">
        <div className="col-md-3">
          <div className="card border-warning">
            <div className="card-body">
              <i className="bi bi-graph-up text-warning" style={{ fontSize: '2rem' }}></i>
              <h4 className="card-title text-warning">{ofertas.length}</h4>
              <p className="card-text">Productos en Oferta</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-success">
            <div className="card-body">
              <i className="bi bi-cash text-success" style={{ fontSize: '2rem' }}></i>
              <h4 className="card-title text-success">
                ${Math.min(...ofertas.map(p => p.price)).toFixed(0)}
              </h4>
              <p className="card-text">Precio Más Bajo</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-danger">
            <div className="card-body">
              <i className="bi bi-percent text-danger" style={{ fontSize: '2rem' }}></i>
              <h4 className="card-title text-danger">
                {Math.max(...ofertas.map(p => p.discount))}%
              </h4>
              <p className="card-text">Mayor Descuento</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-info">
            <div className="card-body">
              <i className="bi bi-clock text-info" style={{ fontSize: '2rem' }}></i>
              <h4 className="card-title text-info">24h</h4>
              <p className="card-text">Tiempo Limitado</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros de ofertas */}
      <div className="d-flex justify-content-center mb-4">
        <div className="btn-group" role="group">
          <button type="button" className="btn btn-outline-warning active">
            Todos los Descuentos
          </button>
          <button type="button" className="btn btn-outline-warning">
            Más de 20% OFF
          </button>
          <button type="button" className="btn btn-outline-warning">
            Más de 30% OFF
          </button>
        </div>
      </div>

      {/* Grid de productos en oferta */}
      {ofertas.length > 0 ? (
        <div className="row">
          {ofertas.map(producto => (
            <div key={producto.id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
              <div className="card h-100 border-warning position-relative">
                {/* Badge de descuento */}
                <div className="position-absolute top-0 end-0 m-2">
                  <span className="badge bg-danger fs-6">
                    -{producto.discount}%
                  </span>
                </div>

                {/* Imagen del producto */}
                <img
                  src={producto.image}
                  className="card-img-top"
                  alt={producto.name}
                  style={{ height: '200px', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/300x200/6c757d/ffffff?text=Producto";
                  }}
                />

                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{producto.name}</h5>
                  <p className="card-text text-muted small">{producto.description}</p>

                  {/* Precios */}
                  <div className="mb-3">
                    <div className="d-flex align-items-center">
                      <span className="text-decoration-line-through text-muted me-2">
                        ${producto.originalPrice.toFixed(2)}
                      </span>
                      <span className="h5 text-success fw-bold mb-0">
                        ${producto.price.toFixed(2)}
                      </span>
                    </div>
                    <small className="text-warning fw-bold">
                      ¡Ahorras ${(producto.originalPrice - producto.price).toFixed(2)}!
                    </small>
                  </div>

                  {/* Categoría y stock */}
                  <div className="mb-3">
                    <span className="badge bg-secondary me-2">{producto.category}</span>
                    <span className={`badge ${producto.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
                      {producto.stock > 0 ? `Stock: ${producto.stock}` : 'Agotado'}
                    </span>
                  </div>

                  {/* Botones de acción */}
                  <div className="mt-auto d-grid gap-2">
                    <button
                      className="btn btn-warning"
                      disabled={producto.stock <= 0}
                    >
                      {producto.stock > 0 ? '¡Comprar Ahora!' : 'Agotado'}
                    </button>
                    <button className="btn btn-outline-warning btn-sm">
                      Ver Detalles
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-5">
          <i className="bi bi-emoji-frown text-warning" style={{ fontSize: '4rem' }}></i>
          <h3 className="mt-3 text-muted">No hay ofertas disponibles en este momento</h3>
          <p className="text-muted">Vuelve pronto para nuevas ofertas especiales.</p>
        </div>
      )}

      {/* Call to action */}
      <div className="text-center mt-5 py-4 bg-light rounded">
        <h3>¿No encuentras lo que buscas?</h3>
        <p className="text-muted mb-3">
          Explora nuestro catálogo completo de productos
        </p>
        <a href="/productos" className="btn btn-primary btn-lg">
          <i className="bi bi-grid me-2"></i>
          Ver Todos los Productos
        </a>
      </div>

      {/* Información adicional */}
      <div className="row mt-5">
        <div className="col-md-4">
          <div className="text-center">
            <i className="bi bi-truck text-primary mb-3" style={{ fontSize: '2rem' }}></i>
            <h6>Envío Gratis</h6>
            <p className="text-muted small">
              En compras sobre $50.000 con ofertas
            </p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="text-center">
            <i className="bi bi-shield-check text-success mb-3" style={{ fontSize: '2rem' }}></i>
            <h6>Garantía</h6>
            <p className="text-muted small">
              30 días de garantía en productos
            </p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="text-center">
            <i className="bi bi-headset text-info mb-3" style={{ fontSize: '2rem' }}></i>
            <h6>Soporte 24/7</h6>
            <p className="text-muted small">
              Atención al cliente especializada
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ofertas;