import mongoose from 'mongoose';

const roadmapTaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Resume', 'DSA', 'Aptitude', 'Interview', 'Core CS', 'Project'],
  },
  priority: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium',
  },
  estimatedHours: {
    type: Number,
    default: 2,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  completedAt: {
    type: Date,
    default: null,
  },
});

const roadmapSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    overallReadinessScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 25,
    },
    summary: {
      type: String,
      default: '',
    },
    tasks: [roadmapTaskSchema],
    aiRecommendations: {
      type: [String],
      default: [],
    },
    lastGeneratedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Roadmap = mongoose.model('Roadmap', roadmapSchema);

export default Roadmap;
