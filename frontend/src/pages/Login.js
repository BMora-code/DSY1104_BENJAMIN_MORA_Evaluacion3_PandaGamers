import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true); // true = login, false = register
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("user");
  const [adminCode, setAdminCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login, register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (isLogin) {
        // Login via backend
        try {
          await login({ email, password });
          navigate("/");
        } catch (err) {
          console.error('Login error', err);
          const msg = err?.response?.data?.message || 'Credenciales incorrectas. Inténtalo de nuevo.';
          setError(msg);
        }
      } else {
        // Register
        if (!name.trim()) {
          setError("El nombre es requerido.");
          setIsLoading(false);
          return;
        }

        if (password !== confirmPassword) {
          setError("Las contraseñas no coinciden.");
          setIsLoading(false);
          return;
        }

        if (password.length < 6) {
          setError("La contraseña debe tener al menos 6 caracteres.");
          setIsLoading(false);
          return;
        }

        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          setError("Por favor ingresa un email válido.");
          setIsLoading(false);
          return;
        }

        // Register via backend

        // Validar código de admin si es admin
        if (role === "admin") {
          if (adminCode !== "123456789") {
            setError("Código de administrador inválido.");
            setIsLoading(false);
            return;
          }
        }

        try {
          await register({ nombre: name.trim(), email, password, role });
          setError("");
          alert("Usuario registrado exitosamente. Ahora puedes iniciar sesión.");
          setIsLogin(true);
          setConfirmPassword("");
        } catch (err) {
          console.error('Register error', err);
          const msg = err?.response?.data?.message || 'Error al registrar usuario. Inténtalo de nuevo.';
          setError(msg);
        }
      }
    } catch (err) {
      setError("Error en la operación. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', color: 'var(--text)', paddingTop: '10rem' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card shadow" style={{ background: 'var(--surface)', border: '2px solid var(--accent)', color: 'var(--text)' }}>
              <div className="card-body">
                <h2 className="card-title text-center mb-4" style={{ color: 'var(--text)', fontFamily: 'var(--font-head)' }}>
                  {isLogin ? "Iniciar Sesión" : "Registrarse"}
                </h2>

                {error && (
                  <div className="alert alert-danger" role="alert" style={{ background: 'var(--surface)', border: '1px solid #FF4500', color: 'var(--text)' }}>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                   {!isLogin && (
                     <div className="mb-3">
                       <label htmlFor="name" className="form-label" style={{ color: 'var(--text)' }}>Nombre</label>
                       <input
                         type="text"
                         className="form-control"
                         id="name"
                         value={name}
                         onChange={(e) => setName(e.target.value)}
                         required
                         placeholder="Ingresa tu nombre completo"
                         style={{ background: 'var(--surface)', border: '2px solid var(--accent)', color: 'var(--text)' }}
                       />
                     </div>
                   )}
                   <div className="mb-3">
                     <label htmlFor="email" className="form-label" style={{ color: 'var(--text)' }}>Email</label>
                     <input
                       type="email"
                       className="form-control"
                       id="email"
                       value={email}
                       onChange={(e) => setEmail(e.target.value)}
                       required
                       placeholder="Ingresa tu email"
                       style={{ background: 'var(--surface)', border: '2px solid var(--accent)', color: 'var(--text)' }}
                     />
                   </div>

                  <div className="mb-3">
                    <label htmlFor="password" className="form-label" style={{ color: 'var(--text)' }}>Contraseña</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Ingresa tu contraseña"
                      style={{ background: 'var(--surface)', border: '2px solid var(--accent)', color: 'var(--text)' }}
                    />
                  </div>

                  {!isLogin && (
                    <>
                      <div className="mb-3">
                        <label htmlFor="confirmPassword" className="form-label" style={{ color: 'var(--text)' }}>Confirmar Contraseña</label>
                        <input
                          type="password"
                          className="form-control"
                          id="confirmPassword"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          placeholder="Confirma tu contraseña"
                          style={{ background: 'var(--surface)', border: '2px solid var(--accent)', color: 'var(--text)' }}
                        />
                      </div>

                      {role === "admin" && (
                        <div className="mb-3">
                          <label htmlFor="adminCode" className="form-label" style={{ color: 'var(--text)' }}>Código de Administrador</label>
                          <input
                            type="password"
                            className="form-control"
                            id="adminCode"
                            value={adminCode}
                            onChange={(e) => setAdminCode(e.target.value)}
                            required
                            placeholder="Ingresa el código de administrador"
                            style={{ background: 'var(--surface)', border: '2px solid var(--accent)', color: 'var(--text)' }}
                          />
                        </div>
                      )}
                    </>
                  )}

                  <div className="d-grid">
                    <button
                      type="submit"
                      className="btn-neon"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          {isLogin ? "Iniciando sesión..." : "Registrando..."}
                        </>
                      ) : (
                        isLogin ? "Iniciar Sesión" : "Registrarse"
                      )}
                    </button>
                  </div>
                </form>

                <div className="text-center mt-3">
                  <button
                    className="btn btn-link p-0"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setError("");
                      setName("");
                      setEmail("");
                      setPassword("");
                      setConfirmPassword("");
                      setRole("user");
                      setAdminCode("");
                      // Si hay código de admin, mostrar campos de admin
                      if (adminCode) {
                        setRole("admin");
                      }
                    }}
                    style={{ color: 'var(--accent)' }}
                  >
                    {isLogin ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
