import React from 'react';
import { Link } from 'react-router-dom';
import { HiHome } from 'react-icons/hi2';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
      <h1 className="text-7xl font-extrabold text-blue-600 mb-2">404</h1>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Page Not Found</h2>
      <p className="text-sm text-slate-600 max-w-sm mb-6">
        The placement resource or page you requested does not exist or has been moved.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-blue-500/20 transition-all"
      >
        <HiHome className="w-4 h-4" />
        <span>Return Home</span>
      </Link>
    </div>
  );
};

export default NotFoundPage;
