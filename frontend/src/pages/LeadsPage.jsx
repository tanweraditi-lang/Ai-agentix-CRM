import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getLeads, createLead, updateLead, deleteLead } from '../services/leadService';

function LeadsPage() {
  const [searchParams] = useSearchParams();
  const urlSearchParam = searchParams.get('search') || '';

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(urlSearchParam);
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    const q = searchParams.get('search');
    if (q !== null) {
      setSearch(q);
    }
    const st = searchParams.get('status');
    if (st !== null && st !== '') {
      setStatusFilter(st);
    }
  }, [searchParams]);
  
  // Modal state for Add/Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLeadId, setEditingLeadId] = useState(null); // null = Create mode, ID = Edit mode
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    serviceInterested: '',
    status: 'New',
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);

  // Delete modal state
  const [deletingLead, setDeletingLead] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const statuses = ['All', 'New', 'Contacted', 'Qualified', 'In Negotiation', 'Converted', 'Lost'];
  const formStatuses = ['New', 'Contacted', 'Qualified', 'In Negotiation', 'Converted', 'Lost'];

  const fetchLeadsData = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search && search.trim()) params.search = search.trim();
      if (statusFilter && statusFilter !== 'All') params.status = statusFilter;

      const data = await getLeads(params);
      
      const leadsList = Array.isArray(data) 
        ? data 
        : (data?.leads || data?.data || []);

      setLeads(leadsList);
    } catch (err) {
      console.error('Error fetching leads:', err);
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeadsData();
  }, [search, statusFilter]);

  const handleOpenAddModal = () => {
    setEditingLeadId(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      serviceInterested: '',
      status: 'New',
    });
    setAlert(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (lead) => {
    setEditingLeadId(lead.id || lead._id);
    setFormData({
      name: lead.name || '',
      email: lead.email || '',
      phone: lead.phone || '',
      company: lead.company || '',
      serviceInterested: lead.serviceInterested || '',
      status: lead.status || 'New',
    });
    setAlert(null);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setAlert(null);

    try {
      if (editingLeadId) {
        await updateLead(editingLeadId, formData);
        setAlert({ type: 'success', message: 'Lead updated successfully!' });
      } else {
        await createLead(formData);
        setAlert({ type: 'success', message: 'Lead added successfully!' });
      }
      setIsModalOpen(false);
      fetchLeadsData();
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Failed to save lead' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateLead(id, { status: newStatus });
      fetchLeadsData();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const confirmDeleteLead = async () => {
    if (!deletingLead) return;
    try {
      setDeleting(true);
      await deleteLead(deletingLead.id || deletingLead._id);
      setAlert({ type: 'success', message: `Lead "${deletingLead.name}" deleted successfully!` });
      setDeletingLead(null);
      fetchLeadsData();
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Failed to delete lead' });
    } finally {
      setDeleting(false);
    }
  };

  const getBadgeStyle = (status) => {
    return 'bg-white text-[#F26522] border-[#FFDCD0] font-bold hover:bg-[#FFF6F1] focus:outline-none focus:ring-2 focus:ring-[#F26522]/30 focus:border-[#F26522] transition-colors shadow-2xs';
  };

  return (
    <div className="space-y-6 text-[#111111]">
      {/* Header & Main Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#FFDCD0] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#FFF6F1] border border-[#FFDCD0] rounded-xl text-[#F26522] shadow-xs">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#111111] tracking-tight">
                Lead Management
              </h1>
              <span className="text-xs bg-[#FFF6F1] text-[#F26522] border border-[#FFDCD0] px-3 py-1 rounded-full font-bold shadow-xs">
                {leads.length} Active
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#475569] mt-0.5 font-medium">
              Track, qualify, update deal stages, and manage prospect pipelines efficiently
            </p>
          </div>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="bg-gradient-to-r from-[#F26522] to-[#D9531E] hover:opacity-95 text-white font-semibold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition-all shadow-sm hover:shadow-md flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>Add New Lead</span>
        </button>
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

      {/* Filter & Search Bar Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#FFDCD0] shadow-xs">
        {/* Search Input */}
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search leads by name, email, company, or phone..."
            className="w-full pl-9 pr-4 py-2 bg-[#FFF6F1]/40 border border-[#FFDCD0] rounded-xl text-xs text-[#111111] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F26522]/30 focus:border-[#F26522] transition-all"
          />
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                statusFilter === st
                  ? 'bg-gradient-to-r from-[#F26522] to-[#D9531E] text-white font-semibold shadow-xs'
                  : 'bg-[#FFF6F1] text-[#F26522] hover:bg-orange-100'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Leads Data Table */}
      <div className="bg-white border border-[#FFDCD0] rounded-2xl overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm space-y-2">
            <div className="inline-block w-6 h-6 border-2 border-[#F26522] border-t-transparent rounded-full animate-spin"></div>
            <p>Loading leads dataset...</p>
          </div>
        ) : leads.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm bg-[#FFF6F1]/20">
            <p className="font-semibold text-slate-700">No leads found</p>
            <p className="text-xs text-slate-400 mt-1">Try adjusting your search terms or filter selection.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#111111]">
              <thead className="bg-[#FFF6F1]/60 text-slate-700 uppercase text-[11px] font-bold tracking-wider border-b border-[#FFDCD0]">
                <tr>
                  <th className="px-6 py-4 font-semibold">Lead Details</th>
                  <th className="px-6 py-4 font-semibold">Company</th>
                  <th className="px-6 py-4 font-semibold">Service Interested</th>
                  <th className="px-6 py-4 font-semibold">Stage Status</th>
                  <th className="px-6 py-4 font-semibold">AI Score</th>
                  <th className="px-6 py-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#FFDCD0]">
                {leads.map((lead) => (
                  <tr key={lead.id || lead._id} className="hover:bg-orange-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-[#111111]">
                      <div className="font-semibold text-sm">{lead.name}</div>
                      <div className="text-xs text-[#475569] font-normal">{lead.email} {lead.phone ? `• ${lead.phone}` : ''}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-700 font-medium">{lead.company || 'N/A'}</td>
                    <td className="px-6 py-4 text-slate-700">{lead.serviceInterested}</td>
                    <td className="px-6 py-4">
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.id || lead._id, e.target.value)}
                        className={`text-xs font-semibold px-3 py-1 rounded-full border focus:outline-none cursor-pointer ${getBadgeStyle(
                          lead.status
                        )}`}
                      >
                        {formStatuses.map(st => (
                          <option key={st} value={st} className="bg-white text-[#111111]">
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 font-bold text-[#F26522]">{lead.score || 85}/100</td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <Link
                        to={`/leads/${lead.id || lead._id}`}
                        className="text-slate-600 hover:text-[#F26522] text-xs font-semibold"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => handleOpenEditModal(lead)}
                        className="text-[#F26522] hover:text-[#D9531E] text-xs font-semibold"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeletingLead(lead)}
                        className="text-rose-600 hover:text-rose-800 text-xs font-semibold"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Lead Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white border border-[#FFDCD0] rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4 text-[#111111]">
            <div className="flex items-center justify-between border-b border-[#FFDCD0] pb-3">
              <h2 className="text-lg font-bold text-[#111111]">
                {editingLeadId ? 'Edit Lead Details' : 'Add New Prospect Lead'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-[#111111] hover:bg-orange-50 text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Lead Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Jane Smith"
                  className="w-full bg-[#FFF6F1]/30 border border-[#FFDCD0] rounded-xl px-3.5 py-2 text-xs text-[#111111] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F26522]/30 focus:border-[#F26522]"
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
                    placeholder="jane@company.com"
                    className="w-full bg-[#FFF6F1]/30 border border-[#FFDCD0] rounded-xl px-3.5 py-2 text-xs text-[#111111] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F26522]/30 focus:border-[#F26522]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full bg-[#FFF6F1]/30 border border-[#FFDCD0] rounded-xl px-3.5 py-2 text-xs text-[#111111] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F26522]/30 focus:border-[#F26522]"
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
                    placeholder="Acme Inc"
                    className="w-full bg-[#FFF6F1]/30 border border-[#FFDCD0] rounded-xl px-3.5 py-2 text-xs text-[#111111] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F26522]/30 focus:border-[#F26522]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Lead Stage</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-white text-[#F26522] border border-[#FFDCD0] rounded-xl px-3.5 py-2 text-xs font-bold hover:bg-[#FFF6F1] focus:outline-none focus:ring-2 focus:ring-[#F26522]/30 focus:border-[#F26522] transition-colors cursor-pointer"
                  >
                    {formStatuses.map(st => (
                      <option key={st} value={st} className="bg-white text-[#111111] hover:bg-[#FFF6F1] font-medium">
                        {st}
                      </option>
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
                  placeholder="e.g. Enterprise Cloud CRM"
                  className="w-full bg-[#FFF6F1]/30 border border-[#FFDCD0] rounded-xl px-3.5 py-2 text-xs text-[#111111] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F26522]/30 focus:border-[#F26522]"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#FFDCD0]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-700 hover:bg-[#FFF6F1] font-semibold text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-gradient-to-r from-[#F26522] to-[#D9531E] hover:opacity-95 text-white font-semibold px-5 py-2 rounded-xl text-xs transition-all shadow-sm"
                >
                  {submitting ? 'Saving...' : editingLeadId ? 'Update Lead' : 'Save Lead'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white border border-rose-200 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4 text-[#111111]">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2.5 rounded-full bg-rose-100">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-lg text-[#111111]">Confirm Lead Removal</h3>
                <p className="text-xs text-[#475569]">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed bg-rose-50/50 p-3 rounded-xl border border-rose-100">
              Are you sure you want to permanently delete lead <strong className="text-rose-700">{deletingLead.name}</strong> ({deletingLead.email})?
            </p>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingLead(null)}
                className="px-4 py-2 rounded-xl text-slate-700 hover:bg-slate-100 font-semibold text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteLead}
                disabled={deleting}
                className="bg-rose-600 hover:bg-rose-700 text-white font-semibold px-4 py-2 rounded-xl text-xs transition-colors shadow-sm disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete Lead'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LeadsPage;

