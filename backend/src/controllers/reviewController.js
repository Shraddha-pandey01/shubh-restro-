import { z } from 'zod';
import Review from '../models/Review.js';

export const createReviewSchema = z.object({
  guestName: z.string().min(2, 'Name must be at least 2 characters').max(80),
  rating: z.number().int().min(1, 'Rating must be at least 1 star').max(5, 'Rating cannot exceed 5 stars'),
  text: z.string().min(5, 'Review must be at least 5 characters').max(1000),
});

export const updateReviewStatusSchema = z.object({
  status: z.enum(['pending', 'approved', 'hidden']),
});

/**
 * @route GET /api/reviews
 * @desc Get publicly visible approved reviews
 * @access Public
 */
export const getPublicReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ status: 'approved' })
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      message: 'Approved guest reviews retrieved.',
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route POST /api/reviews
 * @desc Submit new guest review (status defaults to pending)
 * @access Public / OptionalAuth
 */
export const submitReview = async (req, res, next) => {
  try {
    const { guestName, rating, text } = req.body;

    const review = await Review.create({
      customer: req.user ? req.user._id : null,
      guestName: req.user?.name || guestName,
      rating,
      text,
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for your review. It will be displayed once verified by management.',
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route GET /api/reviews/admin/all
 * @desc Get all reviews for moderation
 * @access Private/Admin
 */
export const getAllReviewsAdmin = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status && status !== 'all') {
      filter.status = status;
    }

    const reviews = await Review.find(filter)
      .populate('customer', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Reviews for moderation retrieved.',
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route PATCH /api/reviews/:id/status
 * @desc Approve or hide a review
 * @access Private/Admin
 */
export const updateReviewStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const review = await Review.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found.',
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: `Review marked as "${status}".`,
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route DELETE /api/reviews/:id
 * @desc Delete review permanently
 * @access Private/Admin
 */
export const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const review = await Review.findByIdAndDelete(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found.',
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully.',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getPublicReviews,
  submitReview,
  getAllReviewsAdmin,
  updateReviewStatus,
  deleteReview,
};
