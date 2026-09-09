import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    referenceId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    guestName: {
      type: String,
      required: [true, 'Please provide guest name'],
      trim: true,
    },
    guestPhone: {
      type: String,
      required: [true, 'Please provide phone number'],
      trim: true,
    },
    guestEmail: {
      type: String,
      trim: true,
      default: '',
    },
    date: {
      type: String,
      required: [true, 'Please provide booking date (YYYY-MM-DD)'],
    },
    timeSlot: {
      type: String,
      required: [true, 'Please select a dining time slot'],
    },
    numberOfGuests: {
      type: Number,
      required: [true, 'Please specify the party size'],
      min: [1, 'Party size must be at least 1'],
      max: [20, 'For parties larger than 20, please contact management directly'],
    },
    tableId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Table',
      default: null,
    },
    specialRequests: {
      type: String,
      default: '',
      maxlength: 500,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
