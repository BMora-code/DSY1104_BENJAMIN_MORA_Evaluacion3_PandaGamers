import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     tags:
 *       - Users
 *     summary: Register a new user
 *     description: Crea un nuevo usuario y devuelve un token JWT.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthRequest'
 *     responses:
 *       '201':
 *         description: User created and token returned
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       '400':
 *         description: Bad request - missing fields
 *       '409':
 *         description: Conflict - user exists
 */
const registerUser = async (req, res) => {
  try {
    const { nombre, email, password, role } = req.body;
    if (!nombre || !email || !password) return res.status(400).json({ message: 'Faltan campos requeridos' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Usuario ya existe' });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    // role solo será tomado si está permitido; por defecto 'user'
    const userRole = ['admin', 'user'].includes(role) ? role : 'user';
    const user = new User({ nombre, email, password: hashed, role: userRole });
    await user.save();

    const token = jwt.sign({ id: user._id, email: user.email, role: user.role, nombre: user.nombre }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });

    return res.status(201).json({ user: { id: user._id, nombre: user.nombre, email: user.email, role: user.role }, token });
  } catch (error) {
    console.error('registerUser error', error);
    // Envío error.message en la respuesta temporalmente para depuración
    return res.status(500).json({ message: 'Error interno', error: error?.message || String(error) });
  }
};

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Users
 *     summary: Login user
 *     description: Autentica usuario y devuelve token JWT.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthRequest'
 *     responses:
 *       '200':
 *         description: Authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       '400':
 *         description: Bad request - missing fields
 *       '401':
 *         description: Unauthorized - invalid credentials
 */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Faltan campos requeridos' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Credenciales inválidas' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Credenciales inválidas' });

    const token = jwt.sign({ id: user._id, email: user.email, role: user.role, nombre: user.nombre }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });

    return res.json({ user: { id: user._id, nombre: user.nombre, email: user.email, role: user.role }, token });
  } catch (error) {
    console.error('loginUser error', error);
    return res.status(500).json({ message: 'Error interno' });
  }
};

export { registerUser, loginUser };
