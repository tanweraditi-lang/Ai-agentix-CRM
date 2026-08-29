import React from 'react';

function SettingsPage() {
  return (
    <div className="max-w-3xl space-y-6 text-[#111111]">
      <div className="bg-white p-5 rounded-2xl border border-[#FFDCD0] shadow-xs">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#111111] tracking-tight">Account Settings</h1>
        <p className="text-xs sm:text-sm text-[#475569]">Manage your profile, preferences, and notifications</p>
      </div>

      <div className="bg-white border border-[#FFDCD0] rounded-2xl p-4 sm:p-6 shadow-xs space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-[#111111] border-b border-[#FFDCD0] pb-2 mb-4">Profile Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                defaultValue="System Admin"
                className="w-full bg-[#FFF6F1]/30 border border-[#FFDCD0] rounded-lg px-4 py-2 text-[#111111] focus:outline-none focus:border-[#F26522]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                defaultValue="admin@agentix.com"
                className="w-full bg-[#FFF6F1]/30 border border-[#FFDCD0] rounded-lg px-4 py-2 text-[#111111] focus:outline-none focus:border-[#F26522]"
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-[#111111] border-b border-[#FFDCD0] pb-2 mb-4">System Preferences</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#111111]">Email Notifications</p>
              <p className="text-xs text-[#475569]">Receive alerts when new leads are assigned</p>
            </div>
            <input type="checkbox" defaultChecked className="h-4 w-4 rounded accent-[#F26522]" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
