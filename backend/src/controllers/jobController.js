import mongoose from 'mongoose';
import Job from '../models/jobModel.js';
import { calculateJobMatches } from '../services/recommendationService.js';

/**
 * @desc    Get all available job listings with filtering and pagination
 * @route   GET /api/jobs
 * @access  Public
 */
export const getAllJobs = async (req, res, next) => {
  try {
    const { search = '', location = '', page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const query = {};

    if (search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [{ title: regex }, { company: regex }, { requiredSkills: regex }];
    }

    if (location.trim()) {
      query.location = new RegExp(location.trim(), 'i');
    }

    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({
        success: true,
        count: 0,
        page: pageNum,
        totalPages: 1,
        data: [],
      });
    }

    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum);

    res.status(200).json({
      success: true,
      count: jobs.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      data: jobs,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single job listing details
 * @route   GET /api/jobs/:id
 * @access  Public
 */
export const getJobById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid job listing ID format.' });
    }

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job listing not found.' });
    }

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get personalized job recommendations based on user skills
 * @route   POST /api/jobs/recommendations
 * @access  Private
 */
export const getRecommendations = async (req, res, next) => {
  try {
    const userProfile = {
      skills: req.body.skills || req.user.skills || [],
      preferredJobRoles: req.body.preferredJobRoles || req.user.preferredJobRoles || [],
      preferredLocation: req.body.preferredLocation || req.user.preferredLocation || '',
    };

    let allJobs = [];
    if (mongoose.connection.readyState === 1) {
      allJobs = await Job.find({}).limit(50);
    }

    const recommendations = calculateJobMatches(userProfile, allJobs);

    res.status(200).json({
      success: true,
      count: recommendations.length,
      data: recommendations,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new job listing (Admin only)
 * @route   POST /api/jobs
 * @access  Private/Admin
 */
export const createJob = async (req, res, next) => {
  try {
    const {
      title,
      company,
      location,
      requiredSkills,
      experienceLevel,
      description,
      applicationUrl,
      source,
    } = req.body;

    if (!title || !company || !location || !description || !applicationUrl) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, company, location, description, and applicationUrl.',
      });
    }

    const job = await Job.create({
      title,
      company,
      location,
      requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : [],
      experienceLevel: experienceLevel || 'Entry-Level',
      description,
      applicationUrl,
      source: source || 'Campus Placement Drive',
      isSampleData: false,
    });

    res.status(201).json({
      success: true,
      message: 'Job listing created successfully',
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a job listing (Admin only)
 * @route   PUT /api/jobs/:id
 * @access  Private/Admin
 */
export const updateJob = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid job listing ID.' });
    }

    const job = await Job.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job listing not found.' });
    }

    res.status(200).json({
      success: true,
      message: 'Job listing updated successfully',
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a job listing (Admin only)
 * @route   DELETE /api/jobs/:id
 * @access  Private/Admin
 */
export const deleteJob = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid job listing ID.' });
    }

    const job = await Job.findByIdAndDelete(id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job listing not found.' });
    }

    res.status(200).json({
      success: true,
      message: 'Job listing deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
