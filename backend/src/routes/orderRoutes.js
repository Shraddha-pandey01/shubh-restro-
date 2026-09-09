import express from 'express';
import {
  createOrder,
  getOrderById,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  createOrderSchema,
  updateOrderStatusSchema,
} from '../controllers/orderController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminOnly.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.post('/', protect, validate(createOrderSchema), createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/:id', optionalAuth, getOrderById);

// Admin endpoints
router.get('/', protect, adminOnly, getAllOrders);
router.patch('/:id/status', protect, adminOnly, validate(updateOrderStatusSchema), updateOrderStatus);

export default router;
