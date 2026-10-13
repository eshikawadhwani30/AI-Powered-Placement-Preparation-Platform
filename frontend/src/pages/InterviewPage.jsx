import React, { useState, useEffect } from 'react';
import interviewApi from '../api/interviewApi';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import {
  HiOutlineChatBubbleLeftRight,
  HiOutlineSparkles,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
  HiOutlineLightBulb,
  HiArrowRight,
  HiArrowPath,
  HiOutlineClock,
  HiOutlineAcademicCap,
  HiOutlineQuestionMarkCircle,
  HiOutlineInformationCircle,
} from 'react-icons/hi2';

const categories = [
  'Technical',
  'HR',
  'DSA',
  'DBMS',
  'Operating Systems',
  'Computer Networks',
  'OOP',
  'Project-Based',
];

const jobRoles = [
  'Software Development Engineer (SDE-1)',
  'Frontend Web Developer',
  'Backend Engineer (Node/Java/Python)',
  'Full Stack MERN Developer',
  'Cloud & DevOps Engineer',
  'Associate Software Engineer (Campus Fresher)',
];

const InterviewPage = () => {
  // Session Configuration State
  const [selectedRole, setSelectedRole] = useState(jobRoles[0]);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [selectedDifficulty, setSelectedDifficulty] = useState('Intermediate');
  const [questionCount, setQuestionCount] = useState(3);

  // Active Session State
  const [session, setSession] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);

  // History State
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [activeTab, setActiveTab] = useState('simulate'); // 'simulate' | 'history'
  const [errorMessage, setErrorMessage] = useState('');

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await interviewApi.getHistory();
      if (res.success && Array.isArray(res.data)) {
        setHistory(res.data);
      }
    } catch (err) {
      console.warn('Could not load interview history:', err.message);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleStartInterview = async (e) => {
    e.preventDefault();
    setGenerating(true);
    setErrorMessage('');
    setEvaluationResult(null);

    try {
      const res = await interviewApi.startInterview({
        jobRole: selectedRole,
        category: selectedCategory,
        difficulty: selectedDifficulty,
        questionCount,
      });

      if (res.success && res.data) {
        setSession(res.data);
        setCurrentQuestionIndex(0);
        setUserAnswer('');
      }
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || 'Failed to generate interview questions. Please try again.'
      );
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!userAnswer || userAnswer.trim().length < 5) {
      setErrorMessage('Please type a substantive answer before submitting for evaluation.');
      return;
    }

    setEvaluating(true);
    setErrorMessage('');

    try {
      const currentQuestion = session.questions[currentQuestionIndex];
      const res = await interviewApi.submitAnswer({
        sessionId: session._id,
        questionId: currentQuestion._id,
        userAnswer,
      });

      if (res.success && res.evaluation) {
        setEvaluationResult(res.evaluation);
        if (res.session) {
          setSession(res.session);
        }
      }
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || 'Failed to evaluate answer. Please try again.'
      );
    } finally {
      setEvaluating(false);
    }
  };

  const handleNextQuestion = () => {
    setEvaluationResult(null);
    setUserAnswer('');
    setCurrentQuestionIndex((prev) => prev + 1);
  };

  const handleResetSession = () => {
    setSession(null);
    setCurrentQuestionIndex(0);
    setUserAnswer('');
    setEvaluationResult(null);
    fetchHistory();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center shadow-xs">
            <HiOutlineChatBubbleLeftRight className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">AI Mock Interview Simulator</h1>
            <p className="text-xs text-slate-500">
              Role-specific technical & behavioral question drills with rubric-based Gemini feedback
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center p-1 bg-slate-200/70 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('simulate')}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === 'simulate' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            Practice Simulation
          </button>
          <button
            onClick={() => {
              setActiveTab('history');
              fetchHistory();
            }}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === 'history' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            Past Sessions ({history.length})
          </button>
        </div>
      </div>

      {/* Transparency Disclaimer */}
      <div className="p-3.5 bg-indigo-50 border border-indigo-200 rounded-2xl flex items-start gap-3 text-xs text-indigo-900">
        <HiOutlineInformationCircle className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Constructive Feedback Note: </span>
          AI-generated evaluations provide qualitative coaching, rubric scores, and model answers to help you prepare. They are not guaranteed or absolute measures of actual campus interview outcomes.
        </div>
      </div>

      {errorMessage && (
        <ErrorMessage message={errorMessage} onDismiss={() => setErrorMessage('')} />
      )}

      {/* TAB 1: PRACTICE SIMULATION */}
      {activeTab === 'simulate' && (
        <>
          {/* 1. SETUP FORM IF NO ACTIVE SESSION */}
          {!session && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
              <div className="max-w-xl mx-auto text-center mb-8">
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-3">
                  <HiOutlineAcademicCap className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Configure Your Interview Round</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Customize the question category, difficulty tier, and target engineering role
                </p>
              </div>

              <form onSubmit={handleStartInterview} className="space-y-6 max-w-2xl mx-auto">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Target Job Role
                  </label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                  >
                    {jobRoles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Interview Category
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Difficulty Level
                    </label>
                    <select
                      value={selectedDifficulty}
                      onChange={(e) => setSelectedDifficulty(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                    >
                      <option value="Beginner">Beginner (Core Fundamentals)</option>
                      <option value="Intermediate">Intermediate (Standard Campus Drive)</option>
                      <option value="Advanced">Advanced (Systems & In-Depth)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    Generates 3 customized placement questions
                  </span>
                  <button
                    type="submit"
                    disabled={generating}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-indigo-500/20 disabled:opacity-50 transition-all flex items-center gap-2"
                  >
                    {generating ? (
                      <LoadingSpinner size="sm" text="Generating with Gemini..." />
                    ) : (
                      <>
                        <HiOutlineSparkles className="w-4 h-4 text-yellow-300" />
                        <span>Start Mock Interview</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 2. ACTIVE INTERVIEW SIMULATION */}
          {session && currentQuestionIndex < session.questions.length && (
            <div className="space-y-6">
              {/* Session Meta Header */}
              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {session.category}
                  </span>
                  <span className="text-xs font-medium text-slate-600">
                    {session.jobRole} • {session.difficulty}
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-500">
                  Question {currentQuestionIndex + 1} of {session.questions.length}
                </div>
              </div>

              {/* Question Card */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center flex-shrink-0 text-sm mt-0.5">
                    Q{currentQuestionIndex + 1}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 leading-snug">
                    {session.questions[currentQuestionIndex].questionText}
                  </h3>
                </div>

                {/* Answer Text Area */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center justify-between">
                    <span>Your Answer (Speak or Type)</span>
                    <span className="text-[11px] font-normal text-slate-400">
                      {userAnswer.length} characters
                    </span>
                  </label>
                  <textarea
                    rows={6}
                    disabled={Boolean(evaluationResult)}
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Structure your answer clearly: State the core principle, explain the operational mechanism, and conclude with performance or trade-off considerations..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all font-sans"
                  />
                </div>

                {!evaluationResult && (
                  <div className="flex items-center justify-end pt-2">
                    <button
                      onClick={handleSubmitAnswer}
                      disabled={evaluating || !userAnswer.trim()}
                      className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-indigo-500/20 disabled:opacity-50 transition-all flex items-center gap-2"
                    >
                      {evaluating ? (
                        <LoadingSpinner size="sm" text="Evaluating with Gemini..." />
                      ) : (
                        <>
                          <HiOutlineSparkles className="w-4 h-4 text-yellow-300" />
                          <span>Submit for AI Review</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* 3. GEMINI EVALUATION & RUBRIC CARD */}
              {evaluationResult && (
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6 animate-fadeIn">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div>
                      <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <HiOutlineSparkles className="w-5 h-5 text-indigo-600" />
                        <span>AI Performance Evaluation</span>
                      </h4>
                      <p className="text-xs text-slate-500">
                        Evaluated against technical depth and clarity criteria
                      </p>
                    </div>

                    {/* Rubric Score Pill */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 font-semibold uppercase">Rubric:</span>
                      <span
                        className={`text-2xl font-black px-4 py-1.5 rounded-xl border ${
                          evaluationResult.rubricScore >= 8
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : evaluationResult.rubricScore >= 5
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {evaluationResult.rubricScore} / 10
                      </span>
                    </div>
                  </div>

                  {/* Feedback Breakdown */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                      <span className="font-bold text-slate-800 uppercase tracking-wider block mb-1">
                        Topic Relevance:
                      </span>
                      <p className="text-slate-600">{evaluationResult.relevance}</p>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                      <span className="font-bold text-slate-800 uppercase tracking-wider block mb-1">
                        Technical Correctness:
                      </span>
                      <p className="text-slate-600">{evaluationResult.technicalCorrectness}</p>
                    </div>
                  </div>

                  {/* Missing Concepts & Actionable Improvements */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-2xl text-xs">
                      <span className="font-bold text-rose-900 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                        <HiOutlineExclamationCircle className="w-4 h-4 text-rose-600" />
                        <span>Missing Concepts</span>
                      </span>
                      <ul className="space-y-1 text-rose-800 list-disc list-inside">
                        {evaluationResult.missingConcepts?.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl text-xs">
                      <span className="font-bold text-amber-900 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                        <HiOutlineLightBulb className="w-4 h-4 text-amber-600" />
                        <span>Areas for Improvement</span>
                      </span>
                      <ul className="space-y-1 text-amber-800 list-disc list-inside">
                        {evaluationResult.areasForImprovement?.map((a, i) => (
                          <li key={i}>{a}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Suggested Better Answer */}
                  <div className="p-5 bg-indigo-50/60 border border-indigo-200 rounded-2xl">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-900 block mb-2 flex items-center gap-2">
                      <HiOutlineAcademicCap className="w-4 h-4 text-indigo-600" />
                      <span>Model Answer Showcase</span>
                    </span>
                    <p className="text-xs text-indigo-950 leading-relaxed font-sans">
                      {evaluationResult.suggestedBetterAnswer}
                    </p>
                  </div>

                  {/* Follow-up question teaser */}
                  {evaluationResult.followUpQuestion && (
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-700">
                      <span className="font-bold text-slate-900 block mb-1">
                        Potential Follow-Up Question:
                      </span>
                      <p className="italic text-slate-600">"{evaluationResult.followUpQuestion}"</p>
                    </div>
                  )}

                  {/* Next Step Action */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      Answer saved and rubric calculated
                    </span>
                    {currentQuestionIndex + 1 < session.questions.length ? (
                      <button
                        onClick={handleNextQuestion}
                        className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
                      >
                        <span>Next Question</span>
                        <HiArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={handleResetSession}
                        className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
                      >
                        <HiOutlineCheckCircle className="w-4 h-4" />
                        <span>Finish Session & View Summary</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 4. SESSION COMPLETED SUMMARY */}
          {session && currentQuestionIndex >= session.questions.length && (
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs text-center max-w-xl mx-auto space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl">
                🎉
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Mock Interview Round Completed!</h2>
              <p className="text-sm text-slate-600">
                You completed all questions for <strong>{session.jobRole}</strong> ({session.category}).
              </p>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 inline-block my-2">
                <span className="text-xs font-semibold text-slate-500 uppercase">Average Session Score</span>
                <p className="text-4xl font-extrabold text-indigo-600 mt-1">
                  {session.averageScore || 7.5} <span className="text-sm font-normal text-slate-400">/ 10</span>
                </p>
              </div>
              <div className="pt-4">
                <button
                  onClick={handleResetSession}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-md transition-all inline-flex items-center gap-2"
                >
                  <HiArrowPath className="w-4 h-4" />
                  <span>Start Another Interview Round</span>
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* TAB 2: INTERVIEW HISTORY */}
      {activeTab === 'history' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <HiOutlineClock className="w-5 h-5 text-indigo-600" />
              <span>Past Interview Rounds</span>
            </h3>
            <button
              onClick={fetchHistory}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              <HiArrowPath className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </button>
          </div>

          {loadingHistory ? (
            <LoadingSpinner size="md" text="Loading session history..." />
          ) : history.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              No previous mock interview rounds recorded yet. Start your first session!
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {history.map((s) => (
                <div key={s._id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {s.category}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 truncate">{s.jobRole}</h4>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {s.questions?.length || 3} questions • Difficulty: {s.difficulty} •{' '}
                      {new Date(s.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-slate-900 px-3 py-1 bg-slate-100 rounded-lg">
                      {s.averageScore ? `${s.averageScore}/10` : 'In Progress'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InterviewPage;
