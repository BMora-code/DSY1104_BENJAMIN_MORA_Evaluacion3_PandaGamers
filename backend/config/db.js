import mongoose from "mongoose";

function maskUri(uri) {
  try {
    return uri.replace(/(:\/\/)([^:@\/\n]+)(:[^@\/\n]+)?@/, (m, p1, user, pass) => `${p1}${user}:****@`);
  } catch (e) {
    return uri;
  }
}

export const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  const dbName = process.env.MONGO_DB || 'pandagamerdb';
  if (!uri) {
    console.warn('MONGO_URI no está definido. Saltando conexión a MongoDB en desarrollo.');
    return;
  }

  try {
    await mongoose.connect(uri, { dbName });
    console.log(`✅ Conectado a MongoDB (db: ${dbName}) - ${maskUri(uri)}`);
  } catch (error) {
    console.error('❌ Error al conectar MongoDB:', error && error.message ? error.message : error);
    // No forzamos exit para facilitar desarrollo local cuando la DB no está disponible
  }
};