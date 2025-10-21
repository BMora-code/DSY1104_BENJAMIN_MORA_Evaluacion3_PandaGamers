// Archivo de datos simulados para la tienda React
// Actúa como una base de datos en memoria con operaciones CRUD

class DataStore {
  constructor() {
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
      // Juegos de mesa
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

    // Ofertas administradas por el admin
    this.ofertas = [];
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

  // Operaciones CRUD para ofertas

  // CREATE
  createOferta(oferta) {
    const newOferta = {
      id: this.ofertas.length + 1,
      ...oferta
    };
    this.ofertas.push(newOferta);
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
      return this.ofertas[index];
    }
    return null;
  }

  // DELETE
  deleteOferta(id) {
    const index = this.ofertas.findIndex(oferta => oferta.id === id);
    if (index !== -1) {
      return this.ofertas.splice(index, 1)[0];
    }
    return null;
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