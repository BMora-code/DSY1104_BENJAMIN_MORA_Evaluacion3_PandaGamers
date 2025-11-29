import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
	nombre: { type: String, required: true },
	descripcion: { type: String, default: '' },
	precio: { type: Number, required: true },
	stock: { type: Number, required: true },
	categoria: { type: String, default: '' },
	imagen: { type: String, default: '' },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;
