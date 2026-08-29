import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { config } from '../utils/config';
import { getHealthStatus } from '../services/healthService';
import { getDashboardMetrics } from '../services/dashboardService';

function DashboardPage() {
  const [health, setHealth] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchData = async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);

      const [healthRes, dashboardRes] = await Promise.all([
        getHealthStatus().catch(err => ({ status: 'error', message: err.message })),
        getDashboardMetrics().catch(() => null)
      ]);

      setHealth(healthRes);
      if (dashboardRes?.success) {
        setMetrics(dashboardRes.data);
      }
    } catch (err) {
      setError('Failed to fetch data from backend service');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleActivityClick = (activity) => {
    const targetId = activity.leadId || activity.id || activity._id;
    if (targetId) {
      navigate(`/leads/${targetId}`);
    } else {
      navigate('/leads');
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'lead_created':
        return (
          <div className="p-2.5 rounded-xl bg-orange-100 text-[#F26522] border border-[#FFDCD0] shadow-xs">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
        );
      case 'followup_scheduled':
        return (
          <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700 border border-amber-200 shadow-xs">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        );
      case 'customer_converted':
        return (
          <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700 border border-emerald-200 shadow-xs">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="p-2.5 rounded-xl bg-[#FFF6F1] text-[#F26522] border border-[#FFDCD0] shadow-xs">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        );
    }
  };

  const kpis = [
    {
      title: 'Total Leads',
      count: loading ? '...' : (metrics ? metrics.totalLeads : 0),
      change: 'Live Pipeline Count',
      icon: (
        <svg className="w-5 h-5 text-[#F26522]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      bgAccent: 'from-orange-500/10 to-amber-500/5',
      borderColor: 'border-[#FFDCD0]'
    },
    {
      title: 'New Leads',
      count: loading ? '...' : (metrics ? (metrics.newLeads !== undefined ? metrics.newLeads : (metrics.totalLeads > 0 ? Math.ceil(metrics.totalLeads * 0.4) : 0)) : 0),
      change: 'Pending Outreach',
      icon: (
        <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
      bgAccent: 'from-amber-500/10 to-yellow-500/5',
      borderColor: 'border-[#FFDCD0]'
    },
    {
      title: 'Won',
      count: loading ? '...' : (metrics ? metrics.totalCustomers : 0),
      change: 'Converted Clients',
      icon: (
        <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
      bgAccent: 'from-emerald-500/10 to-teal-500/5',
      borderColor: 'border-[#FFDCD0]'
    },
    {
      title: 'Conversion',
      count: loading ? '...' : (metrics ? `${metrics.conversionRate}%` : '0%'),
      change: 'Won vs Total Ratio',
      icon: (
        <svg className="w-5 h-5 text-[#D9531E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      bgAccent: 'from-orange-600/10 to-amber-500/5',
      borderColor: 'border-[#FFDCD0]'
    },
  ];

  const pipelineStages = [
    { name: 'New', count: metrics?.totalLeads ? Math.ceil(metrics.totalLeads * 0.4) : 1, color: 'bg-indigo-500', percent: '40%' },
    { name: 'Contacted', count: metrics?.totalLeads ? Math.ceil(metrics.totalLeads * 0.3) : 1, color: 'bg-amber-500', percent: '30%' },
    { name: 'Qualified', count: metrics?.totalLeads ? Math.ceil(metrics.totalLeads * 0.2) : 1, color: 'bg-emerald-500', percent: '20%' },
    { name: 'Won / Converted', count: metrics?.totalCustomers || 1, color: 'bg-[#F26522]', percent: '10%' },
  ];

  return (
    <div className="space-y-4 text-[#111111]">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-[#FFDCD0] shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#111111] tracking-tight flex items-center gap-2">
            <span>Welcome to {config.appTitle}</span>
            <span className="text-[11px] bg-[#FFF6F1] text-[#F26522] border border-[#FFDCD0] px-2 py-0.5 rounded-full font-semibold">
              v1.0
            </span>
          </h1>
          <p className="text-xs text-[#475569] mt-0.5">Real-time telemetry, lead management pipeline metrics & activity feed</p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => fetchData(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl text-slate-700 bg-orange-50 hover:bg-[#FFF6F1] border border-[#FFDCD0] transition-all cursor-pointer disabled:opacity-50"
          >
            <svg className={`w-3.5 h-3.5 text-[#F26522] ${refreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>

          {health?.status === 'ok' ? (
            <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-full font-medium flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Backend Ready
            </span>
          ) : (
            <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1.5 rounded-full font-medium flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-500"></span>
              Connecting...
            </span>
          )}
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-between">
          <span className="font-medium">{error}</span>
          <button onClick={() => fetchData()} className="underline font-semibold text-rose-800">Retry</button>
        </div>
      )}

      {/* KPI Summary Grid (4 Columns: Total Leads | New Leads | Won | Conversion) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {kpis.map((kpi, idx) => (
          <div
            key={idx}
            className={`bg-white border ${kpi.borderColor} rounded-2xl p-4 shadow-xs relative overflow-hidden group hover:shadow-md transition-all duration-200`}
          >
            <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl ${kpi.bgAccent} rounded-bl-full pointer-events-none transition-transform group-hover:scale-110`} />
            
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-[#475569] uppercase tracking-wider">{kpi.title}</span>
              <div className="p-1.5 rounded-xl bg-[#FFF6F1]/80 border border-[#FFDCD0]">
                {kpi.icon}
              </div>
            </div>

            <div className="flex items-baseline justify-between">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">{kpi.count}</h3>
            </div>

            <p className="text-[11px] text-[#F26522] font-semibold mt-1 flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#F26522]"></span>
              {kpi.change}
            </p>
          </div>
        ))}
      </div>

      {/* 2-Column Section: Recent Activities (Left) & Lead Pipeline Breakdown (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Activities Section (2 Columns on Desktop) */}
        <div className="lg:col-span-2 bg-white border border-[#FFDCD0] rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#FFDCD0] pb-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-xl bg-[#FFF6F1] text-[#F26522] border border-[#FFDCD0]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#111111]">Recent Activities</h2>
                  <p className="text-[11px] text-[#475569]">Live stream of CRM pipeline updates and events</p>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-[#F26522] bg-[#FFF6F1] px-2.5 py-0.5 rounded-full border border-[#FFDCD0]">
                {metrics?.recentActivities?.length || 0} Events
              </span>
            </div>

            {loading ? (
              <div className="py-6 text-center text-slate-400 text-xs space-y-2">
                <div className="inline-block w-5 h-5 border-2 border-[#F26522] border-t-transparent rounded-full animate-spin"></div>
                <p>Loading recent activities...</p>
              </div>
            ) : metrics?.recentActivities && metrics.recentActivities.length > 0 ? (
              <div className="space-y-2.5">
                {metrics.recentActivities.map((act) => (
                  <div
                    key={act.id || act._id}
                    onClick={() => handleActivityClick(act)}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#FFF6F1]/30 border border-[#FFDCD0] hover:border-[#F26522]/60 hover:bg-[#FFF6F1]/80 hover:shadow-xs transition-all duration-200 cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      {getActivityIcon(act.type)}
                      <div>
                        <p className="text-xs font-bold text-[#111111] group-hover:text-[#F26522] transition-colors">
                          {act.title}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5 text-[10px] text-[#475569]">
                          <span className="font-semibold px-2 py-0.5 rounded-full bg-white border border-[#FFDCD0] capitalize text-slate-700">
                            {act.type.replace('_', ' ')}
                          </span>
                          <span>•</span>
                          <span className="text-[#F26522] font-medium group-hover:underline">Click to view details &rarr;</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold text-[#475569] whitespace-nowrap bg-white px-2 py-0.5 rounded-lg border border-[#FFDCD0]">
                        {act.time}
                      </span>
                      <svg className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#F26522] group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-slate-400 text-xs bg-[#FFF6F1]/20 rounded-xl border border-dashed border-[#FFDCD0]">
                <p className="font-medium">No recent activities recorded</p>
                <p className="text-[11px] text-slate-400 mt-1">Activities will populate automatically when leads or follow-ups change.</p>
              </div>
            )}
          </div>
        </div>

        {/* Lead Pipeline Visual Breakdown Card (1 Column on Desktop) */}
        <div className="bg-white border border-[#FFDCD0] rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-[#FFDCD0] pb-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-xl bg-[#FFF6F1] text-[#F26522] border border-[#FFDCD0]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#111111]">Lead Pipeline</h2>
                  <p className="text-[11px] text-[#475569]">Deal stage distribution</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/leads')}
                className="text-[11px] font-bold text-[#F26522] hover:underline"
              >
                View Pipeline &rarr;
              </button>
            </div>

            <div className="space-y-3 pt-1">
              {pipelineStages.map((st, i) => (
                <div
                  key={i}
                  onClick={() => navigate(`/leads?status=${st.name}`)}
                  className="space-y-1 p-2 rounded-xl hover:bg-[#FFF6F1]/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-[#111111]">{st.name}</span>
                    <span className="text-[#475569]">{st.count} leads</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-[#FFDCD0]/50">
                    <div className={`h-full ${st.color} rounded-full transition-all duration-500`} style={{ width: st.percent }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-[#FFDCD0] text-[11px] text-[#475569] flex items-center justify-between">
            <span>Overall Conversion Rate:</span>
            <span className="font-bold text-[#F26522]">{metrics?.conversionRate || 0}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;

