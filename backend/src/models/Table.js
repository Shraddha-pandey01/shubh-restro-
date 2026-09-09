import mongoose from 'mongoose';

const tableSchema = new mongoose.Schema(
  {
    tableNumber: {
      type: Number,
      required: [true, 'Please provide a table number'],
      unique: true,
      min: [1, 'Table number must be at least 1'],
    },
    capacity: {
      type: Number,
      required: [true, 'Please provide table capacity'],
      min: [1, 'Capacity must be at least 1 guest'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    location: {
      type: String,
      enum: ['Main Dining Hall', 'Private Alcove', 'Terrace Noir', 'Chef Table'],
      default: 'Main Dining Hall',
    },
  },
  {
    timestamps: true,
  }
);

export const Table = mongoose.model('Table', tableSchema);
export default Table;
