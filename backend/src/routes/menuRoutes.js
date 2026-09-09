import express from 'express';
import {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleAvailability,
  menuItemCreateSchema,
  menuItemUpdateSchema,
} from '../controllers/menuController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminOnly.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.get('/', getMenuItems);
router.get('/:id', getMenuItemById);

// Admin protected endpoints
router.post('/', protect, adminOnly, validate(menuItemCreateSchema), createMenuItem);
router.put('/:id', protect, adminOnly, validate(menuItemUpdateSchema), updateMenuItem);
router.delete('/:id', protect, adminOnly, deleteMenuItem);
router.patch('/:id/availability', protect, adminOnly, toggleAvailability);

export default router;
