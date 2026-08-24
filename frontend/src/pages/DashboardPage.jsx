import React, { useState, useEffect } from 'react';
import { config } from '../utils/config';
import { getHealthStatus } from '../services/healthService';
import { getDashboardMetrics } from '../services/dashboardService';

function DashboardPage() {
  const [health, setHealth] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [healthRes, dashboardRes] = await Promise.all([
          getHealthStatus().catch(err => ({ status: 'error', message: err.message })),
          getDashboardMetrics().catch(() => null)
        ]);

        setHealth(healthRes);
        if (dashboardRes?.success) {
          setMetrics(dashboardRes.data);
        }
      } catch (err) {
        setError('Failed to fetch data from backend');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">{config.appTitle} Dashboard</h1>
          <p className="text-sm text-slate-400">Real-time telemetry and API communication status</p>
        </div>
        <div className="flex items-center space-x-2">
          {health?.status === 'ok' ? (
            <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-full font-medium flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Backend Connected ({health.version})
            </span>
          ) : (
            <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1.5 rounded-full font-medium flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-400"></span>
              Connecting Backend...
            </span>
          )}
        </div>
      </div>

      {/* KPI Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { title: 'Total Leads', count: metrics ? metrics.totalLeads : '128', change: '+12% this week', color: 'border-sky-500/30' },
          { title: 'Active Customers', count: metrics ? metrics.totalCustomers : '45', change: '+5 new accounts', color: 'border-emerald-500/30' },
          { title: 'Pending Follow-ups', count: metrics ? metrics.pendingFollowups : '18', change: '4 overdue', color: 'border-amber-500/30' },
          { title: 'Conversion Rate', count: metrics ? `${metrics.conversionRate}%` : '35.2%', change: '+3.1% vs last month', color: 'border-indigo-500/30' },
        ].map((kpi, idx) => (
          <div key={idx} className={`bg-slate-800 border ${kpi.color} rounded-xl p-5 shadow-lg`}>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{kpi.title}</p>
            <h3 className="text-3xl font-bold text-white my-1">{kpi.count}</h3>
            <p className="text-xs text-sky-400 font-medium">{kpi.change}</p>
          </div>
        ))}
      </div>

      {/* Backend Integration Telemetry Card */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-md space-y-4">
        <h2 className="text-lg font-semibold text-white border-b border-slate-700 pb-2">Backend Connection Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="bg-slate-900/60 p-4 rounded-lg border border-slate-700 space-y-2">
            <p className="text-sky-400 font-bold">API Endpoint Configuration</p>
            <p className="text-slate-300">Base URL: <span className="text-white">{config.apiBaseUrl}</span></p>
            <p className="text-slate-300">Health URL: <span className="text-white">{config.apiBaseUrl}/health</span></p>
            <p className="text-slate-300">Environment: <span className="text-emerald-400">{config.environment}</span></p>
          </div>
          <div className="bg-slate-900/60 p-4 rounded-lg border border-slate-700 space-y-2">
            <p className="text-sky-400 font-bold">Health Response Telemetry</p>
            <p className="text-slate-300">Status: <span className="text-emerald-400">{health?.status || 'loading...'}</span></p>
            <p className="text-slate-300">Message: <span className="text-slate-200">{health?.message || 'Connecting to server...'}</span></p>
            <p className="text-slate-300">Timestamp: <span className="text-slate-400">{health?.timestamp || 'N/A'}</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
