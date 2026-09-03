import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { config } from '../utils/config';
import { getHealthStatus } from '../services/healthService';
import { getDashboardMetrics } from '../services/dashboardService';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
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
  PieChart as PieIcon,
  Layers,
  DollarSign,
  Filter,
} from 'lucide-react';

const COLORS = ['#F26522', '#6366F1', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6', '#3B82F6', '#EF4444'];

const NoDataFallback = ({ title }) => (
  <div className="h-60 flex flex-col items-center justify-center bg-[#FFF6F1]/20 rounded-xl border border-dashed border-[#FFDCD0] text-center p-4">
    <p className="text-xs font-bold text-slate-700">No Data Available</p>
    <p className="text-[11px] text-slate-400 mt-1">{title || 'Aggregation returned 0 records'}</p>
  </div>
);

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

  return (
    <div className="space-y-6 text-[#111111]">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-[#FFDCD0] shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#111111] tracking-tight flex items-center gap-2">
            <span>{config.appTitle} Analytics Dashboard</span>
            <span className="text-[11px] bg-[#FFF6F1] text-[#F26522] border border-[#FFDCD0] px-2.5 py-0.5 rounded-full font-semibold">
              Live Recharts Engine
            </span>
          </h1>
          <p className="text-xs text-[#475569] mt-0.5">
            Real MongoDB Aggregations for Leads, Conversations, Chatbots, Followups & Revenue
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

      {/* KPI Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#475569]">Real Lead & AI Bot Metrics</h2>
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

      {/* CHARTS GRID 1: Monthly Lead Creation & Lead Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* 1. Monthly Lead Creation (Line Chart) */}
        <div className="bg-white border border-[#FFDCD0] rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#FFDCD0] pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-orange-100 text-[#F26522] border border-[#FFDCD0]">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#111111]">Monthly Lead Creation</h2>
                <p className="text-[11px] text-[#475569]">Lead velocity aggregated by creation month</p>
              </div>
            </div>
          </div>
          {loading ? (
            <div className="h-60 flex items-center justify-center text-xs text-slate-400">Loading chart...</div>
          ) : (metrics?.monthlyLeadsChart && metrics.monthlyLeadsChart.length > 0) ? (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={metrics.monthlyLeadsChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#FFDCD0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" name="Total Leads" stroke="#F26522" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="converted" name="Converted" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <NoDataFallback title="No lead creation trend recorded in MongoDB" />
          )}
        </div>

        {/* 2. Lead Status Distribution (Donut Chart) */}
        <div className="bg-white border border-[#FFDCD0] rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#FFDCD0] pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-indigo-100 text-indigo-600 border border-indigo-200">
                <PieIcon className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#111111]">Lead Status Distribution</h2>
                <p className="text-[11px] text-[#475569]">Donut chart breakdown of pipeline stages</p>
              </div>
            </div>
          </div>
          {loading ? (
            <div className="h-60 flex items-center justify-center text-xs text-slate-400">Loading chart...</div>
          ) : (metrics?.leadStatusDistribution && metrics.leadStatusDistribution.some(d => d.value > 0)) ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={metrics.leadStatusDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4}>
                  {metrics.leadStatusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <NoDataFallback title="No lead status distribution found" />
          )}
        </div>
      </div>

      {/* CHARTS GRID 2: Service-Wise Leads & Lead Source Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* 3. Service-wise Leads (Horizontal Bar Chart) */}
        <div className="bg-white border border-[#FFDCD0] rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#FFDCD0] pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-emerald-100 text-emerald-600 border border-emerald-200">
                <BarChart2 className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#111111]">Service-wise Leads</h2>
                <p className="text-[11px] text-[#475569]">Inquiry volume per AI service offer</p>
              </div>
            </div>
          </div>
          {loading ? (
            <div className="h-60 flex items-center justify-center text-xs text-slate-400">Loading chart...</div>
          ) : (metrics?.serviceWiseLeads && metrics.serviceWiseLeads.length > 0) ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart layout="vertical" data={metrics.serviceWiseLeads} margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#FFDCD0" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="service" type="category" tick={{ fontSize: 10 }} width={110} />
                <Tooltip />
                <Bar dataKey="leads" name="Leads" fill="#F26522" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <NoDataFallback title="No service breakdown recorded" />
          )}
        </div>

        {/* 4. Lead Source Distribution (Pie Chart) */}
        <div className="bg-white border border-[#FFDCD0] rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#FFDCD0] pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-purple-100 text-purple-600 border border-purple-200">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#111111]">Lead Source Distribution</h2>
                <p className="text-[11px] text-[#475569]">Acquisition channel breakdown</p>
              </div>
            </div>
          </div>
          {loading ? (
            <div className="h-60 flex items-center justify-center text-xs text-slate-400">Loading chart...</div>
          ) : (metrics?.leadSourceDistribution && metrics.leadSourceDistribution.length > 0) ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={metrics.leadSourceDistribution} dataKey="value" nameKey="source" cx="50%" cy="50%" outerRadius={85} label>
                  {metrics.leadSourceDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <NoDataFallback title="No lead sources aggregated" />
          )}
        </div>
      </div>

      {/* CHARTS GRID 3: Conversation Trend & Daily Chatbot Usage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* 5. Conversation Trend (Area Chart) */}
        <div className="bg-white border border-[#FFDCD0] rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#FFDCD0] pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-blue-100 text-blue-600 border border-blue-200">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#111111]">Conversation Trend</h2>
                <p className="text-[11px] text-[#475569]">Daily chat volume & resolution timeline</p>
              </div>
            </div>
          </div>
          {loading ? (
            <div className="h-60 flex items-center justify-center text-xs text-slate-400">Loading chart...</div>
          ) : (metrics?.conversationTrend && metrics.conversationTrend.length > 0) ? (
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={metrics.conversationTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#FFDCD0" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="conversations" name="Total Chats" stroke="#6366F1" fill="#EEF2FF" strokeWidth={2} />
                <Area type="monotone" dataKey="resolved" name="AI Resolved" stroke="#10B981" fill="#ECFDF5" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <NoDataFallback title="No conversation trend available" />
          )}
        </div>

        {/* 6. Daily Chatbot Usage (Line Chart) */}
        <div className="bg-white border border-[#FFDCD0] rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#FFDCD0] pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-[#FFF6F1] text-[#F26522] border border-[#FFDCD0]">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#111111]">Daily Chatbot Usage</h2>
                <p className="text-[11px] text-[#475569]">AI bot engagement activity</p>
              </div>
            </div>
          </div>
          {loading ? (
            <div className="h-60 flex items-center justify-center text-xs text-slate-400">Loading chart...</div>
          ) : (metrics?.dailyChatbotUsage && metrics.dailyChatbotUsage.length > 0) ? (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={metrics.dailyChatbotUsage}>
                <CartesianGrid strokeDasharray="3 3" stroke="#FFDCD0" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="usage" name="Bot Activity" stroke="#F26522" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <NoDataFallback title="No bot usage data available" />
          )}
        </div>
      </div>

      {/* CHARTS GRID 4: Revenue Trend & Follow-up Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* 7. Revenue Trend (Line Chart) */}
        <div className="bg-white border border-[#FFDCD0] rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#FFDCD0] pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-emerald-100 text-emerald-600 border border-emerald-200">
                <DollarSign className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#111111]">Revenue Trend</h2>
                <p className="text-[11px] text-[#475569]">Monthly converted contract value ($)</p>
              </div>
            </div>
          </div>
          {loading ? (
            <div className="h-60 flex items-center justify-center text-xs text-slate-400">Loading chart...</div>
          ) : (metrics?.revenueTrend && metrics.revenueTrend.length > 0) ? (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={metrics.revenueTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#FFDCD0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
                <Line type="monotone" dataKey="revenue" name="Revenue ($)" stroke="#10B981" strokeWidth={2.5} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <NoDataFallback title="No revenue data available" />
          )}
        </div>

        {/* 8. Follow-up Status (Bar Chart) */}
        <div className="bg-white border border-[#FFDCD0] rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#FFDCD0] pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-amber-100 text-amber-600 border border-amber-200">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#111111]">Follow-up Status</h2>
                <p className="text-[11px] text-[#475569]">Scheduled task status overview</p>
              </div>
            </div>
          </div>
          {loading ? (
            <div className="h-60 flex items-center justify-center text-xs text-slate-400">Loading chart...</div>
          ) : (metrics?.followupStatusDistribution && metrics.followupStatusDistribution.length > 0) ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={metrics.followupStatusDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#FFDCD0" />
                <XAxis dataKey="status" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" name="Tasks" fill="#F59E0B" radius={[6, 6, 0, 0]}>
                  {metrics.followupStatusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.status === 'Overdue' ? '#EF4444' : entry.status === 'Completed' ? '#10B981' : '#F59E0B'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <NoDataFallback title="No followups summary found" />
          )}
        </div>
      </div>

      {/* CHARTS GRID 5: Conversion Funnel & AI Chatbot Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* 9. Conversion Funnel */}
        <div className="bg-white border border-[#FFDCD0] rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#FFDCD0] pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-orange-100 text-[#F26522] border border-[#FFDCD0]">
                <Filter className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#111111]">Conversion Funnel</h2>
                <p className="text-[11px] text-[#475569]">Visitor to Customer conversion stages</p>
              </div>
            </div>
          </div>
          {loading ? (
            <div className="h-60 flex items-center justify-center text-xs text-slate-400">Loading funnel...</div>
          ) : (metrics?.conversionFunnel && metrics.conversionFunnel.length > 0) ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart layout="vertical" data={metrics.conversionFunnel} margin={{ left: 15 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#FFDCD0" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="stage" type="category" tick={{ fontSize: 11 }} width={80} />
                <Tooltip />
                <Bar dataKey="count" name="Count" fill="#F26522" radius={[0, 6, 6, 0]}>
                  {metrics.conversionFunnel.map((entry, index) => (
                    <Cell key={`funnel-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <NoDataFallback title="No conversion funnel available" />
          )}
        </div>

        {/* 10. AI Chatbot Performance */}
        <div className="bg-white border border-[#FFDCD0] rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#FFDCD0] pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-[#FFF6F1] text-[#F26522] border border-[#FFDCD0]">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#111111]">AI Chatbot Performance</h2>
                <p className="text-[11px] text-[#475569]">Resolution rates per deployed bot</p>
              </div>
            </div>
          </div>
          {loading ? (
            <div className="h-60 flex items-center justify-center text-xs text-slate-400">Loading performance...</div>
          ) : (metrics?.chatbotPerformance && metrics.chatbotPerformance.length > 0) ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={metrics.chatbotPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#FFDCD0" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} unit="%" />
                <Tooltip formatter={(value) => [`${value}%`, 'Resolution Rate']} />
                <Legend />
                <Bar dataKey="resolutionRate" name="Resolution Rate (%)" fill="#6366F1" radius={[6, 6, 0, 0]} />
                <Bar dataKey="successRate" name="Accuracy Rate (%)" fill="#10B981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <NoDataFallback title="No chatbot performance recorded" />
          )}
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
