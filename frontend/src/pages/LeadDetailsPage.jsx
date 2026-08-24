import React from 'react';
import { useParams, Link } from 'react-router-dom';

function LeadDetailsPage() {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/leads" className="text-slate-400 hover:text-white text-sm font-medium">
            &larr; Back to Leads
          </Link>
          <h1 className="text-2xl font-bold text-white">Lead Details (#{id || '1'})</h1>
        </div>
        <button className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-4 py-2 rounded-lg text-sm transition-colors shadow-md">
          Convert to Customer
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-md space-y-4">
          <h2 className="text-lg font-semibold text-white border-b border-slate-700 pb-2">Profile Overview</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-400">Full Name</p>
              <p className="font-medium text-white">John Doe</p>
            </div>
            <div>
              <p className="text-slate-400">Company</p>
              <p className="font-medium text-white">Acme Corporation</p>
            </div>
            <div>
              <p className="text-slate-400">Email</p>
              <p className="font-medium text-sky-400">john.doe@acme.com</p>
            </div>
            <div>
              <p className="text-slate-400">Phone</p>
              <p className="font-medium text-white">+1 (555) 234-5678</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-md space-y-4">
          <h2 className="text-lg font-semibold text-white border-b border-slate-700 pb-2">AI Insights</h2>
          <p className="text-xs text-slate-300">
            High conversion propensity based on website interactions and demo requests.
          </p>
          <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-700 text-xs space-y-1">
            <p className="text-emerald-400 font-semibold">Recommended Action:</p>
            <p className="text-slate-300">Schedule product demo within 24 hours.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeadDetailsPage;
