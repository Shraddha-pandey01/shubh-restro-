import express from 'express';
import {
  getGalleryImages,
  createGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
  createGalleryImageSchema,
} from '../controllers/galleryController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminOnly.js';
import { upload } from '../middleware/upload.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.get('/', getGalleryImages);

// Admin routes (supports optional multer single file 'image')
router.post(
  '/',
  protect,
  adminOnly,
  upload.single('image'),
  (req, res, next) => {
    // If file uploaded, imageUrl can be generated from filename
    if (req.file) {
      req.body.imageUrl = `/uploads/${req.file.filename}`;
    }
    next();
  },
  validate(createGalleryImageSchema),
  createGalleryImage
);

router.put(
  '/:id',
  protect,
  adminOnly,
  upload.single('image'),
  updateGalleryImage
);

router.delete('/:id', protect, adminOnly, deleteGalleryImage);

export default router;
