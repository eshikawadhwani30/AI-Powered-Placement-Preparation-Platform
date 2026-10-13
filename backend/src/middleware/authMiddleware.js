import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

/**
 * Reusable JWT Authentication Middleware
 * Checks authorization header (Bearer <token>) and cookies (token)
 */
export const protect = async (req, res, next) => {
  let token;

  // 1. Check for token in Authorization Header (Bearer token)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  // 2. Alternatively check for HttpOnly cookie
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // Token missing
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No authentication token provided.',
    });
  }

  try {
    const secret = process.env.JWT_SECRET || 'fallback_secret_for_development_mode_only';
    const decoded = jwt.verify(token, secret);

    // Fetch user without password hash
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Account not found. Authentication revoked.',
      });
    }

    // Attach authenticated user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Authentication token has expired. Please log in again.',
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid or malformed authentication token.',
    });
  }
};
