import dotenv from 'dotenv';
import app from './src/app.js';
import { connectDB } from './config/db.js';

dotenv.config();

const PORT = process.env.PORT || 4000;

const start = async () => {
  try {
    await connectDB();
  } catch (e) {
    console.warn('No se pudo conectar a la DB:', e);
    // continuar para desarrollo aunque falle la conexión
  }

  app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
  });
};

start();
