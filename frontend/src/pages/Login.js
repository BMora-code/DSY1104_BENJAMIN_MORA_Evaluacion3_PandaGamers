import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import dataStore from "../data/dataStore";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true); // true = login, false = register
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (isLogin) {
        // Login
        const user = dataStore.authenticateUser(username, password);

        if (user) {
          login(user);
          navigate("/");
        } else {
          setError("Credenciales incorrectas. Inténtalo de nuevo.");
        }
      } else {
        // Register
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

        // Verificar si el usuario ya existe
        const existingUser = dataStore.getUsers().find(u => u.username === username);
        if (existingUser) {
          setError("El nombre de usuario ya existe.");
          setIsLoading(false);
          return;
        }

        // Crear nuevo usuario
        const newUser = dataStore.createUser({
          username,
          password,
          role: "user"
        });

        if (newUser) {
          setError("");
          alert("Usuario registrado exitosamente. Ahora puedes iniciar sesión.");
          setIsLogin(true);
          setConfirmPassword("");
        } else {
          setError("Error al registrar usuario. Inténtalo de nuevo.");
        }
      }
    } catch (err) {
      setError("Error en la operación. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">
                {isLogin ? "Iniciar Sesión" : "Registrarse"}
              </h2>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">Usuario</label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder="Ingresa tu usuario"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Ingresa tu contraseña"
                  />
                </div>

                {!isLogin && (
                  <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">Confirmar Contraseña</label>
                    <input
                      type="password"
                      className="form-control"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      placeholder="Confirma tu contraseña"
                    />
                  </div>
                )}

                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-primary"
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
                    setUsername("");
                    setPassword("");
                    setConfirmPassword("");
                  }}
                >
                  {isLogin ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
                </button>
              </div>

              {isLogin && (
                <div className="text-center mt-3">
                  <small className="text-muted">
                    Usuario de prueba: admin / admin123<br />
                    Usuario normal: user / user123
                  </small>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
