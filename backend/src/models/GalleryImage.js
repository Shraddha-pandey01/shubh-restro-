import mongoose from 'mongoose';

const galleryImageSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: [true, 'Please provide an image URL'],
      trim: true,
    },
    caption: {
      type: String,
      trim: true,
      default: '',
      maxlength: [200, 'Caption cannot exceed 200 characters'],
    },
    category: {
      type: String,
      enum: ['Ambiance', 'Dishes', 'Beverages', 'Private Dining', 'Events', 'Cocktails'],
      default: 'Dishes',
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const GalleryImage = mongoose.model('GalleryImage', galleryImageSchema);
export default GalleryImage;
