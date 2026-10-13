import React from 'react';
import { HiOutlineChatBubbleLeftRight } from 'react-icons/hi2';

const InterviewPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
          <HiOutlineChatBubbleLeftRight className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">AI Mock Interview Prep</h1>
          <p className="text-xs text-slate-500">
            Real-time question generation, answer evaluation, and rubrics powered by Google Gemini
          </p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs text-center max-w-xl mx-auto">
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
          <HiOutlineChatBubbleLeftRight className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">Interview Simulator Initialized</h3>
        <p className="text-sm text-slate-600 mb-6">
          Categorized interview practice (Technical, HR, DSA, DBMS, OS, Computer Networks) will be connected in Phase 5.
        </p>
        <div className="text-xs font-semibold px-3 py-2 bg-indigo-50 text-indigo-700 rounded-xl border border-indigo-200/60 inline-block">
          Gemini Evaluation Service Engine Configured
        </div>
      </div>
    </div>
  );
};

export default InterviewPage;
