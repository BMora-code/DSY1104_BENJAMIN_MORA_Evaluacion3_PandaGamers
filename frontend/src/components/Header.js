import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";

const Header = () => {
  const { cart } = useContext(CartContext);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const totalItems = cart.reduce((acc, item) => acc + item.cantidad, 0);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-white shadow-sm border-bottom">
      <nav className="navbar navbar-expand-lg navbar-light">
        <div className="container">
          {/* Logo y título */}
          <Link to="/" className="navbar-brand d-flex align-items-center">
            <img
              src="/images/Logo Empresa/panda-gamers-esport-mascot-logo-vector.jpg"
              alt="PandaGamers Logo"
              className="me-2"
              style={{ height: '40px', width: 'auto' }}
            />
            <span className="fw-bold text-primary">PandaGamers</span>
          </Link>

          {/* Botón hamburguesa para móviles */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Navegación */}
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link to="/" className="nav-link">
                  <i className="bi bi-house me-1"></i>
                  Inicio
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/productos" className="nav-link">
                  <i className="bi bi-grid me-1"></i>
                  Productos
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/ofertas" className="nav-link">
                  <i className="bi bi-percent me-1"></i>
                  Ofertas
                </Link>
              </li>
            </ul>

            {/* Carrito y autenticación */}
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link to="/carrito" className="nav-link position-relative">
                  <i className="bi bi-cart me-1"></i>
                  Carrito
                  {totalItems > 0 && (
                    <span className="badge bg-danger rounded-pill position-absolute top-0 start-100 translate-middle">
                      {totalItems}
                    </span>
                  )}
                </Link>
              </li>

              {user ? (
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    id="userDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className="bi bi-person-circle me-1"></i>
                    {user.username}
                  </a>
                  <ul className="dropdown-menu" aria-labelledby="userDropdown">
                    {user.role === 'admin' && (
                      <li><Link to="/admin" className="dropdown-item">
                        <i className="bi bi-gear me-2"></i>
                        Panel Admin
                      </Link></li>
                    )}
                    <li><a className="dropdown-item" href="#" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right me-2"></i>
                      Cerrar Sesión
                    </a></li>
                  </ul>
                </li>
              ) : (
                <li className="nav-item">
                  <Link to="/login" className="nav-link">
                    <i className="bi bi-person me-1"></i>
                    Iniciar Sesión
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
