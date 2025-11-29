import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: false },
  nombre: { type: String },
  cantidad: { type: Number, required: true },
  precioFinalGuardado: { type: Number, required: true },
  precioUnitario: { type: Number }
}, { _id: false });

const paymentSchema = new mongoose.Schema({
  userEmail: { type: String, default: '' },
  userName: { type: String, default: '' },
  items: { type: [itemSchema], default: [] },
  subtotalOriginal: { type: Number, default: 0 },
  discountAmount: { type: Number, default: 0 },
  subtotal: { type: Number, default: 0 },
  iva: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  shippingCost: { type: Number, default: 0 },
  status: { type: String, enum: ['success','failed','pending'], default: 'pending' },
  reason: { type: String }
}, { timestamps: true });

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
