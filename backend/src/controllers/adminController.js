import Order from '../models/Order.js';
import Booking from '../models/Booking.js';
import User from '../models/User.js';
import Review from '../models/Review.js';

/**
 * @route GET /api/admin/stats
 * @desc Get aggregated metrics for Admin Dashboard
 * @access Private/Admin
 */
export const getDashboardStats = async (_req, res, next) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [
      activeOrdersCount,
      totalOrdersCount,
      todayBookingsCount,
      totalCustomersCount,
      pendingReviewsCount,
      recentOrders,
      recentBookings,
    ] = await Promise.all([
      Order.countDocuments({ status: { $in: ['received', 'preparing', 'ready'] } }),
      Order.countDocuments({}),
      Booking.countDocuments({ createdAt: { $gte: todayStart } }),
      User.countDocuments({ role: 'customer' }),
      Review.countDocuments({ status: 'pending' }),
      Order.find().sort({ createdAt: -1 }).limit(5),
      Booking.find().sort({ createdAt: -1 }).limit(5),
    ]);

    // Calculate today's revenue and total revenue
    const revenueAgg = await Order.aggregate([
      {
        $facet: {
          totalRevenue: [
            { $match: { status: { $ne: 'cancelled' } } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } },
          ],
          todayRevenue: [
            {
              $match: {
                status: { $ne: 'cancelled' },
                createdAt: { $gte: todayStart },
              },
            },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } },
          ],
        },
      },
    ]);

    const totalRevenue = revenueAgg[0]?.totalRevenue[0]?.total || 0;
    const todayRevenue = revenueAgg[0]?.todayRevenue[0]?.total || 0;

    res.status(200).json({
      success: true,
      message: 'Dashboard metrics retrieved.',
      data: {
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        todayRevenue: Math.round(todayRevenue * 100) / 100,
        activeOrdersCount,
        totalOrdersCount,
        todayBookingsCount,
        totalCustomersCount,
        pendingReviewsCount,
        recentOrders,
        recentBookings,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route GET /api/admin/customers
 * @desc Retrieve customer list for CRM with spend and order counts
 * @access Private/Admin
 */
export const getCustomerCRM = async (_req, res, next) => {
  try {
    const customers = await User.find({ role: 'customer' })
      .select('-passwordHash')
      .sort({ createdAt: -1 });

    const crmData = await Promise.all(
      customers.map(async (customer) => {
        const [orders, bookings] = await Promise.all([
          Order.find({ customer: customer._id }),
          Booking.find({ customer: customer._id }),
        ]);

        const totalSpent = orders
          .filter((o) => o.status !== 'cancelled')
          .reduce((acc, o) => acc + o.totalAmount, 0);

        return {
          _id: customer._id,
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          createdAt: customer.createdAt,
          totalOrders: orders.length,
          totalSpent: Math.round(totalSpent * 100) / 100,
          totalBookings: bookings.length,
          lastActive: orders[0]?.createdAt || customer.createdAt,
        };
      })
    );

    res.status(200).json({
      success: true,
      message: 'Customer CRM data retrieved.',
      data: crmData,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route GET /api/admin/customers/:id
 * @desc Retrieve detailed profile, order history, and bookings for a specific customer
 * @access Private/Admin
 */
export const getCustomerDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    const customer = await User.findById(id).select('-passwordHash');
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found.',
        data: null,
      });
    }

    const [orders, bookings] = await Promise.all([
      Order.find({ customer: id }).sort({ createdAt: -1 }),
      Booking.find({ customer: id }).sort({ date: -1 }),
    ]);

    const totalSpent = orders
      .filter((o) => o.status !== 'cancelled')
      .reduce((acc, o) => acc + o.totalAmount, 0);

    res.status(200).json({
      success: true,
      message: 'Customer details retrieved.',
      data: {
        customer,
        totalOrders: orders.length,
        totalSpent: Math.round(totalSpent * 100) / 100,
        orders,
        bookings,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getDashboardStats,
  getCustomerCRM,
  getCustomerDetails,
};
