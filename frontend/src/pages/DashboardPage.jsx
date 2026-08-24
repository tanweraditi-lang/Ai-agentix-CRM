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
    <div className="space-y-6 text-[#111827]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#111827] tracking-tight">{config.appTitle} Dashboard</h1>
          <p className="text-sm text-slate-500">Real-time telemetry and API communication status</p>
        </div>
        <div className="flex items-center space-x-2">
          {health?.status === 'ok' ? (
            <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-full font-medium flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Backend Connected ({health.version})
            </span>
          ) : (
            <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1.5 rounded-full font-medium flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-500"></span>
              Connecting Backend...
            </span>
          )}
        </div>
      </div>

      {/* KPI Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { title: 'Total Leads', count: metrics ? metrics.totalLeads : '128', change: '+12% this week', color: 'border-[#FBCFE8]' },
          { title: 'Active Customers', count: metrics ? metrics.totalCustomers : '45', change: '+5 new accounts', color: 'border-[#FBCFE8]' },
          { title: 'Pending Follow-ups', count: metrics ? metrics.pendingFollowups : '18', change: '4 overdue', color: 'border-[#FBCFE8]' },
          { title: 'Conversion Rate', count: metrics ? `${metrics.conversionRate}%` : '35.2%', change: '+3.1% vs last month', color: 'border-[#FBCFE8]' },
        ].map((kpi, idx) => (
          <div key={idx} className={`bg-white border ${kpi.color} rounded-xl p-5 shadow-sm`}>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{kpi.title}</p>
            <h3 className="text-3xl font-bold text-[#111827] my-1">{kpi.count}</h3>
            <p className="text-xs text-[#BE185D] font-semibold">{kpi.change}</p>
          </div>
        ))}
      </div>

      {/* Backend Integration Telemetry Card */}
      <div className="bg-white border border-[#FBCFE8] rounded-xl p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-semibold text-[#111827] border-b border-[#FBCFE8] pb-2">Backend Connection Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="bg-[#FCE7F3]/40 p-4 rounded-lg border border-[#FBCFE8] space-y-2">
            <p className="text-[#BE185D] font-bold">API Endpoint Configuration</p>
            <p className="text-slate-700">Base URL: <span className="text-[#111827] font-semibold">{config.apiBaseUrl}</span></p>
            <p className="text-slate-700">Health URL: <span className="text-[#111827] font-semibold">{config.apiBaseUrl}/health</span></p>
            <p className="text-slate-700">Environment: <span className="text-emerald-700 font-semibold">{config.environment}</span></p>
          </div>
          <div className="bg-[#FCE7F3]/40 p-4 rounded-lg border border-[#FBCFE8] space-y-2">
            <p className="text-[#BE185D] font-bold">Health Response Telemetry</p>
            <p className="text-slate-700">Status: <span className="text-emerald-700 font-semibold">{health?.status || 'loading...'}</span></p>
            <p className="text-slate-700">Message: <span className="text-[#111827]">{health?.message || 'Connecting to server...'}</span></p>
            <p className="text-slate-700">Timestamp: <span className="text-slate-500">{health?.timestamp || 'N/A'}</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
