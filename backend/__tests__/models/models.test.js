import { describe, it, expect } from 'vitest';
import User from '../../src/models/User.js';
import MenuItem from '../../src/models/MenuItem.js';
import Table from '../../src/models/Table.js';
import Order from '../../src/models/Order.js';
import Booking from '../../src/models/Booking.js';
import Review from '../../src/models/Review.js';
import GalleryImage from '../../src/models/GalleryImage.js';

describe('Mongoose Models Schema Validation Unit Tests', () => {
  describe('User Model', () => {
    it('should fail validation when required fields are missing', () => {
      const user = new User({});
      const err = user.validateSync();
      expect(err).toBeDefined();
      expect(err.errors.name).toBeDefined();
      expect(err.errors.email).toBeDefined();
      expect(err.errors.passwordHash).toBeDefined();
    });

    it('should default role to customer', () => {
      const user = new User({
        name: 'Rahul Sharma',
        email: 'rahul.sharma@gmail.com',
        passwordHash: 'secret123',
      });
      expect(user.role).toBe('customer');
    });

    it('should fail on invalid email format', () => {
      const user = new User({
        name: 'Invalid Email User',
        email: 'invalid-email',
        passwordHash: 'secret123',
      });
      const err = user.validateSync();
      expect(err.errors.email).toBeDefined();
    });
  });

  describe('MenuItem Model', () => {
    it('should fail validation when required fields are missing', () => {
      const item = new MenuItem({});
      const err = item.validateSync();
      expect(err).toBeDefined();
      expect(err.errors.name).toBeDefined();
      expect(err.errors.price).toBeDefined();
      expect(err.errors.category).toBeDefined();
      expect(err.errors.imageUrl).toBeDefined();
    });

    it('should validate valid categories only', () => {
      const item = new MenuItem({
        name: 'Paneer Tikka',
        description: 'Chargrilled paneer cubes',
        price: 280,
        category: 'InvalidCategory',
        imageUrl: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8',
      });
      const err = item.validateSync();
      expect(err.errors.category).toBeDefined();
    });

    it('should pass validation with valid menu data and defaults', () => {
      const item = new MenuItem({
        name: 'Paneer Butter Masala',
        description: 'Fresh cottage cheese in rich tomato gravy',
        price: 340,
        category: 'Main Course',
        imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7',
      });
      const err = item.validateSync();
      expect(err).toBeUndefined();
      expect(item.isAvailable).toBe(true);
      expect(item.isVeg).toBe(true);
    });
  });

  describe('Table Model', () => {
    it('should fail when tableNumber or capacity is missing', () => {
      const table = new Table({});
      const err = table.validateSync();
      expect(err.errors.tableNumber).toBeDefined();
      expect(err.errors.capacity).toBeDefined();
    });

    it('should set default isActive to true', () => {
      const table = new Table({ tableNumber: 1, capacity: 4 });
      expect(table.isActive).toBe(true);
      expect(table.location).toBe('Main Dining Hall');
    });
  });

  describe('Order Model', () => {
    it('should require orderNumber, guestName, guestPhone, and at least one item', () => {
      const order = new Order({
        items: [],
      });
      const err = order.validateSync();
      expect(err.errors.orderNumber).toBeDefined();
      expect(err.errors.guestName).toBeDefined();
      expect(err.errors.guestPhone).toBeDefined();
      expect(err.errors.items).toBeDefined();
    });

    it('should default status to received', () => {
      const order = new Order({
        orderNumber: 'SHUBH-ORD-TEST1',
        guestName: 'Neha Gupta',
        guestPhone: '+91 9876543210',
        items: [
          {
            menuItemId: '507f1f77bcf86cd799439011',
            name: 'Paneer Butter Masala',
            price: 340,
            quantity: 1,
          },
        ],
        subtotal: 340,
        totalAmount: 374,
      });
      const err = order.validateSync();
      expect(err).toBeUndefined();
      expect(order.status).toBe('received');
      expect(order.orderType).toBe('pickup');
    });
  });

  describe('Booking Model', () => {
    it('should require referenceId, guestName, date, timeSlot, and numberOfGuests', () => {
      const booking = new Booking({});
      const err = booking.validateSync();
      expect(err.errors.referenceId).toBeDefined();
      expect(err.errors.guestName).toBeDefined();
      expect(err.errors.date).toBeDefined();
      expect(err.errors.timeSlot).toBeDefined();
      expect(err.errors.numberOfGuests).toBeDefined();
    });

    it('should default status to pending', () => {
      const booking = new Booking({
        referenceId: 'SHUBH-BKG-12345',
        guestName: 'Rahul Sharma',
        guestPhone: '+91 9876543210',
        date: '2026-10-15',
        timeSlot: '19:30',
        numberOfGuests: 2,
      });
      const err = booking.validateSync();
      expect(err).toBeUndefined();
      expect(booking.status).toBe('pending');
    });
  });

  describe('Review Model', () => {
    it('should validate rating range between 1 and 5', () => {
      const review = new Review({
        guestName: 'Sofia',
        rating: 6,
        text: 'Too good to be 5 stars',
      });
      const err = review.validateSync();
      expect(err.errors.rating).toBeDefined();
    });

    it('should default status to pending', () => {
      const review = new Review({
        guestName: 'Sofia',
        rating: 5,
        text: 'An unforgettable culinary voyage.',
      });
      const err = review.validateSync();
      expect(err).toBeUndefined();
      expect(review.status).toBe('pending');
    });
  });

  describe('GalleryImage Model', () => {
    it('should require imageUrl', () => {
      const image = new GalleryImage({});
      const err = image.validateSync();
      expect(err.errors.imageUrl).toBeDefined();
    });

    it('should set default category to Dishes and order to 0', () => {
      const image = new GalleryImage({
        imageUrl: 'https://example.com/gallery1.jpg',
      });
      expect(image.category).toBe('Dishes');
      expect(image.order).toBe(0);
    });
  });
});
