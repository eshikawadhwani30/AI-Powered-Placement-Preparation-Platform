import mongoose from 'mongoose';
import Resume from '../models/resumeModel.js';
import InterviewSession from '../models/interviewModel.js';
import { DSAQuestion, DSAProgress } from '../models/dsaModel.js';
import { AptitudeAttempt } from '../models/aptitudeModel.js';
import Roadmap from '../models/roadmapModel.js';
import Activity from '../models/activityModel.js';
import {
  computeProgressSnapshot,
  generateLearningRoadmap,
} from '../services/roadmapService.js';

const gatherSnapshot = async (user) => {
  const userId = user._id;

  let completedFields = 0;
  const totalFields = 7;
  if (user.name) completedFields += 1;
  if (user.email) completedFields += 1;
  if (user.skills?.length) completedFields += 1;
  if (user.preferredJobRoles?.length) completedFields += 1;
  if (user.preferredLocation) completedFields += 1;
  if (user.profile?.college) completedFields += 1;
  if (user.profile?.graduationYear) completedFields += 1;
  const profileCompleteness = Math.round((completedFields / totalFields) * 100);

  let resumeScore = 0;
  let missingSkills = [];
  let dsaPercentage = 0;
  let weakDsaTopics = [];
  let aptitudeAverage = 0;
  let weakAptitudeTopics = [];
  let interviewAveragePercent = 0;

  if (mongoose.connection.readyState === 1) {
    const latestResume = await Resume.findOne({ user: userId }).sort({ createdAt: -1 });
    resumeScore = latestResume?.score || 0;
    missingSkills = latestResume?.analysis?.missingSkills || [];

    const allQuestions = await DSAQuestion.find({});
    const progress = await DSAProgress.find({ user: userId, isSolved: true });
    const solved = new Set(progress.map((p) => p.question.toString()));
    dsaPercentage =
      allQuestions.length > 0 ? Math.round((solved.size / allQuestions.length) * 100) : 0;

    const topicStats = {};
    allQuestions.forEach((q) => {
      if (!topicStats[q.topic]) topicStats[q.topic] = { total: 0, solved: 0 };
      topicStats[q.topic].total += 1;
      if (solved.has(q._id.toString())) topicStats[q.topic].solved += 1;
    });
    weakDsaTopics = Object.entries(topicStats)
      .map(([topic, s]) => ({
        topic,
        percentage: s.total ? Math.round((s.solved / s.total) * 100) : 0,
      }))
      .sort((a, b) => a.percentage - b.percentage)
      .map((t) => t.topic);

    const attempts = await AptitudeAttempt.find({ user: userId, status: 'completed' });
    if (attempts.length) {
      aptitudeAverage = Math.round(
        attempts.reduce((sum, a) => sum + a.scorePercentage, 0) / attempts.length
      );
      const cat = {};
      attempts.forEach((a) => {
        if (!cat[a.category]) cat[a.category] = [];
        cat[a.category].push(a.scorePercentage);
      });
      weakAptitudeTopics = Object.entries(cat)
        .map(([category, scores]) => ({
          category,
          avg: Math.round(scores.reduce((s, n) => s + n, 0) / scores.length),
        }))
        .sort((a, b) => a.avg - b.avg)
        .map((c) => c.category);
    }

    const sessions = await InterviewSession.find({ user: userId });
    if (sessions.length) {
      const sum = sessions.reduce((acc, curr) => acc + (curr.averageScore || 0), 0);
      interviewAveragePercent = Math.round((sum / sessions.length) * 10);
    }
  }

  return computeProgressSnapshot({
    profileCompleteness,
    resumeScore,
    dsaPercentage,
    aptitudeAverage,
    interviewAveragePercent,
    missingSkills,
    weakDsaTopics,
    weakAptitudeTopics,
  });
};

const preserveCompletedTasks = (previousTasks = [], nextTasks = []) => {
  const completedTitles = new Set(
    previousTasks.filter((t) => t.isCompleted).map((t) => t.title.trim().toLowerCase())
  );

  return nextTasks.map((task) => {
    const done = completedTitles.has(task.title.trim().toLowerCase());
    return {
      ...task,
      isCompleted: done,
      completedAt: done ? new Date() : null,
    };
  });
};

/**
 * @desc    Generate or regenerate a personalized roadmap
 * @route   POST /api/roadmap/generate
 * @access  Private
 */
export const generateRoadmap = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'Database is not connected. Roadmaps are stored in MongoDB.',
      });
    }

    const snapshot = await gatherSnapshot(req.user);
    const generated = await generateLearningRoadmap(snapshot);

    const existing = await Roadmap.findOne({ user: req.user._id });
    const tasks = preserveCompletedTasks(existing?.tasks || [], generated.tasks);

    const roadmap = await Roadmap.findOneAndUpdate(
      { user: req.user._id },
      {
        $set: {
          overallReadinessScore: snapshot.readinessScore,
          summary: generated.summary,
          tasks,
          aiRecommendations: generated.aiRecommendations,
          lastGeneratedAt: new Date(),
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    await Activity.create({
      user: req.user._id,
      type: 'roadmap_generated',
      title: 'Placement roadmap updated',
      description: `Readiness ${snapshot.readinessScore}% · ${generated.source === 'gemini' ? 'Gemini suggestions' : 'rule-based plan'}`,
      metadata: { source: generated.source, readinessScore: snapshot.readinessScore },
    });

    res.status(200).json({
      success: true,
      message:
        generated.source === 'gemini'
          ? 'Roadmap generated with Gemini recommendations on top of backend stats.'
          : 'Roadmap generated from backend stats. Gemini was unavailable, so recommendations are rule-based.',
      data: {
        ...roadmap.toObject(),
        snapshot,
        generationSource: generated.source,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current roadmap for authenticated user
 * @route   GET /api/roadmap
 * @access  Private
 */
export const getRoadmap = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({ success: true, data: null });
    }

    const roadmap = await Roadmap.findOne({ user: req.user._id });
    res.status(200).json({
      success: true,
      data: roadmap,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle completion of a roadmap task
 * @route   PUT /api/roadmap/tasks/:id
 * @access  Private
 */
export const updateRoadmapTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isCompleted } = req.body;

    if (typeof isCompleted !== 'boolean') {
      return res.status(400).json({ success: false, message: 'isCompleted boolean is required.' });
    }

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ success: false, message: 'Database is not connected.' });
    }

    const roadmap = await Roadmap.findOne({ user: req.user._id });
    if (!roadmap) {
      return res.status(404).json({ success: false, message: 'No roadmap found. Generate one first.' });
    }

    const task = roadmap.tasks.id(id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    task.isCompleted = isCompleted;
    task.completedAt = isCompleted ? new Date() : null;
    await roadmap.save();

    res.status(200).json({
      success: true,
      message: isCompleted ? 'Task marked complete' : 'Task marked incomplete',
      data: roadmap,
    });
  } catch (error) {
    next(error);
  }
};
