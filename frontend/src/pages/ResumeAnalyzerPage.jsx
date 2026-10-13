import React, { useState, useEffect } from 'react';
import resumeApi from '../api/resumeApi';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import {
  HiOutlineDocumentText,
  HiOutlineCloudArrowUp,
  HiOutlineSparkles,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineLightBulb,
  HiOutlineExclamationTriangle,
  HiOutlineClock,
  HiOutlineTrash,
  HiArrowPath,
  HiOutlineInformationCircle,
  HiOutlineWrenchScrewdriver,
  HiOutlineBookmarkSquare,
} from 'react-icons/hi2';

const ResumeAnalyzerPage = () => {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [currentResult, setCurrentResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'results' | 'history'
  const [errorMessage, setErrorMessage] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await resumeApi.getHistory();
      if (res.success && Array.isArray(res.data)) {
        setHistory(res.data);
      }
    } catch (err) {
      console.warn('Could not load resume history:', err.message);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        setErrorMessage('Only PDF format (.pdf) is supported.');
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        setErrorMessage('File size exceeds the 5MB maximum limit.');
        return;
      }
      setErrorMessage('');
      setFile(selectedFile);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type !== 'application/pdf') {
        setErrorMessage('Only PDF format (.pdf) is supported.');
        return;
      }
      if (droppedFile.size > 5 * 1024 * 1024) {
        setErrorMessage('File size exceeds 5MB limit.');
        return;
      }
      setErrorMessage('');
      setFile(droppedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setErrorMessage('Please select or drop a PDF resume file.');
      return;
    }

    setAnalyzing(true);
    setErrorMessage('');

    try {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('targetJobDescription', jobDescription);

      const res = await resumeApi.analyzeResume(formData);
      if (res.success && res.data) {
        setCurrentResult(res.data);
        setActiveTab('results');
        fetchHistory(); // refresh history
      }
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || 'Failed to analyze resume. Please try again.'
      );
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDeleteHistory = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this resume analysis record?')) {
      return;
    }

    try {
      await resumeApi.deleteResume(id);
      setHistory(history.filter((h) => h._id !== id));
      if (currentResult?._id === id) {
        setCurrentResult(null);
        setActiveTab('upload');
      }
    } catch (err) {
      setErrorMessage('Failed to delete resume record.');
    }
  };

  const viewPreviousResume = async (item) => {
    try {
      const res = await resumeApi.getById(item._id);
      if (res.success && res.data) {
        setCurrentResult(res.data);
        setActiveTab('results');
      }
    } catch (err) {
      setErrorMessage('Could not load selected resume analysis.');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shadow-xs">
            <HiOutlineDocumentText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">AI Resume Analyzer & ATS Auditor</h1>
            <p className="text-xs text-slate-500">
              Extract skills, compare keywords against job descriptions, and evaluate ATS alignment
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center p-1 bg-slate-200/70 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === 'upload' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            Upload & Audit
          </button>
          {currentResult && (
            <button
              onClick={() => setActiveTab('results')}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                activeTab === 'results' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
              }`}
            >
              Current Analysis
            </button>
          )}
          <button
            onClick={() => {
              setActiveTab('history');
              fetchHistory();
            }}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === 'history' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            History ({history.length})
          </button>
        </div>
      </div>

      {/* Mandatory ATS Transparency Disclaimer */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-start gap-3 text-xs text-blue-900">
        <HiOutlineInformationCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Notice regarding AI Score: </span>
          The score generated by this tool is an estimated compatibility index computed using Google Gemini AI and heuristic keyword analysis. It is designed to guide placement preparation and does not represent an official or guaranteed proprietary ATS score.
        </div>
      </div>

      {errorMessage && (
        <ErrorMessage message={errorMessage} onDismiss={() => setErrorMessage('')} />
      )}

      {/* TAB 1: UPLOAD & AUDIT */}
      {activeTab === 'upload' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Drag & Drop File Zone */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Upload Resume (PDF format, Max 5MB)
              </label>

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
                  dragActive
                    ? 'border-blue-500 bg-blue-50/50'
                    : file
                    ? 'border-emerald-500 bg-emerald-50/30'
                    : 'border-slate-300 hover:border-blue-400 bg-slate-50/50'
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-3">
                  <HiOutlineCloudArrowUp className="w-7 h-7" />
                </div>

                {file ? (
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-emerald-800">{file.name}</p>
                    <p className="text-xs text-slate-500">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB • Ready for analysis
                    </p>
                    <button
                      type="button"
                      onClick={() => setFile(null)}
                      className="text-xs font-semibold text-rose-600 hover:underline mt-2 inline-block"
                    >
                      Remove and choose another
                    </button>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      Drag and drop your PDF resume here, or{' '}
                      <label className="text-blue-600 hover:underline cursor-pointer">
                        browse files
                        <input
                          type="file"
                          accept=".pdf,application/pdf"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Text-based PDF documents only (standard single/double column)
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Target Job Description */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center justify-between">
                <span>Target Job Description (Optional but Recommended)</span>
                <span className="text-[11px] font-normal text-slate-400">
                  Paste role requirements from hiring portals
                </span>
              </label>
              <textarea
                rows={5}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description or role requirements here (e.g. SDE-1, React, Node.js, Spring Boot, AWS, Microservices)..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all font-mono text-xs"
              />
            </div>

            {/* Submit Action */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <span className="text-xs text-slate-500">
                PDF text extraction & Gemini evaluation take ~3-6 seconds
              </span>
              <button
                type="submit"
                disabled={analyzing || !file}
                className="px-7 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-blue-500/20 disabled:opacity-50 transition-all flex items-center gap-2"
              >
                {analyzing ? (
                  <LoadingSpinner size="sm" text="Evaluating with Gemini..." />
                ) : (
                  <>
                    <HiOutlineSparkles className="w-5 h-5 text-yellow-300" />
                    <span>Run AI Resume Audit</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: ANALYSIS RESULTS */}
      {activeTab === 'results' && currentResult && (
        <div className="space-y-6">
          {/* Executive Overview Card */}
          <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                Analysis for: {currentResult.fileName}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
                Executive Evaluation
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                {currentResult.analysis?.summary}
              </p>
            </div>

            {/* Score Badge */}
            <div className="text-center p-6 bg-slate-50 rounded-2xl border border-slate-200 min-w-[200px]">
              <span className="text-xs font-bold uppercase text-slate-400">Estimated Score</span>
              <div
                className={`text-5xl font-black mt-1 ${
                  currentResult.score >= 80
                    ? 'text-emerald-600'
                    : currentResult.score >= 60
                    ? 'text-blue-600'
                    : 'text-amber-600'
                }`}
              >
                {currentResult.score}
                <span className="text-lg font-normal text-slate-400">/100</span>
              </div>
              <span
                className={`inline-block mt-2 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                  currentResult.score >= 80
                    ? 'bg-emerald-100 text-emerald-800'
                    : currentResult.score >= 60
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {currentResult.score >= 80
                  ? 'Strong Candidate'
                  : currentResult.score >= 60
                  ? 'Moderate Alignment'
                  : 'Needs Enhancement'}
              </span>
            </div>
          </div>

          {/* Skills Breakdown Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Identified Skills */}
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <HiOutlineCheckCircle className="w-5 h-5 text-emerald-600" />
                <span>Identified Skills in Resume ({currentResult.analysis?.skillsIdentified?.length || 0})</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {currentResult.analysis?.skillsIdentified?.map((sk, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-medium px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <HiOutlineXCircle className="w-5 h-5 text-rose-600" />
                <span>Missing Skills vs Target Job ({currentResult.analysis?.missingSkills?.length || 0})</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {currentResult.analysis?.missingSkills?.map((sk, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-medium px-2.5 py-1 rounded-lg bg-rose-50 text-rose-800 border border-rose-200"
                  >
                    + {sk}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <HiOutlineSparkles className="w-5 h-5 text-blue-600" />
                <span>Key Resume Strengths</span>
              </h3>
              <ul className="space-y-2 text-xs text-slate-600">
                {currentResult.analysis?.strengths?.map((str, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <HiOutlineExclamationTriangle className="w-5 h-5 text-amber-600" />
                <span>Areas Needing Improvement</span>
              </h3>
              <ul className="space-y-2 text-xs text-slate-600">
                {currentResult.analysis?.weaknesses?.map((w, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bullet Point Improvement Suggestions */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <HiOutlineLightBulb className="w-5 h-5 text-yellow-500" />
              <span>Action Verb & Impact Bullet Point Enhancements</span>
            </h3>
            <div className="space-y-3">
              {currentResult.analysis?.bulletPointSuggestions?.map((sug, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 leading-relaxed"
                >
                  {sug}
                </div>
              ))}
            </div>
          </div>

          {/* ATS Formatting & Roadmap Suggestions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <HiOutlineWrenchScrewdriver className="w-5 h-5 text-indigo-600" />
                <span>ATS Compatibility Tips</span>
              </h3>
              <ul className="space-y-2 text-xs text-slate-600">
                {currentResult.analysis?.atsSuggestions?.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-indigo-500 font-bold">✓</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <HiOutlineBookmarkSquare className="w-5 h-5 text-purple-600" />
                <span>Next 4-Week Action Steps</span>
              </h3>
              <ul className="space-y-2 text-xs text-slate-600">
                {currentResult.analysis?.learningRoadmap?.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">→</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: RESUME HISTORY */}
      {activeTab === 'history' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <HiOutlineClock className="w-5 h-5 text-blue-600" />
              <span>Previous Resume Audits</span>
            </h3>
            <button
              onClick={fetchHistory}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <HiArrowPath className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </button>
          </div>

          {loadingHistory ? (
            <LoadingSpinner size="md" text="Loading history..." />
          ) : history.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              No previous resume analyses recorded yet. Upload a resume to get started!
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {history.map((item) => (
                <div
                  key={item._id}
                  onClick={() => viewPreviousResume(item)}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-slate-50/80 -mx-4 px-4 rounded-xl transition-colors"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-slate-900 truncate">{item.fileName}</p>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                        Score: {item.score}/100
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Audited on {new Date(item.createdAt).toLocaleDateString()} at{' '}
                      {new Date(item.createdAt).toLocaleTimeString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-blue-600 hover:underline">
                      View Report &rarr;
                    </span>
                    <button
                      onClick={(e) => handleDeleteHistory(item._id, e)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Delete record"
                    >
                      <HiOutlineTrash className="w-4 h-4" />
                    </button>
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

export default ResumeAnalyzerPage;
