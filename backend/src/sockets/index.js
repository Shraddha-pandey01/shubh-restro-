import { Server } from 'socket.io';

let ioInstance = null;

export const initSocket = (httpServer, clientUrl = 'http://localhost:5173') => {
  const io = new Server(httpServer, {
    cors: {
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        const isAllowed =
          origin === clientUrl ||
          origin === 'http://localhost:5173' ||
          origin === 'http://localhost:3000' ||
          origin === 'http://127.0.0.1:5173' ||
          /\.vercel\.app$/.test(new URL(origin).hostname) ||
          /^(http:\/\/localhost|http:\/\/127\.0\.0\.1)(:\d+)?$/.test(origin);

        if (isAllowed || process.env.NODE_ENV !== 'production') {
          return callback(null, true);
        }
        return callback(new Error(`Socket CORS origin ${origin} not allowed`));
      },
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log(`[Socket] Client connected: ${socket.id}`);

    // Join admin broadcast channel
    socket.on('join:admin', () => {
      socket.join('admin_room');
      console.log(`[Socket] ${socket.id} joined admin_room`);
    });

    // Join specific order tracking room
    socket.on('join:order', (orderId) => {
      if (orderId) {
        socket.join(`order:${orderId}`);
        console.log(`[Socket] ${socket.id} joined order:${orderId}`);
      }
    });

    // Join specific booking room
    socket.on('join:booking', (bookingId) => {
      if (bookingId) {
        socket.join(`booking:${bookingId}`);
        console.log(`[Socket] ${socket.id} joined booking:${bookingId}`);
      }
    });

    socket.on('disconnect', () => {
      console.log(`[Socket] Client disconnected: ${socket.id}`);
    });
  });

  ioInstance = io;
  return io;
};

/**
 * Access the active Socket.io instance anywhere in controllers.
 * @returns {Server}
 */
export const getIO = () => {
  return ioInstance;
};

/**
 * Emit event to admin room and optionally to a specific entity room.
 */
export const emitOrderCreated = (order) => {
  if (ioInstance) {
    ioInstance.to('admin_room').emit('order:created', order);
    ioInstance.emit('stats:updated');
  }
};

export const emitOrderStatusChanged = (order) => {
  if (ioInstance) {
    ioInstance.to('admin_room').emit('order:status_changed', order);
    ioInstance.to(`order:${order._id}`).emit('order:status_changed', order);
    ioInstance.emit('stats:updated');
  }
};

export const emitBookingCreated = (booking) => {
  if (ioInstance) {
    ioInstance.to('admin_room').emit('booking:created', booking);
    ioInstance.emit('stats:updated');
  }
};

export const emitBookingStatusChanged = (booking) => {
  if (ioInstance) {
    ioInstance.to('admin_room').emit('booking:status_changed', booking);
    ioInstance.to(`booking:${booking._id}`).emit('booking:status_changed', booking);
    ioInstance.emit('stats:updated');
  }
};

export default {
  initSocket,
  getIO,
  emitOrderCreated,
  emitOrderStatusChanged,
  emitBookingCreated,
  emitBookingStatusChanged,
};
