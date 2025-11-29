import express from 'express';
import { processPayment, getPaymentsForUser } from '../controllers/payment.controller.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth, processPayment);
router.get('/', auth, getPaymentsForUser);

export default router;
