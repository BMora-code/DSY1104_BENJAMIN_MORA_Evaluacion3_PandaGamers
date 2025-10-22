import React, { useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";

const Header = () => {
  const { cart } = useContext(CartContext);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const totalItems = cart.reduce((acc, item) => acc + item.cantidad, 0);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Añadir override CSS para evitar el fondo blanco en hover/focus de los dropdown-items
  const dropdownOverride = `
    /* Menú acorde al tema */
    .dropdown-menu {
      background: var(--surface) !important;
      border: 1px solid var(--border) !important;
      padding: 0.25rem;
      min-width: 180px;
    }

    /* Estado normal de los items: transparente y sin sombra */
    .dropdown-menu .dropdown-item {
      background: transparent !important;
      color: var(--text) !important;
      border-radius: 6px;
      transition: background 180ms ease, transform 140ms ease, color 160ms ease;
      box-shadow: none !important;
      padding: 0.45rem 0.6rem;
    }

    /* Hover/focus más notable: fondo más opaco, desplazamiento y sombra reforzada */
    .dropdown-menu .dropdown-item:hover,
    .dropdown-menu .dropdown-item:focus {
      background: rgba(57, 255, 20, 0.18) !important; /* más visible */
      color: var(--text) !important;
      transform: translateX(6px);
      box-shadow: 0 8px 20px rgba(0,0,0,0.12);
    }

    /* Efectos hover para enlaces de navegación */
    .nav-link-hover {
      position: relative;
      transition: all 0.3s ease;
      text-decoration: none;
    }

    .nav-link-hover::before {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 0;
      height: 2px;
      background: linear-gradient(90deg, #39FF14, #FFD700);
      transition: width 0.3s ease;
    }

    .nav-link-hover:hover::before,
    .nav-link-hover.active::before {
      width: 100%;
    }

    .nav-link-hover:hover,
    .nav-link-hover.active {
      color: #39FF14 !important;
      text-shadow: 0 0 10px rgba(57, 255, 20, 0.5);
      transform: translateY(-2px);
    }
  `;

  return (
    <>
      {/* Inyecta estilos locales con mayor prioridad */}
      <style>{dropdownOverride}</style>

      <header className="site-header">
        <div className="container nav-bar">
          <Link className="brand" to="/" aria-label="Ir al inicio">
            <img
              src="/images/Logo Empresa/panda-gamers-esport-mascot-logo-vector.jpg"
              alt="PandaGamers Logo"
              className="logo"
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                objectFit: 'cover',
                marginRight: '10px',
                border: '2px solid #39FF14',
                boxShadow: '0 0 10px rgba(57, 255, 20, 0.3)'
              }}
            />
            <span>PandaGamers</span>
          </Link>
          <nav className="primary-nav" aria-label="Principal">
            <ul className="menu">
              <li><Link to="/" className={`nav-link-hover ${location.pathname === '/' ? 'active' : ''}`} {...(location.pathname === '/' ? {'aria-current': 'page'} : {})}>Inicio</Link></li>
              <li><Link to="/productos" className={`nav-link-hover ${location.pathname === '/productos' ? 'active' : ''}`} {...(location.pathname === '/productos' ? {'aria-current': 'page'} : {})}>Productos</Link></li>
              <li><Link to="/ofertas" className={`nav-link-hover ${location.pathname === '/ofertas' ? 'active' : ''}`} {...(location.pathname === '/ofertas' ? {'aria-current': 'page'} : {})}>Ofertas</Link></li>
              <li><Link to="/blog" className={`nav-link-hover ${location.pathname === '/blog' ? 'active' : ''}`} {...(location.pathname === '/blog' ? {'aria-current': 'page'} : {})}>Blogs</Link></li>
              <li><Link to="/contacto" className={`nav-link-hover ${location.pathname === '/contacto' ? 'active' : ''}`} {...(location.pathname === '/contacto' ? {'aria-current': 'page'} : {})}>Contacto</Link></li>
              <li><Link to="/carrito" className={`nav-link-hover ${location.pathname === '/carrito' ? 'active' : ''}`} {...(location.pathname === '/carrito' ? {'aria-current': 'page'} : {})}>Carrito</Link></li>
            </ul>
          </nav>
          <div className="actions">
            <span id="userArea">
              {user ? (
                <div className="dropdown">
                  <button className="btn-neon dropdown-toggle" type="button" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                    👤 {user.username}
                  </button>
                  <ul className="dropdown-menu" aria-labelledby="userDropdown" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                    {user.role === 'admin' && (
                      <li><Link className="dropdown-item" to="/admin" style={{ color: 'var(--text)' }}>
                        <i className="bi bi-gear me-2"></i>
                        Panel Admin
                      </Link></li>
                    )}
                    <li><button className="dropdown-item" onClick={handleLogout} style={{ color: 'var(--text)' }}>
                      <i className="bi bi-box-arrow-right me-2"></i>
                      Cerrar Sesión
                    </button></li>
                  </ul>
                </div>
              ) : (
                <Link to="/login" className="btn-neon">👤 Usuario</Link>
              )}
            </span>
            <Link to="/carrito" className="btn-neon btn-icon" aria-label="Ir al carrito" style={{ fontSize: '1rem', padding: '0.5rem', whiteSpace: 'nowrap' }}>
              🛒 <span className="badge" id="cart-count" aria-live="polite">{totalItems}</span>
            </Link>
            <Link to="/mis-compras" className="btn-neon" aria-label="Mis compras" style={{ display: user ? 'inline-block' : 'none', fontSize: '0.8rem', padding: '0.4rem 0.6rem', marginLeft: '0.5rem', whiteSpace: 'nowrap' }}>
              📋 Mis compras
            </Link>
            <summary className="nav-toggle" role="button" aria-label="Abrir menú">☰</summary>
          </div>
          <details className="nav-drawer">
            <summary className="sr-only">Abrir menú</summary>
            <div className="drawer" role="navigation" aria-label="Menú móvil">
              <ul className="menu">
                <li><Link to="/" className={`nav-link-hover ${location.pathname === '/' ? 'active' : ''}`} {...(location.pathname === '/' ? {'aria-current': 'page'} : {})}>Inicio</Link></li>
                <li><Link to="/productos" className={`nav-link-hover ${location.pathname === '/productos' ? 'active' : ''}`} {...(location.pathname === '/productos' ? {'aria-current': 'page'} : {})}>Productos</Link></li>
                <li><Link to="/ofertas" className={`nav-link-hover ${location.pathname === '/ofertas' ? 'active' : ''}`} {...(location.pathname === '/ofertas' ? {'aria-current': 'page'} : {})}>Ofertas</Link></li>
                <li><Link to="/blog" className={`nav-link-hover ${location.pathname === '/blog' ? 'active' : ''}`} {...(location.pathname === '/blog' ? {'aria-current': 'page'} : {})}>Blogs</Link></li>
                <li><Link to="/contacto" className={`nav-link-hover ${location.pathname === '/contacto' ? 'active' : ''}`} {...(location.pathname === '/contacto' ? {'aria-current': 'page'} : {})}>Contacto</Link></li>
                <li><Link to="/carrito" className={`nav-link-hover ${location.pathname === '/carrito' ? 'active' : ''}`} {...(location.pathname === '/carrito' ? {'aria-current': 'page'} : {})}>Carrito</Link></li>
              </ul>
            </div>
          </details>
        </div>
      </header>
    </>
  );
};

export default Header;
