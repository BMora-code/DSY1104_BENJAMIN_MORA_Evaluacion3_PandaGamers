import React from "react";
import { Link } from "react-router-dom";

const Conocenos = () => {
  return (
    <div style={{ minHeight: '100vh', color: 'var(--text)' }}>
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 style={{ color: 'var(--text)', fontFamily: 'var(--font-head)' }}>
            <i className="bi bi-building me-2"></i>
            Conócenos
          </h2>
          <Link to="/" className="btn btn-outline-primary">
            <i className="bi bi-house me-1"></i>
            Volver al Inicio
          </Link>
        </div>

        <div className="row">
          <div className="col-lg-6 mb-4">
            <div className="card" style={{ background: 'var(--surface)', border: '2px solid var(--border)', color: 'var(--text)' }}>
              <div className="card-body">
                <h3 className="card-title" style={{ color: 'var(--text)', fontFamily: 'var(--font-head)' }}>
                  Nuestra Historia
                </h3>
                <p className="card-text" style={{ color: 'var(--muted)' }}>
                  PandaGamers nació en 2020 en el corazón de Santiago de Chile, con la visión de crear un espacio donde los gamers pudieran encontrar todo lo necesario para su setup perfecto. Lo que comenzó como una pequeña tienda online se ha convertido en el destino preferido para gamers de todo Chile.
                </p>
                <p className="card-text" style={{ color: 'var(--muted)' }}>
                  Nuestro nombre, PandaGamers, refleja nuestra filosofía: ser amigables y accesibles como un panda, pero feroces y apasionados por los videojuegos como verdaderos gamers. Cada producto que ofrecemos ha sido seleccionado con cuidado para garantizar la mejor calidad y experiencia de juego.
                </p>
                <p className="card-text" style={{ color: 'var(--muted)' }}>
                  Desde nuestros humildes comienzos, hemos crecido gracias a nuestra comunidad de gamers que nos han acompañado en este viaje. Hoy, somos más que una tienda; somos una familia de gamers comprometidos con la excelencia y la innovación en el mundo del gaming.
                </p>
              </div>
            </div>
          </div>

          <div className="col-lg-6 mb-4">
            <div className="card" style={{ background: 'var(--surface)', border: '2px solid var(--border)', color: 'var(--text)' }}>
              <div className="card-body">
                <h3 className="card-title" style={{ color: 'var(--text)', fontFamily: 'var(--font-head)' }}>
                  Nuestra Misión
                </h3>
                <p className="card-text" style={{ color: 'var(--muted)' }}>
                  En PandaGamers, nuestra misión es democratizar el acceso a la mejor tecnología gaming, ofreciendo productos de alta calidad a precios competitivos. Creemos que todos los gamers merecen tener acceso a equipos que potencien su experiencia de juego.
                </p>
                <p className="card-text" style={{ color: 'var(--muted)' }}>
                  Nos comprometemos a proporcionar un servicio excepcional, asesoramiento experto y soporte continuo a nuestros clientes. Cada compra no es solo una transacción, sino el inicio de una relación duradera con nuestra comunidad gaming.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-6 mb-4">
            <div className="card" style={{ background: 'var(--surface)', border: '2px solid var(--border)', color: 'var(--text)' }}>
              <div className="card-body">
                <h3 className="card-title" style={{ color: 'var(--text)', fontFamily: 'var(--font-head)' }}>
                  Nuestros Valores
                </h3>
                <ul style={{ color: 'var(--muted)' }}>
                  <li><strong style={{ color: 'var(--accent)' }}>Calidad:</strong> Solo ofrecemos productos de las mejores marcas y con garantía oficial.</li>
                  <li><strong style={{ color: 'var(--accent)' }}>Pasión:</strong> Somos gamers apasionados que entienden las necesidades reales de la comunidad.</li>
                  <li><strong style={{ color: 'var(--accent)' }}>Innovación:</strong> Siempre estamos al día con las últimas tendencias y tecnologías gaming.</li>
                  <li><strong style={{ color: 'var(--accent)' }}>Comunidad:</strong> Construimos y apoyamos la comunidad gaming chilena.</li>
                  <li><strong style={{ color: 'var(--accent)' }}>Sostenibilidad:</strong> Promovemos prácticas responsables y productos duraderos.</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="col-lg-6 mb-4">
            <div className="card" style={{ background: 'var(--surface)', border: '2px solid var(--border)', color: 'var(--text)' }}>
              <div className="card-body text-center">
                <h3 className="card-title mb-4" style={{ color: 'var(--text)', fontFamily: 'var(--font-head)' }}>
                  Nuestra Foto
                </h3>
                <img
                  src="/images/istockphoto-1393796813-612x612.jpg"
                  alt="PandaGamers - Nuestra Empresa"
                  className="img-fluid rounded"
                  style={{
                    maxHeight: '300px',
                    width: '100%',
                    objectFit: 'cover',
                    border: '2px solid var(--accent)',
                    boxShadow: '0 4px 15px rgba(57, 255, 20, 0.3)'
                  }}
                />
                <p className="mt-3" style={{ color: 'var(--muted)', fontSize: '0.9em' }}>
                  Representamos la vanguardia de la tecnología gaming en Chile
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="card" style={{ background: 'var(--surface)', border: '2px solid var(--border)', color: 'var(--text)' }}>
              <div className="card-body text-center">
                <h3 className="card-title" style={{ color: 'var(--text)', fontFamily: 'var(--font-head)' }}>
                  ¿Por qué elegir PandaGamers?
                </h3>
                <div className="row mt-4">
                  <div className="col-md-3 mb-3">
                    <div className="text-center">
                      <i className="bi bi-truck display-4" style={{ color: 'var(--accent)' }}></i>
                      <h5 style={{ color: 'var(--text)' }}>Envío Rápido</h5>
                      <p style={{ color: 'var(--muted)' }}>Entrega en 24-48 horas en Santiago y regiones</p>
                    </div>
                  </div>
                  <div className="col-md-3 mb-3">
                    <div className="text-center">
                      <i className="bi bi-shield-check display-4" style={{ color: 'var(--accent)' }}></i>
                      <h5 style={{ color: 'var(--text)' }}>Garantía Oficial</h5>
                      <p style={{ color: 'var(--muted)' }}>Todos nuestros productos tienen garantía oficial</p>
                    </div>
                  </div>
                  <div className="col-md-3 mb-3">
                    <div className="text-center">
                      <i className="bi bi-headset display-4" style={{ color: 'var(--accent)' }}></i>
                      <h5 style={{ color: 'var(--text)' }}>Soporte Técnico</h5>
                      <p style={{ color: 'var(--muted)' }}>Asesoría especializada y soporte post-venta</p>
                    </div>
                  </div>
                  <div className="col-md-3 mb-3">
                    <div className="text-center">
                      <i className="bi bi-star display-4" style={{ color: 'var(--accent)' }}></i>
                      <h5 style={{ color: 'var(--text)' }}>Calidad Premium</h5>
                      <p style={{ color: 'var(--muted)' }}>Solo productos de las mejores marcas del mercado</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Conocenos;