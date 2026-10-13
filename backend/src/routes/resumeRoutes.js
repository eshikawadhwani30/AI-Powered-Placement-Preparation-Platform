import express from 'express';
import {
  uploadAndAnalyze,
  getResumeHistory,
  getResumeById,
  deleteResume,
} from '../controllers/resumeController.js';
import { protect } from '../middleware/authMiddleware.js';
import { handleUpload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/analyze', protect, handleUpload, uploadAndAnalyze);
router.get('/history', protect, getResumeHistory);
router.route('/:id')
  .get(protect, getResumeById)
  .delete(protect, deleteResume);

export default router;
