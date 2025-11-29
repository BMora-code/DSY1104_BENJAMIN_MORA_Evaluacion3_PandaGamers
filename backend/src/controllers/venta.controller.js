// Placeholder venta controller
import mongoose from 'mongoose';
import Venta from '../models/Venta.js';
import Product from '../models/product.model.js';

/**
 * @openapi
 * /api/sales:
 *   get:
 *     tags:
 *       - Sales
 *     summary: Get sales (ventas)
 *     description: Devuelve las ventas registradas. Requiere autenticación.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Array of ventas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Venta'
 */
const getVentas = async (req, res) => {
  try {
    // populate producto con sólo los campos requeridos: nombre, stock, precio
    const ventas = await Venta.find().sort({ createdAt: -1 }).populate({ path: 'producto', select: 'nombre stock precio' });
    return res.json(ventas);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Error interno' });
  }
};

/**
 * @openapi
 * /api/sales:
 *   post:
 *     tags:
 *       - Sales
 *     summary: Create a sale (venta)
 *     description: Crea una venta y descuenta stock si hay disponibilidad. Requiere autenticación.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productoId
 *               - cantidad
 *             properties:
 *               productoId:
 *                 type: string
 *               cantidad:
 *                 type: integer
 *     responses:
 *       '201':
 *         description: Sale created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SaleCreated'
 *       '400':
 *         description: Bad request or stock insufficient
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
// POST /api/sales - crear venta
const createSale = async (req, res) => {
  try {
    const { productoId, cantidad } = req.body;
    const qty = Number(cantidad);
    if (!productoId || !qty || qty <= 0) return res.status(400).json({ message: 'productoId y cantidad válidos son requeridos' });

    // Validar formato de ObjectId para evitar errores de cast en Mongoose
    if (!mongoose.Types.ObjectId.isValid(productoId)) {
      return res.status(400).json({ message: 'productoId inválido (debe ser ObjectId)' });
    }

    // Primero intentar descontar stock de forma atómica
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: productoId, stock: { $gte: qty } },
      { $inc: { stock: -qty } },
      { new: true }
    );

    if (!updatedProduct) {
      // comprobar si el producto existe
      const exists = await Product.findById(productoId);
      if (!exists) return res.status(404).json({ message: 'Producto no existe' });
      return res.status(400).json({ message: 'Stock insuficiente' });
    }

    const total = Number((updatedProduct.precio * qty).toFixed(2));

    const sale = new Venta({ producto: productoId, cantidad: qty, total, comprador: req.user?.email || req.user?.id || '' });
    const saved = await sale.save();
    const populated = await saved.populate({ path: 'producto', select: 'nombre descripcion precio categoria imagen' });

    return res.status(201).json({
      producto: populated.producto,
      cantidad: populated.cantidad,
      total: populated.total,
      fecha: populated.createdAt,
    });
  } catch (e) {
    console.error('createSale error', e);
    return res.status(500).json({ message: 'Error interno' });
  }
};

export { getVentas, createSale };
