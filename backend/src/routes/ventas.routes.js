import express from 'express';
import auth from '../middleware/auth.js';
import { createSale, getVentas } from '../controllers/venta.controller.js';

const router = express.Router();

router.post('/', auth, createSale);
router.get('/', auth, getVentas);

export default router;
