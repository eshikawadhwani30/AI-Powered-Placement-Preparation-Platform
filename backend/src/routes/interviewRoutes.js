import express from 'express';
import {
  startInterview,
  submitAnswer,
  getInterviewHistory,
  getInterviewById,
} from '../controllers/interviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/generate', protect, startInterview);
router.post('/evaluate', protect, submitAnswer);
router.get('/history', protect, getInterviewHistory);
router.get('/:id', protect, getInterviewById);

export default router;
