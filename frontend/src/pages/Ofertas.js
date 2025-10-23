import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import dataStore from "../data/dataStore";

const Ofertas = () => {
  const [ofertas, setOfertas] = useState([]);
  const [filteredOfertas, setFilteredOfertas] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const { agregarAlCarrito } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleAddToCart = (e, producto) => {
    e.stopPropagation(); // Evitar navegación al hacer clic en el botón

    // Verificar si hay usuario activo
    if (!user) {
      alert("Debes iniciar sesión para agregar productos al carrito.");
      return;
    }

    // Adaptar el formato del producto para el carrito
    const cartItem = {
      id: producto.id,
      nombre: producto.name,
      precio: producto.price,
      imagen: producto.image,
      cantidad: 1
    };
    agregarAlCarrito(cartItem);

    // Mostrar anuncio personalizado
    const anuncio = document.createElement('div');
    anuncio.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #39FF14, #FFD700);
      color: #000;
      padding: 15px 20px;
      border-radius: 10px;
      box-shadow: 0 4px 20px rgba(57, 255, 20, 0.3);
      z-index: 10000;
      font-weight: bold;
      animation: slideIn 0.5s ease-out;
    `;
    anuncio.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px;">
        <span>🛒</span>
        <span>"${producto.name}" agregado al carrito</span>
        <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: #000; font-size: 18px; cursor: pointer; margin-left: 10px;">×</button>
      </div>
    `;

    // Agregar estilos de animación si no existen
    if (!document.getElementById('cart-notification-styles')) {
      const style = document.createElement('style');
      style.id = 'cart-notification-styles';
      style.textContent = `
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(anuncio);

    // Auto-remover después de 4 segundos
    setTimeout(() => {
      if (anuncio.parentElement) {
        anuncio.remove();
      }
    }, 4000);
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

  // Si el usuario tiene descuento DUOC, ocultar la página de ofertas
  if (user && user.hasDuocDiscount) {
    return (
      <div style={{ minHeight: '100vh', color: 'var(--text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="container">
          <div className="text-center">
            <div className="card" style={{ background: 'var(--surface)', border: '2px solid var(--accent)', color: 'var(--text)' }}>
              <div className="card-body py-5">
                <i className="bi bi-star-fill mb-4" style={{ fontSize: '4rem', color: 'var(--accent)' }}></i>
                <h2 className="card-title mb-3" style={{ color: 'var(--text)', fontFamily: 'var(--font-head)' }}>
                  ¡Felicitaciones!
                </h2>
                <p className="card-text mb-4" style={{ color: 'var(--muted)', fontSize: '1.1rem' }}>
                  Como estudiante de DUOC UC, tienes acceso a un descuento especial del 20% en todos nuestros productos.
                </p>
                <p className="card-text mb-4" style={{ color: 'var(--accent)', fontSize: '1.2rem', fontWeight: 'bold' }}>
                  El descuento se aplicará automáticamente en tu carrito de compras.
                </p>
                <a href="/productos" className="btn-neon btn-lg">
                  <i className="bi bi-grid me-2"></i>
                  Explorar Productos
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', color: 'var(--text)' }}>
      <div className="container mt-4">
        {/* Header de ofertas */}
        <div className="text-center mb-5">
          <div className="ofertas-header py-5 rounded" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <i className="bi bi-percent" style={{ fontSize: '3rem', color: 'var(--accent)' }}></i>
            <h1 className="display-5 fw-bold mt-3" style={{ color: 'var(--text)', fontFamily: 'var(--font-head)' }}>¡Ofertas Especiales!</h1>
            <p className="lead" style={{ color: 'var(--muted)' }}>
              Aprovecha estos descuentos exclusivos en productos seleccionados
            </p>
            <div className="badge fs-6 px-3 py-2" style={{ background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)' }}>
              ¡Hasta {ofertas.length > 0 ? Math.max(...ofertas.map(p => p.discount)) : 0}% de descuento!
            </div>
          </div>
        </div>

      {/* Estadísticas de ofertas */}
      <div className="row text-center mb-5">
        <div className="col-md-3">
          <div className="card" style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}>
            <div className="card-body">
              <i className="bi bi-graph-up" style={{ fontSize: '2rem', color: 'var(--accent)' }}></i>
              <h4 className="card-title" style={{ color: 'var(--text)' }}>{ofertas.length}</h4>
              <p className="card-text" style={{ color: 'var(--muted)' }}>Productos en Oferta</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card" style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}>
            <div className="card-body">
              <i className="bi bi-cash" style={{ fontSize: '2rem', color: 'var(--accent)' }}></i>
              <h4 className="card-title" style={{ color: 'var(--text)' }}>
                ${ofertas.length > 0 ? Math.min(...ofertas.map(p => p.price)).toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).replace(/\B(?=(\d{3})+(?!\d))/g, '.') : '0'}
              </h4>
              <p className="card-text" style={{ color: 'var(--muted)' }}>Precio Más Bajo</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card" style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}>
            <div className="card-body">
              <i className="bi bi-percent" style={{ fontSize: '2rem', color: 'var(--accent)' }}></i>
              <h4 className="card-title" style={{ color: 'var(--text)' }}>
                {ofertas.length > 0 ? Math.max(...ofertas.map(p => p.discount)) : 0}%
              </h4>
              <p className="card-text" style={{ color: 'var(--muted)' }}>Mayor Descuento</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card" style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}>
            <div className="card-body">
              <i className="bi bi-clock" style={{ fontSize: '2rem', color: 'var(--accent)' }}></i>
              <h4 className="card-title" style={{ color: 'var(--text)' }}>24h</h4>
              <p className="card-text" style={{ color: 'var(--muted)' }}>Tiempo Limitado</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros de ofertas */}
      <div className="d-flex justify-content-center mb-4">
        <div className="btn-group" role="group">
          <button
            type="button"
            className={`btn ${activeFilter === 'all' ? 'btn-neon' : 'btn-outline'}`}
            onClick={() => handleFilterChange('all')}
          >
            Todos los Descuentos ({ofertas.length})
          </button>
          <button
            type="button"
            className={`btn ${activeFilter === '20' ? 'btn-neon' : 'btn-outline'}`}
            onClick={() => handleFilterChange('20')}
          >
            Más de 20% OFF ({ofertas.filter(o => o.discount > 20).length})
          </button>
          <button
            type="button"
            className={`btn ${activeFilter === '30' ? 'btn-neon' : 'btn-outline'}`}
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
              <div className="card h-100 position-relative" style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}>
                {/* Badge de descuento */}
                <div className="position-absolute top-0 end-0 m-2">
                  <span className="badge fs-6" style={{ background: '#FF4500', color: 'var(--text)' }}>
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
                  <h5 className="card-title" style={{ color: 'var(--text)' }}>{producto.name}</h5>
                  <p className="card-text small" style={{ color: 'var(--muted)' }}>{producto.description}</p>

                  {/* Precios */}
                  <div className="mb-3">
                    <div className="d-flex align-items-center">
                      <span className="text-decoration-line-through me-2" style={{ color: 'var(--muted)' }}>
                        ${producto.originalPrice.toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                      </span>
                      <span className="h5 fw-bold mb-0" style={{ color: 'var(--accent)' }}>
                        ${producto.price.toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                      </span>
                    </div>
                    <small className="fw-bold" style={{ color: 'var(--accent)' }}>
                      ¡Ahorras ${(producto.originalPrice - producto.price).toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}!
                    </small>
                  </div>

                  {/* Categoría y stock */}
                  <div className="mb-3">
                    <span className="badge me-2" style={{ background: 'var(--accent)', color: 'var(--text)' }}>{producto.category}</span>
                    <span className={`badge ${producto.stock > 0 ? '' : ''}`} style={{ background: producto.stock > 0 ? 'var(--accent)' : '#FF4500', color: 'var(--text)' }}>
                      {producto.stock > 0 ? `Stock: ${producto.stock}` : 'Agotado'}
                    </span>
                  </div>

                  {/* Botones de acción */}
                  <div className="mt-auto d-grid gap-2">
                    <button
                      className="btn-neon"
                      onClick={(e) => handleAddToCart(e, producto)}
                      disabled={producto.stock <= 0}
                    >
                      {producto.stock > 0 ? 'Agregar al Carrito' : 'Agotado'}
                    </button>
                    <button
                      className="btn-outline btn-sm"
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
          <i className="bi bi-emoji-frown" style={{ fontSize: '4rem', color: 'var(--accent)' }}></i>
          <h3 className="mt-3" style={{ color: 'var(--muted)' }}>No hay ofertas disponibles en este momento</h3>
          <p style={{ color: 'var(--muted)' }}>Vuelve pronto para nuevas ofertas especiales.</p>
        </div>
      )}

      {/* Call to action */}
      <div className="text-center mt-5 py-4 rounded" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <h3 style={{ color: 'var(--text)' }}>¿No encuentras lo que buscas?</h3>
        <p className="mb-3" style={{ color: 'var(--muted)' }}>
          Explora nuestro catálogo completo de productos
        </p>
        <a href="/productos" className="btn-neon btn-lg">
          <i className="bi bi-grid me-2"></i>
          Ver Todos los Productos
        </a>
      </div>

      {/* Información adicional */}
      <div className="row mt-5">
        <div className="col-md-4">
          <div className="text-center">
            <i className="bi bi-truck mb-3" style={{ fontSize: '2rem', color: 'var(--accent)' }}></i>
            <h6 style={{ color: 'var(--text)' }}>Envío Gratis</h6>
            <p className="small" style={{ color: 'var(--muted)' }}>
              En compras sobre $50.000 con ofertas
            </p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="text-center">
            <i className="bi bi-shield-check mb-3" style={{ fontSize: '2rem', color: 'var(--accent)' }}></i>
            <h6 style={{ color: 'var(--text)' }}>Garantía</h6>
            <p className="small" style={{ color: 'var(--muted)' }}>
              30 días de garantía en productos
            </p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="text-center">
            <i className="bi bi-headset mb-3" style={{ fontSize: '2rem', color: 'var(--accent)' }}></i>
            <h6 style={{ color: 'var(--text)' }}>Soporte 24/7</h6>
            <p className="small" style={{ color: 'var(--muted)' }}>
              Atención al cliente especializada
            </p>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Ofertas;