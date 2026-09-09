import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../src/server.js';
import User from '../../src/models/User.js';
import MenuItem from '../../src/models/MenuItem.js';

describe('Auth and Menu API Integration Tests', () => {
  let adminToken = '';
  let customerToken = '';
  let testItemId = '';

  beforeAll(async () => {
    const mongoUri =
      process.env.MONGODB_URI ||
      'mongodb://127.0.0.1:27017/shubh_restro';

    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri);
    }

    // Ensure an admin user exists for testing
    let admin = await User.findOne({
      email: 'admin@gmail.com',
    });

    if (!admin) {
      try {
        admin = await User.create({
          name: 'Shubham Pandey',
          email: 'admin@gmail.com',
          passwordHash: 'Admin@123',
          phone: '+91 9876543210',
          role: 'admin',
        });
      } catch {
        admin = await User.findOne({ email: 'admin@gmail.com' });
        if (admin) {
          admin.passwordHash = 'Admin@123';
          await admin.save();
        }
      }
    } else {
      admin.passwordHash = 'Admin@123';
      await admin.save();
    }

    // Ensure at least one menu item exists
    const itemCount = await MenuItem.countDocuments();

    if (itemCount === 0) {
      await MenuItem.create({
        name: 'Paneer Tikka',
        description:
          'Soft paneer cubes marinated in yogurt and aromatic Indian spices, grilled until smoky and served with mint chutney.',
        price: 280,
        category: 'Starters',
        imageUrl:
          'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=1200&q=80',
        isAvailable: true,
        isVeg: true,
      });
    }
  });

  afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  });

  describe('Health Endpoint', () => {
    it('should return operational health status with consistent shape', async () => {
      const res = await request(app).get('/api/health');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('message');
      expect(res.body).toHaveProperty('timestamp');
    });
  });

  describe('Auth Endpoints: /api/auth', () => {
    const uniqueEmail = `test.aarav.${Date.now()}@example.com`;

    it('should successfully register a customer with valid data and return { success, message, data: { user, token } }', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Aarav Verma',
          email: uniqueEmail,
          password: 'Password123!',
          phone: '+91 9876543212',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data.user).toHaveProperty(
        'email',
        uniqueEmail
      );
      expect(res.body.data.user.role).toBe('customer');

      customerToken = res.body.data.token;
    });

    it('should reject registration if email is duplicate with 409 status', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Rohan Verma',
          email: uniqueEmail,
          password: 'Password123!',
        });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.data).toBeNull();
    });

    it('should reject registration with invalid email or short password with 400', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Rahul Kumar',
          email: 'not-an-email',
          password: '123',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toBeDefined();
    });

    it('should authenticate registered customer via /api/auth/login', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: uniqueEmail,
          password: 'Password123!',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('token');
    });

    it('should reject login with incorrect password with 401', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: uniqueEmail,
          password: 'WrongPassword!',
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.data).toBeNull();
    });

    it('should authenticate admin user via /api/auth/admin-login', async () => {
      const res = await request(app)
        .post('/api/auth/admin-login')
        .send({
          email: 'admin@gmail.com',
          password: 'Admin@123',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.role).toBe('admin');

      adminToken = res.body.data.token;
    });

    it('should reject non-admin from /api/auth/admin-login with 401', async () => {
      const res = await request(app)
        .post('/api/auth/admin-login')
        .send({
          email: uniqueEmail,
          password: 'Password123!',
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should retrieve current user via /api/auth/me with valid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe(uniqueEmail);
    });

    it('should reject /api/auth/me without token with 401', async () => {
      const res = await request(app).get('/api/auth/me');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('Menu Endpoints: /api/menu', () => {
    it('should list menu items publicly via GET /api/menu', async () => {
      const res = await request(app).get('/api/menu');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);

      testItemId = res.body.data[0]._id;
    });

    it('should filter menu items by category', async () => {
      const res = await request(app).get(
        '/api/menu?category=Starters'
      );

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(
        res.body.data.every(
          (item) => item.category === 'Starters'
        )
      ).toBe(true);
    });

    it('should retrieve single item details via GET /api/menu/:id', async () => {
      const res = await request(app).get(
        `/api/menu/${testItemId}`
      );

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data._id).toBe(testItemId);
    });

    it('should return 404 for nonexistent menu item id', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();

      const res = await request(app).get(
        `/api/menu/${fakeId}`
      );

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it('should deny unauthorized user from POST /api/menu with 401', async () => {
      const res = await request(app)
        .post('/api/menu')
        .send({
          name: 'Hacked Paneer',
          description: 'Unauthorized dish',
          price: 199,
          category: 'Starters',
          imageUrl: 'https://example.com/hacked.jpg',
          isAvailable: true,
          isVeg: true,
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should deny customer (non-admin) from POST /api/menu with 403', async () => {
      const res = await request(app)
        .post('/api/menu')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          name: 'Forbidden Paneer Dish',
          description: 'Customer trying to add dish',
          price: 250,
          category: 'Starters',
          imageUrl: 'https://example.com/forbidden.jpg',
          isAvailable: true,
          isVeg: true,
        });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('should allow admin to create a menu item with valid data', async () => {
      const res = await request(app)
        .post('/api/menu')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Paneer Butter Masala',
          description:
            'Tender paneer cubes cooked in a rich tomato gravy with butter, cream, and traditional Indian spices.',
          price: 340,
          category: 'Main Courses',
          imageUrl:
            'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=1200&q=80',
          isAvailable: true,
          isVeg: true,
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe(
        'Paneer Butter Masala'
      );

      // Clean up newly created item
      const createdId = res.body.data._id;

      const delRes = await request(app)
        .delete(`/api/menu/${createdId}`)
        .set(
          'Authorization',
          `Bearer ${adminToken}`
        );

      expect(delRes.status).toBe(200);
      expect(delRes.body.success).toBe(true);
    });

    it('should allow admin to toggle menu item availability via PATCH /api/menu/:id/availability', async () => {
      const res = await request(app)
        .patch(
          `/api/menu/${testItemId}/availability`
        )
        .set(
          'Authorization',
          `Bearer ${adminToken}`
        );

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty(
        'isAvailable'
      );

      // Toggle back to original state
      await request(app)
        .patch(
          `/api/menu/${testItemId}/availability`
        )
        .set(
          'Authorization',
          `Bearer ${adminToken}`
        );
    });
  });
});
