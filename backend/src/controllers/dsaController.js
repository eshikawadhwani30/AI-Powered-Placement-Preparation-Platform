import mongoose from 'mongoose';
import { DSAQuestion, DSAProgress } from '../models/dsaModel.js';
import Activity from '../models/activityModel.js';

/**
 * @desc    Get all DSA questions with topic/difficulty filters and user progress status
 * @route   GET /api/dsa/questions
 * @access  Private
 */
export const getDSAQuestions = async (req, res, next) => {
  try {
    const { topic, difficulty, status = 'all', search = '', page = 1, limit = 20 } = req.query;
    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 50);

    const query = {};
    if (topic && topic !== 'All') {
      query.topic = topic;
    }
    if (difficulty && difficulty !== 'All') {
      query.difficulty = difficulty;
    }
    if (search.trim()) {
      query.title = new RegExp(search.trim(), 'i');
    }

    let questions = [];
    let progressMap = new Map();

    if (mongoose.connection.readyState === 1) {
      questions = await DSAQuestion.find(query).sort({ topic: 1, difficulty: 1 });

      const progressRecords = await DSAProgress.find({ user: req.user._id });
      progressRecords.forEach((p) => {
        progressMap.set(p.question.toString(), p);
      });
    }

    // Merge student progress onto question objects
    let merged = questions.map((q) => {
      const p = progressMap.get(q._id.toString());
      return {
        _id: q._id,
        title: q.title,
        topic: q.topic,
        difficulty: q.difficulty,
        description: q.description,
        examples: q.examples,
        constraints: q.constraints,
        hints: q.hints,
        isSolved: Boolean(p?.isSolved),
        isBookmarked: Boolean(p?.isBookmarked),
        notes: p?.notes || '',
        solvedAt: p?.solvedAt || null,
      };
    });

    // Apply status filter ('solved', 'unsolved', 'bookmarked')
    if (status === 'solved') {
      merged = merged.filter((q) => q.isSolved);
    } else if (status === 'unsolved') {
      merged = merged.filter((q) => !q.isSolved);
    } else if (status === 'bookmarked') {
      merged = merged.filter((q) => q.isBookmarked);
    }

    const total = merged.length;
    const start = (pageNum - 1) * limitNum;
    const paged = merged.slice(start, start + limitNum);

    res.status(200).json({
      success: true,
      count: paged.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      data: paged,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single DSA question details and student notes
 * @route   GET /api/dsa/questions/:id
 * @access  Private
 */
export const getDSAQuestionById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid question ID format.' });
    }

    const question = await DSAQuestion.findById(id);
    if (!question) {
      return res.status(404).json({ success: false, message: 'DSA question not found.' });
    }

    let progress = null;
    if (mongoose.connection.readyState === 1) {
      progress = await DSAProgress.findOne({ user: req.user._id, question: id });
    }

    res.status(200).json({
      success: true,
      data: {
        ...question.toObject(),
        isSolved: Boolean(progress?.isSolved),
        isBookmarked: Boolean(progress?.isBookmarked),
        notes: progress?.notes || '',
        solvedAt: progress?.solvedAt || null,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update student progress (mark solved/unsolved, toggle bookmark, save personal notes)
 * @route   POST /api/dsa/progress
 * @access  Private
 */
export const updateDSAProgress = async (req, res, next) => {
  try {
    const { questionId, isSolved, isBookmarked, notes } = req.body;

    if (!questionId || !mongoose.Types.ObjectId.isValid(questionId)) {
      return res.status(400).json({ success: false, message: 'Valid questionId is required.' });
    }

    let updatedProgress = null;

    if (mongoose.connection.readyState === 1) {
      const question = await DSAQuestion.findById(questionId);
      if (!question) {
        return res.status(404).json({ success: false, message: 'DSA question not found.' });
      }

      const updateFields = {};
      if (typeof isSolved === 'boolean') {
        updateFields.isSolved = isSolved;
        updateFields.solvedAt = isSolved ? new Date() : null;
      }
      if (typeof isBookmarked === 'boolean') {
        updateFields.isBookmarked = isBookmarked;
      }
      if (typeof notes === 'string') {
        updateFields.notes = notes;
      }

      updatedProgress = await DSAProgress.findOneAndUpdate(
        { user: req.user._id, question: questionId },
        { $set: updateFields },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      // If marked solved, log to student's activity timeline
      if (isSolved === true) {
        await Activity.create({
          user: req.user._id,
          type: 'dsa_solved',
          title: `Solved DSA Problem: ${question.title}`,
          description: `Completed ${question.difficulty} problem in topic "${question.topic}"`,
          metadata: {
            questionId,
            topic: question.topic,
            difficulty: question.difficulty,
          },
        });
      }
    }

    res.status(200).json({
      success: true,
      message: 'DSA progress updated successfully',
      data: updatedProgress || {
        questionId,
        isSolved: Boolean(isSolved),
        isBookmarked: Boolean(isBookmarked),
        notes: notes || '',
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get overall DSA statistics, topic breakdown, and practice recommendations
 * @route   GET /api/dsa/progress
 * @access  Private
 */
export const getDSAStats = async (req, res, next) => {
  try {
    let allQuestions = [];
    let userProgress = [];

    if (mongoose.connection.readyState === 1) {
      allQuestions = await DSAQuestion.find({});
      userProgress = await DSAProgress.find({ user: req.user._id });
    }

    const solvedSet = new Set(
      userProgress.filter((p) => p.isSolved).map((p) => p.question.toString())
    );
    const bookmarkedSet = new Set(
      userProgress.filter((p) => p.isBookmarked).map((p) => p.question.toString())
    );

    const total = allQuestions.length;
    const solvedCount = solvedSet.size;
    const percentage = total > 0 ? Math.round((solvedCount / total) * 100) : 0;

    // Topic Breakdown
    const topicBreakdown = {};
    allQuestions.forEach((q) => {
      if (!topicBreakdown[q.topic]) {
        topicBreakdown[q.topic] = { total: 0, solved: 0, percentage: 0 };
      }
      topicBreakdown[q.topic].total++;
      if (solvedSet.has(q._id.toString())) {
        topicBreakdown[q.topic].solved++;
      }
    });

    Object.keys(topicBreakdown).forEach((top) => {
      const t = topicBreakdown[top];
      t.percentage = t.total > 0 ? Math.round((t.solved / t.total) * 100) : 0;
    });

    // Difficulty Breakdown
    const difficultyBreakdown = {
      Easy: { total: 0, solved: 0 },
      Medium: { total: 0, solved: 0 },
      Hard: { total: 0, solved: 0 },
    };

    allQuestions.forEach((q) => {
      if (difficultyBreakdown[q.difficulty]) {
        difficultyBreakdown[q.difficulty].total++;
        if (solvedSet.has(q._id.toString())) {
          difficultyBreakdown[q.difficulty].solved++;
        }
      }
    });

    const weakTopics = Object.entries(topicBreakdown)
      .sort((a, b) => a[1].percentage - b[1].percentage)
      .map(([topic]) => topic);

    const recommendedQuestions = allQuestions
      .filter((q) => !solvedSet.has(q._id.toString()))
      .sort((a, b) => {
        const aWeak = weakTopics.indexOf(a.topic);
        const bWeak = weakTopics.indexOf(b.topic);
        const topicRank = (aWeak === -1 ? 99 : aWeak) - (bWeak === -1 ? 99 : bWeak);
        if (topicRank !== 0) return topicRank;
        const order = { Easy: 0, Medium: 1, Hard: 2 };
        return (order[a.difficulty] || 1) - (order[b.difficulty] || 1);
      })
      .slice(0, 3)
      .map((q) => ({
        _id: q._id,
        title: q.title,
        topic: q.topic,
        difficulty: q.difficulty,
      }));

    res.status(200).json({
      success: true,
      data: {
        totalQuestions: total,
        solvedCount,
        bookmarkedCount: bookmarkedSet.size,
        percentage,
        topicBreakdown,
        difficultyBreakdown,
        nextRecommendation: recommendedQuestions[0] || null,
        recommendedQuestions,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add a new DSA question (Admin only)
 * @route   POST /api/dsa/questions
 * @access  Private/Admin
 */
export const createDSAQuestion = async (req, res, next) => {
  try {
    const { title, topic, difficulty, description, examples, constraints, hints } = req.body;

    if (!title || !topic || !difficulty || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, topic, difficulty, and description.',
      });
    }

    const question = await DSAQuestion.create({
      title,
      topic,
      difficulty,
      description,
      examples: examples || [],
      constraints: constraints || [],
      hints: hints || [],
    });

    res.status(201).json({
      success: true,
      message: 'DSA question created successfully',
      data: question,
    });
  } catch (error) {
    next(error);
  }
};
