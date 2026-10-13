import express from 'express';
import {
  getAllJobs,
  getJobById,
  getRecommendations,
  createJob,
  updateJob,
  deleteJob,
} from '../controllers/jobController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/', getAllJobs);
router.post('/recommendations', protect, getRecommendations);
router.get('/:id', getJobById);

// Admin-only management endpoints
router.post('/', protect, adminOnly, createJob);
router.put('/:id', protect, adminOnly, updateJob);
router.delete('/:id', protect, adminOnly, deleteJob);

export default router;
