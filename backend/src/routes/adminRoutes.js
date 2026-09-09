import express from 'express';
import {
  getDashboardStats,
  getCustomerCRM,
  getCustomerDetails,
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminOnly.js';

const router = express.Router();

router.use(protect, adminOnly);

router.get('/stats', getDashboardStats);
router.get('/customers', getCustomerCRM);
router.get('/customers/:id', getCustomerDetails);

export default router;
