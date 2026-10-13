import mongoose from 'mongoose';
import InterviewSession from '../models/interviewModel.js';
import Activity from '../models/activityModel.js';
import { generateQuestions, evaluateAnswer } from '../services/interviewService.js';

/**
 * @desc    Generate a new interview session with AI questions
 * @route   POST /api/interview/generate
 * @access  Private
 */
export const startInterview = async (req, res, next) => {
  try {
    const {
      jobRole = 'Software Development Engineer (SDE-1)',
      category = 'Technical',
      difficulty = 'Intermediate',
      questionCount = 3,
    } = req.body;

    const validCategories = [
      'Technical',
      'HR',
      'DSA',
      'DBMS',
      'Operating Systems',
      'Computer Networks',
      'OOP',
      'Project-Based',
    ];

    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: `Invalid category. Must be one of: ${validCategories.join(', ')}`,
      });
    }

    // Generate questions with Gemini
    const questions = await generateQuestions(jobRole, category, difficulty, questionCount);

    let session = null;

    if (mongoose.connection.readyState === 1) {
      session = await InterviewSession.create({
        user: req.user._id,
        jobRole,
        category,
        difficulty,
        questions: questions.map((q) => ({
          questionText: q.questionText,
          userAnswer: '',
          rubricScore: null,
        })),
        averageScore: 0,
        status: 'in-progress',
      });
    }

    res.status(201).json({
      success: true,
      message: 'Interview session generated successfully',
      data: session || {
        _id: 'mock-session-' + Date.now(),
        jobRole,
        category,
        difficulty,
        questions: questions.map((q, i) => ({
          _id: `q-${i + 1}`,
          questionText: q.questionText,
        })),
        status: 'in-progress',
        createdAt: new Date(),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Submit student answer and receive rubric feedback from Gemini
 * @route   POST /api/interview/evaluate
 * @access  Private
 */
export const submitAnswer = async (req, res, next) => {
  try {
    const { sessionId, questionId, userAnswer } = req.body;

    if (!sessionId || !questionId) {
      return res.status(400).json({
        success: false,
        message: 'sessionId and questionId are required to evaluate an answer.',
      });
    }

    if (!userAnswer || userAnswer.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an answer before submitting for AI evaluation.',
      });
    }

    let session = null;
    let targetQuestion = null;

    if (mongoose.connection.readyState === 1) {
      session = await InterviewSession.findById(sessionId);

      if (!session) {
        return res.status(404).json({ success: false, message: 'Interview session not found.' });
      }

      // Verify ownership
      if (session.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Access denied: You do not own this interview session.',
        });
      }

      targetQuestion = session.questions.id(questionId);
      if (!targetQuestion) {
        return res.status(404).json({ success: false, message: 'Question not found in this session.' });
      }
    }

    const questionText = targetQuestion?.questionText || 'Explain your technical approach.';
    const jobRole = session?.jobRole || 'SDE';
    const category = session?.category || 'Technical';
    const difficulty = session?.difficulty || 'Intermediate';

    // Evaluate answer via Gemini
    const evaluation = await evaluateAnswer(questionText, userAnswer, jobRole, category, difficulty);

    if (session && targetQuestion) {
      targetQuestion.userAnswer = userAnswer;
      targetQuestion.rubricScore = evaluation.rubricScore;
      targetQuestion.relevance = evaluation.relevance;
      targetQuestion.technicalCorrectness = evaluation.technicalCorrectness;
      targetQuestion.missingConcepts = evaluation.missingConcepts;
      targetQuestion.areasForImprovement = evaluation.areasForImprovement;
      targetQuestion.suggestedBetterAnswer = evaluation.suggestedBetterAnswer;
      targetQuestion.evaluatedAt = new Date();

      // Recalculate session average score
      const evaluated = session.questions.filter((q) => q.rubricScore !== null);
      if (evaluated.length > 0) {
        const sum = evaluated.reduce((acc, q) => acc + q.rubricScore, 0);
        session.averageScore = Number((sum / evaluated.length).toFixed(1));
      }

      // If all questions are evaluated, mark session completed
      if (evaluated.length === session.questions.length) {
        session.status = 'completed';

        // Log activity
        await Activity.create({
          user: req.user._id,
          type: 'interview_completed',
          title: `Completed ${session.category} Mock Interview`,
          description: `Scored ${session.averageScore}/10 for ${session.jobRole}`,
          metadata: {
            sessionId: session._id,
            averageScore: session.averageScore,
          },
        });
      }

      await session.save();
    }

    res.status(200).json({
      success: true,
      message: 'Answer evaluated successfully',
      evaluation,
      session: session || null,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get interview session history for authenticated user
 * @route   GET /api/interview/history
 * @access  Private
 */
export const getInterviewHistory = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({ success: true, count: 0, data: [] });
    }

    const sessions = await InterviewSession.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: sessions.length,
      data: sessions,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single interview session by ID
 * @route   GET /api/interview/:id
 * @access  Private
 */
export const getInterviewById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid session ID format.' });
    }

    const session = await InterviewSession.findById(id);

    if (!session) {
      return res.status(404).json({ success: false, message: 'Interview session not found.' });
    }

    // Verify ownership
    if (session.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You do not own this session.',
      });
    }

    res.status(200).json({
      success: true,
      data: session,
    });
  } catch (error) {
    next(error);
  }
};
