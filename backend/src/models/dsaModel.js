import mongoose from 'mongoose';

const dsaQuestionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    topic: {
      type: String,
      required: true,
      enum: [
        'Arrays',
        'Strings',
        'Linked Lists',
        'Stacks',
        'Queues',
        'Trees',
        'Graphs',
        'Recursion',
        'Searching',
        'Sorting',
        'Greedy Algorithms',
        'Dynamic Programming',
      ],
      index: true,
    },
    difficulty: {
      type: String,
      required: true,
      enum: ['Easy', 'Medium', 'Hard'],
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    examples: [
      {
        input: { type: String, required: true },
        output: { type: String, required: true },
        explanation: { type: String, default: '' },
      },
    ],
    constraints: {
      type: [String],
      default: [],
    },
    hints: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const DSAQuestion = mongoose.model('DSAQuestion', dsaQuestionSchema);

const dsaProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DSAQuestion',
      required: true,
      index: true,
    },
    isSolved: {
      type: Boolean,
      default: false,
    },
    isBookmarked: {
      type: Boolean,
      default: false,
    },
    notes: {
      type: String,
      default: '',
    },
    solvedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate progress records per user-question pair
dsaProgressSchema.index({ user: 1, question: 1 }, { unique: true });

export const DSAProgress = mongoose.model('DSAProgress', dsaProgressSchema);
