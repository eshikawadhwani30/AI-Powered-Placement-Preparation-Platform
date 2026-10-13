import React from 'react';
import { HiOutlineDocumentText } from 'react-icons/hi2';

const ResumeAnalyzerPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
          <HiOutlineDocumentText className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">AI Resume Analyzer</h1>
          <p className="text-xs text-slate-500">
            Extract skills, compare with target job descriptions, and inspect ATS compatibility
          </p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs text-center max-w-xl mx-auto">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
          <HiOutlineDocumentText className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">Resume Upload & Parsing Ready</h3>
        <p className="text-sm text-slate-600 mb-6">
          PDF upload, Multer integration, pdf-parse extraction, and Gemini AI analysis will be connected in Phase 4.
        </p>
        <div className="text-xs font-semibold px-3 py-2 bg-blue-50 text-blue-700 rounded-xl border border-blue-200/60 inline-block">
          Backend PDF Extraction & Gemini Pipeline Configured
        </div>
      </div>
    </div>
  );
};

export default ResumeAnalyzerPage;
