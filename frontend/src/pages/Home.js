import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import dataStore from "../data/dataStore";

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [stats, setStats] = useState({ totalProducts: 0, totalCategories: 0 });

  useEffect(() => {
    // Obtener productos destacados (primeros 3)
    const products = dataStore.getProducts();
    setFeaturedProducts(products.slice(0, 3));

    // Calcular estadísticas
    const categories = [...new Set(products.map(p => p.category))];
    setStats({
      totalProducts: products.length,
      totalCategories: categories.length
    });
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <div className="hero-section bg-primary text-white py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-3">Bienvenido a la Tienda React</h1>
              <p className="lead mb-4">
                Descubre una amplia variedad de productos de calidad con la mejor experiencia de compra en línea.
              </p>
              <Link to="/productos" className="btn btn-light btn-lg">
                Explorar Productos
              </Link>
            </div>
            <div className="col-lg-6">
              <img
                src="/images/shopping-hero.jpg"
                alt="Tienda online"
                className="img-fluid rounded shadow"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/600x400/007bff/ffffff?text=Tienda+React";
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="container py-5">
        <div className="row text-center">
          <div className="col-md-4">
            <div className="stat-card p-4 rounded shadow-sm">
              <h2 className="text-primary">{stats.totalProducts}</h2>
              <p className="mb-0">Productos Disponibles</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="stat-card p-4 rounded shadow-sm">
              <h2 className="text-success">{stats.totalCategories}</h2>
              <p className="mb-0">Categorías</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="stat-card p-4 rounded shadow-sm">
              <h2 className="text-warning">24/7</h2>
              <p className="mb-0">Atención al Cliente</p>
            </div>
          </div>
        </div>
      </div>

      {/* Productos Destacados */}
      <div className="bg-light py-5">
        <div className="container">
          <h2 className="text-center mb-4">Productos Destacados</h2>
          <div className="row">
            {featuredProducts.map(product => (
              <div key={product.id} className="col-lg-4 col-md-6 mb-4">
                <div className="card h-100 shadow-sm">
                  <img
                    src={product.image}
                    className="card-img-top"
                    alt={product.name}
                    style={{ height: '200px', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/300x200/6c757d/ffffff?text=Producto";
                    }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{product.name}</h5>
                    <p className="card-text text-muted">{product.description}</p>
                    <p className="card-text fw-bold text-primary">${product.price}</p>
                    <Link to="/productos" className="btn btn-outline-primary">
                      Ver Más
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <Link to="/productos" className="btn btn-primary btn-lg me-3">
              Ver Todos los Productos
            </Link>
            <Link to="/ofertas" className="btn btn-warning btn-lg">
              <i className="bi bi-percent me-1"></i>
              Ver Ofertas
            </Link>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="container py-5">
        <div className="text-center">
          <h2>¿Listo para comprar?</h2>
          <p className="lead mb-4">
            Regístrate ahora y obtén acceso a ofertas exclusivas y envío gratuito.
          </p>
          <Link to="/login" className="btn btn-success btn-lg me-3">
            Iniciar Sesión
          </Link>
          <Link to="/productos" className="btn btn-outline-success btn-lg">
            Comprar Ahora
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
