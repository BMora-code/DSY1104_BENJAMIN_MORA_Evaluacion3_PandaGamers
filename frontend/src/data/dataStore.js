// Archivo de datos simulados para la tienda React
// Actúa como una base de datos en memoria con operaciones CRUD

class DataStore {
  constructor() {
    // Cargar datos desde localStorage si existen
    this.loadFromStorage();

    // Si no hay datos, inicializar con datos por defecto
    if (!this.products || this.products.length === 0) {
      this.initializeDefaultData();
    }

    // Asegurar que el admin principal siempre esté presente
    this.ensureDefaultAdmin();
  }


  initializeDefaultData() {
    // No inicializar admin aquí, se hace en ensureDefaultAdmin

    this.products = [
      // Accesorios
      {
        id: 1,
        name: 'Auriculares HyperX',
        description: 'Auriculares gaming de alta calidad con sonido inmersivo.',
        price: 79990,
        category: 'Accesorios',
        image: '/images/Accesorios/Auriculares HyperX.webp',
        stock: 15
      },
      {
        id: 2,
        name: 'Control Inalámbrico',
        description: 'Control inalámbrico para consolas, cómodo y preciso.',
        price: 59990,
        category: 'Accesorios',
        image: '/images/Accesorios/Control inalámbrico.jpg',
        stock: 20
      },
      {
        id: 3,
        name: 'Mousepad RGB',
        description: 'Mousepad con iluminación RGB para setups gaming.',
        price: 29990,
        category: 'Accesorios',
        image: '/images/Accesorios/Mousepad RGB.webp',
        stock: 25
      },
      {
        id: 4,
        name: 'Teclado Razer',
        description: 'Teclado mecánico RGB con switches ópticos.',
        price: 149990,
        category: 'Accesorios',
        image: '/images/Accesorios/Teclado Razer.webp',
        stock: 10
      },
      // Consolas
      {
        id: 5,
        name: 'Nintendo Switch',
        description: 'Consola híbrida para gaming en casa o movilidad.',
        price: 349990,
        category: 'Consolas',
        image: '/images/Consolas/Nintendo Switch.png',
        stock: 8
      },
      {
        id: 6,
        name: 'PlayStation 4 Pro',
        description: 'Consola de última generación con 4K HDR.',
        price: 399990,
        category: 'Consolas',
        image: '/images/Consolas/PlayStation 4 Pro.avif',
        stock: 5
      },
      {
        id: 7,
        name: 'PlayStation 5',
        description: 'La consola más potente con ray tracing y SSD ultra rápido.',
        price: 599990,
        category: 'Consolas',
        image: '/images/Consolas/PlayStation 5.webp',
        stock: 3
      },
      {
        id: 8,
        name: 'Xbox Series X',
        description: 'Consola Xbox de nueva generación con 4K gaming.',
        price: 549990,
        category: 'Consolas',
        image: '/images/Consolas/Xbox Series X.jpg',
        stock: 4
      },
      // Juegos de mesa (corregido: rutas de imagen correctamente terminadas)
      {
        id: 9,
        name: 'Carcassonne',
        description: 'Juego de estrategia medieval para construir ciudades.',
        price: 49990,
        category: 'Juegos de mesa',
        image: '/images/Juegos de mesa/Carcassonne.jpg',
        stock: 12
      },
      {
        id: 10,
        name: 'Catan',
        description: 'Juego de colonización y comercio en una isla.',
        price: 59990,
        category: 'Juegos de mesa',
        image: '/images/Juegos de mesa/Catán.webp',
        stock: 10
      },
      {
        id: 11,
        name: 'Monopoly',
        description: 'Clásico juego de propiedades y negocios.',
        price: 39990,
        category: 'Juegos de mesa',
        image: '/images/Juegos de mesa/Monopoly.jpg',
        stock: 15
      },
      {
        id: 12,
        name: 'Risk',
        description: 'Juego de estrategia global de conquista territorial.',
        price: 54990,
        category: 'Juegos de mesa',
        image: '/images/Juegos de mesa/Risk.jpg',
        stock: 8
      },
      // Mouses
      {
        id: 13,
        name: 'HyperX Pulsefire',
        description: 'Mouse gaming ergonómico con sensor óptico preciso.',
        price: 69990,
        category: 'Mouses',
        image: '/images/Mouses/HyperX Pulsefire.webp',
        stock: 18
      },
      {
        id: 14,
        name: 'Logitech G502',
        description: 'Mouse gaming con 11 botones programables.',
        price: 89990,
        category: 'Mouses',
        image: '/images/Mouses/Logitech G502.webp',
        stock: 14
      },
      {
        id: 15,
        name: 'Razer DeathAdder',
        description: 'Mouse ergonómico con sensor óptico de 16,000 DPI.',
        price: 79990,
        category: 'Mouses',
        image: '/images/Mouses/Razer DeathAdder.webp',
        stock: 16
      },
      {
        id: 16,
        name: 'SteelSeries Rival 3',
        description: 'Mouse gaming ligero con iluminación RGB.',
        price: 64990,
        category: 'Mouses',
        image: '/images/Mouses/SteelSeries Rival 3 –.webp',
        stock: 20
      },
      // Pc Gamers
      {
        id: 17,
        name: 'PC Alienware',
        description: 'PC gaming de alto rendimiento con RTX 3080.',
        price: 1999990,
        category: 'Pc Gamers',
        image: '/images/Pc Gamers/PC Alienware.webp',
        stock: 2
      },
      {
        id: 18,
        name: 'PC ASUS ROG Strix',
        description: 'PC gaming con componentes premium y RGB.',
        price: 1799990,
        category: 'Pc Gamers',
        image: '/images/Pc Gamers/PC ASUS ROG Strix.png',
        stock: 3
      },
      {
        id: 19,
        name: 'PC HP Omen',
        description: 'PC gaming equilibrado para gaming competitivo.',
        price: 1499990,
        category: 'Pc Gamers',
        image: '/images/Pc Gamers/PC HP Omen.jpg',
        stock: 4
      },
      {
        id: 20,
        name: 'PC MSI Gaming',
        description: 'PC gaming con enfriamiento avanzado.',
        price: 1699990,
        category: 'Pc Gamers',
        image: '/images/Pc Gamers/PC MSI Gaming.jpg',
        stock: 3
      },
      // Poleras
      {
        id: 21,
        name: 'Polera Gamer 1',
        description: 'Polera cómoda para gamers con diseño único.',
        price: 29990,
        category: 'Poleras',
        image: '/images/Poleras/640 (1).webp',
        stock: 30
      },
      {
        id: 22,
        name: 'Polera Gamer 2',
        description: 'Polera con estampado de juegos.',
        price: 34990,
        category: 'Poleras',
        image: '/images/Poleras/3396_1.png',
        stock: 25
      },
      {
        id: 23,
        name: 'Polera God of War',
        description: 'Polera inspirada en God of War.',
        price: 39990,
        category: 'Poleras',
        image: '/images/Poleras/PLR-GOW.jpg',
        stock: 20
      },
      {
        id: 24,
        name: 'Polera Papa Gamer',
        description: 'Polera divertida para papás gamers.',
        price: 32990,
        category: 'Poleras',
        image: '/images/Poleras/polera-papa-de-dia-gamer-de-noche.jpg',
        stock: 22
      },
      // Polerones
      {
        id: 25,
        name: 'Polerón Gamer 1',
        description: 'Polerón abrigado para sesiones largas de gaming.',
        price: 59990,
        category: 'Polerones',
        image: '/images/Polerones/1132_9.png',
        stock: 15
      },
      {
        id: 26,
        name: 'Polerón Gamer 2',
        description: 'Polerón con capucha y diseño moderno.',
        price: 64990,
        category: 'Polerones',
        image: '/images/Polerones/9704_9.png',
        stock: 12
      },
      {
        id: 27,
        name: 'Polerón Smash Bros Vintage',
        description: 'Polerón inspirado en Super Smash Bros con colores vintage.',
        price: 69990,
        category: 'Polerones',
        image: '/images/Polerones/poleron-smash-bros-vintage-colors.jpg',
        stock: 10
      },
      {
        id: 28,
        name: 'Polerón Smash Ultimate',
        description: 'Polerón de Super Smash Bros Ultimate.',
        price: 74990,
        category: 'Polerones',
        image: '/images/Polerones/poleron-smash-ultimate-2.jpg',
        stock: 8
      },
      // Portamouse
      {
        id: 29,
        name: 'HyperX Fury S',
        description: 'Portamouse gaming con diseño ergonómico.',
        price: 39990,
        category: 'Portamouse',
        image: '/images/Portamouse/HyperX Fury S.avif',
        stock: 18
      },
      {
        id: 30,
        name: 'Logitech G640',
        description: 'Portamouse de tela para precisión máxima.',
        price: 49990,
        category: 'Portamouse',
        image: '/images/Portamouse/Logitech G640.jpg',
        stock: 16
      },
      {
        id: 31,
        name: 'Razer Goliathus',
        description: 'Portamouse con superficie de control óptima.',
        price: 44990,
        category: 'Portamouse',
        image: '/images/Portamouse/Razer Goliathus.png',
        stock: 20
      },
      {
        id: 32,
        name: 'SteelSeries QcK',
        description: 'Portamouse profesional para esports.',
        price: 52990,
        category: 'Portamouse',
        image: '/images/Portamouse/SteelSeries QcK.jpg',
        stock: 14
      },
      // Sillas
      {
        id: 33,
        name: 'Silla Cougar',
        description: 'Silla gaming ergonómica con soporte lumbar.',
        price: 299990,
        category: 'Sillas',
        image: '/images/Sillas/Silla Cougar.webp',
        stock: 5
      },
      {
        id: 34,
        name: 'Silla DXRacer',
        description: 'Silla premium para gaming con ajuste completo.',
        price: 399990,
        category: 'Sillas',
        image: '/images/Sillas/Silla DXRacer.jpg',
        stock: 4
      },
      {
        id: 35,
        name: 'Silla GT Omega',
        description: 'Silla gaming cómoda con diseño moderno.',
        price: 349990,
        category: 'Sillas',
        image: '/images/Sillas/Silla GT Omega.jpg',
        stock: 6
      },
      {
        id: 36,
        name: 'Silla SecretLab',
        description: 'Silla de alta gama con materiales premium.',
        price: 499990,
        category: 'Sillas',
        image: '/images/Sillas/Silla SecretLab.webp',
        stock: 3
      }
    ];

    this.users = [];

    this.orders = [];
    this.ofertas = [];

    // Guardar datos iniciales en localStorage
    this.saveToStorage();
  }

