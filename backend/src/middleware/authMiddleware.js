import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'it_is_jwt_secret'
      );

      const user = await User.findById(decoded.id).select('-passwordHash');
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User belonging to this token no longer exists.',
          data: null,
        });
      }

      req.user = user;
      return next();
    } catch {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. Invalid or expired token.',
        data: null,
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Please provide a valid token.',
      data: null,
    });
  }
};

/**
 * Optional authentication middleware.
 * Attaches user to req.user if a valid token is provided, but continues if not.
 */
export const optionalAuth = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'it_is_jwt_secret'
      );
      req.user = await User.findById(decoded.id).select('-passwordHash');
    } catch {
      // Ignore token verification errors for optional auth
    }
  }
  next();
};

export default protect;
