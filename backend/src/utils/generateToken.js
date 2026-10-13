import jwt from 'jsonwebtoken';

/**
 * Generate a JWT token and attach it to an HttpOnly cookie
 * @param {Object} res - Express response object
 * @param {string} userId - User document ID
 * @param {string} role - User role (user | admin)
 * @returns {string} The signed JWT string
 */
export const generateToken = (res, userId, role = 'user') => {
  const secret = process.env.JWT_SECRET || 'fallback_secret_for_development_mode_only';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  const token = jwt.sign({ id: userId, role }, secret, {
    expiresIn,
  });

  // Calculate milliseconds for cookie expiration (default: 7 days)
  const isProduction = process.env.NODE_ENV === 'production';
  const maxAge = 7 * 24 * 60 * 60 * 1000;

  if (res) {
    res.cookie('token', token, {
      httpOnly: true, // Not accessible via client-side JavaScript (mitigates XSS)
      secure: isProduction, // HTTPS only in production
      sameSite: isProduction ? 'none' : 'lax', // CSRF mitigation
      maxAge,
    });
  }

  return token;
};

/**
 * Clear the authentication cookie upon logout
 * @param {Object} res - Express response object
 */
export const clearAuthCookie = (res) => {
  if (res) {
    res.cookie('token', '', {
      httpOnly: true,
      expires: new Date(0),
    });
  }
};
