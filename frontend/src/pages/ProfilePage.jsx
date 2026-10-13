import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { HiOutlineUser, HiOutlineCheckBadge } from 'react-icons/hi2';

const ProfilePage = () => {
  const { user } = useAuth();
  const [skills, setSkills] = useState(user?.skills?.join(', ') || 'React, Node.js, Express, MongoDB, JavaScript');
  const [preferredRole, setPreferredRole] = useState(user?.preferredJobRoles?.join(', ') || 'Software Development Engineer');
  const [preferredLocation, setPreferredLocation] = useState(user?.preferredLocation || 'Bengaluru / Remote');

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
          <HiOutlineUser className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Student Profile Settings</h1>
          <p className="text-xs text-slate-500">
            Manage your personal profile, technical skills, and placement preferences
          </p>
        </div>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white font-bold text-2xl flex items-center justify-center shadow-md shadow-blue-500/20">
            {user?.name ? user.name[0].toUpperCase() : 'U'}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">{user?.name || 'Student Name'}</h3>
            <p className="text-sm text-slate-500">{user?.email || 'student@example.com'}</p>
            <span className="inline-flex items-center gap-1 mt-1 text-xs font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
              <HiOutlineCheckBadge className="w-3.5 h-3.5" />
              Role: {user?.role || 'user'}
            </span>
          </div>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
              Technical Skills (comma separated)
            </label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
              Target Job Roles
            </label>
            <input
              type="text"
              value={preferredRole}
              onChange={(e) => setPreferredRole(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
              Preferred Work Location
            </label>
            <input
              type="text"
              value={preferredLocation}
              onChange={(e) => setPreferredLocation(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-sm shadow-blue-500/20 transition-all"
            >
              Save Profile Preferences
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
