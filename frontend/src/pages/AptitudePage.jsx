import React from 'react';
import { HiOutlineAcademicCap } from 'react-icons/hi2';

const AptitudePage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
          <HiOutlineAcademicCap className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Aptitude Practice & Tests</h1>
          <p className="text-xs text-slate-500">
            Timed tests across Quantitative, Logical Reasoning, Verbal, and Data Interpretation
          </p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs text-center max-w-xl mx-auto">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
          <HiOutlineAcademicCap className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">Aptitude Assessment Module</h3>
        <p className="text-sm text-slate-600 mb-6">
          Server-evaluated multiple-choice tests with timer enforcement and detailed solutions will be active in Phase 8.
        </p>
        <div className="text-xs font-semibold px-3 py-2 bg-amber-50 text-amber-700 rounded-xl border border-amber-200/60 inline-block">
          Anti-tamper Server Scoring Engine Configured
        </div>
      </div>
    </div>
  );
};

export default AptitudePage;
