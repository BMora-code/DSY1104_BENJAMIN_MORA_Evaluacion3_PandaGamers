import dataStore from '../dataStore';

describe('DataStore', () => {
  beforeEach(() => {
    // Reiniciar el estado del dataStore antes de cada test
    // Nota: En un entorno real, podrías necesitar una función de reinicio
    // Por simplicidad, asumimos que los tests no interfieren entre sí
  });

  describe('Productos', () => {
    test('getProducts retorna todos los productos', () => {
      const products = dataStore.getProducts();
      expect(Array.isArray(products)).toBe(true);
      expect(products.length).toBeGreaterThan(0);
      expect(products[0]).toHaveProperty('id');
      expect(products[0]).toHaveProperty('name');
      expect(products[0]).toHaveProperty('price');
    });

    test('getProductById retorna el producto correcto', () => {
      const product = dataStore.getProductById(1);
      expect(product).toBeTruthy();
      expect(product.id).toBe(1);
    });

    test('getProductById retorna null para ID inexistente', () => {
      const product = dataStore.getProductById(999);
      expect(product).toBeNull();
    });

    test('getProductsByCategory filtra correctamente', () => {
      const electronics = dataStore.getProductsByCategory('Electrónicos');
      expect(Array.isArray(electronics)).toBe(true);
      electronics.forEach(product => {
        expect(product.category).toBe('Electrónicos');
      });
    });

    test('createProduct agrega un nuevo producto', () => {
      const newProduct = {
        name: 'Producto de Prueba',
        description: 'Descripción de prueba',
        price: 99.99,
        category: 'Pruebas',
        stock: 5
      };

      const createdProduct = dataStore.createProduct(newProduct);
      expect(createdProduct).toHaveProperty('id');
      expect(createdProduct.name).toBe(newProduct.name);
      expect(createdProduct.price).toBe(newProduct.price);

      // Verificar que se agregó a la lista
      const allProducts = dataStore.getProducts();
      const found = allProducts.find(p => p.id === createdProduct.id);
      expect(found).toBeTruthy();
    });

    test('updateProduct modifica un producto existente', () => {
      const updatedData = {
        name: 'Producto Actualizado',
        price: 199.99
      };

      const updatedProduct = dataStore.updateProduct(1, updatedData);
      expect(updatedProduct).toBeTruthy();
      expect(updatedProduct.name).toBe('Producto Actualizado');
      expect(updatedProduct.price).toBe(199.99);
      expect(updatedProduct.id).toBe(1);
    });

    test('updateProduct retorna null para ID inexistente', () => {
      const result = dataStore.updateProduct(999, { name: 'Test' });
      expect(result).toBeNull();
    });

    test('deleteProduct elimina un producto', () => {
      const initialLength = dataStore.getProducts().length;
      const deletedProduct = dataStore.deleteProduct(1);

      expect(deletedProduct).toBeTruthy();
      expect(deletedProduct.id).toBe(1);
      expect(dataStore.getProducts().length).toBe(initialLength - 1);
    });

    test('deleteProduct retorna null para ID inexistente', () => {
      const result = dataStore.deleteProduct(999);
      expect(result).toBeNull();
    });
  });

  describe('Usuarios', () => {
    test('getUsers retorna todos los usuarios', () => {
      const users = dataStore.getUsers();
      expect(Array.isArray(users)).toBe(true);
      expect(users.length).toBeGreaterThan(0);
    });

    test('authenticateUser funciona correctamente', () => {
      const user = dataStore.authenticateUser('admin', 'admin123');
      expect(user).toBeTruthy();
      expect(user.username).toBe('admin');
      expect(user.role).toBe('admin');
      expect(user).not.toHaveProperty('password');
    });

    test('authenticateUser retorna null para credenciales incorrectas', () => {
      const user = dataStore.authenticateUser('admin', 'wrongpassword');
      expect(user).toBeNull();
    });
  });

  describe('Órdenes', () => {
    test('createOrder crea una nueva orden', () => {
      const orderData = {
        userId: 'testuser',
        items: [{ id: 1, nombre: 'Producto', precio: 10, cantidad: 1 }],
        subtotal: 10,
        iva: 1.9,
        total: 11.9
      };

      const order = dataStore.createOrder(orderData);
      expect(order).toHaveProperty('id');
      expect(order.userId).toBe('testuser');
      expect(order.total).toBe(11.9);
      expect(order).toHaveProperty('date');
    });

    test('getOrders retorna todas las órdenes', () => {
      const orders = dataStore.getOrders();
      expect(Array.isArray(orders)).toBe(true);
    });

    test('getOrderById retorna la orden correcta', () => {
      // Crear una orden primero
      const orderData = {
        userId: 'testuser',
        items: [],
        subtotal: 0,
        iva: 0,
        total: 0
      };
      const createdOrder = dataStore.createOrder(orderData);

      const foundOrder = dataStore.getOrderById(createdOrder.id);
      expect(foundOrder).toBeTruthy();
      expect(foundOrder.id).toBe(createdOrder.id);
    });
  });

  describe('Búsqueda y filtrado', () => {
    test('searchProducts busca por nombre', () => {
      const results = dataStore.searchProducts('Producto');
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeGreaterThan(0);
    });

    test('searchProducts busca por descripción', () => {
      const results = dataStore.searchProducts('Descripción');
      expect(Array.isArray(results)).toBe(true);
    });

    test('filterProductsByPrice filtra correctamente', () => {
      const results = dataStore.filterProductsByPrice(0, 50);
      expect(Array.isArray(results)).toBe(true);
      results.forEach(product => {
        expect(product.price).toBeGreaterThanOrEqual(0);
        expect(product.price).toBeLessThanOrEqual(50);
      });
    });
  });
});