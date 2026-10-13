import mongoose from 'mongoose';
import { AptitudeQuestion, AptitudeAttempt } from '../models/aptitudeModel.js';
import Activity from '../models/activityModel.js';
import { scoreAptitudeAttempt, buildCategoryPerformance } from '../services/aptitudeService.js';

const CATEGORIES = [
  'Quantitative Aptitude',
  'Logical Reasoning',
  'Verbal Ability',
  'Data Interpretation',
];

/**
 * @desc    List aptitude questions without answers (practice catalog)
 * @route   GET /api/aptitude/questions
 * @access  Private
 */
export const getAptitudeQuestions = async (req, res, next) => {
  try {
    const { category, difficulty, page = 1, limit = 20 } = req.query;
    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 50);
    const skip = (pageNum - 1) * limitNum;

    const query = {};
    if (category && category !== 'All') query.category = category;
    if (difficulty && difficulty !== 'All') query.difficulty = difficulty;

    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({
        success: true,
        count: 0,
        total: 0,
        page: pageNum,
        totalPages: 1,
        data: [],
      });
    }

    const total = await AptitudeQuestion.countDocuments(query);
    const questions = await AptitudeQuestion.find(query)
      .select('-correctAnswerIndex -explanation')
      .sort({ category: 1, createdAt: 1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: questions.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      data: questions,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Start a timed aptitude attempt. Questions and timer are bound on the server.
 * @route   POST /api/aptitude/start
 * @access  Private
 */
export const startAptitudeTest = async (req, res, next) => {
  try {
    const { category, difficulty, count = 5, durationMinutes = 10 } = req.body;

    if (category && category !== 'Mixed' && !CATEGORIES.includes(category)) {
      return res.status(400).json({
        success: false,
        message: `Invalid category. Choose one of: ${CATEGORIES.join(', ')} or Mixed.`,
      });
    }

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'Database is not connected. Aptitude tests require MongoDB.',
      });
    }

    const query = {};
    if (category && category !== 'Mixed') query.category = category;
    if (difficulty && difficulty !== 'All') query.difficulty = difficulty;

    const requestedCount = Math.min(Math.max(parseInt(count, 10) || 5, 1), 15);
    const pool = await AptitudeQuestion.find(query).select('-correctAnswerIndex -explanation');

    if (pool.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No aptitude questions found for the selected filters. Ask an admin to seed questions.',
      });
    }

    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(requestedCount, shuffled.length));
    const durationLimitSeconds = Math.min(Math.max(parseInt(durationMinutes, 10) || 10, 1), 60) * 60;

    const attempt = await AptitudeAttempt.create({
      user: req.user._id,
      category: category && category !== 'Mixed' ? category : 'Mixed',
      status: 'in_progress',
      startedAt: new Date(),
      durationLimitSeconds,
      questionIds: selected.map((q) => q._id),
      totalQuestions: selected.length,
      correctAnswers: 0,
      scorePercentage: 0,
      timeTakenSeconds: 0,
      answers: [],
    });

    res.status(201).json({
      success: true,
      message: 'Aptitude test started. Answers are scored on the server after submission.',
      data: {
        attemptId: attempt._id,
        category: attempt.category,
        startedAt: attempt.startedAt,
        durationLimitSeconds,
        remainingSeconds: durationLimitSeconds,
        questions: selected.map((q, index) => ({
          _id: q._id,
          index: index + 1,
          question: q.question,
          category: q.category,
          difficulty: q.difficulty,
          options: q.options,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Submit answers; score is calculated only on the server
 * @route   POST /api/aptitude/submit
 * @access  Private
 */
export const submitAptitudeTest = async (req, res, next) => {
  try {
    const { attemptId, answers = [] } = req.body;

    if (!attemptId || !mongoose.Types.ObjectId.isValid(attemptId)) {
      return res.status(400).json({ success: false, message: 'Valid attemptId is required.' });
    }

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'Database is not connected. Cannot score aptitude tests.',
      });
    }

    const attempt = await AptitudeAttempt.findById(attemptId);
    if (!attempt) {
      return res.status(404).json({ success: false, message: 'Aptitude attempt not found.' });
    }

    if (attempt.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'You can only submit your own tests.' });
    }

    if (attempt.status === 'completed') {
      return res.status(400).json({ success: false, message: 'This attempt has already been submitted.' });
    }

    const questions = await AptitudeQuestion.find({
      _id: { $in: attempt.questionIds },
    }).select('+correctAnswerIndex +explanation');

    const ordered = attempt.questionIds
      .map((id) => questions.find((q) => q._id.toString() === id.toString()))
      .filter(Boolean);

    const result = scoreAptitudeAttempt(ordered, Array.isArray(answers) ? answers : []);

    const elapsed = Math.floor((Date.now() - new Date(attempt.startedAt).getTime()) / 1000);
    const timeTakenSeconds = Math.max(0, Math.min(elapsed, attempt.durationLimitSeconds || elapsed));

    attempt.status = 'completed';
    attempt.totalQuestions = result.totalQuestions;
    attempt.correctAnswers = result.correctAnswers;
    attempt.scorePercentage = result.scorePercentage;
    attempt.timeTakenSeconds = timeTakenSeconds;
    attempt.answers = result.details.map((d) => ({
      questionId: d.questionId,
      selectedOption: d.selectedOption,
      isCorrect: d.isCorrect,
    }));
    await attempt.save();

    await Activity.create({
      user: req.user._id,
      type: 'aptitude_submitted',
      title: `Completed ${attempt.category} aptitude test`,
      description: `Scored ${result.scorePercentage}% (${result.correctAnswers}/${result.totalQuestions})`,
      metadata: {
        attemptId: attempt._id,
        category: attempt.category,
        scorePercentage: result.scorePercentage,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Test scored on the server. Client-supplied scores are ignored.',
      data: {
        attemptId: attempt._id,
        category: attempt.category,
        totalQuestions: result.totalQuestions,
        correctAnswers: result.correctAnswers,
        scorePercentage: result.scorePercentage,
        timeTakenSeconds,
        results: result.details,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Aptitude history and topic-wise performance for the authenticated user
 * @route   GET /api/aptitude/history
 * @access  Private
 */
export const getAptitudeHistory = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({
        success: true,
        count: 0,
        data: [],
        performance: { byCategory: {}, weakTopics: [] },
      });
    }

    const attempts = await AptitudeAttempt.find({
      user: req.user._id,
      status: 'completed',
    })
      .sort({ createdAt: -1 })
      .limit(50)
      .select('-answers');

    const performance = buildCategoryPerformance(attempts);

    res.status(200).json({
      success: true,
      count: attempts.length,
      data: attempts,
      performance,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create aptitude question (Admin)
 * @route   POST /api/admin/aptitude/questions
 * @access  Private/Admin
 */
export const createAptitudeQuestion = async (req, res, next) => {
  try {
    const { question, category, difficulty, options, correctAnswerIndex, explanation } = req.body;

    if (!question || !category || !Array.isArray(options) || options.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Provide question, category, and at least two options.',
      });
    }

    if (!Number.isInteger(correctAnswerIndex) || correctAnswerIndex < 0 || correctAnswerIndex >= options.length) {
      return res.status(400).json({
        success: false,
        message: 'correctAnswerIndex must be a valid option index.',
      });
    }

    const created = await AptitudeQuestion.create({
      question,
      category,
      difficulty: difficulty || 'Medium',
      options,
      correctAnswerIndex,
      explanation: explanation || '',
    });

    res.status(201).json({
      success: true,
      message: 'Aptitude question created',
      data: created,
    });
  } catch (error) {
    next(error);
  }
};
