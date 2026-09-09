import { z } from 'zod';
import Order from '../models/Order.js';
import MenuItem from '../models/MenuItem.js';
import { generateReferenceId } from '../utils/generateReferenceId.js';
import { emitOrderCreated, emitOrderStatusChanged } from '../sockets/index.js';

// Validation schema
export const createOrderSchema = z.object({
  guestName: z.string().min(2, 'Name is required'),
  guestPhone: z.string().min(5, 'Phone number is required'),
  guestEmail: z.string().email().optional().or(z.literal('')),
  orderType: z.enum(['pickup', 'delivery']).default('pickup'),
  address: z
    .object({
      street: z.string().optional(),
      city: z.string().optional(),
      postalCode: z.string().optional(),
      instructions: z.string().optional(),
    })
    .optional(),
  items: z
    .array(
      z.object({
        menuItemId: z.string().min(1, 'Menu item ID is required'),
        quantity: z.number().int().min(1, 'Quantity must be at least 1'),
      })
    )
    .min(1, 'Order must contain at least one item'),
  paymentMethod: z
    .enum(['pay_at_pickup', 'cash_on_delivery', 'card_at_counter', 'stripe_placeholder'])
    .default('pay_at_pickup'),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['received', 'preparing', 'ready', 'completed', 'cancelled']),
});

/**
 * @route POST /api/orders
 * @desc Create new order (guest or authenticated customer)
 * @access Public / OptionalAuth
 */
export const createOrder = async (req, res, next) => {
  try {
    const {
      guestName,
      guestPhone,
      guestEmail,
      orderType,
      address,
      items: requestedItems,
      paymentMethod,
    } = req.body;

    // Fetch and validate menu items to use current server pricing
    const itemIds = requestedItems.map((i) => i.menuItemId);
    const menuItems = await MenuItem.find({ _id: { $in: itemIds } });

    if (menuItems.length !== requestedItems.length) {
      return res.status(400).json({
        success: false,
        message: 'One or more items in the order do not exist in the menu.',
        data: null,
      });
    }

    // Check availability and map line items
    let subtotal = 0;
    const orderItems = requestedItems.map((reqItem) => {
      const dbItem = menuItems.find((m) => m._id.toString() === reqItem.menuItemId);
      if (!dbItem.isAvailable) {
        throw new Error(`The dish "${dbItem.name}" is currently unavailable.`);
      }

      const itemTotal = dbItem.price * reqItem.quantity;
      subtotal += itemTotal;

      return {
        menuItemId: dbItem._id,
        name: dbItem.name,
        price: dbItem.price,
        quantity: reqItem.quantity,
        imageUrl: dbItem.imageUrl,
      };
    });

    const tax = Math.round(subtotal * 0.1 * 100) / 100; // 10% tax
    const deliveryFee = orderType === 'delivery' ? 15 : 0;
    const totalAmount = Math.round((subtotal + tax + deliveryFee) * 100) / 100;

    const orderNumber = generateReferenceId('ORD');

    const order = await Order.create({
      orderNumber,
      customer: req.user ? req.user._id : null,
      guestName: guestName || req.user?.name || '',
      guestPhone: guestPhone || req.user?.phone || '',
      guestEmail: guestEmail || req.user?.email || '',
      items: orderItems,
      subtotal,
      tax,
      deliveryFee,
      totalAmount,
      orderType,
      address: address || {},
      status: 'received',
      paymentMethod,
      paymentStatus: 'pending',
    });

    // Real-time broadcast
    emitOrderCreated(order);

    res.status(201).json({
      success: true,
      message: 'Order placed successfully.',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route GET /api/orders/:id
 * @desc Get order details by ID or orderNumber
 * @access Public / Protected
 */
export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let order;

    // Check if ID is a valid MongoDB ObjectId or an orderNumber string
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(id).populate('customer', 'name email phone');
    } else {
      order = await Order.findOne({ orderNumber: id }).populate('customer', 'name email phone');
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.',
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order retrieved successfully.',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route GET /api/orders/my-orders
 * @desc Get authenticated customer's order history
 * @access Private
 */
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ customer: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Order history retrieved.',
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route GET /api/orders
 * @desc Get all orders (Admin only, filter by status)
 * @access Private/Admin
 */
export const getAllOrders = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status && status !== 'all') {
      filter.status = status;
    }

    const orders = await Order.find(filter)
      .populate('customer', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Orders retrieved successfully.',
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route PATCH /api/orders/:id/status
 * @desc Update order status & broadcast change
 * @access Private/Admin
 */
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.',
        data: null,
      });
    }

    order.status = status;
    if (status === 'completed') {
      order.paymentStatus = 'paid';
    }
    await order.save();

    // Broadcast status change in real time to admin and customer rooms
    emitOrderStatusChanged(order);

    res.status(200).json({
      success: true,
      message: `Order status updated to "${status}".`,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  createOrder,
  getOrderById,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
};
