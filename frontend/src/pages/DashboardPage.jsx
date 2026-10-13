import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import dashboardApi from '../api/dashboardApi';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import {
  HiSparkles,
  HiOutlineDocumentText,
  HiOutlineChatBubbleLeftRight,
  HiOutlineBriefcase,
  HiOutlineCodeBracketSquare,
  HiOutlineAcademicCap,
  HiOutlineMap,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiArrowRight,
  HiOutlineExclamationTriangle,
  HiArrowPath,
  HiOutlineBuildingOffice2,
  HiOutlineMapPin,
  HiOutlineArrowTopRightOnSquare,
} from 'react-icons/hi2';

const DashboardPage = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await dashboardApi.getDashboard();
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to load dashboard data. Ensure backend is running and authenticated.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <LoadingSpinner size="lg" text="Aggregating placement preparation metrics..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto py-12 space-y-4 text-center">
        <ErrorMessage message={error} />
        <button
          onClick={fetchDashboard}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-md transition-all"
        >
          <HiArrowPath className="w-4 h-4" />
          <span>Retry Loading Dashboard</span>
        </button>
      </div>
    );
  }

  const {
    readiness = { score: 25, level: 'Beginner' },
    resume = {},
    dsa = { totalQuestions: 15, solvedCount: 0, percentage: 0 },
    aptitude = { totalAttempts: 0, averageScore: 0 },
    interview = { totalSessions: 0, averageScorePercent: 0 },
    jobs = [],
    roadmap = {},
    activities = [],
    user: profileUser = {},
  } = data || {};

  return (
    <div className="space-y-8 pb-10">
      {/* 1. Welcome Banner & Overall Readiness Meter */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 text-white shadow-xl shadow-blue-500/10 relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold mb-3 text-blue-100">
              <HiSparkles className="w-4 h-4 text-yellow-300" />
              <span>Campus Recruitment Suite • SDE / Tech Tracks</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Welcome back, {user?.name || profileUser?.name || 'Student'}! 👋
            </h1>
            <p className="mt-2 text-sm sm:text-base text-blue-100/90 leading-relaxed">
              Here is your centralized placement readiness overview. Your current readiness index is{' '}
              <strong className="text-white underline decoration-yellow-400">
                {readiness.score}%
              </strong>{' '}
              ({readiness.level}).
            </p>
          </div>

          {/* Readiness Gauge Card */}
          <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center min-w-[220px]">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-200 mb-1">
              Placement Readiness
            </p>
            <p className="text-4xl font-extrabold text-white">{readiness.score}%</p>
            <div className="w-full bg-white/20 h-2.5 rounded-full overflow-hidden mt-3 mb-2">
              <div
                className="bg-yellow-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(readiness.score, 100)}%` }}
              />
            </div>
            <span className="text-[11px] font-medium text-blue-100">{readiness.level}</span>
          </div>
        </div>
      </div>

      {/* Profile Completion Callout (if incomplete) */}
      {profileUser?.profileCompleteness < 100 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-900">
          <div className="flex items-center gap-3">
            <HiOutlineExclamationTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-bold">
                Student Profile is {profileUser?.profileCompleteness || 0}% Complete
              </p>
              <p className="text-xs text-amber-700">
                Add target roles, skills, and college details to unlock hyper-accurate job matches.
              </p>
            </div>
          </div>
          <Link
            to="/profile"
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-xl shadow-xs inline-flex items-center gap-1.5 flex-shrink-0"
          >
            <span>Complete Profile</span>
            <HiArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* 2. Core Preparation Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Resume Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Resume ATS Score
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <HiOutlineDocumentText className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900">
              {resume.hasResume ? `${resume.score} / 100` : 'Not Uploaded'}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {resume.hasResume ? `File: ${resume.fileName}` : 'Upload PDF for ATS feedback'}
            </p>
            {resume.missingSkills && resume.missingSkills.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {resume.missingSkills.slice(0, 3).map((s, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200"
                  >
                    Missing: {s}
                  </span>
                ))}
              </div>
            )}
          </div>
          <Link
            to="/resume"
            className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 pt-3 border-t border-slate-100"
          >
            <span>{resume.hasResume ? 'View Analysis' : 'Upload Resume'}</span>
            <HiArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* DSA Progress Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                DSA Solved
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <HiOutlineCodeBracketSquare className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900">
              {dsa.solvedCount} <span className="text-sm font-normal text-slate-400">/ {dsa.totalQuestions}</span>
            </p>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-3 mb-1">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(dsa.percentage, 100)}%` }}
              />
            </div>
            <p className="text-xs text-slate-500">{dsa.percentage}% of curated problems solved</p>
          </div>
          <Link
            to="/dsa"
            className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 pt-3 border-t border-slate-100"
          >
            <span>Practice Problems</span>
            <HiArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Aptitude Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Aptitude Tests
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <HiOutlineAcademicCap className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900">
              {aptitude.totalAttempts > 0 ? `${aptitude.averageScore}%` : '0 Tests'}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {aptitude.totalAttempts > 0
                ? `${aptitude.totalAttempts} rounds completed`
                : 'Timed Quant & Logic rounds'}
            </p>
            {aptitude.latestAttempt && (
              <span className="mt-2 inline-block text-[11px] font-medium text-amber-700">
                Last: {aptitude.latestAttempt.category} ({aptitude.latestAttempt.scorePercentage}%)
              </span>
            )}
          </div>
          <Link
            to="/aptitude"
            className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-amber-600 hover:text-amber-700 pt-3 border-t border-slate-100"
          >
            <span>Take Practice Round</span>
            <HiArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mock Interview Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                AI Interviews
              </span>
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <HiOutlineChatBubbleLeftRight className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900">
              {interview.totalSessions > 0 ? `${interview.totalSessions} Sessions` : '0 Sessions'}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {interview.totalSessions > 0
                ? `Avg Score: ${interview.averageScorePercent}%`
                : 'AI-evaluated questions & rubrics'}
            </p>
            {interview.latestSession && (
              <span className="mt-2 inline-block text-[11px] font-medium text-indigo-700 truncate max-w-full">
                Role: {interview.latestSession.jobRole}
              </span>
            )}
          </div>
          <Link
            to="/interview"
            className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 pt-3 border-t border-slate-100"
          >
            <span>Start Simulation</span>
            <HiArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 3. Recommended Jobs & Roadmap Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recommended Jobs (2 cols) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <HiOutlineBriefcase className="w-5 h-5 text-blue-600" />
                <span>Job Recommendations Matched to Your Skills</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Calculated by comparing your profile skills against campus drive listings
              </p>
            </div>
            <Link
              to="/jobs"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>View All</span>
              <HiArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {jobs.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-sm">
              No matching listings found. Try adding more skills in your profile!
            </div>
          ) : (
            <div className="space-y-3">
              {jobs.map((job) => (
                <div
                  key={job._id}
                  className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 truncate">{job.title}</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200/80">
                        {job.matchScore}% Match
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-1">
                        <HiOutlineBuildingOffice2 className="w-3.5 h-3.5" />
                        {job.company}
                      </span>
                      <span className="flex items-center gap-1">
                        <HiOutlineMapPin className="w-3.5 h-3.5" />
                        {job.location}
                      </span>
                    </div>

                    {/* Skill Match badges */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {job.requiredSkills.slice(0, 4).map((sk, idx) => {
                        const isMatched = job.matchedSkills?.includes(sk);
                        return (
                          <span
                            key={idx}
                            className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${
                              isMatched
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {sk} {isMatched ? '✓' : ''}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  <a
                    href={job.applicationUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="self-start sm:self-center px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-lg transition-colors flex items-center gap-1"
                  >
                    <span>Apply</span>
                    <HiOutlineArrowTopRightOnSquare className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Personalized Roadmap Snapshot (1 col) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <HiOutlineMap className="w-5 h-5 text-purple-600" />
                <span>Next Milestone</span>
              </h3>
              <Link
                to="/roadmap"
                className="text-xs font-semibold text-purple-600 hover:underline"
              >
                Full Roadmap
              </Link>
            </div>

            {roadmap.nextTask ? (
              <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-200 text-purple-800">
                    {roadmap.nextTask.priority} Priority
                  </span>
                  <span className="text-xs text-purple-600 font-medium">
                    {roadmap.nextTask.category}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-purple-950">
                  {roadmap.nextTask.title}
                </h4>
                <p className="text-xs text-purple-700">
                  Estimated time: ~{roadmap.nextTask.estimatedHours || 2} hours
                </p>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center text-slate-500 text-xs">
                No active milestone pending. Generate your personalized placement roadmap to get targeted weekly tasks.
              </div>
            )}

            <div className="mt-5 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Completed Tasks</span>
                <span className="font-bold">
                  {roadmap.completedTasks || 0} / {roadmap.totalTasks || 0}
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-purple-600 h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      roadmap.totalTasks > 0
                        ? Math.round((roadmap.completedTasks / roadmap.totalTasks) * 100)
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>

          <Link
            to="/roadmap"
            className="mt-6 w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-xl text-center shadow-xs transition-colors block"
          >
            Open Preparation Roadmap &rarr;
          </Link>
        </div>
      </div>

      {/* 4. Recent Activity Stream */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
          <HiOutlineClock className="w-5 h-5 text-slate-600" />
          <span>Recent Activity & Preparation Audit Trail</span>
        </h3>

        <div className="divide-y divide-slate-100">
          {activities.map((act, idx) => (
            <div key={act._id || idx} className="py-3.5 flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <HiOutlineCheckCircle className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900">{act.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{act.description}</p>
              </div>
              <span className="text-[11px] text-slate-400 whitespace-nowrap">
                {act.createdAt ? new Date(act.createdAt).toLocaleDateString() : 'Recent'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
