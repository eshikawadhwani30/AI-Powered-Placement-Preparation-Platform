import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateProfileUpdate } from '../middleware/validatorMiddleware.js';

const router = express.Router();

router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, validateProfileUpdate, updateUserProfile);

export default router;
