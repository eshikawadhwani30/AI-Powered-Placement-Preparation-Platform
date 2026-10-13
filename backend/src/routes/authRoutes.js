import express from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import {
  validateRegister,
  validateLogin,
} from '../middleware/validatorMiddleware.js';

const router = express.Router();

router.post('/register', validateRegister, registerUser);
router.post('/login', validateLogin, loginUser);
router.post('/logout', logoutUser);
router.get('/me', protect, getCurrentUser);

export default router;
