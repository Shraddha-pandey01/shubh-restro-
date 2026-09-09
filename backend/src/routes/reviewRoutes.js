import express from 'express';
import {
  getPublicReviews,
  submitReview,
  getAllReviewsAdmin,
  updateReviewStatus,
  deleteReview,
  createReviewSchema,
  updateReviewStatusSchema,
} from '../controllers/reviewController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminOnly.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.get('/', getPublicReviews);
router.post('/', optionalAuth, validate(createReviewSchema), submitReview);

// Admin routes
router.get('/admin/all', protect, adminOnly, getAllReviewsAdmin);
router.patch('/:id/status', protect, adminOnly, validate(updateReviewStatusSchema), updateReviewStatus);
router.delete('/:id', protect, adminOnly, deleteReview);

export default router;
