import User from '../models/userModel.js';

/**
 * @desc    Get profile for currently authenticated user
 * @route   GET /api/users/profile
 * @access  Private
 */
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found.',
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update profile for currently authenticated user
 * @route   PUT /api/users/profile
 * @access  Private
 */
export const updateUserProfile = async (req, res, next) => {
  try {
    // Identity is strictly derived from req.user._id (never from req.body.id)
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found.',
      });
    }

    const {
      name,
      skills,
      preferredJobRoles,
      preferredLocation,
      profile,
      password,
    } = req.body;

    if (name) user.name = name;
    if (Array.isArray(skills)) user.skills = skills;
    if (Array.isArray(preferredJobRoles)) user.preferredJobRoles = preferredJobRoles;
    if (typeof preferredLocation === 'string') user.preferredLocation = preferredLocation;

    if (profile && typeof profile === 'object') {
      user.profile = {
        ...user.profile.toObject(),
        ...profile,
      };
    }

    // Update password if supplied
    if (password && password.trim().length >= 6) {
      user.password = password;
    }

    // Role cannot be escalated by regular users
    // user.role remains unchanged unless modified by an administrative process

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};
