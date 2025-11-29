import mongoose from 'mongoose';
import Product from '../models/product.model.js';
import Venta from '../models/Venta.js';

// Simula un procesamiento de pago y registra ventas (incluso si el pago falla)
const processPayment = async (req, res) => {
  try {
    const { total, items = [], shippingCost = 0 } = req.body;
    const userEmail = req.user?.email || req.user?.id || 'anonymous';

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Items son requeridos' });
    }

    // Preparar resultados por item
    const results = [];

    // Simular fallo de pago aleatorio: 20% de probabilidad
    const paymentFailed = Math.random() < 0.2;

    for (const it of items) {
      const qty = Number(it.cantidad || it.qty || it.quantity || 1);
      // Soportar varios nombres de campo para id
      const productId = it.productId || it.id || it._id || it.productoId;

      let product = null;
      if (productId && mongoose.Types.ObjectId.isValid(String(productId))) {
        product = await Product.findById(productId).exec();
      }

      // Determinar precio unitario: preferir precioFinalGuardado, luego precio del producto
      const precioUnitario = Number(it.precioFinalGuardado ?? it.precio ?? it.price ?? (product ? product.precio : 0));
      const ventaTotal = precioUnitario * qty;

      // Si el pago falló, no descontar stock; registrar venta con status 'failed'
      if (paymentFailed) {
        const venta = new Venta({ producto: product ? product._id : undefined, cantidad: qty, total: ventaTotal, precioUnitario, comprador: userEmail, status: 'failed', reason: 'payment_failed' });
        await venta.save();
        results.push({ producto: product ? { _id: product._id, nombre: product.nombre } : null, cantidad: qty, precioUnitario, total: ventaTotal, status: 'failed' });
        continue;
      }

      // En caso de pago exitoso, intentar descontar stock de forma atómica
      if (!product) {
        // No encontrado por id, intentar buscar por nombre si viene
        if (it.nombre || it.name) {
          product = await Product.findOne({ nombre: it.nombre || it.name }).exec();
        }
      }

      if (!product) {
        // No existe el producto, registrar venta fallida
        const venta = new Venta({ cantidad: qty, total: ventaTotal, precioUnitario, comprador: userEmail, status: 'failed', reason: 'product_not_found' });
        await venta.save();
        results.push({ producto: null, cantidad: qty, precioUnitario, total: ventaTotal, status: 'failed', reason: 'product_not_found' });
        continue;
      }

      // Intentar descontar stock atomically
      const updated = await Product.findOneAndUpdate(
        { _id: product._id, stock: { $gte: qty } },
        { $inc: { stock: -qty } },
        { new: true }
      ).exec();

      if (!updated) {
        // stock insuficiente
        const venta = new Venta({ producto: product._id, cantidad: qty, total: ventaTotal, precioUnitario, comprador: userEmail, status: 'failed', reason: 'stock_insufficient' });
        await venta.save();
        results.push({ producto: { _id: product._id, nombre: product.nombre }, cantidad: qty, precioUnitario, total: ventaTotal, status: 'failed', reason: 'stock_insufficient' });
        continue;
      }

      // Stock descontado y venta exitosa
      const venta = new Venta({ producto: product._id, cantidad: qty, total: ventaTotal, precioUnitario, comprador: userEmail, status: 'sold' });
      await venta.save();
      results.push({ producto: { _id: product._id, nombre: product.nombre }, cantidad: qty, precioUnitario, total: ventaTotal, status: 'sold' });
    }

    const overallStatus = paymentFailed ? 'failed' : 'success';
    return res.json({ success: !paymentFailed, status: overallStatus, items: results, total, shippingCost });
  } catch (e) {
    console.error('processPayment error', e);
    return res.status(500).json({ success: false, message: 'Error interno' });
  }
};

const getPaymentsForUser = async (req, res) => {
  try {
    const userEmail = req.user?.email || req.user?.id;
    if (!userEmail) return res.status(400).json([]);

    const ventas = await Venta.find({ comprador: userEmail }).sort({ createdAt: -1 }).populate({ path: 'producto', select: 'nombre descripcion precio imagen' }).exec();
    return res.json(ventas);
  } catch (e) {
    console.error('getPaymentsForUser error', e);
    return res.status(500).json({ message: 'Error interno' });
  }
};

export { processPayment, getPaymentsForUser };
