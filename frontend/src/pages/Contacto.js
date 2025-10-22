import React, { useState } from "react";

const Contacto = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    mensaje: ""
  });

  const [errors, setErrors] = useState({
    nombre: "",
    email: "",
    mensaje: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar error cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio";
    }

    if (!formData.email.trim()) {
      newErrors.email = "El correo electrónico es obligatorio";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El correo electrónico no es válido";
    }

    if (!formData.mensaje.trim()) {
      newErrors.mensaje = "El mensaje es obligatorio";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Aquí iría la lógica para enviar el formulario
      alert("Mensaje enviado correctamente. ¡Gracias por contactarnos!");
      setFormData({
        nombre: "",
        email: "",
        mensaje: ""
      });
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(270deg, #000000, #0d1f4a, #000000)',
      backgroundSize: '600% 600%',
      animation: 'bgMove 20s ease infinite',
      minHeight: '100vh',
      color: 'var(--text)'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <section style={{
          padding: 'clamp(2rem, 6vw, 4rem) 0',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontFamily: 'var(--font-head)',
            lineHeight: '1.15',
            fontSize: 'clamp(1.8rem, 4vw, 3rem)',
            margin: '0 0 .5rem',
            color: 'var(--text)'
          }}>
            Contáctanos
          </h1>
          <p style={{
            color: 'var(--muted)',
            fontSize: 'clamp(1rem, 2vw, 1.125rem)',
            margin: '0 0 1.25rem'
          }}>
            ¿Tienes dudas o comentarios? ¡Escríbenos!
          </p>
        </section>

        <section>
          <form
            onSubmit={handleSubmit}
            style={{
              backgroundColor: '#1a1f3a',
              padding: '2rem',
              borderRadius: '16px',
              boxShadow: '0 0 12px #1E90FF, 0 0 24px rgba(57,255,20,.3)',
              maxWidth: '600px',
              margin: '0 auto'
            }}
            noValidate
          >
            <label
              htmlFor="nombre"
              style={{
                display: 'block',
                marginBottom: '0.25rem',
                fontWeight: 'bold',
                marginTop: '1rem',
                color: 'var(--text)'
              }}
            >
              Nombre:
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                backgroundColor: '#0f172a',
                color: 'white',
                fontSize: '1rem'
              }}
            />
            <span
              style={{
                color: '#FF4F4F',
                fontSize: '0.875rem',
                marginTop: '0.25rem',
                display: 'block',
                height: '1rem'
              }}
            >
              {errors.nombre}
            </span>

            <label
              htmlFor="email"
              style={{
                display: 'block',
                marginBottom: '0.25rem',
                fontWeight: 'bold',
                marginTop: '1rem',
                color: 'var(--text)'
              }}
            >
              Correo electrónico:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                backgroundColor: '#0f172a',
                color: 'white',
                fontSize: '1rem'
              }}
            />
            <span
              style={{
                color: '#FF4F4F',
                fontSize: '0.875rem',
                marginTop: '0.25rem',
                display: 'block',
                height: '1rem'
              }}
            >
              {errors.email}
            </span>

            <label
              htmlFor="mensaje"
              style={{
                display: 'block',
                marginBottom: '0.25rem',
                fontWeight: 'bold',
                marginTop: '1rem',
                color: 'var(--text)'
              }}
            >
              Mensaje:
            </label>
            <textarea
              id="mensaje"
              name="mensaje"
              rows="5"
              value={formData.mensaje}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                backgroundColor: '#0f172a',
                color: 'white',
                fontSize: '1rem',
                resize: 'vertical'
              }}
            />
            <span
              style={{
                color: '#FF4F4F',
                fontSize: '0.875rem',
                marginTop: '0.25rem',
                display: 'block',
                height: '1rem'
              }}
            >
              {errors.mensaje}
            </span>

            <button
              type="submit"
              className="btn-neon"
              style={{ marginTop: '1.5rem' }}
            >
              Enviar mensaje
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Contacto;