import express from 'express';
import { getProducts, getFilteredProducts, updateStock, createProduct, getProductByName } from '../controllers/product.controller.js';

const router = express.Router();

router.get('/test', (req, res) => res.json({ message: 'Ruta /api/products activa' }));
router.get('/', getProducts);
router.post('/', createProduct);
router.get('/filter', getFilteredProducts);
router.patch('/:id/stock', updateStock);
router.get('/find', getProductByName);

export default router;
