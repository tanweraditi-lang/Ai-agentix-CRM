import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getLeadById, updateLead } from '../services/leadService';

function LeadDetailsPage() {
  const { id } = useParams();
  const [lead, setLead] = useState(null);
  const [followups, setFollowups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const statuses = ['New', 'Contacted', 'Qualified', 'In Negotiation', 'Converted', 'Lost'];

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const data = await getLeadById(id);
      if (data?.success) {
        setLead(data.lead);
        setFollowups(data.followups || []);
      }
    } catch (err) {
      console.error('Error fetching lead details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    try {
      setUpdating(true);
      await updateLead(id, { status: newStatus });
      setLead(prev => ({ ...prev, status: newStatus }));
    } catch (err) {
      console.error('Error updating status:', err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-slate-500 text-sm">Loading lead profile details...</div>;
  }

  if (!lead) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-slate-500">Lead profile not found.</p>
        <Link to="/leads" className="text-[#BE185D] hover:underline text-sm font-semibold">
          &larr; Back to Leads Pipeline
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-[#111827]">
      {/* Top Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Link to="/leads" className="text-slate-600 hover:text-[#BE185D] text-sm font-semibold transition-colors">
            &larr; Back
          </Link>
          <h1 className="text-2xl font-bold text-[#111827]">{lead.name}</h1>
          <span className="bg-[#FCE7F3] text-[#BE185D] border border-[#FBCFE8] px-3 py-1 rounded-full text-xs font-bold">
            {lead.status}
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <label className="text-xs text-slate-600 font-medium">Change Stage:</label>
          <select
            value={lead.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={updating}
            className="bg-white border border-[#FBCFE8] rounded-lg px-3 py-1.5 text-xs text-[#111827] focus:outline-none focus:border-[#EC4899] cursor-pointer shadow-sm font-medium"
          >
            {statuses.map(st => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Contact & Service Info */}
        <div className="md:col-span-2 bg-white border border-[#FBCFE8] rounded-xl p-6 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-[#111827] border-b border-[#FBCFE8] pb-2 mb-4">
              Prospect Profile
            </h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-slate-500">Full Name</p>
                <p className="font-semibold text-[#111827]">{lead.name}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Company</p>
                <p className="font-semibold text-[#111827]">{lead.company || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Email Address</p>
                <p className="font-semibold text-[#BE185D]">{lead.email}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Phone Number</p>
                <p className="font-semibold text-[#111827]">{lead.phone || 'N/A'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-slate-500">Service Interested</p>
                <p className="font-medium text-slate-800 mt-0.5">{lead.serviceInterested}</p>
              </div>
            </div>
          </div>

          {/* Activity / Follow-ups Timeline */}
          <div>
            <h2 className="text-lg font-semibold text-[#111827] border-b border-[#FBCFE8] pb-2 mb-4">
              Follow-ups & Outreach Timeline
            </h2>
            {followups.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No scheduled follow-ups recorded yet for this lead.</p>
            ) : (
              <div className="space-y-3">
                {followups.map((f, idx) => (
                  <div key={idx} className="bg-[#FCE7F3]/30 border border-[#FBCFE8] rounded-lg p-3 text-xs space-y-1">
                    <div className="flex items-center justify-between text-slate-500">
                      <span>Date: {f.date}</span>
                      <span className="text-emerald-700 font-semibold">{f.status}</span>
                    </div>
                    <p className="text-[#111827] font-medium">{f.notes}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: AI Scoring & Meta */}
        <div className="space-y-6">
          <div className="bg-white border border-[#FBCFE8] rounded-xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-[#111827] border-b border-[#FBCFE8] pb-2">AI Conversion Propensity</h2>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Lead Score</span>
              <span className="text-2xl font-bold text-[#BE185D]">{lead.score || 85}/100</span>
            </div>
            <div className="bg-[#FCE7F3]/40 p-3 rounded-lg border border-[#FBCFE8] text-xs space-y-1">
              <p className="text-[#BE185D] font-bold">AI Recommendation:</p>
              <p className="text-slate-700">High engagement detected. Schedule product demo to advance deal stage.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeadDetailsPage;
