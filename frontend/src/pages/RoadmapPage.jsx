import React from 'react';
import { HiOutlineMap } from 'react-icons/hi2';

const RoadmapPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
          <HiOutlineMap className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Personalized Learning Roadmap</h1>
          <p className="text-xs text-slate-500">
            Synthesized milestones driven by your resume audit, DSA progress, and mock test scores
          </p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs text-center max-w-xl mx-auto">
        <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-4">
          <HiOutlineMap className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">Roadmap Generator Ready</h3>
        <p className="text-sm text-slate-600 mb-6">
          Dynamic milestone tracking with Gemini AI recommendations will be connected in Phase 9.
        </p>
        <div className="text-xs font-semibold px-3 py-2 bg-purple-50 text-purple-700 rounded-xl border border-purple-200/60 inline-block">
          Objective Progress Synthesizer
        </div>
      </div>
    </div>
  );
};

export default RoadmapPage;
