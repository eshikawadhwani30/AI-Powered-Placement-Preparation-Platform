import React, { useState, useEffect } from 'react';
import jobsApi from '../api/jobsApi';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import {
  HiOutlineBriefcase,
  HiOutlineSparkles,
  HiOutlineBuildingOffice2,
  HiOutlineMapPin,
  HiOutlineMagnifyingGlass,
  HiOutlineArrowTopRightOnSquare,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineInformationCircle,
  HiArrowPath,
} from 'react-icons/hi2';

const JobRecommendationsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('recommended'); // 'recommended' | 'all'
  const [recommendations, setRecommendations] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [customSkills, setCustomSkills] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const loadRecommendations = async (skillsOverride = null) => {
    setLoading(true);
    setErrorMessage('');
    try {
      const payload = {};
      if (skillsOverride) {
        payload.skills = skillsOverride
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);
      }
      const res = await jobsApi.getRecommendations(payload);
      if (res.success && Array.isArray(res.data)) {
        setRecommendations(res.data);
      }
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || 'Could not fetch job recommendations.'
      );
    } finally {
      setLoading(false);
    }
  };

  const loadAllJobs = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const res = await jobsApi.getAllJobs({
        search: searchTerm,
        location: selectedLocation,
      });
      if (res.success && Array.isArray(res.data)) {
        setAllJobs(res.data);
      }
    } catch (err) {
      setErrorMessage('Could not fetch jobs catalog.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'recommended') {
      loadRecommendations();
    } else {
      loadAllJobs();
    }
  }, [activeTab]);

  const handleFilterSearch = (e) => {
    e.preventDefault();
    if (activeTab === 'all') {
      loadAllJobs();
    } else {
      loadRecommendations(customSkills);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shadow-xs">
            <HiOutlineBriefcase className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Campus Placement Job Recommendations</h1>
            <p className="text-xs text-slate-500">
              Personalized skill matching, compatibility percentage, and qualification gap analysis
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center p-1 bg-slate-200/70 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('recommended')}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === 'recommended' ? 'bg-white text-rose-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            Skill-Matched Jobs
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === 'all' ? 'bg-white text-rose-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            All Drive Openings
          </button>
        </div>
      </div>

      {/* Mandatory Sample Data Transparency Banner */}
      <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-xs text-rose-900">
        <HiOutlineInformationCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Placement Listings Note: </span>
          Job openings displayed in this system are seeded sample opportunities modeled after real campus drives. They provide authentic criteria for practice, skill alignment, and interview readiness drills.
        </div>
      </div>

      {errorMessage && (
        <ErrorMessage message={errorMessage} onDismiss={() => setErrorMessage('')} />
      )}

      {/* Dynamic Skill Simulation Filter Strip */}
      {activeTab === 'recommended' && (
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <form onSubmit={handleFilterSearch} className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                value={customSkills}
                onChange={(e) => setCustomSkills(e.target.value)}
                placeholder="Test skill match (e.g. React, Node.js, Spring Boot, Docker, Java, SQL)..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
            >
              <HiOutlineSparkles className="w-4 h-4 text-yellow-300" />
              <span>Simulate Match</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setCustomSkills('');
                loadRecommendations();
              }}
              className="p-2.5 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors"
              title="Reset to profile skills"
            >
              <HiArrowPath className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Search Filter for Catalog View */}
      {activeTab === 'all' && (
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <form onSubmit={handleFilterSearch} className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <HiOutlineMagnifyingGlass className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search job title, company, or required skill..."
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-all"
            >
              Search Openings
            </button>
          </form>
        </div>
      )}

      {/* Main Content Listings */}
      {loading ? (
        <div className="py-16">
          <LoadingSpinner size="lg" text="Matching opportunities against profile competencies..." />
        </div>
      ) : activeTab === 'recommended' ? (
        <div className="space-y-4">
          {recommendations.length === 0 ? (
            <div className="p-12 bg-white rounded-2xl border border-slate-200 text-center text-slate-400 text-sm">
              No matching listings found. Try adding additional skills to your profile!
            </div>
          ) : (
            recommendations.map((job) => (
              <div
                key={job._id}
                className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-start justify-between gap-6"
              >
                <div className="space-y-3 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900">{job.title}</h3>
                    <span
                      className={`text-xs font-black px-2.5 py-0.5 rounded-full border ${
                        job.matchScore >= 80
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : job.matchScore >= 50
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {job.matchScore}% Match
                    </span>
                    {job.isSampleData && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-500">
                        Sample Drive
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <HiOutlineBuildingOffice2 className="w-4 h-4 text-slate-400" />
                      {job.company}
                    </span>
                    <span className="flex items-center gap-1">
                      <HiOutlineMapPin className="w-4 h-4 text-slate-400" />
                      {job.location}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {job.experienceLevel}
                    </span>
                  </div>

                  {/* Why this job matched you */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
                    <strong className="text-slate-900 font-semibold">Why this matches you: </strong>
                    {job.reasonWhyMatched}
                  </div>

                  {/* Skills Comparison */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                      Required Skills Compatibility:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {job.requiredSkills?.map((skill, idx) => {
                        const isMatched = job.matchedSkills?.includes(skill);
                        return (
                          <span
                            key={idx}
                            className={`text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1 border ${
                              isMatched
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : 'bg-rose-50 text-rose-700 border-rose-200'
                            }`}
                          >
                            {isMatched ? (
                              <HiOutlineCheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <HiOutlineXCircle className="w-3.5 h-3.5 text-rose-500" />
                            )}
                            <span>{skill}</span>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex md:flex-col items-center justify-between md:justify-start gap-3 flex-shrink-0 pt-2">
                  <a
                    href={job.applicationUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                  >
                    <span>Apply / Practice</span>
                    <HiOutlineArrowTopRightOnSquare className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* All Openings View */
        <div className="space-y-4">
          {allJobs.length === 0 ? (
            <div className="p-12 bg-white rounded-2xl border border-slate-200 text-center text-slate-400 text-sm">
              No campus listings matching your search filter.
            </div>
          ) : (
            allJobs.map((job) => (
              <div
                key={job._id}
                className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-start justify-between gap-6"
              >
                <div className="space-y-2 flex-1">
                  <h3 className="text-lg font-bold text-slate-900">{job.title}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-medium text-slate-700">
                      <HiOutlineBuildingOffice2 className="w-4 h-4 text-slate-400" />
                      {job.company}
                    </span>
                    <span className="flex items-center gap-1">
                      <HiOutlineMapPin className="w-4 h-4 text-slate-400" />
                      {job.location}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {job.experienceLevel}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 pt-1 leading-relaxed">
                    {job.description}
                  </p>
                  <div className="flex flex-wrap gap-1 pt-2">
                    {job.requiredSkills?.map((s, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <a
                  href={job.applicationUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="self-start px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-xl transition-all flex items-center gap-1"
                >
                  <span>View Details</span>
                  <HiOutlineArrowTopRightOnSquare className="w-3.5 h-3.5" />
                </a>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default JobRecommendationsPage;
