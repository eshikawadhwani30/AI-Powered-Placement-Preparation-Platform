import mongoose from 'mongoose';

const aptitudeQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Quantitative Aptitude',
        'Logical Reasoning',
        'Verbal Ability',
        'Data Interpretation',
      ],
      index: true,
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium',
    },
    options: {
      type: [String],
      required: true,
      validate: [
        (opts) => opts.length >= 2,
        'Question must have at least 2 options',
      ],
    },
    correctAnswerIndex: {
      type: Number,
      required: true,
      min: 0,
      select: false, // Hidden by default from student queries to prevent inspection
    },
    explanation: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const AptitudeQuestion = mongoose.model('AptitudeQuestion', aptitudeQuestionSchema);

const aptitudeAttemptSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    correctAnswers: {
      type: Number,
      required: true,
    },
    scorePercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    timeTakenSeconds: {
      type: Number,
      default: 0,
    },
    answers: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'AptitudeQuestion',
        },
        selectedOption: Number,
        isCorrect: Boolean,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const AptitudeAttempt = mongoose.model('AptitudeAttempt', aptitudeAttemptSchema);
