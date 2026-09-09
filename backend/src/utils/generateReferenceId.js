import crypto from 'crypto';

/**
 * Generate a branded reference ID for orders or bookings.
 * @param {'ORD' | 'BKG'} prefix
 * @returns {string}
 */
export const generateReferenceId = (prefix = 'ORD') => {
  const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  const randomSuffix = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `SHUBH-${prefix}-${dateStr}-${randomSuffix}`;
};

export default generateReferenceId;
