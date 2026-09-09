/**
 * Restricts route access to users with the 'admin' role.
 * Must be used after `protect` middleware.
 */
export const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Administrator privileges are required.',
      data: null,
    });
  }
  next();
};

export default adminOnly;
