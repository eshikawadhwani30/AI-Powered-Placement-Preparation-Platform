import express from 'express';
import {
  getAptitudeQuestions,
  startAptitudeTest,
  submitAptitudeTest,
  getAptitudeHistory,
} from '../controllers/aptitudeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/questions', protect, getAptitudeQuestions);
router.post('/start', protect, startAptitudeTest);
router.post('/submit', protect, submitAptitudeTest);
router.get('/history', protect, getAptitudeHistory);

export default router;
