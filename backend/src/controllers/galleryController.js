import { z } from 'zod';
import GalleryImage from '../models/GalleryImage.js';

export const createGalleryImageSchema = z.object({
  imageUrl: z.string().min(1, 'Image URL is required'),
  caption: z.string().max(200).optional().default(''),
  category: z.enum(['Ambiance', 'Dishes', 'Beverages', 'Private Dining', 'Events', 'Cocktails']).default('Dishes'),
  order: z.number().int().optional().default(0),
});

export const updateGalleryImageSchema = createGalleryImageSchema.partial();

/**
 * @route GET /api/gallery
 * @desc Get all gallery images
 * @access Public
 */
export const getGalleryImages = async (req, res, next) => {
  try {
    const { category } = req.query;
    const filter = {};
    if (category && category !== 'All') {
      filter.category = category;
    }

    const images = await GalleryImage.find(filter).sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Gallery images retrieved.',
      data: images,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route POST /api/gallery
 * @desc Add new image to gallery
 * @access Private/Admin
 */
export const createGalleryImage = async (req, res, next) => {
  try {
    let imageUrl = req.body.imageUrl;

    // Handle uploaded file via multer if present
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an image URL or upload an image file.',
        data: null,
      });
    }

    const image = await GalleryImage.create({
      imageUrl,
      caption: req.body.caption || '',
      category: req.body.category || 'Dishes',
      order: req.body.order !== undefined ? Number(req.body.order) : 0,
    });

    res.status(201).json({
      success: true,
      message: 'Gallery image added successfully.',
      data: image,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route PUT /api/gallery/:id
 * @desc Update gallery image caption or ordering
 * @access Private/Admin
 */
export const updateGalleryImage = async (req, res, next) => {
  try {
    const { id } = req.params;
    let updateData = { ...req.body };

    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }

    const image = await GalleryImage.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Gallery image not found.',
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Gallery image updated successfully.',
      data: image,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route DELETE /api/gallery/:id
 * @desc Remove image from gallery
 * @access Private/Admin
 */
export const deleteGalleryImage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const image = await GalleryImage.findByIdAndDelete(id);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Gallery image not found.',
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Gallery image deleted.',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getGalleryImages,
  createGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
};
