import swaggerJSDoc from 'swagger-jsdoc';

const definition = {
  openapi: '3.0.0',
  info: {
    title: 'PandaGamers API',
    version: '1.0.0',
    description: 'API REST para PandaGamers - documentación generada con swagger-jsdoc'
  },
  servers: [
    { url: process.env.API_URL || 'http://localhost:4000', description: 'Servidor local' }
  ]
};
// Añadir definición de seguridad bearerAuth para JWT
definition.components = {
  securitySchemes: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT'
    }
  },
  schemas: {
    User: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '64a1f2e9c2a4f5b6d7e8f901' },
        nombre: { type: 'string', example: 'Juan Perez' },
        email: { type: 'string', example: 'juan.perez@example.com' },
        role: { type: 'string', example: 'user' }
      }
    },
    AuthRequest: {
      type: 'object',
      required: ['email','password'],
      properties: {
        email: { type: 'string', example: 'juan.perez@example.com' },
        password: { type: 'string', example: 'secret123' }
      }
    },
    AuthResponse: {
      type: 'object',
      properties: {
        user: { $ref: '#/components/schemas/User' },
        token: { type: 'string', example: 'eyJhbGciOiJI...' }
      }
    },
    Product: {
      type: 'object',
      properties: {
        _id: { type: 'string', example: '64b2f4a1c3d2e5f678901234' },
        nombre: { type: 'string', example: 'PlayStation 4 Pro' },
        descripcion: { type: 'string', example: 'Consola usada en buen estado' },
        precio: { type: 'number', example: 349990 },
        stock: { type: 'integer', example: 5 },
        categoria: { type: 'string', example: 'Consolas' },
        imagen: { type: 'string', example: 'http://localhost:4000/images/Consolas/ps4pro.jpg' }
      }
    },
    ProductList: {
      type: 'array',
      items: { $ref: '#/components/schemas/Product' }
    },
    PaymentItem: {
      type: 'object',
      properties: {
        productoId: { type: 'string' },
        nombre: { type: 'string' },
        cantidad: { type: 'integer' },
        precio: { type: 'number' },
        precioTrasOferta: { type: 'number' },
        precioFinalGuardado: { type: 'number' }
      }
    },
    PaymentRequest: {
      type: 'object',
      properties: {
        total: { type: 'number' },
        shippingCost: { type: 'number' },
        shippingInfo: {
          type: 'object',
          properties: {
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            email: { type: 'string' },
            deliveryOption: { type: 'string', example: 'express' }
          }
        },
        items: {
          type: 'array',
          items: { $ref: '#/components/schemas/PaymentItem' }
        }
      }
    },
    Payment: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        userEmail: { type: 'string' },
        userName: { type: 'string' },
        subtotal: { type: 'number' },
        iva: { type: 'number' },
        shippingCost: { type: 'number' },
        total: { type: 'number' },
        status: { type: 'string', example: 'success' },
        items: { type: 'array', items: { $ref: '#/components/schemas/PaymentItem' } }
      }
    },
    PaymentResult: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        paymentId: { type: 'string' },
        items: { type: 'array', items: { $ref: '#/components/schemas/PaymentItem' } },
        allSold: { type: 'boolean' }
      }
    },
    Venta: {
      type: 'object',
      properties: {
        producto: { $ref: '#/components/schemas/Product' },
        cantidad: { type: 'integer' },
        total: { type: 'number' },
        precioUnitario: { type: 'number' },
        comprador: { type: 'string' },
        status: { type: 'string' }
      }
    },
    FilteredProducts: {
      type: 'object',
      properties: {
        count: { type: 'integer' },
        data: { $ref: '#/components/schemas/ProductList' }
      }
    },
    StockUpdateResponse: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        product: { $ref: '#/components/schemas/Product' }
      }
    },
    SaleCreated: {
      type: 'object',
      properties: {
        producto: { $ref: '#/components/schemas/Product' },
        cantidad: { type: 'integer' },
        total: { type: 'number' },
        fecha: { type: 'string', format: 'date-time' }
      }
    },
    ErrorResponse: {
      type: 'object',
      properties: { message: { type: 'string' } }
    }
  }
};

const options = {
  definition,
  // scan routes and controllers for JSDoc @openapi comments (best-effort)
  apis: ['./src/routes/*.js', './src/controllers/*.js']
};

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;
