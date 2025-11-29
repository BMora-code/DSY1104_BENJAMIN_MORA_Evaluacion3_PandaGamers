import express from 'express';
import Payment from '../models/Payment.js';
import Venta from '../models/Venta.js';
import User from '../models/user.model.js';
import mongoose from 'mongoose';

const router = express.Router();

// Obtener payment por id
router.get('/payment/:id', async (req, res) => {
  try {
    const p = await Payment.findById(req.params.id).lean();
    if (!p) return res.status(404).json({ message: 'Payment no encontrado' });
    return res.json(p);
  } catch (e) {
    console.error('debug payment error', e);
    return res.status(500).json({ message: 'Error' });
  }
});

// Listar últimos payments
router.get('/payments', async (req, res) => {
  try {
    const list = await Payment.find().sort({ createdAt: -1 }).limit(50).lean();
    return res.json(list);
  } catch (e) {
    console.error('debug payments list error', e);
    return res.status(500).json({ message: 'Error' });
  }
});

// Listar últimas ventas
router.get('/ventas', async (req, res) => {
  try {
    const list = await Venta.find().sort({ createdAt: -1 }).limit(50).lean();
    return res.json(list);
  } catch (e) {
    console.error('debug ventas list error', e);
    return res.status(500).json({ message: 'Error' });
  }
});

// Listar últimos usuarios (solo para debugging/admin local)
router.get('/users', async (req, res) => {
  try {
    const list = await User.find().sort({ createdAt: -1 }).limit(100).lean();
    return res.json(list.map(u => ({ id: u._id, nombre: u.nombre, email: u.email, role: u.role, createdAt: u.createdAt })));
  } catch (e) {
    console.error('debug users list error', e);
    return res.status(500).json({ message: 'Error' });
  }
});

export default router;

// Ruta adicional para listar una colección arbitraria (útil para debugging local)
router.get('/collection/:name', async (req, res) => {
  const name = req.params.name;
  try {
    if (!name) return res.status(400).json({ message: 'Nombre de colección requerido' });
    const coll = mongoose.connection.db.collection(name);
    const docs = await coll.find({}).limit(200).toArray();
    return res.json({ count: docs.length, data: docs });
  } catch (e) {
    console.error('debug collection error', e);
    return res.status(500).json({ message: 'Error leyendo colección' });
  }
});

// Insertar un documento en una colección arbitraria (debug) - body: JSON del documento
router.post('/collection/:name', async (req, res) => {
  const name = req.params.name;
  const doc = req.body;
  try {
    if (!name) return res.status(400).json({ message: 'Nombre de colección requerido' });
    if (!doc || typeof doc !== 'object') return res.status(400).json({ message: 'Body JSON requerido' });
    const coll = mongoose.connection.db.collection(name);
    const result = await coll.insertOne(doc);
    return res.status(201).json({ insertedId: result.insertedId });
  } catch (e) {
    console.error('debug collection insert error', e && e.message ? e.message : e);
    return res.status(500).json({ message: 'Error insertando documento' });
  }
});

// Intentar listar bases de datos accesibles (puede fallar si el usuario no tiene privilegios)
router.get('/dbs', async (req, res) => {
  try {
    const admin = mongoose.connection.db.admin();
    const info = await admin.listDatabases();
    return res.json(info);
  } catch (e) {
    console.error('debug dbs error', e && e.message ? e.message : e);
    return res.status(500).json({ message: 'No se pudo listar bases de datos (privilegios insuficientes o error)' });
  }
});

// Listar colecciones en la DB conectada actualmente
router.get('/collections', async (req, res) => {
  try {
    const cols = await mongoose.connection.db.listCollections().toArray();
    return res.json(cols.map(c => c.name));
  } catch (e) {
    console.error('debug collections error', e && e.message ? e.message : e);
    return res.status(500).json({ message: 'No se pudo listar colecciones' });
  }
});

// Listar colecciones de una DB específica (pasar nombre en la ruta)
router.get('/collections/:dbName', async (req, res) => {
  const dbName = req.params.dbName;
  try {
    if (!dbName) return res.status(400).json({ message: 'dbName requerido' });
    const db = mongoose.connection.client.db(dbName);
    const cols = await db.listCollections().toArray();
    return res.json(cols.map(c => c.name));
  } catch (e) {
    console.error('debug collections db error', e && e.message ? e.message : e);
    return res.status(500).json({ message: 'No se pudo listar colecciones para la DB solicitada' });
  }
});
