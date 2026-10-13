import express from 'express';
import { getAdminDashboard } from '../controllers/adminController.js';
import { createJob, updateJob, deleteJob } from '../controllers/jobController.js';
import { createDSAQuestion } from '../controllers/dsaController.js';
import { createAptitudeQuestion } from '../controllers/aptitudeController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect, adminOnly);

router.get('/dashboard', getAdminDashboard);
router.post('/jobs', createJob);
router.put('/jobs/:id', updateJob);
router.delete('/jobs/:id', deleteJob);
router.post('/dsa/questions', createDSAQuestion);
router.post('/aptitude/questions', createAptitudeQuestion);

export default router;
