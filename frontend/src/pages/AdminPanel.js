import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import dataStore from "../data/dataStore";

const AdminPanel = () => {
  const { user } = useContext(AuthContext);
  const { cart } = useContext(CartContext); // eslint-disable-line no-unused-vars
  const navigate = useNavigate();
  // Restaurar pestaña activa desde localStorage si existe, por defecto "dashboard"
  const [activeTab, setActiveTab] = useState(() => {
    try {
      return localStorage.getItem("adminActiveTab") || "dashboard";
    } catch (e) {
      return "dashboard";
    }
  });
  // Wrapper para setear pestaña y persistirla
  const setTab = (tab) => {
    setActiveTab(tab);
    try { localStorage.setItem("adminActiveTab", tab); } catch (e) { /* ignore */ }
  };
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [ofertas, setOfertas] = useState([]);
  // Estado para usuario restaurado desde localStorage (fallback durante refresh)
  const [restoredUser, setRestoredUser] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingOferta, setEditingOferta] = useState(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  const [showOfertaForm, setShowOfertaForm] = useState(false);

  // Form states
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    image: ""
  });

  const [userForm, setUserForm] = useState({
    username: "",    // se muestra como "Nombre" en el formulario pero sigue almacenándose en username
    email: "",
    password: "",
    confirmPassword: "",
    role: "user"
  });

  const [userSearch, setUserSearch] = useState("");
  const [adminSearch, setAdminSearch] = useState("");

  const [ofertaForm, setOfertaForm] = useState({
    productId: "",
    discount: ""
  });

  // Indica si hay algún rastro de sesión en localStorage (token/usuario)
  const persistedExists = !!(
    localStorage.getItem('auth_user') ||
    localStorage.getItem('user') ||
    localStorage.getItem('authUser') ||
    localStorage.getItem('token') ||
    localStorage.getItem('authToken')
  );

  // Restaurar usuario persistido (si existe) al montar
  useEffect(() => {
    const stored = localStorage.getItem('auth_user') || localStorage.getItem('user') || localStorage.getItem('authUser');
    if (stored) {
      try {
        setRestoredUser(JSON.parse(stored));
      } catch (err) {
        // Si no es JSON (p.ej. solo token), no podemos extraer usuario -> dejamos null
        setRestoredUser(null);
      }
    }
  }, []);

  useEffect(() => {
    // Si no hay usuario en contexto:
    if (!user) {
      // Si tampoco hay persistencia -> redirigir a login
      if (!persistedExists) {
        navigate("/login");
        return;
      }
      // Hay persistencia -> esperar a que AuthContext restaure el usuario.
      // No redirigimos aquí; el componente mostrará "Cargando..." hasta que user exista.
      return;
    }

    // Si el usuario existe pero no es admin -> redirigir al inicio
    if (user.role !== 'admin') {
      navigate("/");
      return;
    }

    // Usuario admin presente -> cargar datos
    loadData();
  }, [user, navigate, persistedExists]);

  const loadData = () => {
    setProducts(dataStore.getProducts());
    setUsers(dataStore.getUsers());
    setOrders(dataStore.getOrders());
    setOfertas(dataStore.getOfertas());
  };

  const handleProductSubmit = (e) => {
    e.preventDefault();

    let productData;

    if (editingProduct) {
      // Al editar, solo actualizar los campos editables (name, description, price, category)
      // Mantener stock e image del producto original
      productData = {
        name: productForm.name,
        description: productForm.description,
        price: parseFloat(productForm.price),
        category: productForm.category,
        stock: editingProduct.stock, // Mantener stock original
        image: editingProduct.image // Mantener imagen original
      };
    } else {
      // Al crear, incluir todos los campos
      productData = {
        ...productForm,
        price: parseFloat(productForm.price),
        stock: parseInt(productForm.stock)
      };
    }

    if (editingProduct) {
      dataStore.updateProduct(editingProduct.id, productData);
      // Actualizar el estado local inmediatamente para reflejar el cambio
      setProducts(prevProducts =>
        prevProducts.map(p =>
          p.id === editingProduct.id ? { ...p, ...productData } : p
        )
      );
    } else {
      const newProduct = dataStore.createProduct(productData);
      // Agregar el nuevo producto al estado local
      setProducts(prevProducts => [...prevProducts, newProduct]);
    }

    resetProductForm();

    // Notificar a otras partes de la app que los productos cambiaron
    window.dispatchEvent(new CustomEvent('productsUpdated'));
  };

  const resetProductForm = () => {
    setProductForm({
      name: "",
      description: "",
      price: "",
      category: "",
      stock: "",
      image: ""
    });
    setEditingProduct(null);
    setShowProductForm(false);
  };

  const handleUserSubmit = (e) => {
    e.preventDefault();

    // Validar confirmación de contraseña
    if (userForm.password !== userForm.confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    // Crear usuario (se envía username como 'nombre' mostrado)
    dataStore.createUser({
      username: userForm.username,
      email: userForm.email,
      password: userForm.password,
      role: userForm.role
    });

    loadData();
    resetUserForm();
  };

  const resetUserForm = () => {
    setUserForm({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "user"
    });
    setShowUserForm(false);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      stock: product.stock.toString(),
      image: product.image
    });
    setShowProductForm(true);
    // Desplazar automáticamente al formulario de producto
    setTimeout(() => {
      const formElement = document.querySelector('.card.mb-4');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este producto?")) {
      dataStore.deleteProduct(id);
      loadData();

      // Notificar a otras partes de la app que los productos cambiaron
      window.dispatchEvent(new CustomEvent('productsUpdated'));
    }
  };

  const handleDeleteUser = (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este usuario?")) {
      dataStore.deleteUser(id);
      loadData();
    }
  };

  const handleDeleteOrder = (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta orden?")) {
      dataStore.deleteOrder(id);
      loadData();
      // Notificar a otras partes de la app que las órdenes cambiaron
      window.dispatchEvent(new CustomEvent('ordersUpdated'));
    }
  };

  const handleOfertaSubmit = (e) => {
    e.preventDefault();

    const product = products.find(p => p.id === parseInt(ofertaForm.productId));
    if (!product) {
      alert(`Producto con ID ${ofertaForm.productId} no encontrado. Verifica que el ID sea correcto.`);
      return;
    }

    const discount = parseInt(ofertaForm.discount);
    const price = product.price * (1 - discount / 100);

    const ofertaData = {
      productId: parseInt(ofertaForm.productId),
      discount: discount,
      price: price,
      originalPrice: product.price,
      productName: product.name,
      productDescription: product.description,
      productCategory: product.category,
      productImage: product.image,
      productStock: product.stock
    };

    if (editingOferta) {
      dataStore.updateOferta(editingOferta.id, ofertaData);
    } else {
      dataStore.createOferta(ofertaData);
    }

    // Forzar recarga de datos inmediatamente
    loadData();
    resetOfertaForm();

    // Disparar evento personalizado para actualizar otras páginas
    window.dispatchEvent(new CustomEvent('ofertasUpdated'));
  };

  const resetOfertaForm = () => {
    setOfertaForm({
      productId: "",
      discount: ""
    });
    setEditingOferta(null);
    setShowOfertaForm(false);
  };

  const handleEditOferta = (oferta) => {
    setEditingOferta(oferta);
    setOfertaForm({
      productId: oferta.productId.toString(),
      discount: oferta.discount.toString()
    });
    setShowOfertaForm(true);
  };

  const handleDeleteOferta = (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta oferta?")) {
      dataStore.deleteOferta(id);
      loadData();
    }
  };

  // Mostrar mientras se restaura el usuario (si existe persistencia)
  if (!user) {
    // Si no hay persistencia, la useEffect anterior ya habrá redirigido a /login
    // Si hay persistencia, esperar a que AuthContext restaure el usuario
    return <div>Cargando...</div>;
  }

  return (
    <div className="container mt-4 admin-panel">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 style={{ fontFamily: 'var(--font-head)', color: 'var(--text)' }}>Panel de Administración</h1>
        <button className="btn-neon" onClick={() => navigate("/")}>
          Volver al Inicio
        </button>
      </div>

      {/* Tabs de navegación */}
      <ul className="nav nav-tabs mb-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={() => setTab("dashboard")}
            style={activeTab === "dashboard" ? { background: 'var(--primary)', color: 'var(--primary-contrast)' } : { color: 'var(--text)' }}
          >
            <i className="bi bi-speedometer2 me-1"></i>
            Dashboard
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "products" ? "active" : ""}`}
            onClick={() => setTab("products")}
            style={activeTab === "products" ? { background: 'var(--primary)', color: 'var,--primary-contrast' } : { color: 'var(--text)' }}
          >
            <i className="bi bi-box-seam me-1"></i>
            Productos
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setTab("users")}
            style={activeTab === "users" ? { background: 'var(--primary)', color: 'var,--primary-contrast' } : { color: 'var(--text)' }}
          >
            <i className="bi bi-people me-1"></i>
            Usuarios
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => setTab("orders")}
            style={activeTab === "orders" ? { background: 'var(--primary)', color: 'var,--primary-contrast' } : { color: 'var(--text)' }}
          >
            <i className="bi bi-receipt me-1"></i>
            Órdenes
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "ofertas" ? "active" : ""}`}
            onClick={() => setTab("ofertas")}
            style={activeTab === "ofertas" ? { background: 'var(--primary)', color: 'var(--primary-contrast)' } : { color: 'var(--text)' }}
          >
            <i className="bi bi-percent me-1"></i>
            Ofertas
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "stock" ? "active" : ""}`}
            onClick={() => setTab("stock")}
            style={activeTab === "stock" ? { background: 'var(--primary)', color: 'var(--primary-contrast)' } : { color: 'var(--text)' }}
          >
            <i className="bi bi-boxes me-1"></i>
            Stock
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "admins" ? "active" : ""}`}
            onClick={() => setTab("admins")}
            style={activeTab === "admins" ? { background: 'var(--primary)', color: 'var(--primary-contrast)' } : { color: 'var(--text)' }}
          >
            <i className="bi bi-shield me-1"></i>
            Administradores
          </button>
        </li>
      </ul>

      {/* Contenido de las tabs */}
      {activeTab === "dashboard" && (
        <div>
          <h3>Dashboard Administrativo</h3>

          {/* Estadísticas principales */}
          <div className="row mb-4">
            <div className="col-md-3">
              <div className="card text-center" style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}>
                <div className="card-body">
                  <i className="bi bi-box-seam" style={{ fontSize: '2rem', color: 'var(--accent)' }}></i>
                  <h4 className="card-title" style={{ color: 'var(--text)' }}>{products.length}</h4>
                  <p className="card-text" style={{ color: 'var(--muted)' }}>Total Productos</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-center" style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var,--text' }}>
                <div className="card-body">
                  <i className="bi bi-people" style={{ fontSize: '2rem', color: 'var(--accent)' }}></i>
                  <h4 className="card-title" style={{ color: 'var(--text)' }}>{users.length}</h4>
                  <p className="card-text" style={{ color: 'var(--muted)' }}>Total Usuarios</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-center" style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var,--text' }}>
                <div className="card-body">
                  <i className="bi bi-receipt" style={{ fontSize: '2rem', color: 'var(--accent)' }}></i>
                  <h4 className="card-title" style={{ color: 'var(--text)' }}>{orders.length}</h4>
                  <p className="card-text" style={{ color: 'var(--muted)' }}>Total Órdenes</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-center" style={{ background: 'var(--surface)', border: '1px solid var,--border', color: 'var,--text' }}>
                <div className="card-body">
                  <i className="bi bi-boxes" style={{ fontSize: '2rem', color: 'var(--accent)' }}></i>
                  <h4 className="card-title" style={{ color: 'var(--text)' }}>{products.reduce((total, product) => total + product.stock, 0)}</h4>
                  <p className="card-text" style={{ color: 'var(--muted)' }}>Total Stock</p>
                </div>
              </div>
            </div>
          </div>

          {/* Gráficos y análisis */}
          <div className="row">
            <div className="col-md-6">
              <div className="card" style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}>
                <div className="card-header" style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', color: 'var(--text)' }}>
                  <h5 style={{ color: 'var(--text)' }}>Productos por Categoría</h5>
                </div>
                <div className="card-body">
                  {Object.entries(
                    products.reduce((acc, product) => {
                      acc[product.category] = (acc[product.category] || 0) + 1;
                      return acc;
                    }, {})
                  ).map(([category, count]) => (
                    <div key={category} className="d-flex justify-content-between mb-2">
                      <span style={{ color: 'var(--text)' }}>{category}</span>
                      <span className="badge" style={{
                        color: '#ffffff',
                        fontWeight: 'bold',
                        background: 'transparent',
                        border: 'none'
                      }}>{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card" style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var,--text' }}>
                <div className="card-header" style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', color: 'var,--text' }}>
                  <h5 style={{ color: 'var(--text)' }}>Órdenes Recientes</h5>
                </div>
                <div className="card-body">
                  {orders.slice(-5).reverse().map(order => (
                    <div key={order.id} className="border-bottom pb-2 mb-2" style={{ borderColor: 'var(--border) !important' }}>
                      <small style={{ color: 'var(--muted)' }}>
                        Orden #{order.id} - ${order.total?.toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).replace(/\B(?=(\d{3})+(?!\d))/g, '.') || '0'}
                      </small>
                      <br />
                      <small style={{ color: 'var(--muted)' }}>
                        {new Date(order.date).toLocaleDateString()} - {order.status}
                      </small>
                    </div>
                  ))}
                  {orders.length === 0 && (
                    <p style={{ color: 'var(--muted)' }} className="mb-0">No hay órdenes recientes</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Acciones rápidas */}
          <div className="card mt-4 mb-5" style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var,--text' }}>
            <div className="card-header" style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', color: 'var,--text' }}>
              <h5 style={{ color: 'var(--text)' }}>Acciones Rápidas</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-3">
                  <button
                    className="btn-neon w-100 mb-2"
                    onClick={() => setTab("products")}
                  >
                    <i className="bi bi-plus-circle me-1"></i>
                    Agregar Producto
                  </button>
                </div>
                <div className="col-md-3">
                  <button
                    className="btn-neon w-100 mb-2"
                    onClick={() => navigate("/productos")}
                  >
                    <i className="bi bi-eye me-1"></i>
                    Ver Tienda
                  </button>
                </div>
                <div className="col-md-3">
                  <button
                    className="btn-neon w-100 mb-2"
                    onClick={() => setTab("ofertas")}
                  >
                    <i className="bi bi-percent me-1"></i>
                    Gestionar Ofertas
                  </button>
                </div>
                <div className="col-md-3">
                  <button
                    className="btn-neon w-100 mb-2"
                    onClick={() => setTab("orders")}
                  >
                    <i className="bi bi-receipt me-1"></i>
                    Ver Órdenes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "products" && (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3>Gestión de Productos</h3>
            <button
              className="btn btn-primary"
              onClick={() => {
                if (showProductForm) {
                  setShowProductForm(false);
                } else {
                  resetProductForm();
                  setShowProductForm(true);
                }
              }}
            >
              {showProductForm ? "Cancelar" : "Agregar Producto"}
            </button>
          </div>

          {/* Formulario de producto */}
          {showProductForm && (
            <div className="card mb-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}>
              <div className="card-body">
                <h5 style={{ color: 'var(--text)' }}>Producto</h5>
                <form onSubmit={handleProductSubmit}>
                  <div className="mb-3">
                    <label className="form-label" style={{ color: 'var(--text)' }}>Nombre</label>
                    <input
                      type="text"
                      className="form-control"
                      style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
                      value={productForm.name}
                      onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label" style={{ color: 'var(--text)' }}>Categoría</label>
                    <input
                      type="text"
                      className="form-control"
                      style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
                      value={productForm.category}
                      onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label" style={{ color: 'var(--text)' }}>Descripción</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
                      value={productForm.description}
                      onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label" style={{ color: 'var(--text)' }}>Precio</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
                      value={productForm.price}
                      onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                      required
                    />
                  </div>
                  {!editingProduct && (
                    <>
                      <div className="mb-3">
                        <label className="form-label" style={{ color: 'var(--text)' }}>Existencias</label>
                        <input
                          type="number"
                          className="form-control"
                          style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
                          value={productForm.stock}
                          onChange={(e) => setProductForm({...productForm, stock: e.target.value})}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label" style={{ color: 'var(--text)' }}>URL de la imagen</label>
                        <input
                          type="url"
                          className="form-control"
                          style={{ background: 'var(--surface)', border: '1px solid var,--border', color: 'var(--text)' }}
                          value={productForm.image}
                          onChange={(e) => setProductForm({...productForm, image: e.target.value})}
                        />
                      </div>
                    </>
                  )}
                  <div className="d-flex gap-2">
                    <button type="submit" className="btn-neon">
                      {editingProduct ? "Actualizar" : "Crear"} Producto
                    </button>
                    <button type="button" className="btn-outline" onClick={resetProductForm}>
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Tabla de productos */}
          <div className="table-responsive">
            <table className="table" style={{
              background: '#1a1f3a',
              color: '#ffffff',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
              border: '1px solid #39FF14',
              width: '100%'
            }}>
              <thead style={{
                background: '#2d3748',
                color: '#ffffff',
                border: 'none'
              }}>
                <tr>
                  <th style={{ padding: '1rem', fontWeight: '700', border: 'none', fontSize: '0.9rem', background: '#2d3748', color: '#ffffff' }}>ID</th>
                  <th style={{ padding: '1rem', fontWeight: '700', border: 'none', fontSize: '0.9rem', background: '#2d3748', color: '#ffffff' }}>Nombre</th>
                  <th style={{ padding: '1rem', fontWeight: '700', border: 'none', fontSize: '0.9rem', background: '#2d3748', color: '#ffffff' }}>Categoría</th>
                  <th style={{ padding: '1rem', fontWeight: '700', border: 'none', fontSize: '0.9rem', background: '#2d3748', color: '#ffffff' }}>Precio</th>
                  <th style={{ padding: '1rem', fontWeight: '700', border: 'none', fontSize: '0.9rem', background: '#2d3748', color: '#ffffff' }}>Existencias</th>
                  <th style={{ padding: '1rem', fontWeight: '700', border: 'none', fontSize: '0.9rem', background: '#2d3748', color: '#ffffff' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr key={product.id} style={{
                    background: index % 2 === 0 ? '#121827' : '#0d1f4a',
                    borderBottom: '1px solid #1e293b',
                    transition: 'all 0.2s ease'
                  }}
                  >
                    <td style={{ padding: '1rem', color: '#ffffff', border: 'none', fontSize: '0.9rem', background: index % 2 === 0 ? '#121827' : '#0d1f4a' }}>{product.id}</td>
                    <td style={{ padding: '1rem', color: '#ffffff', border: 'none', fontWeight: '500', fontSize: '0.9rem', background: index % 2 === 0 ? '#121827' : '#0d1f4a' }}>{product.name}</td>
                    <td style={{ padding: '1rem', color: '#ffffff', border: 'none', fontSize: '0.9rem', background: index % 2 === 0 ? '#121827' : '#0d1f4a' }}>{product.category}</td>
                    <td className="price-cell" style={{ padding: '1rem', color: '#39FF14', border: 'none', fontWeight: '600', fontSize: '0.9rem', background: index % 2 === 0 ? '#121827' : '#0d1f4a' }}>
                      ${product.price.toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                    </td>
                    <td style={{
                      padding: '1rem',
                      color: '#ffffff',
                      border: 'none',
                      fontSize: '0.9rem',
                      background: index % 2 === 0 ? '#121827' : '#0d1f4a',
                      fontWeight: '600'
                    }}>
                      <span style={{
                        color: product.stock > 10 ? '#39FF14' : product.stock > 5 ? '#FFD700' : '#FF4500',
                        background: product.stock > 10 ? 'rgba(57,255,20,0.1)' : product.stock > 5 ? 'rgba(255,215,0,0.1)' : 'rgba(255,69,0,0.1)',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        border: `1px solid ${product.stock > 10 ? '#39FF14' : product.stock > 5 ? '#FFD700' : '#FF4500'}`
                      }}>
                        {product.stock}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', border: 'none', background: index % 2 === 0 ? '#121827' : '#0d1f4a' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          className="btn btn-sm"
                          style={{
                            background: '#39FF14',
                            color: '#000000',
                            border: 'none',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            transition: 'all 0.2s ease',
                            boxShadow: '0 0 8px rgba(57,255,20,0.3)'
                          }}
                          onMouseOver={(e) => {
                            e.target.style.transform = 'scale(1.05)';
                            e.target.style.boxShadow = '0 0 12px rgba(57,255,20,0.6)';
                          }}
                          onMouseOut={(e) => {
                            e.target.style.transform = 'scale(1)';
                            e.target.style.boxShadow = '0 0 8px rgba(57,255,20,0.3)';
                          }}
                          onClick={() => handleEditProduct(product)}
                        >
                          ✏️ Editar
                        </button>
                        <button
                          className="btn btn-sm"
                          style={{
                            background: '#FF4500',
                            color: '#ffffff',
                            border: 'none',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            transition: 'all 0.2s ease',
                            boxShadow: '0 0 8px rgba(255,69,0,0.3)'
                          }}
                          onMouseOver={(e) => {
                            e.target.style.transform = 'scale(1.05)';
                            e.target.style.boxShadow = '0 0 12px rgba(255,69,0,0.6)';
                          }}
                          onMouseOut={(e) => {
                            e.target.style.transform = 'scale(1)';
                            e.target.style.boxShadow = '0 0 8px rgba(255,69,0,0.3)';
                          }}
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          🗑️ Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "users" && (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3>Gestión de Usuarios</h3>
            <button
              className="btn btn-primary"
              onClick={() => setShowUserForm(!showUserForm)}
            >
              {showUserForm ? "Cancelar" : "Crear Usuario"}
            </button>
          </div>

          {/* Barra de búsqueda para usuarios */}
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por ID o nombre..."
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
            />
          </div>

          {/* Formulario de usuario */}
          {showUserForm && (
            <div className="card mb-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}>
              <div className="card-body">
                <h5 style={{ color: 'var(--text)' }}>Crear Nuevo Usuario</h5>
                <form onSubmit={handleUserSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label" style={{ color: 'var(--text)' }}>Nombre</label>
                      <input
                        type="text"
                        className="form-control"
                        style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
                        value={userForm.username}
                        onChange={(e) => setUserForm({...userForm, username: e.target.value})}
                        required
                        placeholder="Nombre completo"
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label" style={{ color: 'var(--text)' }}>Correo</label>
                      <input
                        type="email"
                        className="form-control"
                        style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var,--text' }}
                        value={userForm.email}
                        onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                        required
                        placeholder="correo@ejemplo.com"
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label" style={{ color: 'var(--text)' }}>Contraseña</label>
                      <input
                        type="password"
                        className="form-control"
                        style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var,--text' }}
                        value={userForm.password}
                        onChange={(e) => setUserForm({...userForm, password: e.target.value})}
                        required
                        placeholder="Contraseña"
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label" style={{ color: 'var(--text)' }}>Confirmar Contraseña</label>
                      <input
                        type="password"
                        className="form-control"
                        style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var,--text' }}
                        value={userForm.confirmPassword}
                        onChange={(e) => setUserForm({...userForm, confirmPassword: e.target.value})}
                        required
                        placeholder="Repite la contraseña"
                      />
                    </div>
                  </div>
                  <div className="d-flex gap-2">
                    <button type="submit" className="btn-neon">
                      Crear Usuario
                    </button>
                    <button type="button" className="btn-outline" onClick={resetUserForm}>
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Tabla de usuarios (solo usuarios normales) */}
          <div className="table-responsive">
            <table className="table" style={{
              background: '#1a1f3a',
              color: '#ffffff',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
              border: '1px solid #39FF14',
              width: '100%'
            }}>
              <thead style={{
                background: '#2d3748',
                color: '#ffffff',
                border: 'none'
              }}>
                <tr>
                  <th style={{ padding: '1rem', fontWeight: '700', border: 'none', fontSize: '0.9rem', background: '#2d3748', color: '#ffffff' }}>ID</th>
                  <th style={{ padding: '1rem', fontWeight: '700', border: 'none', fontSize: '0.9rem', background: '#2d3748', color: '#ffffff' }}>Usuario</th>
                  <th style={{ padding: '1rem', fontWeight: '700', border: 'none', fontSize: '0.9rem', background: '#2d3748', color: '#ffffff' }}>Correo</th>
                  <th style={{ padding: '1rem', fontWeight: '700', border: 'none', fontSize: '0.9rem', background: '#2d3748', color: '#ffffff' }}>Contraseña</th>
                  <th style={{ padding: '1rem', fontWeight: '700', border: 'none', fontSize: '0.9rem', background: '#2d3748', color: '#ffffff' }}>Rol</th>
                  <th style={{ padding: '1rem', fontWeight: '700', border: 'none', fontSize: '0.9rem', background: '#2d3748', color: '#ffffff' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.filter(user => user.role !== 'admin')
                  .filter(user =>
                    userSearch === "" ||
                    user.id.toString().includes(userSearch.toLowerCase()) ||
                    user.username.toLowerCase().includes(userSearch.toLowerCase())
                  )
                  .sort((a, b) => a.id - b.id) // Ordenar por ID ascendente
                  .map((user, index) => (
                  <tr key={user.id} style={{
                    background: index % 2 === 0 ? '#121827' : '#0d1f4a',
                    borderBottom: '1px solid #1e293b',
                    transition: 'all 0.2s ease'
                  }}
                  >
                    <td style={{ padding: '1rem', color: '#ffffff', border: 'none', fontSize: '0.9rem', background: index % 2 === 0 ? '#121827' : '#0d1f4a' }}>{user.id}</td>
                    <td style={{ padding: '1rem', color: '#ffffff', border: 'none', fontWeight: '500', fontSize: '0.9rem', background: index % 2 === 0 ? '#121827' : '#0d1f4a' }}>{user.username}</td>
                    <td style={{ padding: '1rem', color: '#ffffff', border: 'none', fontSize: '0.9rem', background: index % 2 === 0 ? '#121827' : '#0d1f4a' }}>{user.email || '-'}</td>
                    <td style={{ padding: '1rem', color: '#ffffff', border: 'none', fontSize: '0.9rem', background: index % 2 === 0 ? '#121827' : '#0d1f4a' }}>{user.password || '-'}</td>
                    <td className="role-cell" style={{ padding: '1rem', border: 'none', background: index % 2 === 0 ? '#121827' : '#0d1f4a' }}>
                      <span style={{
                        color: '#39FF14',
                        background: 'rgba(57,255,20,0.1)',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        border: '1px solid #39FF14',
                        fontWeight: '600',
                        fontSize: '0.8rem'
                      }}>
                        USER
                      </span>
                    </td>
                    <td style={{ padding: '1rem', border: 'none', background: index % 2 === 0 ? '#121827' : '#0d1f4a' }}>
                      <button
                        className="btn btn-sm"
                        style={{
                          background: '#FF4500',
                          color: '#ffffff',
                          border: 'none',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          transition: 'all 0.2s ease',
                          boxShadow: '0 0 8px rgba(255,69,0,0.3)'
                        }}
                        onMouseOver={(e) => {
                          e.target.style.transform = 'scale(1.05)';
                          e.target.style.boxShadow = '0 0 12px rgba(255,69,0,0.6)';
                        }}
                        onMouseOut={(e) => {
                          e.target.style.transform = 'scale(1)';
                          e.target.style.boxShadow = '0 0 8px rgba(255,69,0,0.3)';
                        }}
                        onClick={() => handleDeleteUser(user.id)}
                        title="Eliminar usuario"
                      >
                        🗑️ Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "orders" && (
        <div>
          <h3 style={{ color: 'var(--text)' }}>Gestión de Órdenes</h3>
          <div className="table-responsive">
            <table className="table" style={{
              background: '#1a1f3a',
              color: '#ffffff',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
              border: '1px solid #39FF14',
              width: '100%'
            }}>
              <thead style={{
                background: '#2d3748',
                color: '#ffffff',
                border: 'none'
              }}>
                <tr>
                  <th style={{ padding: '1rem', fontWeight: '700', border: 'none', fontSize: '0.9rem', background: '#2d3748', color: '#ffffff' }}>ID</th>
                  <th style={{ padding: '1rem', fontWeight: '700', border: 'none', fontSize: '0.9rem', background: '#2d3748', color: '#ffffff' }}>Usuario</th>
                  <th style={{ padding: '1rem', fontWeight: '700', border: 'none', fontSize: '0.9rem', background: '#2d3748', color: '#ffffff' }}>Total</th>
                  <th style={{ padding: '1rem', fontWeight: '700', border: 'none', fontSize: '0.9rem', background: '#2d3748', color: '#ffffff' }}>Fecha</th>
                  <th style={{ padding: '1rem', fontWeight: '700', border: 'none', fontSize: '0.9rem', background: '#2d3748', color: '#ffffff' }}>Estado</th>
                  <th style={{ padding: '1rem', fontWeight: '700', border: 'none', fontSize: '0.9rem', background: '#2d3748', color: '#ffffff' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr key={order.id} style={{
                    background: index % 2 === 0 ? '#121827' : '#0d1f4a',
                    borderBottom: '1px solid #1e293b',
                    transition: 'all 0.2s ease'
                  }}
                  >
                    <td style={{ padding: '1rem', color: '#ffffff', border: 'none', fontSize: '0.9rem', background: index % 2 === 0 ? '#121827' : '#0d1f4a' }}>{order.id}</td>
                    <td style={{ padding: '1rem', color: '#ffffff', border: 'none', fontSize: '0.9rem', background: index % 2 === 0 ? '#121827' : '#0d1f4a' }}>{order.userId}</td>
                    <td style={{ padding: '1rem', color: '#39FF14', border: 'none', fontWeight: '600', fontSize: '0.9rem', background: index % 2 === 0 ? '#121827' : '#0d1f4a' }}>
                      ${order.total?.toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).replace(/\B(?=(\d{3})+(?!\d))/g, '.') || '0'}
                    </td>
                    <td style={{ padding: '1rem', color: '#ffffff', border: 'none', fontSize: '0.9rem', background: index % 2 === 0 ? '#121827' : '#0d1f4a' }}>{new Date(order.date).toLocaleDateString()}</td>
                    <td className="status-cell" style={{ padding: '1rem', border: 'none', background: index % 2 === 0 ? '#121827' : '#0d1f4a' }}>
                      <span style={{
                        color: '#39FF14',
                        background: 'rgba(57,255,20,0.1)',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        border: '1px solid #39FF14',
                        fontWeight: '600',
                        fontSize: '0.8rem'
                      }}>
                        {order.status || 'Completada'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', border: 'none', background: index % 2 === 0 ? '#121827' : '#0d1f4a' }}>
                      <button
                        className="btn btn-sm"
                        style={{
                          background: '#FF4500',
                          color: '#ffffff',
                          border: 'none',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          transition: 'all 0.2s ease',
                          boxShadow: '0 0 8px rgba(255,69,0,0.3)'
                        }}
                        onMouseOver={(e) => {
                          e.target.style.transform = 'scale(1.05)';
                          e.target.style.boxShadow = '0 0 12px rgba(255,69,0,0.6)';
                        }}
                        onMouseOut={(e) => {
                          e.target.style.transform = 'scale(1)';
                          e.target.style.boxShadow = '0 0 8px rgba(255,69,0,0.3)';
                        }}
                        onClick={() => handleDeleteOrder(order.id)}
                      >
                        🗑️ Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "stock" && (
        <div>
          <h3>Gestión de Stock</h3>
          <div className="table-responsive">
            <table className="table" style={{
              background: '#1a1f3a',
              color: '#ffffff',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
              border: '1px solid #39FF14',
              width: '100%'
            }}>
              <thead style={{
                background: '#2d3748',
                color: '#ffffff',
                border: 'none'
              }}>
                <tr>
                  <th style={{ padding: '1rem', fontWeight: '700', border: 'none', fontSize: '0.9rem', background: '#2d3748', color: '#ffffff' }}>ID</th>
                  <th style={{ padding: '1rem', fontWeight: '700', border: 'none', fontSize: '0.9rem', background: '#2d3748', color: '#ffffff' }}>Producto</th>
                  <th style={{ padding: '1rem', fontWeight: '700', border: 'none', fontSize: '0.9rem', background: '#2d3748', color: '#ffffff' }}>Categoría</th>
                  <th style={{ padding: '1rem', fontWeight: '700', border: 'none', fontSize: '0.9rem', background: '#2d3748', color: '#ffffff' }}>Stock Actual</th>
                  <th style={{ padding: '1rem', fontWeight: '700', border: 'none', fontSize: '0.9rem', background: '#2d3748', color: '#ffffff' }}>Nuevo Stock</th>
                  <th style={{ padding: '1rem', fontWeight: '700', border: 'none', fontSize: '0.9rem', background: '#2d3748', color: '#ffffff' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr key={product.id} style={{
                    background: index % 2 === 0 ? '#121827' : '#0d1f4a',
                    borderBottom: '1px solid #1e293b',
                    transition: 'all 0.2s ease'
                  }}>
                    <td style={{ padding: '1rem', color: '#ffffff', border: 'none', fontSize: '0.9rem', background: index % 2 === 0 ? '#121827' : '#0d1f4a' }}>{product.id}</td>
                    <td style={{ padding: '1rem', color: '#ffffff', border: 'none', fontWeight: '500', fontSize: '0.9rem', background: index % 2 === 0 ? '#121827' : '#0d1f4a' }}>{product.name}</td>
                    <td style={{ padding: '1rem', color: '#ffffff', border: 'none', fontSize: '0.9rem', background: index % 2 === 0 ? '#121827' : '#0d1f4a' }}>{product.category}</td>
                    <td style={{
                      padding: '1rem',
                      color: '#ffffff',
                      border: 'none',
                      fontSize: '0.9rem',
                      background: index % 2 === 0 ? '#121827' : '#0d1f4a',
                      fontWeight: '600'
                    }}>
                      <span style={{
                        color: product.stock > 10 ? '#39FF14' : product.stock > 5 ? '#FFD700' : '#FF4500',
                        background: product.stock > 10 ? 'rgba(57,255,20,0.1)' : product.stock > 5 ? 'rgba(255,215,0,0.1)' : 'rgba(255,69,0,0.1)',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        border: `1px solid ${product.stock > 10 ? '#39FF14' : product.stock > 5 ? '#FFD700' : '#FF4500'}`
                      }}>
                        {product.stock}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', border: 'none', background: index % 2 === 0 ? '#121827' : '#0d1f4a' }}>
                      <input
                        type="number"
                        min="0"
                        className="form-control form-control-sm"
                        style={{
                          background: '#2d3748',
                          border: '1px solid #39FF14',
                          color: '#ffffff',
                          width: '80px',
                          fontSize: '0.8rem'
                        }}
                        defaultValue={product.stock}
                        onChange={(e) => {
                          const newStock = parseInt(e.target.value) || 0;
                          e.target.dataset.newStock = newStock;
                        }}
                      />
                    </td>
                    <td style={{ padding: '1rem', border: 'none', background: index % 2 === 0 ? '#121827' : '#0d1f4a' }}>
                      <button
                        className="btn btn-sm"
                        style={{
                          background: '#39FF14',
                          color: '#000000',
                          border: 'none',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          transition: 'all 0.2s ease',
                          boxShadow: '0 0 8px rgba(57,255,20,0.3)'
                        }}
                        onMouseOver={(e) => {
                          e.target.style.transform = 'scale(1.05)';
                          e.target.style.boxShadow = '0 0 12px rgba(57,255,20,0.6)';
                        }}
                        onMouseOut={(e) => {
                          e.target.style.transform = 'scale(1)';
                          e.target.style.boxShadow = '0 0 8px rgba(57,255,20,0.3)';
                        }}
                        onClick={(e) => {
                          const input = e.target.closest('tr').querySelector('input[type="number"]');
                          const newStock = parseInt(input.dataset.newStock) || parseInt(input.value) || 0;
                          if (newStock !== product.stock) {
                            dataStore.updateProduct(product.id, { stock: newStock });
                            setProducts(prevProducts =>
                              prevProducts.map(p =>
                                p.id === product.id ? { ...p, stock: newStock } : p
                              )
                            );
                            window.dispatchEvent(new CustomEvent('productsUpdated'));
                          }
                        }}
                      >
                        💾 Actualizar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "admins" && (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3>Gestión de Administradores</h3>
            <button
              className="btn btn-primary"
              onClick={() => setShowUserForm(!showUserForm)}
            >
              {showUserForm ? "Cancelar" : "Crear Administrador"}
            </button>
          </div>

          {/* Barra de búsqueda para administradores */}
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por ID o nombre..."
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
              value={adminSearch}
              onChange={(e) => setAdminSearch(e.target.value)}
            />
          </div>

          {/* Formulario de administrador */}
          {showUserForm && (
            <div className="card mb-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}>
              <div className="card-body">
                <h5 style={{ color: 'var(--text)' }}>Crear Nuevo Administrador</h5>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  // Validar confirmación de contraseña
                  if (userForm.password !== userForm.confirmPassword) {
                    alert("Las contraseñas no coinciden.");
                    return;
                  }

                  // Validar código de admin
                  if ((userForm.adminCode || '') !== "123456789") {
                    alert("Código de administrador inválido.");
                    return;
                  }

                  // Crear administrador
                  dataStore.createUser({
                    username: userForm.username,
                    email: userForm.email,
                    password: userForm.password,
                    role: 'admin'
                  });

                  loadData();
                  resetUserForm();
                }}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label" style={{ color: 'var(--text)' }}>Nombre</label>
                      <input
                        type="text"
                        className="form-control"
                        style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
                        value={userForm.username}
                        onChange={(e) => setUserForm({...userForm, username: e.target.value})}
                        required
                        placeholder="Nombre completo"
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label" style={{ color: 'var(--text)' }}>Correo</label>
                      <input
                        type="email"
                        className="form-control"
                        style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
                        value={userForm.email}
                        onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                        required
                        placeholder="correo@ejemplo.com"
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label" style={{ color: 'var(--text)' }}>Contraseña</label>
                      <input
                        type="password"
                        className="form-control"
                        style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
                        value={userForm.password}
                        onChange={(e) => setUserForm({...userForm, password: e.target.value})}
                        required
                        placeholder="Contraseña"
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label" style={{ color: 'var(--text)' }}>Confirmar Contraseña</label>
                      <input
                        type="password"
                        className="form-control"
                        style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
                        value={userForm.confirmPassword}
                        onChange={(e) => setUserForm({...userForm, confirmPassword: e.target.value})}
                        required
                        placeholder="Repite la contraseña"
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label" style={{ color: 'var(--text)' }}>Código de Administrador</label>
                    <input
                      type="password"
                      className="form-control"
                      style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
                      value={userForm.adminCode || ''}
                      onChange={(e) => setUserForm({...userForm, adminCode: e.target.value})}
                      required
                      placeholder="Código requerido para crear admin"
                    />
                  </div>
                  <div className="d-flex gap-2">
                    <button type="submit" className="btn-neon">
                      Crear Administrador
                    </button>
                    <button type="button" className="btn-outline" onClick={resetUserForm}>
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Tabla de administradores */}
          <div className="table-responsive">
            <table className="table" style={{
              background: '#1a1f3a',
              color: '#ffffff',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
              border: '1px solid #39FF14',
              width: '100%'
            }}>
              <thead style={{
                background: '#2d3748',
                color: '#ffffff',
                border: 'none'
              }}>
                <tr>
                  <th style={{ padding: '1rem', fontWeight: '700', border: 'none', fontSize: '0.9rem', background: '#2d3748', color: '#ffffff' }}>ID</th>
                  <th style={{ padding: '1rem', fontWeight: '700', border: 'none', fontSize: '0.9rem', background: '#2d3748', color: '#ffffff' }}>Administrador</th>
                  <th style={{ padding: '1rem', fontWeight: '700', border: 'none', fontSize: '0.9rem', background: '#2d3748', color: '#ffffff' }}>Correo</th>
                  <th style={{ padding: '1rem', fontWeight: '700', border: 'none', fontSize: '0.9rem', background: '#2d3748', color: '#ffffff' }}>Contraseña</th>
                  <th style={{ padding: '1rem', fontWeight: '700', border: 'none', fontSize: '0.9rem', background: '#2d3748', color: '#ffffff' }}>Rol</th>
                  <th style={{ padding: '1rem', fontWeight: '700', border: 'none', fontSize: '0.9rem', background: '#2d3748', color: '#ffffff' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.filter(user => user.role === 'admin')
                  .filter(user =>
                    adminSearch === "" ||
                    user.id.toString().includes(adminSearch.toLowerCase()) ||
                    user.username.toLowerCase().includes(adminSearch.toLowerCase())
                  )
                  .sort((a, b) => a.id - b.id) // Ordenar por ID ascendente
                  .map((user, index) => (
                  <tr key={user.id} style={{
                    background: index % 2 === 0 ? '#121827' : '#0d1f4a',
                    borderBottom: '1px solid #1e293b',
                    transition: 'all 0.2s ease'
                  }}
                  >
                    <td style={{ padding: '1rem', color: '#ffffff', border: 'none', fontSize: '0.9rem', background: index % 2 === 0 ? '#121827' : '#0d1f4a' }}>{user.id}</td>
                    <td style={{ padding: '1rem', color: '#ffffff', border: 'none', fontWeight: '500', fontSize: '0.9rem', background: index % 2 === 0 ? '#121827' : '#0d1f4a' }}>{user.username}</td>
                    <td style={{ padding: '1rem', color: '#ffffff', border: 'none', fontSize: '0.9rem', background: index % 2 === 0 ? '#121827' : '#0d1f4a' }}>{user.email || '-'}</td>
                    <td style={{ padding: '1rem', color: '#ffffff', border: 'none', fontSize: '0.9rem', background: index % 2 === 0 ? '#121827' : '#0d1f4a' }}>{user.password || '-'}</td>
                    <td className="role-cell" style={{ padding: '1rem', border: 'none', background: index % 2 === 0 ? '#121827' : '#0d1f4a' }}>
                      <span style={{
                        color: '#FF4500',
                        background: 'rgba(255,69,0,0.1)',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        border: '1px solid #FF4500',
                        fontWeight: '600',
                        fontSize: '0.8rem'
                      }}>
                        ADMIN
                      </span>
                    </td>
                    <td style={{ padding: '1rem', border: 'none', background: index % 2 === 0 ? '#121827' : '#0d1f4a' }}>
                      {user.username !== 'admin' && (
                        <button
                          className="btn btn-sm"
                          style={{
                            background: '#FF4500',
                            color: '#ffffff',
                            border: 'none',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            transition: 'all 0.2s ease',
                            boxShadow: '0 0 8px rgba(255,69,0,0.3)'
                          }}
                          onMouseOver={(e) => {
                            e.target.style.transform = 'scale(1.05)';
                            e.target.style.boxShadow = '0 0 12px rgba(255,69,0,0.6)';
                          }}
                          onMouseOut={(e) => {
                            e.target.style.transform = 'scale(1)';
                            e.target.style.boxShadow = '0 0 8px rgba(255,69,0,0.3)';
                          }}
                          onClick={() => handleDeleteUser(user.id)}
                          title="Eliminar administrador"
                        >
                          🗑️ Eliminar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "ofertas" && (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3>Gestión de Ofertas</h3>
            <button
              className="btn btn-warning"
              onClick={() => setShowOfertaForm(!showOfertaForm)}
            >
              {showOfertaForm ? "Cancelar" : "Crear Oferta"}
            </button>
          </div>

          {/* Formulario de oferta */}
          {showOfertaForm && (
            <div className="card mb-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var,--text' }}>
              <div className="card-body">
                <h5 style={{ color: 'var,--text' }}>{editingOferta ? "Editar Oferta" : "Nueva Oferta"}</h5>
                <form onSubmit={handleOfertaSubmit}>
                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label className="form-label" style={{ color: 'var(--text)' }}>Producto</label>
                      <select
                        className="form-select"
                        style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
                        value={ofertaForm.productId}
                        onChange={(e) => setOfertaForm({...ofertaForm, productId: e.target.value})}
                        required
                      >
                        <option value="">Seleccionar producto</option>
                        {products
                          .filter(product => !ofertas.some(oferta => parseInt(oferta.productId) === product.id))
                          .map(product => (
                            <option key={product.id} value={product.id}>
                              ID {product.id} - {product.name} - ${product.price.toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label" style={{ color: 'var(--text)' }}>Descuento (%)</label>
                      <input
                        type="number"
                        min="1"
                        max="90"
                        className="form-control"
                        style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
                        value={ofertaForm.discount}
                        onChange={(e) => setOfertaForm({...ofertaForm, discount: e.target.value})}
                        required
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label" style={{ color: 'var(--text)' }}>Precio Calculado</label>
                      <input
                        type="text"
                        className="form-control"
                        style={{ background: 'var(--surface)', border: '1px solid var,--border', color: 'var,--text' }}
                        value={ofertaForm.productId && ofertaForm.discount ? (() => {
                          const product = products.find(p => p.id === parseInt(ofertaForm.productId));
                          if (product) {
                            const discount = parseInt(ofertaForm.discount) || 0;
                            const price = product.price * (1 - discount / 100);
                            return `$${price.toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
                          }
                          return '';
                        })() : ''}
                        readOnly
                        placeholder="Selecciona producto y descuento"
                      />
                    </div>
                  </div>
                  <div className="d-flex gap-2">
                    <button type="submit" className="btn-neon">
                      {editingOferta ? "Actualizar" : "Crear"} Oferta
                    </button>
                    <button type="button" className="btn-outline" onClick={resetOfertaForm}>
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Tabla de ofertas */}
          <div className="table-responsive">
            <table className="table" style={{
              background: '#1a1f3a',
              color: '#ffffff',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
              border: '1px solid #39FF14',
              width: '100%'
            }}>
              <thead style={{
                background: '#2d3748',
                color: '#ffffff',
                border: 'none'
              }}>
                <tr>
                  <th style={{ padding: '1rem', fontWeight: '700', border: 'none', fontSize: '0.9rem', background: '#2d3748', color: '#ffffff' }}>ID</th>
                  <th style={{ padding: '1rem', fontWeight: '700', border: 'none', fontSize: '0.9rem', background: '#2d3748', color: '#ffffff' }}>Producto</th>
                  <th style={{ padding: '1rem', fontWeight: '700', border: 'none', fontSize: '0.9rem', background: '#2d3748', color: '#ffffff' }}>Precio Original</th>
                  <th style={{ padding: '1rem', fontWeight: '700', border: 'none', fontSize: '0.9rem', background: '#2d3748', color: '#ffffff' }}>Descuento</th>
                  <th style={{ padding: '1rem', fontWeight: '700', border: 'none', fontSize: '0.9rem', background: '#2d3748', color: '#ffffff' }}>Precio Oferta</th>
                  <th style={{ padding: '1rem', fontWeight: '700', border: 'none', fontSize: '0.9rem', background: '#2d3748', color: '#ffffff' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {ofertas.map((oferta, index) => {
                  const producto = products.find(p => p.id === oferta.productId);
                  return (
                    <tr key={oferta.id} style={{
                      background: index % 2 === 0 ? '#121827' : '#0d1f4a',
                      borderBottom: '1px solid #1e293b',
                      transition: 'all 0.2s ease'
                    }}
                    >
                      <td style={{ padding: '1rem', color: '#ffffff', border: 'none', fontSize: '0.9rem', background: index % 2 === 0 ? '#121827' : '#0d1f4a' }}>{oferta.id}</td>
                      <td style={{ padding: '1rem', color: '#ffffff', border: 'none', fontSize: '0.9rem', background: index % 2 === 0 ? '#121827' : '#0d1f4a' }}>
                        {producto ? (
                          <>
                            <strong>ID {producto.id}</strong> - {producto.name}
                          </>
                        ) : (
                          <span className="error-cell" style={{ color: '#FF4500', fontWeight: '600' }}>Producto no encontrado (ID: {oferta.productId})</span>
                        )}
                      </td>
                      <td style={{ padding: '1rem', color: '#ffffff', border: 'none', fontSize: '0.9rem', background: index % 2 === 0 ? '#121827' : '#0d1f4a' }}>
                        ${producto ? producto.price.toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).replace(/\B(?=(\d{3})+(?!\d))/g, '.') : 'N/A'}
                      </td>
                      <td className="discount-cell" style={{ padding: '1rem', border: 'none', background: index % 2 === 0 ? '#121827' : '#0d1f4a' }}>
                        <span style={{
                          color: '#FFD700',
                          background: 'rgba(255,215,0,0.1)',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          border: '1px solid #FFD700',
                          fontWeight: '600',
                          fontSize: '0.8rem'
                        }}>
                          {oferta.discount}%
                        </span>
                      </td>
                      <td style={{ padding: '1rem', color: '#39FF14', border: 'none', fontWeight: '600', fontSize: '0.9rem', background: index % 2 === 0 ? '#121827' : '#0d1f4a' }}>
                        ${oferta.price.toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                      </td>
                      <td style={{ padding: '1rem', border: 'none', background: index % 2 === 0 ? '#121827' : '#0d1f4a' }}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            className="btn btn-sm"
                            style={{
                              background: '#FFD700',
                              color: '#000000',
                              border: 'none',
                              padding: '0.25rem 0.75rem',
                              borderRadius: '6px',
                              fontSize: '0.8rem',
                              fontWeight: '600',
                              transition: 'all 0.2s ease',
                              boxShadow: '0 0 8px rgba(255,215,0,0.3)'
                            }}
                            onMouseOver={(e) => {
                              e.target.style.transform = 'scale(1.05)';
                              e.target.style.boxShadow = '0 0 12px rgba(255,215,0,0.6)';
                            }}
                            onMouseOut={(e) => {
                              e.target.style.transform = 'scale(1)';
                              e.target.style.boxShadow = '0 0 8px rgba(255,215,0,0.3)';
                            }}
                            onClick={() => handleEditOferta(oferta)}
                          >
                            ✏️ Editar
                          </button>
                          <button
                            className="btn btn-sm"
                            style={{
                              background: '#FF4500',
                              color: '#ffffff',
                              border: 'none',
                              padding: '0.25rem 0.75rem',
                              borderRadius: '6px',
                              fontSize: '0.8rem',
                              fontWeight: '600',
                              transition: 'all 0.2s ease',
                              boxShadow: '0 0 8px rgba(255,69,0,0.3)'
                            }}
                            onMouseOver={(e) => {
                              e.target.style.transform = 'scale(1.05)';
                              e.target.style.boxShadow = '0 0 12px rgba(255,69,0,0.6)';
                            }}
                            onMouseOut={(e) => {
                              e.target.style.transform = 'scale(1)';
                              e.target.style.boxShadow = '0 0 8px rgba(255,69,0,0.3)';
                            }}
                            onClick={() => handleDeleteOferta(oferta.id)}
                          >
                            🗑️ Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;