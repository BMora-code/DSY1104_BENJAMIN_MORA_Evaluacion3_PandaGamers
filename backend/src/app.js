import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/user.routes.js';
import productRoutes from './routes/productRoutes.js';
import salesRoutes from './routes/sales.routes.js';
import ventasRoutes from './routes/ventas.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import debugRoutes from './routes/debug.routes.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger.js';

dotenv.config();

const app = express();
app.use(express.json());

// CORS dinámico: permitir uno o varios orígenes en desarrollo
const rawFrontends = process.env.FRONTEND_URL || 'http://localhost:3000';
const allowedOrigins = rawFrontends.split(',').map(s => s.trim()).filter(Boolean);
// añadir el puerto 3001 por compatibilidad local adicional
if (!allowedOrigins.includes('http://localhost:3001')) allowedOrigins.push('http://localhost:3001');

app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (like curl, mobile apps, or same-origin)
    if (!origin) return callback(null, true);
    // Allow explicit allowed origins
    if (allowedOrigins.indexOf(origin) !== -1) return callback(null, true);
    // Allow any localhost origin (different ports during development)
    try {
      const url = new URL(origin);
      if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
        return callback(null, true);
      }
    } catch (e) {
      // ignore parse errors
    }
    return callback(new Error('CORS not allowed for origin: ' + origin));
  },
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));

// simple logger
app.use((req, res, next) => {
  console.log(`--> ${req.method} ${req.path}`);
  next();
});


app.use('/api/auth', userRoutes);
app.use('/api/users', userRoutes);
// mount productos routes (single source of truth)
app.use('/api/products', productRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/ventas', ventasRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/debug', debugRoutes);

// Swagger UI - OpenAPI docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api-docs.json', (req, res) => res.json(swaggerSpec));

// health (root)
app.get('/', (req, res) => res.send('Backend funcionando'));

export default app;
