import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    requiredSkills: {
      type: [String],
      required: true,
      default: [],
    },
    experienceLevel: {
      type: String,
      default: 'Fresher / Entry-Level (0-1 yrs)',
    },
    description: {
      type: String,
      required: true,
    },
    applicationUrl: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      default: 'Sample Campus Placement Listing',
    },
    isSampleData: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for skill searches
jobSchema.index({ requiredSkills: 1 });

const Job = mongoose.model('Job', jobSchema);

export default Job;
