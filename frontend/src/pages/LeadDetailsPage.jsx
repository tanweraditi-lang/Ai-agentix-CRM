import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getLeadById, updateLead } from '../services/leadService';

function LeadDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [followups, setFollowups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    serviceInterested: '',
    status: 'New',
  });
  const [alert, setAlert] = useState(null);

  const statuses = ['New', 'Contacted', 'Qualified', 'In Negotiation', 'Converted', 'Lost'];

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const data = await getLeadById(id);
      const leadItem = data?.lead || data?.data?.lead || (data?.success ? data.lead : null);
      if (leadItem) {
        setLead(leadItem);
        setFollowups(data.followups || []);
      } else {
        setLead(null);
      }
    } catch (err) {
      console.error('Error fetching lead details:', err);
      setLead(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleOpenEditModal = () => {
    if (!lead) return;
    setFormData({
      name: lead.name || '',
      email: lead.email || '',
      phone: lead.phone || '',
      company: lead.company || '',
      serviceInterested: lead.serviceInterested || '',
      status: lead.status || 'New',
    });
    setAlert(null);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      const res = await updateLead(id, formData);
      setLead(prev => ({ ...prev, ...formData }));
      setIsEditModalOpen(false);
      setAlert({ type: 'success', message: 'Lead updated successfully!' });
      setTimeout(() => {
        navigate('/leads');
      }, 500);
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Failed to update lead' });
    } finally {
      setUpdating(false);
    }
  };

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
        <p className="text-[#475569]">Lead profile not found.</p>
        <Link to="/leads" className="text-[#F26522] hover:underline text-sm font-semibold">
          &larr; Back to Leads Pipeline
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-[#111111]">
      {/* Top Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#FFDCD0] shadow-xs">
        <div className="flex items-center space-x-4">
          <Link to="/leads" className="text-[#475569] hover:text-[#F26522] text-xs font-semibold transition-colors flex items-center gap-1 bg-[#FFF6F1] px-3 py-1.5 rounded-xl border border-[#FFDCD0]">
            &larr; Back to Leads
          </Link>
          <h1 className="text-2xl font-bold text-[#111111]">{lead.name}</h1>
          <span className="bg-[#FFF6F1] text-[#F26522] border border-[#FFDCD0] px-3 py-1 rounded-full text-xs font-bold">
            {lead.status}
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleOpenEditModal}
            className="bg-orange-50 hover:bg-[#FFF6F1] text-[#F26522] border border-[#FFDCD0] font-semibold px-4 py-1.5 rounded-xl text-xs transition-colors"
          >
            Edit Profile
          </button>
          <div className="flex items-center space-x-2">
            <label className="text-xs text-slate-600 font-medium">Stage:</label>
            <select
              value={lead.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={updating}
              className="bg-white border border-[#FFDCD0] rounded-xl px-3 py-1.5 text-xs text-[#111111] focus:outline-none focus:border-[#F26522] cursor-pointer shadow-xs font-semibold"
            >
              {statuses.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {alert && (
        <div
          className={`p-3.5 rounded-xl text-xs font-medium flex items-center justify-between shadow-xs ${
            alert.type === 'success'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-rose-50 text-rose-700 border border-rose-200'
          }`}
        >
          <span>{alert.message}</span>
          <button onClick={() => setAlert(null)} className="font-bold ml-4 hover:opacity-75">&times;</button>
        </div>
      )}

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Contact & Service Info */}
        <div className="md:col-span-2 bg-white border border-[#FFDCD0] rounded-2xl p-6 shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-[#111111] border-b border-[#FFDCD0] pb-2 mb-4">
              Prospect Profile
            </h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-[#475569]">Full Name</p>
                <p className="font-semibold text-[#111111]">{lead.name}</p>
              </div>
              <div>
                <p className="text-xs text-[#475569]">Company</p>
                <p className="font-semibold text-[#111111]">{lead.company || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-[#475569]">Email Address</p>
                <p className="font-semibold text-[#F26522]">{lead.email}</p>
              </div>
              <div>
                <p className="text-xs text-[#475569]">Phone Number</p>
                <p className="font-semibold text-[#111111]">{lead.phone || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-[#475569]">Assigned Representative</p>
                <p className="font-semibold text-[#111111]">
                  {lead.assignedUser?.name || lead.assignedUser?.email || (typeof lead.assignedUser === 'string' ? lead.assignedUser : 'Unassigned')}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#475569]">Service Interested</p>
                <p className="font-medium text-slate-800 mt-0.5">{lead.serviceInterested}</p>
              </div>
            </div>
          </div>

          {/* Activity / Follow-ups Timeline */}
          <div>
            <h2 className="text-lg font-semibold text-[#111111] border-b border-[#FFDCD0] pb-2 mb-4">
              Follow-ups & Outreach Timeline
            </h2>
            {followups.length === 0 ? (
              <p className="text-xs text-[#475569] italic">No scheduled follow-ups recorded yet for this lead.</p>
            ) : (
              <div className="space-y-3">
                {followups.map((f, idx) => (
                  <div key={idx} className="bg-[#FFF6F1]/30 border border-[#FFDCD0] rounded-xl p-3.5 text-xs space-y-1">
                    <div className="flex items-center justify-between text-[#475569]">
                      <span>Date: {f.date}</span>
                      <span className="text-emerald-700 font-semibold">{f.status}</span>
                    </div>
                    <p className="text-[#111111] font-medium">{f.notes}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: AI Scoring & Meta */}
        <div className="space-y-6">
          <div className="bg-white border border-[#FFDCD0] rounded-2xl p-6 shadow-xs space-y-4">
            <h2 className="text-lg font-semibold text-[#111111] border-b border-[#FFDCD0] pb-2">AI Conversion Propensity</h2>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#475569] font-medium">Lead Score</span>
              <span className="text-2xl font-bold text-[#F26522]">{lead.score || 85}/100</span>
            </div>
            <div className="bg-[#FFF6F1]/40 p-3 rounded-xl border border-[#FFDCD0] text-xs space-y-1">
              <p className="text-[#F26522] font-bold">AI Recommendation:</p>
              <p className="text-slate-700">High engagement detected. Schedule product demo to advance deal stage.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Lead Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white border border-[#FFDCD0] rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4 text-[#111111]">
            <div className="flex items-center justify-between border-b border-[#FFDCD0] pb-3">
              <h2 className="text-lg font-bold text-[#111111]">Edit Lead Details</h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-[#111111] hover:bg-orange-50 text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Lead Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#FFF6F1]/30 border border-[#FFDCD0] rounded-xl px-3.5 py-2 text-xs text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#F26522]/30 focus:border-[#F26522]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#FFF6F1]/30 border border-[#FFDCD0] rounded-xl px-3.5 py-2 text-xs text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#F26522]/30 focus:border-[#F26522]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#FFF6F1]/30 border border-[#FFDCD0] rounded-xl px-3.5 py-2 text-xs text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#F26522]/30 focus:border-[#F26522]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Company Name</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full bg-[#FFF6F1]/30 border border-[#FFDCD0] rounded-xl px-3.5 py-2 text-xs text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#F26522]/30 focus:border-[#F26522]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Lead Stage</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-[#FFF6F1]/30 border border-[#FFDCD0] rounded-xl px-3.5 py-2 text-xs text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#F26522]/30 focus:border-[#F26522]"
                  >
                    {statuses.map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Service Interested *</label>
                <input
                  type="text"
                  required
                  value={formData.serviceInterested}
                  onChange={(e) => setFormData({ ...formData, serviceInterested: e.target.value })}
                  className="w-full bg-[#FFF6F1]/30 border border-[#FFDCD0] rounded-xl px-3.5 py-2 text-xs text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#F26522]/30 focus:border-[#F26522]"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#FFDCD0]">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-700 hover:bg-[#FFF6F1] font-semibold text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="bg-gradient-to-r from-[#F26522] to-[#D9531E] hover:opacity-95 text-white font-semibold px-5 py-2 rounded-xl text-xs transition-all shadow-sm"
                >
                  {updating ? 'Updating...' : 'Update Lead'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default LeadDetailsPage;

