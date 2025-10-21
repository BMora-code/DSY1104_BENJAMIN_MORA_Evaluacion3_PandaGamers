import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import dataStore from "../data/dataStore";

const Ofertas = () => {
  const [ofertas, setOfertas] = useState([]);
  const [filteredOfertas, setFilteredOfertas] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const { agregarAlCarrito } = useContext(CartContext);
  const navigate = useNavigate();

  const handleAddToCart = (e, producto) => {
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

  const handleCardClick = (producto) => {
    navigate(`/productos/${producto.id}`);
  };

  const handleFilterChange = (filterType) => {
    setActiveFilter(filterType);
    let filtered = [...ofertas];

    switch (filterType) {
      case '20':
        filtered = ofertas.filter(oferta => oferta.discount > 20);
        break;
      case '30':
        filtered = ofertas.filter(oferta => oferta.discount > 30);
        break;
      case 'all':
      default:
        filtered = ofertas;
        break;
    }

    setFilteredOfertas(filtered);
  };

  useEffect(() => {
    const loadOfertas = () => {
      console.log('Cargando ofertas desde dataStore...');
      // Obtener ofertas administradas por el admin
      const ofertasAdmin = dataStore.getOfertas();
      console.log('Ofertas obtenidas:', ofertasAdmin);

      // Obtener productos completos para las ofertas
      const allProducts = dataStore.getProducts();
      console.log('Productos disponibles:', allProducts.length);

      const productosConOferta = ofertasAdmin.map(oferta => {
        const producto = allProducts.find(p => p.id === parseInt(oferta.productId));
        console.log(`Buscando producto ID ${oferta.productId}:`, producto ? 'Encontrado' : 'No encontrado');
        if (producto) {
          return {
            ...producto,
            originalPrice: producto.price,
            discount: oferta.discount,
            price: oferta.price,
            ofertaId: oferta.id
          };
        } else {
          // Si el producto no existe, intentar obtener datos del dataStore de ofertas
          // Esto asume que guardamos toda la información del producto en la oferta
          return {
            id: `error-${oferta.id}`,
            name: oferta.productName || `Producto no encontrado (ID: ${oferta.productId})`,
            description: oferta.productDescription || 'Este producto ya no está disponible. Contacta al administrador.',
            price: oferta.price,
            originalPrice: oferta.originalPrice || oferta.price * (100 / (100 - oferta.discount)),
            discount: oferta.discount,
            category: oferta.productCategory || 'Error',
            image: oferta.productImage || 'https://via.placeholder.com/300x200/dc3545/ffffff?text=Producto+No+Encontrado',
            stock: oferta.productStock || 0,
            ofertaId: oferta.id
          };
        }
      });

      console.log('Productos con oferta procesados:', productosConOferta);
      setOfertas(productosConOferta);

      // Aplicar el filtro activo después de cargar las ofertas
      let filtered = [...productosConOferta];
      switch (activeFilter) {
        case '20':
          filtered = productosConOferta.filter(oferta => oferta.discount > 20);
          break;
        case '30':
          filtered = productosConOferta.filter(oferta => oferta.discount > 30);
          break;
        case 'all':
        default:
          filtered = productosConOferta;
          break;
      }
      setFilteredOfertas(filtered);
      setLoading(false);
    };

    loadOfertas();

    // Escuchar cambios en las ofertas desde el admin panel
    const handleOfertasUpdate = () => {
      console.log('Evento ofertasUpdated recibido, recargando ofertas...');
      loadOfertas();
    };

    window.addEventListener('ofertasUpdated', handleOfertasUpdate);

    // Escuchar cambios en las ofertas (simular actualización en tiempo real)
    const interval = setInterval(() => {
      console.log('Intervalo: verificando ofertas...');
      loadOfertas();
    }, 2000);

    return () => {
      window.removeEventListener('ofertasUpdated', handleOfertasUpdate);
      clearInterval(interval);
    };
  }, [activeFilter]);

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
            ¡Hasta {ofertas.length > 0 ? Math.max(...ofertas.map(p => p.discount)) : 0}% de descuento!
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
                ${ofertas.length > 0 ? Math.min(...ofertas.map(p => p.price)).toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).replace(/\B(?=(\d{3})+(?!\d))/g, '.') : '0'}
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
                {ofertas.length > 0 ? Math.max(...ofertas.map(p => p.discount)) : 0}%
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
          <button
            type="button"
            className={`btn btn-outline-warning ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => handleFilterChange('all')}
          >
            Todos los Descuentos ({ofertas.length})
          </button>
          <button
            type="button"
            className={`btn btn-outline-warning ${activeFilter === '20' ? 'active' : ''}`}
            onClick={() => handleFilterChange('20')}
          >
            Más de 20% OFF ({ofertas.filter(o => o.discount > 20).length})
          </button>
          <button
            type="button"
            className={`btn btn-outline-warning ${activeFilter === '30' ? 'active' : ''}`}
            onClick={() => handleFilterChange('30')}
          >
            Más de 30% OFF ({ofertas.filter(o => o.discount > 30).length})
          </button>
        </div>
      </div>

      {/* Grid de productos en oferta */}
      {filteredOfertas.length > 0 ? (
        <div className="row">
          {filteredOfertas.map(producto => (
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
                        ${producto.originalPrice.toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                      </span>
                      <span className="h5 text-success fw-bold mb-0">
                        ${producto.price.toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                      </span>
                    </div>
                    <small className="text-warning fw-bold">
                      ¡Ahorras ${(producto.originalPrice - producto.price).toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}!
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
                      onClick={(e) => handleAddToCart(e, producto)}
                      disabled={producto.stock <= 0}
                    >
                      {producto.stock > 0 ? 'Agregar al Carrito' : 'Agotado'}
                    </button>
                    <button
                      className="btn btn-outline-warning btn-sm"
                      onClick={() => handleCardClick(producto)}
                    >
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