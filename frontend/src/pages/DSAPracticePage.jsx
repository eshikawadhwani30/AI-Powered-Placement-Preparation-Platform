import React from 'react';
import { HiOutlineCodeBracketSquare } from 'react-icons/hi2';

const DSAPracticePage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
          <HiOutlineCodeBracketSquare className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">DSA Learning & Practice</h1>
          <p className="text-xs text-slate-500">
            Topic-wise questions from Arrays to DP with difficulty filters and bookmarks
          </p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs text-center max-w-xl mx-auto">
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
          <HiOutlineCodeBracketSquare className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">DSA Question Bank Prepared</h3>
        <p className="text-sm text-slate-600 mb-6">
          Categorized problem library, bookmarking, and completion tracking will be connected in Phase 7.
        </p>
        <div className="text-xs font-semibold px-3 py-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200/60 inline-block">
          11 Algorithmic Topics Supported
        </div>
      </div>
    </div>
  );
};

export default DSAPracticePage;
