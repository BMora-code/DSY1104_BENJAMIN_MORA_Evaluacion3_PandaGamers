import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import dataStore from "../data/dataStore"; // eslint-disable-line no-unused-vars
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const { agregarAlCarrito } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    // Obtener productos destacados personalizados
    const customFeatured = [
      {
        id: 999,
        name: 'ROG Strix Helios',
        description: 'PC gaming de alto rendimiento con RTX 4090.',
        price: 2500000,
        category: 'Pc Gamers',
        image: '/images/Portada/ROG_Strix_Helios.jpg',
        stock: 2
      },
      {
        id: 998,
        name: 'PS5 Pro',
        description: 'Consola de nueva generación con tecnología de upscaling avanzada.',
        price: 800000,
        category: 'Consolas',
        image: '/images/Portada/la-tecnologia-de-upscaling-de-la-ps5-pro-el-pssr-apunta-a-4k-y-120-fps-o-8k-y-60-fps-cover65f83fecb9b56.jpg',
        stock: 1
      }
    ];
    setFeaturedProducts(customFeatured);
  }, []);

  const categories = [
    { name: "Accesorios", icon: "🎧", link: "/productos?cat=Accesorios" },
    { name: "Consolas", icon: "🎮", link: "/productos?cat=Consolas" },
    { name: "Juegos de mesa", icon: "🎲", link: "/productos?cat=Juegos de mesa" },
    { name: "Mouses", icon: "🖱️", link: "/productos?cat=Mouses" },
    { name: "Pc Gamers", icon: "💻", link: "/productos?cat=Pc Gamers" },
    { name: "Poleras", icon: "👕", link: "/productos?cat=Poleras" },
    { name: "Polerones", icon: "🧥", link: "/productos?cat=Polerones" },
    { name: "Portamouse", icon: "🖼️", link: "/productos?cat=Portamouse" },
    { name: "Sillas", icon: "🪑", link: "/productos?cat=Sillas" },
  ];

  return (
    <div>
      <main id="contenido">
        <section className="hero">
          <div className="container hero-grid">
            <div className="hero-copy">
              {user && user.hasDuocDiscount && (
                <div className="alert alert-success mb-4" style={{ background: 'rgba(57, 255, 20, 0.1)', border: '2px solid var(--accent)', color: 'var(--text)' }}>
                  <i className="bi bi-star-fill me-2"></i>
                  ¡Felicitaciones! Tienes un 20% de descuento DUOC en todos los productos.
                </div>
              )}
              <h1>Tu mundo gamer, a otro nivel</h1>
              <p className="lead">Explora nuestro catálogo y arma tu setup con los mejores productos para gamers.</p>
              <Link to="/productos" className="btn-neon">Ver catálogo</Link>
            </div>
            <div className="hero-visual" aria-hidden="true" style={{
              backgroundImage: `url('/images/Portada/RZR_Product-Trailers_Wallpaper_RazerBasiliskV3_1920x1080.jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              minHeight: '400px',
              width: '100%',
              maxWidth: '800px',
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              margin: '0 auto'
            }}></div>
          </div>
        </section>

        <section className="categories">
          <div className="container">
            <h2 className="section-title">Categorías</h2>
            <ul className="tiles" aria-label="Listado de categorías">
              {categories.map((cat, index) => (
                <li key={index}>
                  <Link className="tile" to={cat.link}>
                    <div className="icon">{cat.icon}</div>
                    <strong>{cat.name}</strong>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="featured">
          <div className="container">
            <h2 className="section-title">Destacados</h2>
            <div className="cards" id="featured-grid">
              {featuredProducts.map(product => (
                <article className="card" key={product.id}>
                  <div className="thumb" style={{ backgroundImage: `url(${product.image})` }}></div>
                  <h3>{product.name}</h3>
                  <p className="muted">{product.description}</p>
                  <div className="actions">
                    <span className="price">${product.price.toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).replace(/\B(?=(\d{3})+(?!\d))/g, '.')} CLP</span>
                    <button className="btn-outline" onClick={() => agregarAlCarrito(product)}>Añadir</button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
