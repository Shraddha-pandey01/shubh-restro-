import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { io as ioClient } from 'socket.io-client';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { app, server } from '../../src/server.js';
import MenuItem from '../../src/models/MenuItem.js';
import User from '../../src/models/User.js';

let adminUser = null;

describe('Socket.io Real-Time Automated Integration Test', () => {
  let clientSocket = null;
  let serverPort = 0;
  let testItem = null;

  beforeAll(async () => {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/shubh_restro';
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri);
    }

    testItem = await MenuItem.findOne({ isAvailable: true });
    if (!testItem) {
      testItem = await MenuItem.create({
        name: 'Paneer Makhani',
        description: 'Test dish for socket assertion',
        price: 90,
        category: 'Main Course',
        imageUrl: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8',
        isAvailable: true,
      });
    }

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
    adminUser = admin;

    // Start server on an ephemeral port
    await new Promise((resolve) => {
      server.listen(0, () => {
        const address = server.address();
        serverPort = typeof address === 'object' && address ? address.port : 5001;
        resolve();
      });
    });

    // Connect socket client
    clientSocket = ioClient(`http://localhost:${serverPort}`, {
      transports: ['websocket'],
      forceNew: true,
    });

    await new Promise((resolve) => {
      clientSocket.on('connect', () => {
        // Join admin broadcast room
        clientSocket.emit('join:admin');
        resolve();
      });
    });
  });

  afterAll(async () => {
    if (clientSocket && clientSocket.connected) {
      clientSocket.disconnect();
    }
    await new Promise((resolve) => server.close(resolve));
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  });

  it('should emit "order:created" event to admin room when an order is placed via API', async () => {
    const orderPromise = new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error('Timed out waiting for order:created socket event'));
      }, 7000);

      clientSocket.on('order:created', (data) => {
        clearTimeout(timer);
        resolve(data);
      });
    });

    const authToken = jwt.sign(
      { id: adminUser._id, role: 'admin' },
      process.env.JWT_SECRET || ''
    );

    // Trigger order creation via API
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        guestName: 'Realtime Socket Tester',
        guestPhone: '+91 9876543210',
        orderType: 'pickup',
        items: [{ menuItemId: testItem._id.toString(), quantity: 1 }],
        paymentMethod: 'pay_at_pickup',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    const createdOrderNumber = res.body.data.orderNumber;

    // Await the socket event arrival
    const socketPayload = await orderPromise;
    expect(socketPayload).toBeDefined();
    expect(socketPayload.orderNumber).toBe(createdOrderNumber);
    expect(socketPayload.guestName).toBe('Realtime Socket Tester');
  });

  it('should emit "order:status_changed" when order status is updated', async () => {
    const authToken = jwt.sign(
      { id: adminUser._id, role: 'admin' },
      process.env.JWT_SECRET || 'it_is_jwt_secret'
    );

    // Create an order first
    const createRes = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        guestName: 'Status Tester',
        guestPhone: '+91 9876543211',
        orderType: 'pickup',
        items: [{ menuItemId: testItem._id.toString(), quantity: 1 }],
      });

    const orderId = createRes.body.data._id;

    // Listen for status changed event
    const statusPromise = new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error('Timed out waiting for order:status_changed socket event'));
      }, 7000);

      clientSocket.on('order:status_changed', (data) => {
        if (data._id === orderId) {
          clearTimeout(timer);
          resolve(data);
        }
      });
    });

    // Trigger status update
    await request(app)
      .patch(`/api/orders/${orderId}/status`)
      .set('Authorization', `Bearer ${generateAdminToken()}`)
      .send({ status: 'preparing' });

    const statusPayload = await statusPromise;
    expect(statusPayload).toBeDefined();
    expect(statusPayload._id).toBe(orderId);
    expect(statusPayload.status).toBe('preparing');
  });
});

function generateAdminToken() {
  return jwt.sign(
    { id: adminUser._id.toString(), role: 'admin' },
    process.env.JWT_SECRET || 'it_is_jwt_secret',
    { expiresIn: '1h' }
  );
}
