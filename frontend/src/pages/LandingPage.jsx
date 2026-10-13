import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
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
  HiShieldCheck,
  HiCpuChip,
} from 'react-icons/hi2';

const LandingPage = () => {
  const [backendStatus, setBackendStatus] = useState(null);

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await api.get('/health');
        setBackendStatus(response.data);
      } catch (err) {
        setBackendStatus({ success: false, message: 'Backend unreachable' });
      }
    };
    checkBackend();
  }, []);

  const features = [
    {
      icon: HiOutlineDocumentText,
      title: 'AI Resume Analyzer',
      desc: 'Extracts skills, flags missing keywords against job descriptions, identifies weak bullet points, and provides ATS improvement recommendations.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: HiOutlineChatBubbleLeftRight,
      title: 'Gemini Mock Interviewer',
      desc: 'Simulate role-specific technical, HR, and systems interviews with live AI evaluation, rubric-based scores, and model answers.',
      color: 'from-indigo-500 to-purple-500',
    },
    {
      icon: HiOutlineCodeBracketSquare,
      title: 'Curated DSA Question Bank',
      desc: 'Master 11+ algorithmic topics from Arrays to Dynamic Programming with bookmarks, difficulty filters, and progress tracking.',
      color: 'from-emerald-500 to-teal-500',
    },
    {
      icon: HiOutlineAcademicCap,
      title: 'Aptitude Practice Engine',
      desc: 'Timed multiple-choice tests across Quantitative, Logical, Verbal, and Data Interpretation with automated server scoring and detailed solutions.',
      color: 'from-amber-500 to-orange-500',
    },
    {
      icon: HiOutlineBriefcase,
      title: 'Smart Job Recommendations',
      desc: 'Matches your current skills against industry job openings, showing exact compatibility percentages and missing requirements.',
      color: 'from-rose-500 to-pink-500',
    },
    {
      icon: HiOutlineMap,
      title: 'Personalized Placement Roadmap',
      desc: 'AI-synthesized step-by-step milestones combining your resume gaps, mock test results, and target company timelines.',
      color: 'from-violet-500 to-fuchsia-500',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col">
      <Navbar />

      {/* Backend Status Notification Strip */}
      <div className="bg-slate-100 border-b border-slate-200 py-1.5 px-4 text-xs text-center text-slate-600 flex items-center justify-center gap-2">
        <span className="font-semibold text-slate-700">System Integration Status:</span>
        {backendStatus?.success ? (
          <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Backend REST API Connected (MongoDB: {backendStatus.database?.status})
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-amber-600 font-medium">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Connecting to Backend (http://localhost:5000)...
          </span>
        )}
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-32 bg-gradient-to-b from-blue-50/50 via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/70 text-blue-700 text-xs sm:text-sm font-semibold mb-6 border border-blue-200/60 shadow-xs">
            <HiSparkles className="w-4 h-4 text-blue-600" />
            <span>End-to-End Placement Preparation with Google Gemini AI</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
            Crack Your Campus Placements with <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">AI-Powered Precision</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Stop juggling 5 different portals. Analyze your resume, practice technical mock interviews, solve DSA questions, take timed aptitude tests, and follow a personalized roadmap—all in one unified platform.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 group"
            >
              <span>Get Started Free</span>
              <HiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all border border-slate-200"
            >
              Sign In to Your Dashboard
            </Link>
          </div>

          {/* Quick Metrics */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto pt-8 border-t border-slate-200/70">
            <div>
              <p className="text-3xl font-bold text-slate-900">100%</p>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">Production MERN Stack</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-600">Gemini AI</p>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">Official GenAI SDK</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-900">11+ DSA</p>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">Core Topic Categories</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-indigo-600">JWT + RBAC</p>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">Secure Role Auth</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Features Section */}
      <section id="features" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">Complete Toolkit</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Everything You Need To Secure Your Dream Job Offer
            </p>
            <p className="mt-4 text-base text-slate-600">
              Each module is purpose-built to eliminate guesswork and prepare you systematically for campus recruitments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between"
                >
                  <div>
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${feature.color} flex items-center justify-center text-white mb-5 shadow-sm`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{feature.desc}</p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-blue-600 gap-1">
                    <span>Explore module</span>
                    <HiArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">Structured Preparation</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Four Steps From Beginner to Job-Ready
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center mx-auto mb-4">
                1
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Upload Resume</h4>
              <p className="text-xs text-slate-600">
                Upload your PDF resume. Our backend extracts text and runs Gemini analysis to highlight ATS and keyword gaps.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center mx-auto mb-4">
                2
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Mock Interview</h4>
              <p className="text-xs text-slate-600">
                Generate questions for Tech, HR, or DSA. Submit your answers and receive structured rubric evaluations.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center mx-auto mb-4">
                3
              </div>
              <h4 className="font-bold text-slate-900 mb-2">DSA & Aptitude</h4>
              <p className="text-xs text-slate-600">
                Solve filtered coding problems and take timed aptitude rounds with server-side validated scorecards.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center mx-auto mb-4">
                4
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Personal Roadmap</h4>
              <p className="text-xs text-slate-600">
                Follow dynamic, personalized weekly milestones updated as you improve across all metrics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits for Students */}
      <section id="benefits" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">Why It Works</h2>
            <p className="text-3xl font-extrabold text-slate-900">Built Specifically For College Placement Drives</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="p-6 bg-white rounded-xl border border-slate-200">
              <HiShieldCheck className="w-8 h-8 text-blue-600 mb-3" />
              <h4 className="font-bold text-slate-900 mb-1">Authentic Evaluation</h4>
              <p className="text-xs text-slate-600">
                Transparent feedback with rubrics, missing concepts, and suggested answers instead of vague scores.
              </p>
            </div>
            <div className="p-6 bg-white rounded-xl border border-slate-200">
              <HiCpuChip className="w-8 h-8 text-indigo-600 mb-3" />
              <h4 className="font-bold text-slate-900 mb-1">Secure AI Integration</h4>
              <p className="text-xs text-slate-600">
                All Gemini AI calls remain securely on the backend with zero key exposure and input sanitization.
              </p>
            </div>
            <div className="p-6 bg-white rounded-xl border border-slate-200">
              <HiCheckCircle className="w-8 h-8 text-emerald-600 mb-3" />
              <h4 className="font-bold text-slate-900 mb-1">Single Source of Truth</h4>
              <p className="text-xs text-slate-600">
                Consolidated tracking of your coding streaks, aptitude percentiles, and interview readiness.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Elevate Your Placement Prep?</h2>
          <p className="text-blue-100 text-base max-w-xl mx-auto mb-8">
            Create your account now and start analyzing your resume or practicing mock interviews in seconds.
          </p>
          <Link
            to="/register"
            className="px-8 py-3.5 bg-white text-blue-700 font-bold rounded-xl shadow-lg hover:bg-blue-50 transition-all inline-block"
          >
            Create Free Student Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-slate-900 text-slate-400 py-10 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-sm">PrepAI Platform</span>
            <span>&copy; {new Date().getFullYear()} AI-Powered Placement Preparation Platform.</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/login" className="hover:text-white transition-colors">Sign In</Link>
            <Link to="/register" className="hover:text-white transition-colors">Register</Link>
            <span className="text-slate-500">Built with MERN & Gemini</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
