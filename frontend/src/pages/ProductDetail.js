import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import dataStore from "../data/dataStore";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { agregarAlCarrito } = useContext(CartContext);
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
        <div className="col-lg-6">
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

        <div className="col-lg-6">
          <div className="card">
            <div className="card-body">
              <h1 className="card-title mb-3">{product.name}</h1>

              <div className="mb-3">
                <span className="badge bg-primary me-2">{product.category}</span>
                <span className={`badge ${product.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
                  {product.stock > 0 ? `Stock: ${product.stock}` : 'Agotado'}
                </span>
              </div>

              <p className="card-text lead mb-4">{product.description}</p>

              <div className="mb-4">
                <h3 className="text-primary fw-bold">${product.price.toLocaleString('es-CL')}</h3>
              </div>

              {product.stock > 0 && (
                <div className="mb-4">
                  <label className="form-label">Cantidad:</label>
                  <div className="d-flex align-items-center">
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span className="mx-3 fw-bold">{quantity}</span>
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.stock}
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              <div className="d-grid gap-2">
                <button
                  className="btn btn-primary btn-lg"
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                >
                  {product.stock > 0 ? 'Agregar al Carrito' : 'Producto Agotado'}
                </button>

                <button
                  className="btn btn-outline-primary"
                  onClick={() => navigate("/productos")}
                >
                  Continuar Comprando
                </button>
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