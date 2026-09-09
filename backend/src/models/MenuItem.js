import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a dish name'],
      trim: true,
      maxlength: [120, 'Name cannot exceed 120 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
      min: [0, 'Price must be positive'],
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
      enum: {
        values: [
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
        ],
        message: '{VALUE} is not a valid menu category',
      },
    },
    imageUrl: {
      type: String,
      required: [true, 'Please provide an image URL'],
      trim: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    isVeg: {
      type: Boolean,
      default: true,
    },
    tastingNotes: {
      type: String,
      default: '',
    },
    winePairing: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const MenuItem = mongoose.model('MenuItem', menuItemSchema);
export default MenuItem;
