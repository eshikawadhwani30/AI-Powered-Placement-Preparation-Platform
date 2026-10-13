import mongoose from 'mongoose';

const interviewQuestionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  userAnswer: { type: String, default: '' },
  rubricScore: { type: Number, min: 0, max: 10, default: null },
  relevance: { type: String, default: '' },
  technicalCorrectness: { type: String, default: '' },
  missingConcepts: { type: [String], default: [] },
  areasForImprovement: { type: [String], default: [] },
  suggestedBetterAnswer: { type: String, default: '' },
  evaluatedAt: { type: Date, default: null },
});

const interviewSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    jobRole: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Technical',
        'HR',
        'DSA',
        'DBMS',
        'Operating Systems',
        'Computer Networks',
        'OOP',
        'Project-Based',
      ],
    },
    difficulty: {
      type: String,
      required: true,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Intermediate',
    },
    questions: [interviewQuestionSchema],
    averageScore: {
      type: Number,
      min: 0,
      max: 10,
      default: 0,
    },
    status: {
      type: String,
      enum: ['in-progress', 'completed'],
      default: 'in-progress',
    },
  },
  {
    timestamps: true,
  }
);

const InterviewSession = mongoose.model('InterviewSession', interviewSessionSchema);

export default InterviewSession;
