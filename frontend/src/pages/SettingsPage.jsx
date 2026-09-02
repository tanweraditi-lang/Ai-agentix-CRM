import React, { useState } from 'react';
import { Settings, User, Bell, Shield, Lock, Clock, CheckCircle2 } from 'lucide-react';

function SettingsPage() {
  const userStr = localStorage.getItem('user');
  let user = { first_name: 'Rajesh', last_name: 'Sharma', email: 'admin@agentix.com', role: 'admin', lastLogin: new Date() };
  try {
    if (userStr) user = JSON.parse(userStr);
  } catch {}

  const [activeTab, setActiveTab] = useState('profile');
  const isAdmin = (user?.role || 'agent').toLowerCase() === 'admin';

  const userName = [user.first_name, user.last_name].filter(Boolean).join(' ') || user.name || 'User';

  return (
    <div className="max-w-4xl space-y-6 text-[#111111]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#FFDCD0] shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#FFF6F1] border border-[#FFDCD0] rounded-xl text-[#F26522] shadow-xs">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#111111] tracking-tight">System Settings</h1>
            <p className="text-xs sm:text-sm text-[#475569] font-medium">Manage profile, authentication roles, and workspace preferences</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold bg-orange-50 text-[#F26522] border border-[#FFDCD0] px-3 py-1.5 rounded-full capitalize">
            Role: {user.role || 'Agent'}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-[#FFDCD0] shadow-xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'profile'
              ? 'bg-[#F26522] text-white shadow-xs'
              : 'text-slate-600 hover:text-[#F26522]'
          }`}
        >
          Profile & Session
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'users'
              ? 'bg-[#F26522] text-white shadow-xs'
              : 'text-slate-600 hover:text-[#F26522]'
          }`}
        >
          User Management (Admin)
        </button>
      </div>

      {/* Content Area */}
      <div className="bg-white border border-[#FFDCD0] rounded-2xl p-6 shadow-xs space-y-6">
        {activeTab === 'profile' ? (
          <>
            <div>
              <h2 className="text-base font-bold text-[#111111] border-b border-[#FFDCD0] pb-2 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-[#F26522]" />
                <span>User Profile & Credentials</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    disabled
                    value={userName}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    disabled
                    value={user.email || 'user@agentix.com'}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700"
                  />
                </div>
              </div>
            </div>

            {/* Session Info */}
            <div className="p-4 rounded-2xl bg-[#FFF6F1]/50 border border-[#FFDCD0] space-y-2 text-xs">
              <h3 className="font-bold text-[#111111] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#F26522]" />
                <span>Active Session Telemetry</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600">
                <p>
                  <span className="font-bold text-slate-800">Assigned Role:</span> <span className="capitalize">{user.role || 'Agent'}</span>
                </p>
                <p>
                  <span className="font-bold text-slate-800">Last Successful Login:</span>{' '}
                  {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Just Now'}
                </p>
                <p>
                  <span className="font-bold text-slate-800">Token Type:</span> JWT Bearer (HMAC-SHA256)
                </p>
                <p>
                  <span className="font-bold text-slate-800">Session Status:</span> Valid & Active
                </p>
              </div>
            </div>
          </>
        ) : (
          <div>
            <h2 className="text-base font-bold text-[#111111] border-b border-[#FFDCD0] pb-2 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#F26522]" />
              <span>User & Role Management</span>
            </h2>

            {isAdmin ? (
              <div className="space-y-4 text-xs">
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>You have full Admin access. You can add, edit, or revoke user roles.</span>
                </div>
                <div className="p-4 rounded-xl border border-[#FFDCD0] bg-slate-50 space-y-2">
                  <p className="font-bold text-slate-800">System Accounts Summary:</p>
                  <ul className="list-disc pl-5 space-y-1 text-slate-700">
                    <li><span className="font-bold">Rajesh Sharma</span> (admin@agentix.com) — Administrator</li>
                    <li><span className="font-bold">Priya Patel</span> (agent@agentix.com) — Agent</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="p-5 rounded-2xl bg-orange-50 border border-[#FFDCD0] text-xs space-y-2">
                <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
                  <Lock className="w-5 h-5 text-[#F26522]" />
                  <span>Access Restricted to Administrators</span>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  Your account is operating under the <span className="font-bold text-slate-900">[Agent]</span> role. Agents cannot manage users, modify password policies, or adjust access permissions.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SettingsPage;
