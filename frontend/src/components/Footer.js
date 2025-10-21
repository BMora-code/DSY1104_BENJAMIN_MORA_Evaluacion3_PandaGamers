import React from "react";

const Footer = () => (
  <footer className="bg-dark text-light mt-5 py-4">
    <div className="container">
      <div className="row">
        <div className="col-lg-6 mb-3">
          <h5 className="text-primary mb-3">PandaGamer</h5>
          <p className="mb-0">
            Tu tienda en línea de confianza. Encuentra productos de calidad con la mejor experiencia de compra.
          </p>
        </div>

        <div className="col-lg-6 mb-3">
          <h6 className="mb-3">Contacto</h6>
          <ul className="list-unstyled">
            <li className="mb-2">
              <i className="bi bi-envelope me-2"></i>
              contacto@tiendareact.com
            </li>
            <li className="mb-2">
              <i className="bi bi-telephone me-2"></i>
              +56 9 1234 5678
            </li>
            <li className="mb-2">
              <i className="bi bi-geo-alt me-2"></i>
              Santiago, Chile
            </li>
          </ul>
        </div>
      </div>

      <hr className="my-4" />

      <div className="row align-items-center">
        <div className="col-md-6">
          <p className="mb-0">
            © 2025 Benjamin Mora - Evaluación 2. Todos los derechos reservados.
          </p>
        </div>
        <div className="col-md-6 text-md-end">
          <div className="social-links">
            <a href="#" className="text-light me-3" title="Facebook">
              <i className="bi bi-facebook"></i>
            </a>
            <a href="#" className="text-light me-3" title="Twitter">
              <i className="bi bi-twitter"></i>
            </a>
            <a href="#" className="text-light me-3" title="Instagram">
              <i className="bi bi-instagram"></i>
            </a>
            <a href="#" className="text-light" title="LinkedIn">
              <i className="bi bi-linkedin"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
