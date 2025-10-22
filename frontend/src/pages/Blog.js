import React, { useState } from "react";

const Blog = () => {
  const [eventos] = useState([
    {
      titulo: "Torneo PandaGamers 2025",
      descripcion: "Participa en nuestro próximo torneo de juegos de mesa y gana premios exclusivos. Inscripciones abiertas hasta el 30 de septiembre."
    },
    {
      titulo: "Actualización de Stock",
      descripcion: "Hemos recibido nuevos teclados mecánicos, mouses y sillas gamer. ¡Ven a conocer las últimas novedades!"
    },
    {
      titulo: "Evento Stream en Vivo",
      descripcion: "Únete a nuestro stream el viernes y descubre las últimas tendencias de hardware y videojuegos."
    }
  ]);

  const [reseñas, setReseñas] = useState(() => {
    const saved = localStorage.getItem("reseñas");
    return saved ? JSON.parse(saved) : [
      {
        nombre: "Juan P.",
        descripcion: "El mouse ROG es increíble, la precisión y los botones programables han mejorado mi experiencia de juego. Muy recomendable.",
        estrellas: 5
      },
      {
        nombre: "Ana G.",
        descripcion: "Compré el juego de mesa 'Estrategia Extrema' y fue todo un éxito con mis amigos. Gran calidad y diversión asegurada.",
        estrellas: 4
      },
      {
        nombre: "Carlos M.",
        descripcion: "La silla gamer SecretLab es muy cómoda, incluso para largas horas. La recomiendo sin duda.",
        estrellas: 5
      },
      {
        nombre: "María T.",
        descripcion: "Los polerones son cálidos y con un diseño moderno. Me encantó la compra.",
        estrellas: 4
      }
    ];
  });

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    estrellas: "5"
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.nombre.trim() && formData.descripcion.trim()) {
      const nuevaReseña = {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim(),
        estrellas: parseInt(formData.estrellas)
      };
      const nuevasReseñas = [nuevaReseña, ...reseñas];
      setReseñas(nuevasReseñas);
      localStorage.setItem("reseñas", JSON.stringify(nuevasReseñas));
      setFormData({ nombre: "", descripcion: "", estrellas: "5" });
    }
  };

  const renderStars = (count) => {
    return "★".repeat(count) + "☆".repeat(5 - count);
  };

  return (
    <div style={{ minHeight: '100vh', color: 'var(--text)' }}>
      <div style={{ maxWidth: '900px', margin: '2rem auto', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        <h2 style={{ fontFamily: 'var(--font-head)', textAlign: 'center', fontSize: '2rem', marginBottom: '1rem', color: 'var(--text)' }}>
          Actualizaciones y Eventos
        </h2>

        <div>
          {eventos.map((evento, index) => (
            <div key={index} style={{
              background: 'var(--surface)',
              padding: '1.5rem 1.8rem',
              borderRadius: 'var(--radius)',
              boxShadow: '0 0 10px #39FF14',
              transition: '0.3s',
              marginBottom: '1.5rem'
            }}>
              <h3 style={{ margin: '0 0 .5rem 0', color: 'var(--primary)' }}>{evento.titulo}</h3>
              <p style={{ margin: '0', color: 'var(--text)' }}>{evento.descripcion}</p>
            </div>
          ))}
        </div>

        <h2 style={{ fontFamily: 'var(--font-head)', textAlign: 'center', fontSize: '2rem', marginBottom: '1rem', color: 'var(--text)' }}>
          Reseñas de Clientes
        </h2>

        <div>
          {reseñas.map((reseña, index) => (
            <div key={index} style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '.5rem',
              background: 'var(--surface)',
              padding: '1rem 1.5rem',
              borderRadius: 'var(--radius)',
              boxShadow: '0 0 8px #0f6ad1',
              transition: '0.3s',
              marginBottom: '1.5rem'
            }}>
              <h3 style={{ margin: '0', color: '#39FF14', fontWeight: 'bold' }}>{reseña.nombre}</h3>
              <div style={{ color: '#FFD700', fontSize: '1rem' }}>{renderStars(reseña.estrellas)}</div>
              <p style={{ margin: '0', color: '#cbd5e1' }}>{reseña.descripcion}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button className="btn-neon" onClick={() => window.location.href = '/productos'}>
            Ver Productos
          </button>
          <button className="btn-neon" style={{ marginLeft: '1rem' }} onClick={() => window.location.href = '/contacto'}>
            Ver Contacto
          </button>
        </div>

        <h2 style={{ fontFamily: 'var(--font-head)', textAlign: 'center', fontSize: '2rem', marginBottom: '1rem', color: 'var(--text)' }}>
          Escribe tu Reseña
        </h2>

        <form onSubmit={handleSubmit} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          maxWidth: '900px',
          margin: '0 auto',
          fontSize: '1rem'
        }}>
          <input
            type="text"
            placeholder="Tu nombre"
            value={formData.nombre}
            onChange={(e) => setFormData({...formData, nombre: e.target.value})}
            required
            style={{
              width: '400px',
              padding: '0.75rem',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--accent)',
              background: 'var(--surface)',
              color: 'var(--text)',
              margin: '0 auto',
              display: 'block'
            }}
          />
          <textarea
            placeholder="Escribe tu reseña"
            value={formData.descripcion}
            onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
            required
            rows="4"
            style={{
              width: '800px',
              maxWidth: '100%',
              minHeight: '250px',
              padding: '1rem',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--accent)',
              background: 'var(--surface)',
              color: 'var(--text)',
              fontSize: '1rem',
              resize: 'vertical',
              display: 'block',
              margin: '0 auto'
            }}
          />
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '.5rem',
            color: 'var(--text)',
            justifyContent: 'center'
          }}>
            Calificación:
            <select
              value={formData.estrellas}
              onChange={(e) => setFormData({...formData, estrellas: e.target.value})}
              required
              style={{
                padding: '0.75rem',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--accent)',
                background: 'var(--surface)',
                color: 'var(--text)',
                marginLeft: '0.5rem'
              }}
            >
              <option value="5">★★★★★</option>
              <option value="4">★★★★☆</option>
              <option value="3">★★★☆☆</option>
              <option value="2">★★☆☆☆</option>
              <option value="1">★☆☆☆☆</option>
            </select>
          </label>
          <button type="submit" className="btn-neon" style={{
            border: '1px solid #39FF14',
            borderRadius: '12px',
            padding: '0.8rem 1.2rem',
            fontSize: '1rem',
            background: 'transparent',
            color: '#39FF14',
            fontWeight: '700',
            textShadow: '0 0 4px rgba(0,0,0,.4)',
            boxShadow: '0 0 8px #39FF14 inset',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            display: 'block',
            margin: '0 auto'
          }}>
            Enviar Reseña
          </button>
        </form>
      </div>
    </div>
  );
};

export default Blog;