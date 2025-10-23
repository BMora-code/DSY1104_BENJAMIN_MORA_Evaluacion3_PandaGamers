import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import dataStore from "../data/dataStore";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { agregarAlCarrito } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cargar producto por ID
    const productData = dataStore.getProductById(parseInt(id));
    setProduct(productData);
    setLoading(false);
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      const cartItem = {
        id: product.id,
        nombre: product.name,
        precio: product.price,
        imagen: product.image,
        cantidad: quantity
      };
      agregarAlCarrito(cartItem);
      alert("Producto agregado al carrito");
    }
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  // Cantidad seleccionada en detalle de producto
  const increment = () => {
    const max = product?.stock ?? Infinity;
    setQuantity(q => Math.min(q + 1, max));
  };
  const decrement = () => setQuantity(q => Math.max(1, q - 1));

  const handleAddToCartWithQuantity = (e) => {
    e?.preventDefault();
    if (!product) return;

    // Verificar si hay usuario activo
    if (!user) {
      alert("Debes iniciar sesión para agregar productos al carrito.");
      return;
    }

    // Usar agregarAlCarrito del contexto con la cantidad seleccionada
    agregarAlCarrito(product, quantity);
    // Mostrar un anuncio personalizado en lugar del alert
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
        <span>${quantity} ${quantity === 1 ? 'unidad' : 'unidades'} de "${product.name}" ${quantity === 1 ? 'agregada' : 'agregadas'} al carrito</span>
        <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: #000; font-size: 18px; cursor: pointer; margin-left: 10px;">×</button>
      </div>
    `;

    // Agregar estilos de animación
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);

    document.body.appendChild(anuncio);

    // Auto-remover después de 4 segundos
    setTimeout(() => {
      if (anuncio.parentElement) {
        anuncio.remove();
      }
    }, 4000);
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <h2>Producto no encontrado</h2>
          <button className="btn btn-primary mt-3" onClick={() => navigate("/productos")}>
            Volver a Productos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <button className="btn btn-link p-0 text-decoration-none" onClick={() => navigate("/")}>
              Inicio
            </button>
          </li>
          <li className="breadcrumb-item">
            <button className="btn btn-link p-0 text-decoration-none" onClick={() => navigate("/productos")}>
              Productos
            </button>
          </li>
          <li className="breadcrumb-item active" aria-current="page">{product.name}</li>
        </ol>
      </nav>

      <div className="row">
        <div className="col-md-5">
          <div className="card">
            <img
              src={product.image}
              className="card-img-top"
              alt={product.name}
              style={{ height: '400px', objectFit: 'cover' }}
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/400x400/6c757d/ffffff?text=Producto";
              }}
            />
          </div>
        </div>
        <div className="col-md-7">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title mb-3">{product.name}</h2>
              <p className="card-text">{product.description}</p>
              <div className="mb-3">
                <span className="badge bg-primary me-2">{product.category}</span>
                <span className={`badge ${product.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
                  {product.stock > 0 ? `Stock: ${product.stock}` : 'Agotado'}
                </span>
              </div>

              <div className="mb-4">
                {user && user.hasDuocDiscount ? (
                  <div>
                    <h5 className="text-muted text-decoration-line-through mb-1">
                      Precio original: ${product.price.toLocaleString('es-CL')}
                    </h5>
                    <h3 className="text-success fw-bold">
                      Precio con descuento DUOC: ${Math.round(product.price * 0.8).toLocaleString('es-CL')} (20% OFF)
                    </h3>
                  </div>
                ) : (
                  <h3 className="text-primary fw-bold">${product.price.toLocaleString('es-CL')}</h3>
                )}
              </div>

              {/* Selector de cantidad + botón agregar con la cantidad seleccionada */}
              <div className="d-flex align-items-center gap-2 my-3">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                  onClick={decrement}
                  aria-label="Disminuir cantidad"
                  disabled={quantity <= 1}
                >
                  −
                </button>

                <input
                  type="text"
                  readOnly
                  value={quantity}
                  className="form-control text-center"
                  style={{ width: '60px' }}
                  aria-label="Cantidad seleccionada"
                />

                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                  onClick={increment}
                  aria-label="Aumentar cantidad"
                  disabled={product && typeof product.stock !== 'undefined' && quantity >= product.stock}
                >
                  +
                </button>

                <button
                  type="button"
                  className="btn-neon ms-2"
                  onClick={handleAddToCartWithQuantity}
                  disabled={product && product.stock <= 0}
                >
                  Agregar al carrito
                </button>
              </div>

              <div style={{ marginTop: '1.5rem' }}>
                <small style={{ color: 'var(--muted)' }}>Stock: {product.stock}</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Productos relacionados */}
      <div className="mt-5">
        <h3 className="mb-4">Productos Relacionados</h3>
        <div className="row">
          {dataStore.getProductsByCategory(product.category)
            .filter(p => p.id !== product.id)
            .slice(0, 3)
            .map(relatedProduct => (
              <div key={relatedProduct.id} className="col-lg-4 col-md-6 mb-4">
                <div className="card h-100">
                  <img
                    src={relatedProduct.image}
                    className="card-img-top"
                    alt={relatedProduct.name}
                    style={{ height: '200px', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/300x200/6c757d/ffffff?text=Producto";
                    }}
                  />
                  <div className="card-body">
                    <h6 className="card-title">{relatedProduct.name}</h6>
                    <p className="card-text text-primary fw-bold">${relatedProduct.price.toLocaleString('es-CL')}</p>
                    <button
                      className="btn btn-outline-primary w-100"
                      onClick={() => navigate(`/productos/${relatedProduct.id}`)}
                    >
                      Ver Detalles
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;