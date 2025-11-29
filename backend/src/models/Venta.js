import mongoose from 'mongoose';

const ventaSchema = new mongoose.Schema({
  producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: false },
  cantidad: { type: Number, required: true },
  total: { type: Number, required: true },
  precioUnitario: { type: Number },
  comprador: { type: String, default: '' },
  // status y reason son opcionales; cuando la venta es exitosa no se establecen
  status: { type: String, enum: ['sold','failed'] },
  reason: { type: String }
}, { timestamps: true });

const Venta = mongoose.model('Venta', ventaSchema);
export default Venta;
