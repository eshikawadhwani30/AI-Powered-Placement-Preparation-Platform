import React from 'react';
import { HiOutlineBriefcase } from 'react-icons/hi2';

const JobRecommendationsPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
          <HiOutlineBriefcase className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Job Recommendations</h1>
          <p className="text-xs text-slate-500">
            Compare student profile skills against verified openings and view skill gap matches
          </p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs text-center max-w-xl mx-auto">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
          <HiOutlineBriefcase className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">Job Recommendation Engine</h3>
        <p className="text-sm text-slate-600 mb-6">
          Skill-match algorithms, job schemas, and compatibility breakdown will be integrated in Phase 6.
        </p>
        <div className="text-xs font-semibold px-3 py-2 bg-rose-50 text-rose-700 rounded-xl border border-rose-200/60 inline-block">
          Modular Job API Ready for Seeding
        </div>
      </div>
    </div>
  );
};

export default JobRecommendationsPage;
