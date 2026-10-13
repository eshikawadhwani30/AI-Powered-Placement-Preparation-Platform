import mongoose from 'mongoose';
import User from '../models/userModel.js';
import Job from '../models/jobModel.js';
import { DSAQuestion } from '../models/dsaModel.js';
import { AptitudeQuestion } from '../models/aptitudeModel.js';
import Resume from '../models/resumeModel.js';
import InterviewSession from '../models/interviewModel.js';

/**
 * @desc    Admin platform overview
 * @route   GET /api/admin/dashboard
 * @access  Private/Admin
 */
export const getAdminDashboard = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({
        success: true,
        data: {
          users: 0,
          jobs: 0,
          dsaQuestions: 0,
          aptitudeQuestions: 0,
          resumes: 0,
          interviews: 0,
        },
      });
    }

    const [users, jobs, dsaQuestions, aptitudeQuestions, resumes, interviews] = await Promise.all([
      User.countDocuments(),
      Job.countDocuments(),
      DSAQuestion.countDocuments(),
      AptitudeQuestion.countDocuments(),
      Resume.countDocuments(),
      InterviewSession.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      data: { users, jobs, dsaQuestions, aptitudeQuestions, resumes, interviews },
    });
  } catch (error) {
    next(error);
  }
};
