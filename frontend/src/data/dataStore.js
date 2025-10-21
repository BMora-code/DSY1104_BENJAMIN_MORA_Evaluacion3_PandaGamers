// Archivo de datos simulados para la tienda React
// Actúa como una base de datos en memoria con operaciones CRUD

class DataStore {
  constructor() {
    this.products = [
      {
        id: 1,
        name: 'Producto 1',
        description: 'Descripción del producto 1',
        price: 29990, // Precios en pesos chilenos
        category: 'Electrónicos',
        image: '/images/product1.jpg',
        stock: 10
      },
      {
        id: 2,
        name: 'Producto 2',
        description: 'Descripción del producto 2',
        price: 49990,
        category: 'Ropa',
        image: '/images/product2.jpg',
        stock: 5
      },
      {
        id: 3,
        name: 'Producto 3',
        description: 'Descripción del producto 3',
        price: 19990,
        category: 'Hogar',
        image: '/images/product3.jpg',
        stock: 20
      }
    ];

    this.users = [
      {
        id: 1,
        username: 'admin',
        password: 'admin123',
        role: 'admin'
      },
      {
        id: 2,
        username: 'user',
        password: 'user123',
        role: 'user'
      }
    ];

    this.orders = [];
  }

  // Operaciones CRUD para productos

  // CREATE
  createProduct(product) {
    const newProduct = {
      id: this.products.length + 1,
      ...product
    };
    this.products.push(newProduct);
    return newProduct;
  }

  // READ
  getProducts() {
    return [...this.products];
  }

  getProductById(id) {
    return this.products.find(product => product.id === id);
  }

  getProductsByCategory(category) {
    return this.products.filter(product => product.category === category);
  }

  // UPDATE
  updateProduct(id, updatedProduct) {
    const index = this.products.findIndex(product => product.id === id);
    if (index !== -1) {
      this.products[index] = { ...this.products[index], ...updatedProduct };
      return this.products[index];
    }
    return null;
  }

  // DELETE
  deleteProduct(id) {
    const index = this.products.findIndex(product => product.id === id);
    if (index !== -1) {
      return this.products.splice(index, 1)[0];
    }
    return null;
  }

  // Operaciones CRUD para usuarios

  // CREATE
  createUser(user) {
    const newUser = {
      id: this.users.length + 1,
      ...user
    };
    this.users.push(newUser);
    return newUser;
  }

  // READ
  getUsers() {
    return [...this.users];
  }

  getUserById(id) {
    return this.users.find(user => user.id === id);
  }

  getUserByUsername(username) {
    return this.users.find(user => user.username === username);
  }

  // UPDATE
  updateUser(id, updatedUser) {
    const index = this.users.findIndex(user => user.id === id);
    if (index !== -1) {
      this.users[index] = { ...this.users[index], ...updatedUser };
      return this.users[index];
    }
    return null;
  }

  // DELETE
  deleteUser(id) {
    const index = this.users.findIndex(user => user.id === id);
    if (index !== -1) {
      return this.users.splice(index, 1)[0];
    }
    return null;
  }

  // Operaciones CRUD para órdenes

  // CREATE
  createOrder(order) {
    const newOrder = {
      id: this.orders.length + 1,
      ...order,
      date: new Date().toISOString()
    };
    this.orders.push(newOrder);
    return newOrder;
  }

  // READ
  getOrders() {
    return [...this.orders];
  }

  getOrderById(id) {
    return this.orders.find(order => order.id === id);
  }

  getOrdersByUserId(userId) {
    return this.orders.filter(order => order.userId === userId);
  }

  // UPDATE
  updateOrder(id, updatedOrder) {
    const index = this.orders.findIndex(order => order.id === id);
    if (index !== -1) {
      this.orders[index] = { ...this.orders[index], ...updatedOrder };
      return this.orders[index];
    }
    return null;
  }

  // DELETE
  deleteOrder(id) {
    const index = this.orders.findIndex(order => order.id === id);
    if (index !== -1) {
      return this.orders.splice(index, 1)[0];
    }
    return null;
  }

  // Métodos de búsqueda y filtrado
  searchProducts(query) {
    const lowerQuery = query.toLowerCase();
    return this.products.filter(product =>
      product.name.toLowerCase().includes(lowerQuery) ||
      product.description.toLowerCase().includes(lowerQuery) ||
      product.category.toLowerCase().includes(lowerQuery)
    );
  }

  filterProductsByPrice(minPrice, maxPrice) {
    return this.products.filter(product =>
      product.price >= minPrice && product.price <= maxPrice
    );
  }

  // Método para autenticación
  authenticateUser(username, password) {
    const user = this.users.find(u => u.username === username && u.password === password);
    return user ? { ...user, password: undefined } : null;
  }
}

// Exportar una instancia singleton del DataStore
const dataStore = new DataStore();
export default dataStore;