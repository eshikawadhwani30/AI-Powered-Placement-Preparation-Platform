import express from 'express';
import {
  generateRoadmap,
  getRoadmap,
  updateRoadmapTask,
} from '../controllers/roadmapController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/generate', protect, generateRoadmap);
router.get('/', protect, getRoadmap);
router.put('/tasks/:id', protect, updateRoadmapTask);

export default router;
