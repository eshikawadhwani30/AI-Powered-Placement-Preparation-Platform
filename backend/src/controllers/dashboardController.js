import mongoose from 'mongoose';
import User from '../models/userModel.js';
import Resume from '../models/resumeModel.js';
import InterviewSession from '../models/interviewModel.js';
import Job from '../models/jobModel.js';
import { DSAQuestion, DSAProgress } from '../models/dsaModel.js';
import { AptitudeAttempt } from '../models/aptitudeModel.js';
import Roadmap from '../models/roadmapModel.js';
import Activity from '../models/activityModel.js';

/**
 * @desc    Get aggregated placement preparation dashboard metrics for authenticated user
 * @route   GET /api/dashboard
 * @access  Private
 */
export const getDashboardData = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // 1. Fetch user profile (or use req.user if disconnected or mock)
    let user = req.user;
    if (mongoose.connection.readyState === 1) {
      const foundUser = await User.findById(userId).select('-password');
      if (foundUser) user = foundUser;
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Calculate profile completeness percentage
    let completedFields = 0;
    const totalFields = 7;
    if (user.name) completedFields++;
    if (user.email) completedFields++;
    if (user.skills && user.skills.length > 0) completedFields++;
    if (user.preferredJobRoles && user.preferredJobRoles.length > 0) completedFields++;
    if (user.preferredLocation) completedFields++;
    if (user.profile?.college) completedFields++;
    if (user.profile?.graduationYear) completedFields++;
    const profileCompleteness = Math.round((completedFields / totalFields) * 100);

    let latestResume = null;
    let totalDSAQuestions = 15;
    let solvedDSACount = 0;
    let bookmarkedDSACount = 0;
    let aptitudeAttempts = [];
    let interviewSessions = [];
    let availableJobs = [];
    let roadmap = null;
    let activities = [];

    // Query collections only when database is connected
    if (mongoose.connection.readyState === 1) {
      // 2. Resume
      latestResume = await Resume.findOne({ user: userId }).sort({ createdAt: -1 });

      // 3. DSA
      totalDSAQuestions = (await DSAQuestion.countDocuments()) || 15;
      solvedDSACount = await DSAProgress.countDocuments({ user: userId, isSolved: true });
      bookmarkedDSACount = await DSAProgress.countDocuments({ user: userId, isBookmarked: true });

      // 4. Aptitude
      aptitudeAttempts = await AptitudeAttempt.find({ user: userId }).sort({ createdAt: -1 });

      // 5. Interviews
      interviewSessions = await InterviewSession.find({ user: userId }).sort({ createdAt: -1 });

      // 6. Jobs
      availableJobs = await Job.find({}).limit(10);

      // 7. Roadmap
      roadmap = await Roadmap.findOne({ user: userId });

      // 8. Activities
      activities = await Activity.find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(6);
    }

    // Resume Stats
    const resumeStats = {
      hasResume: Boolean(latestResume),
      score: latestResume ? latestResume.score : 0,
      fileName: latestResume ? latestResume.fileName : null,
      analyzedAt: latestResume ? latestResume.createdAt : null,
      missingSkills: latestResume?.analysis?.missingSkills?.slice(0, 5) || [],
      strengthsCount: latestResume?.analysis?.strengths?.length || 0,
      status: latestResume ? 'Analyzed' : 'No resume uploaded',
    };

    // DSA Stats
    const dsaPercentage =
      totalDSAQuestions > 0 ? Math.round((solvedDSACount / totalDSAQuestions) * 100) : 0;
    const dsaStats = {
      totalQuestions: totalDSAQuestions,
      solvedCount: solvedDSACount,
      bookmarkedCount: bookmarkedDSACount,
      percentage: dsaPercentage,
    };

    // Aptitude Stats
    const totalAptitudeAttempts = aptitudeAttempts.length;
    let avgAptitudeScore = 0;
    if (totalAptitudeAttempts > 0) {
      const sum = aptitudeAttempts.reduce((acc, curr) => acc + curr.scorePercentage, 0);
      avgAptitudeScore = Math.round(sum / totalAptitudeAttempts);
    }
    const aptitudeStats = {
      totalAttempts: totalAptitudeAttempts,
      averageScore: avgAptitudeScore,
      latestAttempt: aptitudeAttempts[0]
        ? {
            category: aptitudeAttempts[0].category,
            scorePercentage: aptitudeAttempts[0].scorePercentage,
            attemptedAt: aptitudeAttempts[0].createdAt,
          }
        : null,
    };

    // Interview Stats
    const totalInterviews = interviewSessions.length;
    let avgInterviewScore = 0;
    if (totalInterviews > 0) {
      const sum = interviewSessions.reduce((acc, curr) => acc + (curr.averageScore || 0), 0);
      avgInterviewScore = Math.round((sum / totalInterviews) * 10);
    }
    const interviewStats = {
      totalSessions: totalInterviews,
      averageScorePercent: avgInterviewScore,
      latestSession: interviewSessions[0]
        ? {
            jobRole: interviewSessions[0].jobRole,
            category: interviewSessions[0].category,
            averageScore: interviewSessions[0].averageScore,
            status: interviewSessions[0].status,
            createdAt: interviewSessions[0].createdAt,
          }
        : null,
    };

    // Job Recommendations
    const userSkillsLower = (user.skills || []).map((s) => s.toLowerCase());
    const recommendedJobs = availableJobs
      .map((job) => {
        const required = job.requiredSkills || [];
        if (required.length === 0) return { ...job.toObject(), matchScore: 50 };

        const matched = required.filter((reqSkill) =>
          userSkillsLower.includes(reqSkill.toLowerCase())
        );
        const missing = required.filter(
          (reqSkill) => !userSkillsLower.includes(reqSkill.toLowerCase())
        );
        const matchScore = Math.round((matched.length / required.length) * 100);

        return {
          _id: job._id,
          title: job.title,
          company: job.company,
          location: job.location,
          experienceLevel: job.experienceLevel,
          applicationUrl: job.applicationUrl,
          requiredSkills: job.requiredSkills,
          matchedSkills: matched,
          missingSkills: missing,
          matchScore,
        };
      })
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 4);

    // Roadmap Stats
    const totalRoadmapTasks = roadmap?.tasks?.length || 0;
    const completedRoadmapTasks = roadmap?.tasks?.filter((t) => t.isCompleted)?.length || 0;
    const nextRoadmapTask = roadmap?.tasks?.find((t) => !t.isCompleted) || null;
    const roadmapStats = {
      hasRoadmap: Boolean(roadmap),
      totalTasks: totalRoadmapTasks,
      completedTasks: completedRoadmapTasks,
      nextTask: nextRoadmapTask,
    };

    // Default Activities if user has none
    if (activities.length === 0) {
      activities = [
        {
          _id: 'default-1',
          type: 'profile_updated',
          title: 'Account Initialized',
          description: 'Placement profile setup complete and ready for AI preparation',
          createdAt: user.createdAt || new Date(),
        },
      ];
    }

    // Weighted Placement Readiness Score (0 to 100)
    const readinessScore = Math.round(
      profileCompleteness * 0.15 +
        (resumeStats.score || 0) * 0.25 +
        dsaStats.percentage * 0.25 +
        aptitudeStats.averageScore * 0.20 +
        interviewStats.averageScorePercent * 0.15
    );

    let readinessLevel = 'Beginner / Getting Started';
    if (readinessScore >= 80) readinessLevel = 'Job Ready (High Placement Probability)';
    else if (readinessScore >= 60) readinessLevel = 'Placement Contender (Solid Preparation)';
    else if (readinessScore >= 35) readinessLevel = 'Intermediate (Building Momentum)';

    res.status(200).json({
      success: true,
      data: {
        user: {
          name: user.name,
          email: user.email,
          skills: user.skills,
          preferredJobRoles: user.preferredJobRoles,
          profileCompleteness,
        },
        readiness: {
          score: readinessScore,
          level: readinessLevel,
        },
        resume: resumeStats,
        dsa: dsaStats,
        aptitude: aptitudeStats,
        interview: interviewStats,
        jobs: recommendedJobs,
        roadmap: roadmapStats,
        activities,
      },
    });
  } catch (error) {
    next(error);
  }
};
