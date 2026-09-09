import { z } from 'zod';
import Booking from '../models/Booking.js';
import Table from '../models/Table.js';
import { generateReferenceId } from '../utils/generateReferenceId.js';
import { emitBookingCreated, emitBookingStatusChanged } from '../sockets/index.js';

export const createBookingSchema = z.object({
  guestName: z.string().min(2, 'Guest name is required'),
  guestPhone: z.string().min(5, 'Contact phone is required'),
  guestEmail: z.string().email().optional().or(z.literal('')),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be formatted as YYYY-MM-DD'),
  timeSlot: z.string().min(1, 'Dining time slot is required'),
  numberOfGuests: z.number().int().min(1).max(20),
  specialRequests: z.string().max(500).optional(),
});

export const updateBookingStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'cancelled']),
});

/**
 * @route POST /api/bookings
 * @desc Create new reservation with double-booking prevention
 * @access Public / OptionalAuth
 */
export const createBooking = async (req, res, next) => {
  try {
    const {
      guestName,
      guestPhone,
      guestEmail,
      date,
      timeSlot,
      numberOfGuests,
      specialRequests,
    } = req.body;

    // Double-booking check: find active tables suitable for party size
    const suitableTables = await Table.find({
      isActive: true,
      capacity: { $gte: numberOfGuests },
    }).sort({ capacity: 1 });

    let assignedTableId = null;

    if (suitableTables.length > 0) {
      // Find tables already booked at this exact date & timeSlot
      const busyBookings = await Booking.find({
        date,
        timeSlot,
        status: { $ne: 'cancelled' },
        tableId: { $in: suitableTables.map((t) => t._id) },
      }).select('tableId');

      const busyTableIds = new Set(busyBookings.map((b) => b.tableId?.toString()));
      const availableTable = suitableTables.find(
        (t) => !busyTableIds.has(t._id.toString())
      );

      if (availableTable) {
        assignedTableId = availableTable._id;
      }
    }

    const referenceId = generateReferenceId('BKG');

    const booking = await Booking.create({
      referenceId,
      customer: req.user ? req.user._id : null,
      guestName: guestName || req.user?.name || '',
      guestPhone: guestPhone || req.user?.phone || '',
      guestEmail: guestEmail || req.user?.email || '',
      date,
      timeSlot,
      numberOfGuests,
      tableId: assignedTableId,
      specialRequests: specialRequests || '',
      status: 'pending',
    });

    // Real-time broadcast
    emitBookingCreated(booking);

    res.status(201).json({
      success: true,
      message: 'Reservation requested successfully.',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route GET /api/bookings/lookup
 * @desc Lookup a reservation by reference ID and guest phone
 * @access Public
 */
export const lookupBooking = async (req, res, next) => {
  try {
    const { referenceId, phone } = req.query;

    if (!referenceId) {
      return res.status(400).json({
        success: false,
        message: 'Reservation reference ID is required.',
        data: null,
      });
    }

    const filter = { referenceId: referenceId.trim().toUpperCase() };
    if (phone) {
      const sanitizedPhone = phone.trim();
      // Match phone whether '+' was decoded to space or preserved
      const regexPattern = sanitizedPhone.replace(/^\+/, '').replace(/\s+/g, '\\s*');
      filter.guestPhone = { $regex: regexPattern, $options: 'i' };
    }

    const booking = await Booking.findOne(filter).populate('tableId', 'tableNumber location');
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'No reservation found matching the provided reference code and phone.',
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Reservation located.',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route GET /api/bookings/my-bookings
 * @desc Get authenticated customer's reservations
 * @access Private
 */
export const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ customer: req.user._id })
      .populate('tableId', 'tableNumber location')
      .sort({ date: -1, timeSlot: -1 });

    res.status(200).json({
      success: true,
      message: 'Customer reservations retrieved.',
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route GET /api/bookings
 * @desc Get all reservations (Admin only, filters: date, status)
 * @access Private/Admin
 */
export const getAllBookings = async (req, res, next) => {
  try {
    const { date, status } = req.query;
    const filter = {};

    if (date) filter.date = date;
    if (status && status !== 'all') filter.status = status;

    const bookings = await Booking.find(filter)
      .populate('tableId', 'tableNumber capacity location')
      .populate('customer', 'name email phone')
      .sort({ date: 1, timeSlot: 1 });

    res.status(200).json({
      success: true,
      message: 'Reservations retrieved successfully.',
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route PATCH /api/bookings/:id/status
 * @desc Update booking status & broadcast change
 * @access Private/Admin
 */
export const updateBookingStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const booking = await Booking.findById(id).populate('tableId');
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found.',
        data: null,
      });
    }

    booking.status = status;
    await booking.save();

    // Broadcast status change in real time
    emitBookingStatusChanged(booking);

    res.status(200).json({
      success: true,
      message: `Reservation marked as ${status}.`,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route PATCH /api/bookings/:id/cancel
 * @desc Cancel a reservation (by guest with referenceId or by customer)
 * @access Public / Private
 */
export const cancelBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { referenceId } = req.body;

    let booking;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      booking = await Booking.findById(id);
    } else {
      booking = await Booking.findOne({ referenceId: id });
    }

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found.',
        data: null,
      });
    }

    // Verify ownership if guest
    if (!req.user && referenceId && booking.referenceId !== referenceId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to cancel this booking.',
        data: null,
      });
    }

    booking.status = 'cancelled';
    await booking.save();

    emitBookingStatusChanged(booking);

    res.status(200).json({
      success: true,
      message: 'Reservation has been cancelled.',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  createBooking,
  lookupBooking,
  getMyBookings,
  getAllBookings,
  updateBookingStatus,
  cancelBooking,
};
