import express from 'express';
import {
  getDSAQuestions,
  getDSAQuestionById,
  updateDSAProgress,
  getDSAStats,
  createDSAQuestion,
} from '../controllers/dsaController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/questions', protect, getDSAQuestions);
router.get('/questions/:id', protect, getDSAQuestionById);
router.post('/progress', protect, updateDSAProgress);
router.get('/progress', protect, getDSAStats);
router.post('/questions', protect, adminOnly, createDSAQuestion);

export default router;
