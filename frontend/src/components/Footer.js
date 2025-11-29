import React from "react";

const Footer = () => (
  <footer className="site-footer">
    <div className="footer-background"></div>
    <div className="container footer-grid">
      <div>
        <h4>PandaGamers</h4>
        <p>Todo para tu mundo gamer.</p>
      </div>
      <div>
        <h4>Navegación</h4>
        <nav aria-label="Enlaces de pie">
          <ul className="menu" style={{ flexDirection: 'column', gap: '.25rem' }}>
            <li><a href="./">Inicio</a></li>
            <li><a href="./productos">Productos</a></li>
            <li><a href="./blog">Blogs</a></li>
            <li><a href="./contacto">Contacto</a></li>
          </ul>
        </nav>
      </div>
      <div>
        <h4>Contacto</h4>
        <p>contacto@pandagamers.cl<br />+56 9 1234 5678</p>
      </div>
    </div>
  </footer>
);

export default Footer;
