import mongoose from 'mongoose';
import fs from 'fs';
import Resume from '../models/resumeModel.js';
import Activity from '../models/activityModel.js';
import { extractTextFromPDF, analyzeResume } from '../services/resumeService.js';

/**
 * @desc    Upload PDF resume, extract text, and run AI analysis
 * @route   POST /api/resume/analyze
 * @access  Private
 */
export const uploadAndAnalyze = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No resume PDF file uploaded. Please upload a valid .pdf file.',
      });
    }

    const { targetJobDescription = '' } = req.body;
    const filePath = req.file.path;
    const fileName = req.file.originalname;
    const fileSize = req.file.size;

    // 1. Extract readable text from PDF
    const extractedText = await extractTextFromPDF(filePath);

    // 2. Perform AI / Gemini evaluation
    const analysis = await analyzeResume(extractedText, targetJobDescription);

    let savedResume = null;

    // 3. Save to MongoDB if database is connected
    if (mongoose.connection.readyState === 1) {
      savedResume = await Resume.create({
        user: req.user._id,
        fileName,
        fileSize,
        extractedText,
        targetJobDescription,
        score: analysis.overallScore,
        analysis,
      });

      // Log activity
      await Activity.create({
        user: req.user._id,
        type: 'resume_analyzed',
        title: 'Resume Analyzed by AI',
        description: `Analyzed "${fileName}" with estimated score of ${analysis.overallScore}/100`,
        metadata: {
          resumeId: savedResume._id,
          score: analysis.overallScore,
        },
      });
    }

    res.status(201).json({
      success: true,
      message: 'Resume analyzed successfully',
      data: savedResume || {
        _id: 'temp-session',
        fileName,
        fileSize,
        score: analysis.overallScore,
        analysis,
        targetJobDescription,
        createdAt: new Date(),
      },
    });
  } catch (error) {
    // Clean up temporary uploaded file if error occurs
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (e) {
        // Ignore unlink error
      }
    }
    next(error);
  }
};

/**
 * @desc    Get analysis history for authenticated user
 * @route   GET /api/resume/history
 * @access  Private
 */
export const getResumeHistory = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({ success: true, count: 0, data: [] });
    }

    const history = await Resume.find({ user: req.user._id })
      .select('-extractedText') // exclude full raw text from listing for faster payload
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: history.length,
      data: history,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get specific resume analysis by ID
 * @route   GET /api/resume/:id
 * @access  Private
 */
export const getResumeById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid resume ID format' });
    }

    const resume = await Resume.findById(id);

    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume analysis not found' });
    }

    // Verify user ownership (cannot view another student's resume!)
    if (resume.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You do not own this resume analysis.',
      });
    }

    res.status(200).json({
      success: true,
      data: resume,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a resume analysis by ID
 * @route   DELETE /api/resume/:id
 * @access  Private
 */
export const deleteResume = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid resume ID format' });
    }

    const resume = await Resume.findById(id);

    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume analysis not found' });
    }

    // Verify ownership
    if (resume.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You do not have permission to delete this resume.',
      });
    }

    await Resume.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Resume analysis deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
