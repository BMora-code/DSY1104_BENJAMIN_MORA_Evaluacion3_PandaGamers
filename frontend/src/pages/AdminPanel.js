import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import dataStore from "../data/dataStore";

const AdminPanel = () => {
  const { user } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [ofertas, setOfertas] = useState([]);
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
    username: "",
    password: "",
    role: "user"
  });

  const [ofertaForm, setOfertaForm] = useState({
    productId: "",
    discount: ""
  });

  useEffect(() => {
    // Verificar si el usuario es admin
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role !== 'admin') {
      navigate("/");
      return;
    }

    // Cargar datos
    loadData();
  }, [user, navigate]);

  const loadData = () => {
    setProducts(dataStore.getProducts());
    setUsers(dataStore.getUsers());
    setOrders(dataStore.getOrders());
    setOfertas(dataStore.getOfertas());
  };

  const handleProductSubmit = (e) => {
    e.preventDefault();

    const productData = {
      ...productForm,
      price: parseFloat(productForm.price),
      stock: parseInt(productForm.stock)
    };

    if (editingProduct) {
      dataStore.updateProduct(editingProduct.id, productData);
    } else {
      dataStore.createProduct(productData);
    }

    loadData();
    resetProductForm();
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

    dataStore.createUser(userForm);
    loadData();
    resetUserForm();
  };

  const resetUserForm = () => {
    setUserForm({
      username: "",
      password: "",
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
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este producto?")) {
      dataStore.deleteProduct(id);
      loadData();
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

  if (!user) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Panel de Administración</h1>
        <button className="btn btn-secondary" onClick={() => navigate("/")}>
          Volver al Inicio
        </button>
      </div>

      {/* Tabs de navegación */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveTab("dashboard")}
          >
            <i className="bi bi-speedometer2 me-1"></i>
            Dashboard
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "products" ? "active" : ""}`}
            onClick={() => setActiveTab("products")}
          >
            <i className="bi bi-box-seam me-1"></i>
            Productos
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            <i className="bi bi-people me-1"></i>
            Usuarios
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            <i className="bi bi-receipt me-1"></i>
            Órdenes
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "ofertas" ? "active" : ""}`}
            onClick={() => setActiveTab("ofertas")}
          >
            <i className="bi bi-percent me-1"></i>
            Ofertas
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
              <div className="card text-center">
                <div className="card-body">
                  <i className="bi bi-box-seam text-primary" style={{ fontSize: '2rem' }}></i>
                  <h4 className="card-title">{products.length}</h4>
                  <p className="card-text">Total Productos</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-center">
                <div className="card-body">
                  <i className="bi bi-people text-success" style={{ fontSize: '2rem' }}></i>
                  <h4 className="card-title">{users.length}</h4>
                  <p className="card-text">Total Usuarios</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-center">
                <div className="card-body">
                  <i className="bi bi-receipt text-warning" style={{ fontSize: '2rem' }}></i>
                  <h4 className="card-title">{orders.length}</h4>
                  <p className="card-text">Total Órdenes</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-center">
                <div className="card-body">
                  <i className="bi bi-cart text-info" style={{ fontSize: '2rem' }}></i>
                  <h4 className="card-title">{cart.length}</h4>
                  <p className="card-text">Items en Carrito Global</p>
                </div>
              </div>
            </div>
          </div>

          {/* Gráficos y análisis */}
          <div className="row">
            <div className="col-md-6">
              <div className="card">
                <div className="card-header">
                  <h5>Productos por Categoría</h5>
                </div>
                <div className="card-body">
                  {Object.entries(
                    products.reduce((acc, product) => {
                      acc[product.category] = (acc[product.category] || 0) + 1;
                      return acc;
                    }, {})
                  ).map(([category, count]) => (
                    <div key={category} className="d-flex justify-content-between mb-2">
                      <span>{category}</span>
                      <span className="badge bg-primary">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card">
                <div className="card-header">
                  <h5>Órdenes Recientes</h5>
                </div>
                <div className="card-body">
                  {orders.slice(-5).reverse().map(order => (
                    <div key={order.id} className="border-bottom pb-2 mb-2">
                      <small className="text-muted">
                        Orden #{order.id} - ${order.total.toLocaleString()}
                      </small>
                      <br />
                      <small>
                        {new Date(order.date).toLocaleDateString()} - {order.status}
                      </small>
                    </div>
                  ))}
                  {orders.length === 0 && (
                    <p className="text-muted mb-0">No hay órdenes recientes</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Acciones rápidas */}
          <div className="card mt-4">
            <div className="card-header">
              <h5>Acciones Rápidas</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-3">
                  <button
                    className="btn btn-primary w-100 mb-2"
                    onClick={() => setActiveTab("products")}
                  >
                    <i className="bi bi-plus-circle me-1"></i>
                    Agregar Producto
                  </button>
                </div>
                <div className="col-md-3">
                  <button
                    className="btn btn-success w-100 mb-2"
                    onClick={() => navigate("/productos")}
                  >
                    <i className="bi bi-eye me-1"></i>
                    Ver Tienda
                  </button>
                </div>
                <div className="col-md-3">
                  <button
                    className="btn btn-warning w-100 mb-2"
                    onClick={() => setActiveTab("ofertas")}
                  >
                    <i className="bi bi-percent me-1"></i>
                    Gestionar Ofertas
                  </button>
                </div>
                <div className="col-md-3">
                  <button
                    className="btn btn-info w-100 mb-2"
                    onClick={() => setActiveTab("orders")}
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
              onClick={() => setShowProductForm(!showProductForm)}
            >
              {showProductForm ? "Cancelar" : "Agregar Producto"}
            </button>
          </div>

          {/* Formulario de producto */}
          {showProductForm && (
            <div className="card mb-4">
              <div className="card-body">
                <h5>{editingProduct ? "Editar Producto" : "Nuevo Producto"}</h5>
                <form onSubmit={handleProductSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Nombre</label>
                      <input
                        type="text"
                        className="form-control"
                        value={productForm.name}
                        onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Categoría</label>
                      <input
                        type="text"
                        className="form-control"
                        value={productForm.category}
                        onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Descripción</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={productForm.description}
                      onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                      required
                    />
                  </div>
                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Precio</label>
                      <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        value={productForm.price}
                        onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                        required
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Stock</label>
                      <input
                        type="number"
                        className="form-control"
                        value={productForm.stock}
                        onChange={(e) => setProductForm({...productForm, stock: e.target.value})}
                        required
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Imagen URL</label>
                      <input
                        type="url"
                        className="form-control"
                        value={productForm.image}
                        onChange={(e) => setProductForm({...productForm, image: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-success">
                      {editingProduct ? "Actualizar" : "Crear"} Producto
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={resetProductForm}>
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Tabla de productos */}
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>${product.price.toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</td>
                    <td>{product.stock}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => handleEditProduct(product)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        Eliminar
                      </button>
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

          {/* Formulario de usuario */}
          {showUserForm && (
            <div className="card mb-4">
              <div className="card-body">
                <h5>Crear Nuevo Usuario</h5>
                <form onSubmit={handleUserSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Usuario</label>
                      <input
                        type="text"
                        className="form-control"
                        value={userForm.username}
                        onChange={(e) => setUserForm({...userForm, username: e.target.value})}
                        required
                        placeholder="Nombre de usuario"
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Contraseña</label>
                      <input
                        type="password"
                        className="form-control"
                        value={userForm.password}
                        onChange={(e) => setUserForm({...userForm, password: e.target.value})}
                        required
                        placeholder="Contraseña"
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Rol</label>
                    <select
                      className="form-select"
                      value={userForm.role}
                      onChange={(e) => setUserForm({...userForm, role: e.target.value})}
                    >
                      <option value="user">Usuario</option>
                      <option value="admin">Administrador</option>
                    </select>
                  </div>
                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-success">
                      Crear Usuario
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={resetUserForm}>
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Tabla de usuarios */}
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Usuario</th>
                  <th>Rol</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>
                      <span className={`badge ${user.role === 'admin' ? 'bg-danger' : 'bg-info'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={user.role === 'admin'}
                      >
                        Eliminar
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
          <h3>Gestión de Órdenes</h3>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Usuario</th>
                  <th>Total</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.userId}</td>
                    <td>${order.total?.toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).replace(/\B(?=(\d{3})+(?!\d))/g, '.') || '0'}</td>
                    <td>{new Date(order.date).toLocaleDateString()}</td>
                    <td>
                      <span className="badge bg-success">{order.status || 'Completada'}</span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDeleteOrder(order.id)}
                      >
                        Eliminar
                      </button>
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
            <div className="card mb-4">
              <div className="card-body">
                <h5>{editingOferta ? "Editar Oferta" : "Nueva Oferta"}</h5>
                <form onSubmit={handleOfertaSubmit}>
                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Producto</label>
                      <select
                        className="form-select"
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
                      <label className="form-label">Descuento (%)</label>
                      <input
                        type="number"
                        min="1"
                        max="90"
                        className="form-control"
                        value={ofertaForm.discount}
                        onChange={(e) => setOfertaForm({...ofertaForm, discount: e.target.value})}
                        required
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Precio Calculado</label>
                      <input
                        type="text"
                        className="form-control"
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
                    <button type="submit" className="btn btn-success">
                      {editingOferta ? "Actualizar" : "Crear"} Oferta
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={resetOfertaForm}>
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Tabla de ofertas */}
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Producto</th>
                  <th>Precio Original</th>
                  <th>Descuento</th>
                  <th>Precio Oferta</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {ofertas.map(oferta => {
                  const producto = products.find(p => p.id === oferta.productId);
                  return (
                    <tr key={oferta.id}>
                      <td>{oferta.id}</td>
                      <td>
                        {producto ? (
                          <>
                            <strong>ID {producto.id}</strong> - {producto.name}
                          </>
                        ) : (
                          <span className="text-danger">Producto no encontrado (ID: {oferta.productId})</span>
                        )}
                      </td>
                      <td>${producto ? producto.price.toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).replace(/\B(?=(\d{3})+(?!\d))/g, '.') : 'N/A'}</td>
                      <td>{oferta.discount}%</td>
                      <td>${oferta.price.toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-warning me-2"
                          onClick={() => handleEditOferta(oferta)}
                        >
                          Editar
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteOferta(oferta.id)}
                        >
                          Eliminar
                        </button>
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