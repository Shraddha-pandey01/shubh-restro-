import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { app } from '../../src/server.js';
import User from '../../src/models/User.js';
import MenuItem from '../../src/models/MenuItem.js';
import Table from '../../src/models/Table.js';

describe('Orders, Bookings, Reviews, Gallery and CRM Integration Tests', () => {
  let adminToken = '';
  let customerToken = '';
  let customerId = '';
  let menuItem = null;
  let testOrderId = '';
  let testBookingRef = '';
  let testBookingId = '';
  let testReviewId = '';

  beforeAll(async () => {
    const mongoUri =
      process.env.MONGODB_URI ||
      'mongodb://127.0.0.1:27017/shubh_restro';

    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri);
    }

    // Ensure admin user exists and generate token
    let admin = await User.findOne({ role: 'admin' });

    if (!admin) {
      try {
        admin = await User.create({
          name: 'Shubham Pandey',
          email: 'admin@gmail.com',
          passwordHash: 'Admin123',
          role: 'admin',
        });
      } catch {
        admin = await User.findOne({ role: 'admin' });
      }
    }

    adminToken = jwt.sign(
      { id: admin._id, role: 'admin' },
      process.env.JWT_SECRET || 'it_is_jwt_secret'
    );

    // Authenticate or create customer
    let customer = await User.findOne({
      email: 'customer@gmail.com',
    });

    if (!customer) {
      try {
        customer = await User.create({
          name: 'Rahul Kumar',
          email: 'customer@gmail.com',
          passwordHash: 'Customer123!',
          role: 'customer',
        });
      } catch {
        customer = await User.findOne({ email: 'customer@gmail.com' });
      }
    }

    customerId = customer._id.toString();

    customerToken = jwt.sign(
      { id: customer._id, role: 'customer' },
      process.env.JWT_SECRET || 'it_is_jwt_secret'
    );

    // Ensure menu item
    menuItem = await MenuItem.findOne({ isAvailable: true });

    if (!menuItem) {
      menuItem = await MenuItem.create({
        name: 'Paneer Tikka',
        description: 'Delicious Indian cottage cheese tikka',
        price: 150,
        category: 'Starters',
        imageUrl:
          'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8',
        isAvailable: true,
      });
    }

    // Ensure at least one table
    const table = await Table.findOne({ isActive: true });

    if (!table) {
      await Table.create({
        tableNumber: 10,
        capacity: 4,
        location: 'Main Dining Hall',
      });
    }
  });

  afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  });

  describe('Order Lifecycle: /api/orders', () => {
    it('should reject unauthenticated order placement with 401', async () => {
      const res = await request(app)
        .post('/api/orders')
        .send({
          items: [
            {
              menuItemId: menuItem._id.toString(),
              quantity: 1,
            },
          ],
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should allow authenticated patron to place an order and compute tax and total accurately', async () => {
      const res = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          guestName: 'Amit Verma',
          guestPhone: '9876543210',
          orderType: 'delivery',
          address: {
            street: '12 MG Road',
            city: 'New Delhi',
            state: 'Delhi',
            postalCode: '110001',
            country: 'India',
          },
          items: [
            {
              menuItemId: menuItem._id.toString(),
              quantity: 2,
            },
          ],
          paymentMethod: 'pay_at_pickup',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('orderNumber');
      expect(res.body.data.orderNumber).toMatch(/^SHUBH-ORD-/);
      expect(res.body.data.items).toHaveLength(1);
      expect(res.body.data.subtotal).toBe(menuItem.price * 2);
      expect(res.body.data.deliveryFee).toBe(15);

      expect(res.body.data.totalAmount).toBe(
        Math.round(
          (menuItem.price * 2 +
            menuItem.price * 2 * 0.1 +
            15) *
            100
        ) / 100
      );

      testOrderId = res.body.data._id;
    });

    it('should allow customer to place an order and associate with customer ref', async () => {
      const res = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          guestName: 'Priya Singh',
          guestPhone: '9812345678',
          orderType: 'pickup',
          items: [
            {
              menuItemId: menuItem._id.toString(),
              quantity: 1,
            },
          ],
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.customer).toBe(customerId);
      expect(res.body.data.deliveryFee).toBe(0);
    });

    it('should retrieve customer order history via GET /api/orders/my-orders', async () => {
      const res = await request(app)
        .get('/api/orders/my-orders')
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('should retrieve order by orderId or orderNumber', async () => {
      const res = await request(app).get(
        `/api/orders/${testOrderId}`
      );

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data._id).toBe(testOrderId);
    });

    it('should allow admin to update order status via PATCH /api/orders/:id/status', async () => {
      const res = await request(app)
        .patch(`/api/orders/${testOrderId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          status: 'preparing',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('preparing');
    });
  });

  describe('Booking Lifecycle: /api/bookings', () => {
    it('should reject unauthenticated booking creation with 401', async () => {
      const res = await request(app)
        .post('/api/bookings')
        .send({
          date: '2026-11-20',
          timeSlot: '20:00',
          numberOfGuests: 2,
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should create reservation and generate reference ID for authenticated patron', async () => {
      const res = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          guestName: 'Neha Gupta',
          guestPhone: '9876543210',
          guestEmail: 'neha.gupta@gmail.com',
          date: '2026-11-20',
          timeSlot: '20:00',
          numberOfGuests: 2,
          specialRequests: 'Window table preferred, celebrating anniversary.',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.referenceId).toMatch(/^SHUBH-BKG-/);
      expect(res.body.data.status).toBe('pending');

      testBookingRef = res.body.data.referenceId;
      testBookingId = res.body.data._id;
    });

    it('should lookup reservation by reference ID and phone', async () => {
      const encodedPhone = encodeURIComponent('9876543210');

      const res = await request(app).get(
        `/api/bookings/lookup?referenceId=${testBookingRef}&phone=${encodedPhone}`
      );

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.referenceId).toBe(testBookingRef);
    });

    it('should allow admin to confirm reservation status', async () => {
      const res = await request(app)
        .patch(`/api/bookings/${testBookingId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          status: 'confirmed',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('confirmed');
    });

    it('should allow cancellation of booking', async () => {
      const res = await request(app)
        .patch(`/api/bookings/${testBookingId}/cancel`)
        .send({
          referenceId: testBookingRef,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('cancelled');
    });
  });

  describe('Reviews Moderation: /api/reviews', () => {
    it('should submit a guest review with pending status', async () => {
      const res = await request(app)
        .post('/api/reviews')
        .send({
          guestName: 'Rohit Mehta',
          rating: 5,
          text: 'Exceptional authentic flavors and exquisite service.',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('pending');

      testReviewId = res.body.data._id;
    });

    it('public reviews endpoint should only return approved reviews', async () => {
      const res = await request(app).get('/api/reviews');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(
        res.body.data.every((r) => r.status === 'approved')
      ).toBe(true);
    });

    it('should allow admin to approve a review', async () => {
      const res = await request(app)
        .patch(`/api/reviews/${testReviewId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          status: 'approved',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('approved');
    });
  });

  describe('Gallery & Admin CRM / Stats: /api/gallery & /api/admin', () => {
    it('should return public gallery items', async () => {
      const res = await request(app).get('/api/gallery');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should return admin dashboard stats', async () => {
      const res = await request(app)
        .get('/api/admin/stats')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('totalRevenue');
      expect(res.body.data).toHaveProperty('activeOrdersCount');
      expect(res.body.data).toHaveProperty('totalCustomersCount');
    });

    it('should return customer CRM list', async () => {
      const res = await request(app)
        .get('/api/admin/customers')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);

      const customerRecord = res.body.data.find(
        (c) => c.email === 'customer@gmail.com'
      );

      expect(customerRecord).toBeDefined();
      expect(customerRecord.totalOrders).toBeGreaterThan(0);
    });
  });
});