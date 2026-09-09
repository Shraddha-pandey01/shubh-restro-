import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    menuItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MenuItem',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    imageUrl: {
      type: String,
      default: '',
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
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
      required: [true, 'Please provide contact name'],
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
    items: {
      type: [orderItemSchema],
      validate: [
        (items) => Array.isArray(items) && items.length > 0,
        'Order must contain at least one item',
      ],
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    tax: {
      type: Number,
      default: 0,
      min: 0,
    },
    deliveryFee: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    orderType: {
      type: String,
      enum: ['delivery', 'pickup'],
      default: 'pickup',
    },
    address: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      postalCode: { type: String, default: '' },
      instructions: { type: String, default: '' },
    },
    status: {
      type: String,
      enum: ['received', 'preparing', 'ready', 'completed', 'cancelled'],
      default: 'received',
      index: true,
    },
    paymentMethod: {
      type: String,
      enum: ['pay_at_pickup', 'cash_on_delivery', 'card_at_counter', 'stripe_placeholder'],
      default: 'pay_at_pickup',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

export const Order = mongoose.model('Order', orderSchema);
export default Order;
