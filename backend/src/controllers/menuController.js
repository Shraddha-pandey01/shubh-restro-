import { z } from 'zod';
import MenuItem from '../models/MenuItem.js';

// Zod Validation Schemas
export const menuItemCreateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(120),
  description: z.string().min(5, 'Description must be at least 5 characters').max(1000),
  price: z.number().min(0, 'Price must be positive'),
  category: z.enum([
    'Starters',
    'Main Course',
    'Main Courses',
    'Rice & Biryani',
    'Breads',
    'South Indian',
    'Snacks',
    'Desserts',
    'Beverages',
    'Chef Specialties',
  ]),
  imageUrl: z.string().url('Image URL must be valid'),
  isAvailable: z.boolean().optional().default(true),
  isVeg: z.boolean().optional().default(true),
  tastingNotes: z.string().optional(),
  winePairing: z.string().optional(),
});

export const menuItemUpdateSchema = menuItemCreateSchema.partial();

/**
 * @route GET /api/menu
 * @desc Retrieve all menu items with filtering
 * @access Public
 */
export const getMenuItems = async (req, res, next) => {
  try {
    const { category, search, isVeg, availableOnly } = req.query;
    const filter = {};

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (isVeg !== undefined) {
      filter.isVeg = isVeg === 'true';
    }

    if (availableOnly === 'true') {
      filter.isAvailable = true;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const items = await MenuItem.find(filter).sort({ category: 1, name: 1 });

    res.status(200).json({
      success: true,
      message: 'Menu items retrieved successfully.',
      data: items,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route GET /api/menu/:id
 * @desc Retrieve single dish details
 * @access Public
 */
export const getMenuItemById = async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found.',
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Menu item retrieved successfully.',
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route POST /api/menu
 * @desc Add new dish to menu
 * @access Private/Admin
 */
export const createMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.create(req.body);
    res.status(201).json({
      success: true,
      message: 'New dish added to menu.',
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route PUT /api/menu/:id
 * @desc Update existing dish
 * @access Private/Admin
 */
export const updateMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found.',
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Menu item updated successfully.',
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route DELETE /api/menu/:id
 * @desc Remove dish from menu
 * @access Private/Admin
 */
export const deleteMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found.',
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Menu item deleted successfully.',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route PATCH /api/menu/:id/availability
 * @desc Toggle dish availability
 * @access Private/Admin
 */
export const toggleAvailability = async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found.',
        data: null,
      });
    }

    item.isAvailable = !item.isAvailable;
    await item.save();

    res.status(200).json({
      success: true,
      message: `Dish marked as ${item.isAvailable ? 'available' : 'unavailable'}.`,
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleAvailability,
};
