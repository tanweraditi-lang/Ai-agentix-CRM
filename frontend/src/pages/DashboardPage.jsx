import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { config } from '../utils/config';
import { getHealthStatus } from '../services/healthService';
import { getDashboardMetrics } from '../services/dashboardService';
import {
  Users,
  UserPlus,
  Award,
  TrendingUp,
  RefreshCw,
  Activity,
  BarChart2,
  Zap,
  Calendar,
  Bot,
  MessageSquare,
  CheckCircle2,
  AlertTriangle,
  Clock,
  XCircle,
} from 'lucide-react';

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
      setError('Failed to fetch live dashboard telemetry from backend service');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCardClick = (path) => {
    navigate(path);
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'lead_created':
      case 'lead_activity':
        return (
          <div className="p-2 rounded-xl bg-orange-100 text-[#F26522] border border-[#FFDCD0] shrink-0">
            <UserPlus className="w-4 h-4" />
          </div>
        );
      case 'followup_created':
      case 'followup_scheduled':
        return (
          <div className="p-2 rounded-xl bg-amber-100 text-amber-700 border border-amber-200 shrink-0">
            <Calendar className="w-4 h-4" />
          </div>
        );
      case 'chatbot_created':
      case 'chatbot_updated':
        return (
          <div className="p-2 rounded-xl bg-purple-100 text-purple-700 border border-purple-200 shrink-0">
            <Bot className="w-4 h-4" />
          </div>
        );
      case 'conversation_logged':
      case 'conversation_updated':
        return (
          <div className="p-2 rounded-xl bg-blue-100 text-blue-700 border border-blue-200 shrink-0">
            <MessageSquare className="w-4 h-4" />
          </div>
        );
      case 'customer_converted':
        return (
          <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 border border-emerald-200 shrink-0">
            <Award className="w-4 h-4" />
          </div>
        );
      default:
        return (
          <div className="p-2 rounded-xl bg-[#FFF6F1] text-[#F26522] border border-[#FFDCD0] shrink-0">
            <Zap className="w-4 h-4" />
          </div>
        );
    }
  };

  // Requirement 3: Show Total Leads, New Leads, Converted Leads, Lost Leads + AI Chatbot cards
  const dashboardCards = [
    {
      title: 'Total Leads',
      count: loading ? '...' : (metrics?.totalLeads ?? 0),
      subtitle: 'All Pipeline Prospects',
      icon: <Users className="w-5 h-5 text-[#F26522]" />,
      path: '/leads',
    },
    {
      title: 'New Leads',
      count: loading ? '...' : (metrics?.newLeads ?? 0),
      subtitle: 'Uncontacted Inquiries',
      icon: <UserPlus className="w-5 h-5 text-indigo-600" />,
      path: '/leads?status=New',
    },
    {
      title: 'Converted Leads',
      count: loading ? '...' : (metrics?.convertedLeads ?? 0),
      subtitle: 'Successfully Closed Deals',
      icon: <Award className="w-5 h-5 text-emerald-600" />,
      path: '/leads?status=Converted',
    },
    {
      title: 'Lost Leads',
      count: loading ? '...' : (metrics?.lostLeads ?? 0),
      subtitle: 'Closed Unsuccessful',
      icon: <XCircle className="w-5 h-5 text-rose-600" />,
      path: '/leads?status=Lost',
    },
    {
      title: 'Active Chatbots',
      count: loading ? '...' : (metrics?.activeChatbots ?? 0),
      subtitle: 'Live Deployed AI Bots',
      icon: <Bot className="w-5 h-5 text-[#F26522]" />,
      path: '/chatbots',
    },
    {
      title: "Today's Conversations",
      count: loading ? '...' : (metrics?.todaysConversations ?? 0),
      subtitle: 'Visitor Chats Today',
      icon: <Clock className="w-5 h-5 text-indigo-600" />,
      path: '/conversations',
    },
    {
      title: 'Total Conversations',
      count: loading ? '...' : (metrics?.totalConversations ?? 0),
      subtitle: 'All-Time Transcripts',
      icon: <MessageSquare className="w-5 h-5 text-blue-600" />,
      path: '/conversations',
    },
    {
      title: 'AI Resolved',
      count: loading ? '...' : (metrics?.resolvedByAI ?? 0),
      subtitle: 'Autonomous Solves',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
      path: '/conversations?status=Resolved',
    },
  ];

  const monthlyChartData = metrics?.monthlyLeadsChart || [];
  const maxMonthlyCount = Math.max(...monthlyChartData.map(m => m.count), 1);

  return (
    <div className="space-y-6 text-[#111111]">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-[#FFDCD0] shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#111111] tracking-tight flex items-center gap-2">
            <span>{config.appTitle} Live Dashboard</span>
            <span className="text-[11px] bg-[#FFF6F1] text-[#F26522] border border-[#FFDCD0] px-2.5 py-0.5 rounded-full font-semibold">
              Real MongoDB Analytics
            </span>
          </h1>
          <p className="text-xs text-[#475569] mt-0.5">
            Real-time metrics computed directly from MongoDB Atlas Lead collection stores
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => fetchData(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl text-slate-700 bg-orange-50 hover:bg-[#FFF6F1] border border-[#FFDCD0] transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#F26522] ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh Live Data'}</span>
          </button>

          {health?.status === 'ok' ? (
            <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-full font-medium flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              MongoDB Active
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
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => fetchData()} className="underline font-bold text-rose-900">Retry</button>
        </div>
      )}

      {/* Requirement 3: Real MongoDB Lead & Chatbot Telemetry Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#475569]">Real Lead Pipeline Metrics</h2>
          <span className="text-[11px] text-[#F26522] font-semibold">100% MongoDB Real-time Queries</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {dashboardCards.map((card, idx) => (
            <div
              key={idx}
              onClick={() => handleCardClick(card.path)}
              className="bg-white border border-[#FFDCD0] rounded-2xl p-4 shadow-xs hover:shadow-md hover:border-[#F26522] transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-[#475569] uppercase tracking-wider">{card.title}</span>
                <div className="p-1.5 rounded-xl bg-[#FFF6F1] border border-[#FFDCD0] group-hover:scale-105 transition-transform">
                  {card.icon}
                </div>
              </div>

              <div className="flex items-baseline justify-between">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">{card.count}</h3>
              </div>

              <p className="text-[11px] text-[#F26522] font-semibold mt-1 flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#F26522]"></span>
                {card.subtitle}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Requirement 4: Monthly Leads Chart using Lead createdAt */}
      <div className="bg-white border border-[#FFDCD0] rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#FFDCD0] pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-[#FFF6F1] text-[#F26522] border border-[#FFDCD0]">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#111111]">Monthly Leads Creation Chart</h2>
              <p className="text-[11px] text-[#475569]">
                Aggregated in real-time from MongoDB Lead createdAt timestamps
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-[#F26522] bg-orange-50 border border-[#FFDCD0] px-2.5 py-1 rounded-full">
            MongoDB Aggregation
          </span>
        </div>

        {loading ? (
          <div className="py-8 text-center text-slate-400 text-xs space-y-2">
            <div className="inline-block w-5 h-5 border-2 border-[#F26522] border-t-transparent rounded-full animate-spin"></div>
            <p>Computing monthly lead aggregation...</p>
          </div>
        ) : monthlyChartData.length > 0 ? (
          <div className="pt-2">
            <div className="h-56 flex items-end gap-3 sm:gap-6 px-2 pb-2 border-b border-[#FFDCD0]/60">
              {monthlyChartData.map((item, idx) => {
                const heightPct = Math.round((item.count / maxMonthlyCount) * 100);
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <div className="text-center opacity-90 group-hover:opacity-100 transition-opacity">
                      <span className="block text-[11px] font-extrabold text-[#F26522]">
                        {item.count} leads
                      </span>
                      <span className="block text-[9px] text-emerald-600 font-bold">
                        {item.converted} converted
                      </span>
                    </div>
                    <div
                      className="w-full max-w-[48px] bg-gradient-to-t from-[#F26522] to-[#D9531E] rounded-t-xl transition-all duration-500 group-hover:opacity-90 shadow-2xs relative"
                      style={{ height: `${Math.max(heightPct, 15)}%` }}
                    />
                    <span className="text-[10px] font-bold text-[#475569]">{item.month}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="py-10 text-center text-slate-400 text-xs bg-[#FFF6F1]/20 rounded-xl border border-dashed border-[#FFDCD0] space-y-1">
            <p className="font-bold text-slate-700">No monthly leads aggregated yet</p>
            <p className="text-[11px] text-slate-400">
              New leads created in the CRM will populate this chart automatically using their createdAt dates.
            </p>
          </div>
        )}
      </div>

      {/* Calculated Ratios Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="bg-white border border-[#FFDCD0] rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-bold text-[#475569] uppercase">Conversion Rate</span>
          <h4 className="text-xl font-extrabold text-[#111111] mt-1">{loading ? '...' : `${metrics?.conversionRate ?? 0}%`}</h4>
          <p className="text-[10px] text-slate-500 mt-0.5">Calculated ratio from live converted leads</p>
        </div>

        <div className="bg-white border border-[#FFDCD0] rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-bold text-[#475569] uppercase">Average Response Time</span>
          <h4 className="text-xl font-extrabold text-[#111111] mt-1">
            {metrics?.avgResponseTime ? metrics.avgResponseTime : 'Not enough data'}
          </h4>
          <p className="text-[10px] text-slate-500 mt-0.5">Requires real timing metrics from bot logs</p>
        </div>

        <div className="bg-white border border-[#FFDCD0] rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-bold text-[#475569] uppercase">Customer Satisfaction</span>
          <h4 className="text-xl font-extrabold text-[#111111] mt-1">
            {metrics?.customerSatisfaction ? metrics.customerSatisfaction : 'Not enough data'}
          </h4>
          <p className="text-[10px] text-slate-500 mt-0.5">Requires real feedback ratings</p>
        </div>
      </div>

      {/* Real Activity Stream Section */}
      <div className="bg-white border border-[#FFDCD0] rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#FFDCD0] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-[#FFF6F1] text-[#F26522] border border-[#FFDCD0]">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#111111]">Real Activity Feed</h2>
              <p className="text-[11px] text-[#475569]">Actual stored event logs from MongoDB Activity collection</p>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-[#F26522] bg-[#FFF6F1] px-2.5 py-0.5 rounded-full border border-[#FFDCD0]">
            {metrics?.recentActivities?.length || 0} Stored Events
          </span>
        </div>

        {loading ? (
          <div className="py-8 text-center text-slate-400 text-xs space-y-2">
            <div className="inline-block w-5 h-5 border-2 border-[#F26522] border-t-transparent rounded-full animate-spin"></div>
            <p>Fetching real MongoDB activity logs...</p>
          </div>
        ) : metrics?.recentActivities && metrics.recentActivities.length > 0 ? (
          <div className="space-y-2.5">
            {metrics.recentActivities.map((act) => (
              <div
                key={act.id || act._id}
                onClick={() => {
                  if (act.leadId) navigate(`/leads/${act.leadId}`);
                }}
                className="flex items-center justify-between p-3.5 rounded-xl bg-[#FFF6F1]/30 border border-[#FFDCD0] hover:border-[#F26522]/60 hover:bg-[#FFF6F1]/80 transition-all duration-200 cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  {getActivityIcon(act.type)}
                  <div>
                    <p className="text-xs font-bold text-[#111111] group-hover:text-[#F26522] transition-colors">
                      {act.title || act.action}
                    </p>
                    <p className="text-[11px] text-slate-600 mt-0.5">{act.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold text-[#475569] whitespace-nowrap bg-white px-2.5 py-1 rounded-lg border border-[#FFDCD0]">
                    {act.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-slate-400 text-xs bg-[#FFF6F1]/20 rounded-xl border border-dashed border-[#FFDCD0] space-y-1">
            <p className="font-bold text-slate-700">No real activities recorded yet</p>
            <p className="text-[11px] text-slate-400">
              Activity events will populate automatically when leads, follow-ups, chatbots, or conversations are updated in MongoDB.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;
