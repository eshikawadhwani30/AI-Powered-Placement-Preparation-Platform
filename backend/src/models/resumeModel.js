import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
    },
    extractedText: {
      type: String,
      required: true,
    },
    targetJobDescription: {
      type: String,
      default: '',
    },
    score: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    analysis: {
      overallScore: { type: Number, default: 0 },
      skillsIdentified: { type: [String], default: [] },
      missingSkills: { type: [String], default: [] },
      strengths: { type: [String], default: [] },
      weaknesses: { type: [String], default: [] },
      bulletPointSuggestions: { type: [String], default: [] },
      missingKeywords: { type: [String], default: [] },
      projectRecommendations: { type: [String], default: [] },
      atsSuggestions: { type: [String], default: [] },
      learningRoadmap: { type: [String], default: [] },
      summary: { type: String, default: '' },
    },
  },
  {
    timestamps: true,
  }
);

const Resume = mongoose.model('Resume', resumeSchema);

export default Resume;
