import User from '../models/userModel.js';
import { generateToken, clearAuthCookie } from '../utils/generateToken.js';

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'A user account with this email address already exists.',
      });
    }

    // Create new user (password is automatically hashed by pre-save hook)
    const user = await User.create({
      name,
      email,
      password,
    });

    // Generate JWT and set HttpOnly cookie
    const token = generateToken(res, user._id, user.role);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Authenticate user and log in
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Fetch user including the password hash for comparison
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Generate JWT and set HttpOnly cookie
    const token = generateToken(res, user._id, user.role);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Log out current user and clear cookie
 * @route   POST /api/auth/logout
 * @access  Public
 */
export const logoutUser = async (req, res) => {
  clearAuthCookie(res);
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};

/**
 * @desc    Get currently logged in user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getCurrentUser = async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};