  // Métodos para persistencia en localStorage
  saveToStorage() {
    try {
      localStorage.setItem('dataStore_products', JSON.stringify(this.products));
      localStorage.setItem('dataStore_users', JSON.stringify(this.users));
      localStorage.setItem('dataStore_orders', JSON.stringify(this.orders));
      localStorage.setItem('dataStore_ofertas', JSON.stringify(this.ofertas));
    } catch (error) {
      console.warn('Error saving to localStorage:', error);
    }
  }

  loadFromStorage() {
    try {
      const products = localStorage.getItem('dataStore_products');
      const users = localStorage.getItem('dataStore_users');
      const orders = localStorage.getItem('dataStore_orders');
      const ofertas = localStorage.getItem('dataStore_ofertas');

      if (products) this.products = JSON.parse(products);
      if (users) this.users = JSON.parse(users);
      if (orders) this.orders = JSON.parse(orders);
      if (ofertas) this.ofertas = JSON.parse(ofertas);
    } catch (error) {
      console.warn('Error loading from localStorage:', error);
    }
  }

  // Operaciones CRUD para productos

  // CREATE
  createProduct(product) {
    const newProduct = {
      id: this.products.length + 1,
      ...product
    };
    this.products.push(newProduct);
    this.saveToStorage();
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
      this.saveToStorage();
      return this.products[index];
    }
    return null;
  }

  // DELETE
  deleteProduct(id) {
    const index = this.products.findIndex(product => product.id === id);
    if (index !== -1) {
      const deleted = this.products.splice(index, 1)[0];
      this.saveToStorage();
      return deleted;
    }
    return null;
  }

  // Operaciones CRUD para usuarios

  // CREATE
  createUser(user) {
    // Asignar ID basado en el rol
    let nextId = 1;
    if (user.role === 'admin') {
      // Para admins, encontrar el ID más alto entre admins
      const admins = this.users.filter(u => u.role === 'admin');
      if (admins.length > 0) {
        nextId = Math.max(...admins.map(u => u.id)) + 1;
      }
    } else {
      // Para usuarios normales, encontrar el ID más alto entre usuarios normales
      const normalUsers = this.users.filter(u => u.role !== 'admin');
      if (normalUsers.length > 0) {
        nextId = Math.max(...normalUsers.map(u => u.id)) + 1;
      }
    }

    const newUser = {
      id: nextId,
      ...user
    };
    this.users.push(newUser);
    this.saveToStorage();
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
      this.saveToStorage();
      return this.users[index];
    }
    return null;
  }

  // DELETE
  deleteUser(id) {
    // No permitir eliminar el admin principal (id: 0)
    if (id === 0) {
      return null;
    }

    const index = this.users.findIndex(user => user.id === id);
    if (index !== -1) {
      const deleted = this.users.splice(index, 1)[0];

      // Reorganizar IDs solo dentro del mismo rol
      if (deleted.role === 'admin') {
        const admins = this.users.filter(u => u.role === 'admin');
        admins.forEach((user, idx) => {
          user.id = idx + 1;
        });
      } else {
        const normalUsers = this.users.filter(u => u.role !== 'admin');
        normalUsers.forEach((user, idx) => {
          user.id = idx + 1;
        });
      }

      this.saveToStorage();
      return deleted;
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
    this.saveToStorage();
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
      this.saveToStorage();
      return this.orders[index];
    }
    return null;
  }

  // DELETE
  deleteOrder(id) {
    const index = this.orders.findIndex(order => order.id === id);
    if (index !== -1) {
      const deleted = this.orders.splice(index, 1)[0];
      this.saveToStorage();
      return deleted;
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

  // Operaciones CRUD para ofertas

  // CREATE
  createOferta(oferta) {
    const newOferta = {
      id: this.ofertas.length + 1,
      ...oferta
    };
    this.ofertas.push(newOferta);
    this.saveToStorage();
    return newOferta;
  }

  // READ
  getOfertas() {
    return [...this.ofertas];
  }

  getOfertaById(id) {
    return this.ofertas.find(oferta => oferta.id === id);
  }

  // UPDATE
  updateOferta(id, updatedOferta) {
    const index = this.ofertas.findIndex(oferta => oferta.id === id);
    if (index !== -1) {
      this.ofertas[index] = { ...this.ofertas[index], ...updatedOferta };
      this.saveToStorage();
      return this.ofertas[index];
    }
    return null;
  }

  // DELETE
  deleteOferta(id) {
    const index = this.ofertas.findIndex(oferta => oferta.id === id);
    if (index !== -1) {
      const deleted = this.ofertas.splice(index, 1)[0];
      this.saveToStorage();
      return deleted;
    }
    return null;
  }

  // Método para autenticación
  authenticateUser(identifier, password) {
    // Buscar por username o email
    const user = this.users.find(u =>
      (u.username === identifier || u.email === identifier) && u.password === password
    );
    return user ? { ...user, password: undefined } : null;
  }

  // Método para agregar al carrito con cantidad específica
  addToCart(producto, cantidad) {
    // Usar el contexto del carrito para agregar con cantidad
    // Como dataStore no tiene acceso directo al contexto, delegamos al CartContext
    // Esto se maneja desde ProductDetail.js directamente con el contexto
    console.log(`Agregando ${cantidad} unidades de ${producto.name} al carrito`);
  }

  // Asegurar que el admin principal siempre esté presente
  ensureDefaultAdmin() {
    const defaultAdmin = {
      id: 0,
      name: 'Benja',
      email: 'ben@gmail.com',
      username: 'benja',
      password: 'ben123',
      role: 'admin'
    };

    const existingAdmin = this.users.find(u => u.id === 0);
    if (!existingAdmin) {
      // Eliminar cualquier admin duplicado antes de agregar el principal
      this.users = this.users.filter(u => u.id !== 0);
      this.users.unshift(defaultAdmin);
      this.saveToStorage();
    } else {
      // Asegurar que tenga el rol correcto
      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        this.saveToStorage();
      }
    }
  }

  // Reviews persistence (stored under "reviews" key)
  _loadReviews() {
    try {
      const raw = localStorage.getItem('reviews');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }
  _saveReviews(reviews) {
    try {
      localStorage.setItem('reviews', JSON.stringify(reviews));
    } catch (e) { /* ignore */ }
  }
  getReviews(productId) {
    const reviews = this._loadReviews();
    if (typeof productId === 'undefined' || productId === null) return reviews;
    return reviews.filter(r => r.productId === parseInt(productId));
  }
  createReview(review) {
    const reviews = this._loadReviews();
    const newReview = {
      id: Date.now(), // simple id
      productId: parseInt(review.productId),
      name: review.name || 'Anónimo',
      email: review.email || '',
      rating: parseInt(review.rating) || 5,
      comment: review.comment || '',
      date: new Date().toISOString()
    };
    reviews.push(newReview);
    this._saveReviews(reviews);
    return newReview;
  }
  deleteReview(reviewId) {
    const reviews = this._loadReviews().filter(r => r.id !== reviewId);
    this._saveReviews(reviews);
  }
}

// Exportar una instancia singleton del DataStore
const dataStore = new DataStore();
export default dataStore;