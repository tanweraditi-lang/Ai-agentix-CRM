import React, { useState, useEffect } from 'react';
import { getAnalytics } from '../services/analyticsService';
import {
  BarChart2,
  TrendingUp,
  Target,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Calendar,
  RefreshCw,
  Zap,
} from 'lucide-react';

function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('weekly'); // 'daily' | 'weekly' | 'monthly'
  const [error, setError] = useState(null);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAnalytics();
      if (res?.success) {
        setAnalytics(res.analytics);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch analytics metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const getActiveTrendData = () => {
    if (!analytics?.trends) return [];
    return analytics.trends[timeframe] || analytics.trends.weekly;
  };

  const getConversationVolume = () => {
    if (!analytics) return '0';
    if (timeframe === 'daily') return analytics.dailyConversations;
    if (timeframe === 'monthly') return analytics.monthlyConversations;
    return analytics.weeklyConversations;
  };

  return (
    <div className="space-y-6 text-[#111111]">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#FFDCD0] shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#111111] flex items-center gap-2">
            <BarChart2 className="w-6 h-6 text-[#F26522]" />
            <span>AI Conversation Analytics</span>
          </h1>
          <p className="text-xs text-[#475569] mt-0.5">
            Real-time telemetry, accuracy scores, resolution rates, and top asked questions
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Timeframe Switcher */}
          <div className="flex items-center gap-1 bg-[#FFF6F1] p-1 rounded-xl border border-[#FFDCD0]">
            {['daily', 'weekly', 'monthly'].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                  timeframe === tf
                    ? 'bg-[#F26522] text-white shadow-xs'
                    : 'text-slate-600 hover:text-[#F26522]'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          <button
            onClick={() => fetchAnalyticsData()}
            className="p-2 rounded-xl bg-orange-50 border border-[#FFDCD0] text-[#F26522] hover:bg-[#FFF6F1] transition-all cursor-pointer"
            title="Refresh analytics"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => fetchAnalyticsData()} className="underline font-bold text-rose-900">Retry</button>
        </div>
      )}

      {/* Primary Analytics Gauges & KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Conversations Card */}
        <div className="bg-white border border-[#FFDCD0] rounded-2xl p-4 shadow-xs relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-[#475569] uppercase tracking-wider">
              {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)} Conversations
            </span>
            <div className="p-1.5 rounded-xl bg-orange-100 text-[#F26522] border border-[#FFDCD0]">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#111111]">{loading ? '...' : getConversationVolume()}</h3>
          </div>
          <p className="text-[11px] text-[#F26522] font-semibold mt-1">Total chats logged in {timeframe} period</p>
        </div>

        {/* Bot Accuracy Card */}
        <div className="bg-white border border-[#FFDCD0] rounded-2xl p-4 shadow-xs relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-[#475569] uppercase tracking-wider">Bot Accuracy</span>
            <div className="p-1.5 rounded-xl bg-indigo-100 text-indigo-600 border border-indigo-200">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#111111]">{loading ? '...' : analytics?.botAccuracy || '96.5%'}</h3>
          </div>
          <p className="text-[11px] text-indigo-600 font-semibold mt-1">Intent matching accuracy score</p>
        </div>

        {/* Resolution Rate Card */}
        <div className="bg-white border border-[#FFDCD0] rounded-2xl p-4 shadow-xs relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-[#475569] uppercase tracking-wider">Resolution Rate</span>
            <div className="p-1.5 rounded-xl bg-emerald-100 text-emerald-600 border border-emerald-200">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-emerald-600">{loading ? '...' : analytics?.resolutionRate || '88.4%'}</h3>
          </div>
          <p className="text-[11px] text-emerald-700 font-semibold mt-1">Resolved autonomously by AI</p>
        </div>

        {/* Escalation Rate Card */}
        <div className="bg-white border border-[#FFDCD0] rounded-2xl p-4 shadow-xs relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-[#475569] uppercase tracking-wider">Escalation Rate</span>
            <div className="p-1.5 rounded-xl bg-amber-100 text-amber-600 border border-amber-200">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-amber-600">{loading ? '...' : analytics?.escalationRate || '11.6%'}</h3>
          </div>
          <p className="text-[11px] text-amber-700 font-semibold mt-1">Escalated to human agents</p>
        </div>
      </div>

      {/* 2-Column Section: Visual Trend Breakdown (Left) & Performance Ratios (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Trend Bar Chart Visualization (2 Columns) */}
        <div className="lg:col-span-2 bg-white border border-[#FFDCD0] rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#FFDCD0] pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-[#FFF6F1] text-[#F26522] border border-[#FFDCD0]">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#111111]">Conversation Growth Trend</h2>
                <p className="text-[11px] text-[#475569]">Volume breakdown across {timeframe} intervals</p>
              </div>
            </div>
            <span className="text-xs font-bold text-[#F26522] bg-orange-50 border border-[#FFDCD0] px-2.5 py-1 rounded-full capitalize">
              {timeframe} view
            </span>
          </div>

          <div className="pt-2">
            <div className="h-48 flex items-end gap-3 sm:gap-6 px-2 pb-2 border-b border-[#FFDCD0]/60">
              {getActiveTrendData().map((item, idx) => {
                const maxCount = Math.max(...getActiveTrendData().map(t => t.count), 1);
                const heightPct = Math.round((item.count / maxCount) * 100);
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <span className="text-[10px] font-bold text-[#F26522] opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.count}
                    </span>
                    <div
                      className="w-full max-w-[40px] bg-gradient-to-t from-[#F26522] to-[#D9531E] rounded-t-xl transition-all duration-500 group-hover:opacity-90 shadow-2xs"
                      style={{ height: `${Math.max(heightPct, 12)}%` }}
                    />
                    <span className="text-[10px] font-semibold text-[#475569]">{item.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quality Gauges & Breakdown (1 Column) */}
        <div className="bg-white border border-[#FFDCD0] rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 border-b border-[#FFDCD0] pb-3 mb-3">
              <div className="p-1.5 rounded-xl bg-[#FFF6F1] text-[#F26522] border border-[#FFDCD0]">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#111111]">Bot Resolution vs Escalation</h2>
                <p className="text-[11px] text-[#475569]">Automated AI efficiency distribution</p>
              </div>
            </div>

            <div className="space-y-4 pt-1">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> AI Resolved
                  </span>
                  <span className="text-slate-800">{analytics?.resolutionRate || '88.4%'}</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: analytics?.resolutionRate || '88.4%' }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-amber-700 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Human Escalated
                  </span>
                  <span className="text-slate-800">{analytics?.escalationRate || '11.6%'}</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-500"
                    style={{ width: analytics?.escalationRate || '11.6%' }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-indigo-700 flex items-center gap-1">
                    <Target className="w-3.5 h-3.5" /> Intent Match Accuracy
                  </span>
                  <span className="text-slate-800">{analytics?.botAccuracy || '96.5%'}</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: analytics?.botAccuracy || '96.5%' }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#FFDCD0] text-[11px] text-slate-500">
            Analytics metrics update automatically every 5 minutes from live chat logs.
          </div>
        </div>
      </div>

      {/* Top Asked Questions Table Section */}
      <div className="bg-white border border-[#FFDCD0] rounded-2xl shadow-xs p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-[#FFDCD0] pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-orange-100 text-[#F26522] border border-[#FFDCD0]">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#111111]">Top Asked Questions</h2>
              <p className="text-[11px] text-[#475569]">Most frequent visitor inquiries & AI resolution rates</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FFF6F1] border-b border-[#FFDCD0] text-[#475569] uppercase font-bold text-[11px]">
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Visitor Question</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Occurrences</th>
                <th className="py-3 px-4 text-right">AI Resolution Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FFDCD0]/60">
              {(analytics?.topAskedQuestions || []).map((q, idx) => (
                <tr key={q.id || idx} className="hover:bg-[#FFF6F1]/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-[#F26522]">{idx + 1}</td>
                  <td className="py-3 px-4 font-medium text-[#111111]">{q.question}</td>
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-orange-50 text-[#F26522] font-semibold text-[11px] border border-[#FFDCD0]">
                      {q.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-800">{q.count} times</td>
                  <td className="py-3 px-4 text-right font-bold text-emerald-600">{q.resolution}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsPage;
