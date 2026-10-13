import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HiSparkles,
  HiOutlineHome,
  HiOutlineDocumentText,
  HiOutlineChatBubbleLeftRight,
  HiOutlineBriefcase,
  HiOutlineCodeBracketSquare,
  HiOutlineAcademicCap,
  HiOutlineMap,
  HiOutlineUser,
  HiOutlineArrowRightOnRectangle,
} from 'react-icons/hi2';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: HiOutlineHome },
  { name: 'Resume Analyzer', path: '/resume', icon: HiOutlineDocumentText },
  { name: 'AI Interview Prep', path: '/interview', icon: HiOutlineChatBubbleLeftRight },
  { name: 'Job Recommendations', path: '/jobs', icon: HiOutlineBriefcase },
  { name: 'DSA Practice', path: '/dsa', icon: HiOutlineCodeBracketSquare },
  { name: 'Aptitude Tests', path: '/aptitude', icon: HiOutlineAcademicCap },
  { name: 'Learning Roadmap', path: '/roadmap', icon: HiOutlineMap },
  { name: 'Profile Settings', path: '/profile', icon: HiOutlineUser },
];

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-800">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white shadow-md">
          <HiSparkles className="w-5 h-5" />
        </div>
        <div>
          <span className="font-bold text-white tracking-tight">PrepAI Platform</span>
          <p className="text-[11px] text-blue-400 font-medium">Placement Suite</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                }`
              }
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User Info & Logout Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-blue-600/30 text-blue-400 font-bold flex items-center justify-center border border-blue-500/30 text-sm">
            {user?.name ? user.name[0].toUpperCase() : 'U'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-white truncate">{user?.name || 'Student'}</p>
            <p className="text-xs text-slate-400 truncate">{user?.email || 'user@example.com'}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors border border-red-500/20"
        >
          <HiOutlineArrowRightOnRectangle className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
