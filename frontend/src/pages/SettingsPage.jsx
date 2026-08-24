import React from 'react';

function SettingsPage() {
  return (
    <div className="max-w-3xl space-y-6 text-[#111827]">
      <div>
        <h1 className="text-3xl font-bold text-[#111827] tracking-tight">Account Settings</h1>
        <p className="text-sm text-slate-500">Manage your profile, preferences, and notifications</p>
      </div>

      <div className="bg-white border border-[#FBCFE8] rounded-xl p-6 shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-[#111827] border-b border-[#FBCFE8] pb-2 mb-4">Profile Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                defaultValue="System Admin"
                className="w-full bg-[#FCE7F3]/30 border border-[#FBCFE8] rounded-lg px-4 py-2 text-[#111827] focus:outline-none focus:border-[#EC4899]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                defaultValue="admin@agentix.com"
                className="w-full bg-[#FCE7F3]/30 border border-[#FBCFE8] rounded-lg px-4 py-2 text-[#111827] focus:outline-none focus:border-[#EC4899]"
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-[#111827] border-b border-[#FBCFE8] pb-2 mb-4">System Preferences</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#111827]">Email Notifications</p>
              <p className="text-xs text-slate-500">Receive alerts when new leads are assigned</p>
            </div>
            <input type="checkbox" defaultChecked className="h-4 w-4 rounded accent-[#EC4899]" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
