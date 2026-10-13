import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import {
  HiOutlineDocumentText,
  HiOutlineChatBubbleLeftRight,
  HiOutlineBriefcase,
  HiOutlineCodeBracketSquare,
  HiOutlineAcademicCap,
  HiOutlineMap,
  HiCheckCircle,
  HiArrowRight,
  HiSparkles,
  HiServerStack,
} from 'react-icons/hi2';

const DashboardPage = () => {
  const { user } = useAuth();
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const res = await api.get('/health');
        setHealthData(res.data);
      } catch (err) {
        console.error('Failed to query backend health:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHealth();
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white shadow-lg shadow-blue-500/10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-xs font-semibold mb-4 text-blue-100">
            <HiSparkles className="w-4 h-4 text-yellow-300" />
            <span>AI Placement Engine v1.0</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Welcome back, {user?.name || 'Student'}! 👋
          </h1>
          <p className="mt-2 text-sm sm:text-base text-blue-100/90 leading-relaxed">
            Your centralized command center for campus placement preparation. Track your coding progress, analyze your resume ATS readiness, and conduct AI-powered mock interviews.
          </p>
        </div>
      </div>

      {/* Backend & Environment Live Diagnostics Card */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center flex-shrink-0">
            <HiServerStack className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Backend API & Database Status</h4>
            <p className="text-xs text-slate-500">
              Live link with Express REST API, MongoDB instance, and Gemini AI SDK
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-mono">
            Mode: {healthData?.environment || 'development'}
          </span>
          <span
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 ${
              healthData?.database?.status === 'connected'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                healthData?.database?.status === 'connected' ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            />
            MongoDB: {healthData?.database?.status || 'checking...'}
          </span>
          <span
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 ${
              healthData?.services?.geminiConfigured
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            Gemini AI: {healthData?.services?.geminiConfigured ? 'Ready' : 'Key Needed'}
          </span>
        </div>
      </div>

      {/* Preparation Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase text-slate-500">Resume Status</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <HiOutlineDocumentText className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">Pending</p>
          <p className="text-xs text-slate-500 mt-1">Upload resume for ATS audit</p>
          <Link
            to="/resume"
            className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
          >
            <span>Analyze Resume</span>
            <HiArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase text-slate-500">Mock Interviews</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <HiOutlineChatBubbleLeftRight className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">0 Completed</p>
          <p className="text-xs text-slate-500 mt-1">Practice Tech / HR / DSA</p>
          <Link
            to="/interview"
            className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
          >
            <span>Start AI Interview</span>
            <HiArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase text-slate-500">DSA Questions</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <HiOutlineCodeBracketSquare className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">0 / 11 Solved</p>
          <p className="text-xs text-slate-500 mt-1">Master coding patterns</p>
          <Link
            to="/dsa"
            className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700"
          >
            <span>Solve Problems</span>
            <HiArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase text-slate-500">Aptitude Score</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <HiOutlineAcademicCap className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">Not Attempted</p>
          <p className="text-xs text-slate-500 mt-1">Quant, Logic & Verbal tests</p>
          <Link
            to="/aptitude"
            className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-amber-600 hover:text-amber-700"
          >
            <span>Take Test</span>
            <HiArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Quick Launchpad Action Cards */}
      <div>
        <h3 className="text-base font-bold text-slate-900 mb-4">Placement Preparation Suite</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Link
            to="/resume"
            className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <HiOutlineDocumentText className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 mb-1">Resume Optimizer</h4>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Upload your PDF resume to extract skills and match against job descriptions with Gemini AI.
            </p>
            <span className="text-xs font-semibold text-blue-600 flex items-center gap-1">
              Analyze Now &rarr;
            </span>
          </Link>

          <Link
            to="/interview"
            className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-indigo-500 hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <HiOutlineChatBubbleLeftRight className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 mb-1">AI Mock Interview</h4>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Real-time questions tailored to software engineering, backend, frontend, DBMS, or OS.
            </p>
            <span className="text-xs font-semibold text-indigo-600 flex items-center gap-1">
              Start Simulation &rarr;
            </span>
          </Link>

          <Link
            to="/roadmap"
            className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-purple-500 hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <HiOutlineMap className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 mb-1">Personal Roadmap</h4>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Consolidate weaknesses across resume, code, and aptitude into actionable preparation tasks.
            </p>
            <span className="text-xs font-semibold text-purple-600 flex items-center gap-1">
              View Milestones &rarr;
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
