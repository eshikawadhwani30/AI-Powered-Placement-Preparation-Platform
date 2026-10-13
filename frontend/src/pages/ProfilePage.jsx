import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import authApi from '../api/authApi';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import {
  HiOutlineUser,
  HiOutlineCheckBadge,
  HiOutlineAcademicCap,
  HiOutlineBriefcase,
  HiOutlineGlobeAlt,
  HiOutlineCodeBracket,
  HiCheckCircle,
} from 'react-icons/hi2';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState('');
  const [skills, setSkills] = useState('');
  const [preferredRoles, setPreferredRoles] = useState('');
  const [preferredLocation, setPreferredLocation] = useState('');
  const [college, setCollege] = useState('');
  const [graduationYear, setGraduationYear] = useState('');
  const [bio, setBio] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await authApi.getProfile();
        if (data.user) {
          const u = data.user;
          setName(u.name || '');
          setSkills(u.skills?.join(', ') || '');
          setPreferredRoles(u.preferredJobRoles?.join(', ') || '');
          setPreferredLocation(u.preferredLocation || '');
          setCollege(u.profile?.college || '');
          setGraduationYear(u.profile?.graduationYear || '');
          setBio(u.profile?.bio || '');
          setGithubUrl(u.profile?.githubUrl || '');
          setLinkedinUrl(u.profile?.linkedinUrl || '');
        }
      } catch (err) {
        setErrorMessage(
          err.response?.data?.message || 'Could not fetch profile from server.'
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const skillsArray = skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const rolesArray = preferredRoles
        .split(',')
        .map((r) => r.trim())
        .filter(Boolean);

      const payload = {
        name,
        skills: skillsArray,
        preferredJobRoles: rolesArray,
        preferredLocation,
        profile: {
          college,
          graduationYear: graduationYear ? Number(graduationYear) : null,
          bio,
          githubUrl,
          linkedinUrl,
        },
      };

      const res = await authApi.updateProfile(payload);
      if (res.success && res.user) {
        updateUser(res.user);
        setSuccessMessage('Profile and placement preferences updated successfully!');
      }
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || 'Failed to update profile. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-12">
        <LoadingSpinner size="lg" text="Loading student profile details..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
          <HiOutlineUser className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Student Profile & Preferences</h1>
          <p className="text-xs text-slate-500">
            Configure your technical skills, college background, and target job roles
          </p>
        </div>
      </div>

      {successMessage && (
        <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm">
          <HiCheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span className="font-medium">{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <ErrorMessage message={errorMessage} onDismiss={() => setErrorMessage('')} />
      )}

      {/* Main Profile Card */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
        {/* User Identity Banner */}
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-2xl flex items-center justify-center shadow-md shadow-blue-500/20">
            {user?.name ? user.name[0].toUpperCase() : 'U'}
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">{user?.name || 'Student Name'}</h3>
            <p className="text-sm text-slate-500">{user?.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                <HiOutlineCheckBadge className="w-3.5 h-3.5" />
                Role: {user?.role || 'user'}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                ID: {user?._id?.slice(-6) || 'active'}
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div>
            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
              <HiOutlineUser className="w-4 h-4 text-blue-600" />
              <span>General Information</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  Email Address (Read-only)
                </label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 text-sm cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Academic Background */}
          <div>
            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
              <HiOutlineAcademicCap className="w-4 h-4 text-blue-600" />
              <span>College & Graduation</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  College / University Name
                </label>
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  placeholder="e.g. National Institute of Technology"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  Graduation Year
                </label>
                <input
                  type="number"
                  value={graduationYear}
                  onChange={(e) => setGraduationYear(e.target.value)}
                  placeholder="2026"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Placement Goals */}
          <div>
            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
              <HiOutlineBriefcase className="w-4 h-4 text-blue-600" />
              <span>Placement Targets & Skills</span>
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  Technical Skills (comma separated)
                </label>
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="e.g. React, Node.js, Express, MongoDB, Java, Python, SQL"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Used by the Job Match engine and Gemini to customize interview difficulty.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                    Target Job Roles (comma separated)
                  </label>
                  <input
                    type="text"
                    value={preferredRoles}
                    onChange={(e) => setPreferredRoles(e.target.value)}
                    placeholder="e.g. SDE-1, Full Stack Developer, Frontend Engineer"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                    Preferred Location
                  </label>
                  <input
                    type="text"
                    value={preferredLocation}
                    onChange={(e) => setPreferredLocation(e.target.value)}
                    placeholder="e.g. Bengaluru, Pune, Hyderabad, Remote"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  Short Professional Bio
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Pre-final year Computer Science student passionate about full-stack development and distributed systems..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Social Profiles */}
          <div>
            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
              <HiOutlineGlobeAlt className="w-4 h-4 text-blue-600" />
              <span>Portfolio & Links</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  GitHub Profile URL
                </label>
                <input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/username"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  LinkedIn Profile URL
                </label>
                <input
                  type="url"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-blue-500/20 disabled:opacity-60 transition-all flex items-center gap-2"
            >
              {saving ? <LoadingSpinner size="sm" text="" /> : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
