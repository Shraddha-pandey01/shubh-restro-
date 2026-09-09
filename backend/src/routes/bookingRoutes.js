import express from 'express';
import {
  createBooking,
  lookupBooking,
  getMyBookings,
  getAllBookings,
  updateBookingStatus,
  cancelBooking,
  createBookingSchema,
  updateBookingStatusSchema,
} from '../controllers/bookingController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminOnly.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.post('/', protect, validate(createBookingSchema), createBooking);
router.get('/lookup', lookupBooking);
router.get('/my-bookings', protect, getMyBookings);
router.patch('/:id/cancel', optionalAuth, cancelBooking);

// Admin routes
router.get('/', protect, adminOnly, getAllBookings);
router.patch('/:id/status', protect, adminOnly, validate(updateBookingStatusSchema), updateBookingStatus);

export default router;
