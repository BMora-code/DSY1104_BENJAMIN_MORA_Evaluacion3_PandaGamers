import Product from '../models/product.model.js';

// Helper: proyectar campos que el frontend espera
const projectFields = {
	nombre: 1,
	descripcion: 1,
	precio: 1,
	stock: 1,
	categoria: 1,
	imagen: 1,
	createdAt: 1,
	updatedAt: 1,
};

/**
 * @openapi
 * /api/products:
 *   get:
 *     tags:
 *       - Products
 *     summary: List products with pagination
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Array of products
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductList'
 */
// GET / - devuelve productos con paginación (page, limit)
const getProducts = async (req, res) => {
	try {
		const page = Math.max(1, parseInt(req.query.page) || 1);
		const limit = Math.max(1, parseInt(req.query.limit) || 10);
		const skip = (page - 1) * limit;

		const products = await Product.find({}, projectFields).sort({ createdAt: -1 }).skip(skip).limit(limit);

		// Devuelve siempre un array (vacío si no hay productos) para evitar 404 en frontend
		return res.json(products);
	} catch (error) {
		console.error('getProducts error', error);
		return res.status(500).json({ message: 'Error interno' });
	}
};

/**
 * @openapi
 * /api/products:
 *   post:
 *     tags:
 *       - Products
 *     summary: Create a product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       '201':
 *         description: Product created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 */
// POST / - crear un nuevo producto
const createProduct = async (req, res) => {
	try {
		const { nombre, descripcion, precio, stock, categoria, imagen } = req.body;
		if (!nombre || precio === undefined || precio === null || stock === undefined || stock === null) {
			return res.status(400).json({ message: 'Faltan campos requeridos: nombre, precio, stock' });
		}

		const product = new Product({
			nombre,
			descripcion: descripcion || '',
			precio: Number(precio),
			stock: Number(stock),
			categoria: categoria || '',
			imagen: imagen || '',
		});

		const saved = await product.save();
		// devolver sólo los campos que espera el frontend
		const result = await Product.findById(saved._id, projectFields);
		return res.status(201).json(result);
	} catch (error) {
		console.error('createProduct error', error);
		return res.status(500).json({ message: 'Error interno' });
	}
};

/**
 * @openapi
 * /api/products/filter:
 *   get:
 *     tags:
 *       - Products
 *     summary: Filter products
 *     parameters:
 *       - in: query
 *         name: nombre
 *         schema:
 *           type: string
 *       - in: query
 *         name: precioMin
 *         schema:
 *           type: number
 *       - in: query
 *         name: precioMax
 *         schema:
 *           type: number
 *     responses:
 *       '200':
 *         description: Filter result
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FilteredProducts'
 */
// GET /filter - filtra por nombre (partial, case-insensitive) y rango de precio
const getFilteredProducts = async (req, res) => {
	try {
		const { nombre, precioMin, precioMax } = req.query;
		const filter = {};

		if (nombre) {
			filter.nombre = { $regex: nombre, $options: 'i' };
		}

		if (precioMin !== undefined || precioMax !== undefined) {
			filter.precio = {};
			if (precioMin !== undefined && precioMin !== '') filter.precio.$gte = Number(precioMin);
			if (precioMax !== undefined && precioMax !== '') filter.precio.$lte = Number(precioMax);
			if (Object.keys(filter.precio).length === 0) delete filter.precio;
		}

		const products = await Product.find(filter, projectFields).sort({ createdAt: -1 });
		return res.json({ count: products.length, data: products });
	} catch (error) {
		console.error('getFilteredProducts error', error);
		return res.status(500).json({ message: 'Error interno' });
	}
};

/**
 * @openapi
 * /api/products/{id}/stock:
 *   patch:
 *     tags:
 *       - Products
 *     summary: Update stock for a product
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               stock:
 *                 type: integer
 *     responses:
 *       '200':
 *         description: Stock updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StockUpdateResponse'
 */
// PATCH /:id/stock - actualiza stock de un producto
const updateStock = async (req, res) => {
	try {
		const { id } = req.params;
		const { stock } = req.body;
		if (stock === undefined || stock === null) return res.status(400).json({ message: 'Falta campo stock' });
		const cantidad = Number(stock);
		if (Number.isNaN(cantidad) || cantidad < 0) return res.status(400).json({ message: 'Stock inválido' });

		const product = await Product.findByIdAndUpdate(id, { stock: cantidad }, { new: true, select: projectFields });
		if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

		return res.json({ message: 'Stock actualizado', product });
	} catch (error) {
		console.error('updateStock error', error);
		return res.status(500).json({ message: 'Error interno' });
	}
};

const getAllProducts = getProducts;

/**
 * @openapi
 * /api/products/find:
 *   get:
 *     tags:
 *       - Products
 *     summary: Find product by exact name (case-insensitive)
 *     parameters:
 *       - in: query
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Product found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       '404':
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
// GET /find?name=... - buscar producto por nombre (case-insensitive)
const getProductByName = async (req, res) => {
	try {
		const name = req.query.name;
		if (!name) return res.status(400).json({ message: 'Falta query param name' });
		const prod = await Product.findOne({ nombre: { $regex: `^${name}$`, $options: 'i' } }, projectFields).lean();
		if (!prod) return res.status(404).json({ message: 'Producto no encontrado' });
		return res.json(prod);
	} catch (err) {
		console.error('getProductByName error', err);
		return res.status(500).json({ message: 'Error interno' });
	}
};

export { getProducts, getFilteredProducts, updateStock, createProduct, getAllProducts, getProductByName };

