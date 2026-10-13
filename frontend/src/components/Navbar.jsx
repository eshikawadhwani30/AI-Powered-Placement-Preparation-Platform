import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiSparkles, HiArrowRightOnRectangle } from 'react-icons/hi2';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <HiSparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-lg bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
              PrepAI
            </span>
            <span className="hidden sm:inline-block text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1.5 px-1.5 py-0.5 bg-slate-100 rounded">
              Placement Pro
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-blue-600 transition-colors">How It Works</a>
          <a href="#benefits" className="hover:text-blue-600 transition-colors">Benefits</a>
        </nav>

        {/* Auth CTA Actions */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all shadow-blue-500/20"
              >
                Go to Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 text-slate-500 hover:text-red-600 rounded-lg hover:bg-slate-100 transition-colors"
                title="Logout"
                aria-label="Logout"
              >
                <HiArrowRightOnRectangle className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all shadow-blue-500/20"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
