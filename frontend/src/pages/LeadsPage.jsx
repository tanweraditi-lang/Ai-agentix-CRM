import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getLeads, createLead, updateLead, deleteLead } from '../services/leadService';
import {
  Users,
  Plus,
  Search,
  Eye,
  Edit3,
  Trash2,
  Calendar,
  ArrowUpDown,
  Filter,
  RefreshCw,
} from 'lucide-react';

function LeadsPage() {
  const [searchParams] = useSearchParams();
  const urlSearchParam = searchParams.get('search') || '';
  const urlStatusParam = searchParams.get('status') || 'All';

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter & Search Controls
  const [search, setSearch] = useState(urlSearchParam);
  const [statusFilter, setStatusFilter] = useState(urlStatusParam);
  const [dateFilter, setDateFilter] = useState('all'); // 'all' | 'today' | 'last7days' | 'last30days' | 'custom'
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'oldest' | 'name_asc' | 'name_desc'

  useEffect(() => {
    const q = searchParams.get('search');
    if (q !== null) setSearch(q);

    const st = searchParams.get('status');
    if (st !== null && st !== '') setStatusFilter(st);
  }, [searchParams]);

  // Modal state for Add/Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLeadId, setEditingLeadId] = useState(null);
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
      if (dateFilter && dateFilter !== 'all') params.dateFilter = dateFilter;
      if (dateFilter === 'custom') {
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;
      }
      if (sortBy) params.sortBy = sortBy;

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
  }, [search, statusFilter, dateFilter, startDate, endDate, sortBy]);

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

  const getBadgeStyle = () => {
    return 'bg-white text-[#F26522] border border-slate-200 font-bold hover:bg-[#FFF6F1] focus:outline-none focus:ring-2 focus:ring-[#F26522]/30 focus:border-[#F26522] transition-colors shadow-2xs';
  };

  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter('All');
    setDateFilter('all');
    setStartDate('');
    setEndDate('');
    setSortBy('newest');
  };

  return (
    <div className="space-y-6 text-[#111111]">
      {/* Header & Main Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#FFDCD0] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#FFF6F1] border border-[#FFDCD0] rounded-xl text-[#F26522] shadow-xs">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#111111] tracking-tight">
                Lead Management
              </h1>
              <span className="text-xs bg-[#FFF6F1] text-[#F26522] border border-[#FFDCD0] px-3 py-1 rounded-full font-bold shadow-xs">
                {leads.length} Filtered Leads
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#475569] mt-0.5 font-medium">
              Advanced MongoDB search, date range filters, sorting, and deal pipeline management
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchLeadsData()}
            className="p-2.5 rounded-xl bg-orange-50 border border-[#FFDCD0] text-[#F26522] hover:bg-[#FFF6F1] transition-all cursor-pointer"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleOpenAddModal}
            className="bg-gradient-to-r from-[#F26522] to-[#D9531E] hover:opacity-95 text-white font-semibold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition-all shadow-sm hover:shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Lead</span>
          </button>
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

      {/* Advanced Filter, Search & Sorting Panel */}
      <div className="bg-white p-5 rounded-2xl border border-[#FFDCD0] shadow-xs space-y-4">
        {/* Row 1: Search Input & Status Pills */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search Bar across Name, Email, Company, Phone, Service */}
          <div className="relative flex-1 min-w-[240px]">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, company, phone, or service..."
              className="w-full pl-9 pr-4 py-2 bg-[#FFF6F1]/40 border border-[#FFDCD0] rounded-xl text-xs text-[#111111] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F26522]/30 focus:border-[#F26522] transition-all"
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            {statuses.map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  statusFilter === st
                    ? 'bg-gradient-to-r from-[#F26522] to-[#D9531E] text-white font-bold shadow-xs'
                    : 'bg-[#FFF6F1] text-[#F26522] hover:bg-orange-100 border border-[#FFDCD0]/40'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Row 2: Date Filters & Sorting Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#FFDCD0]/60 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            {/* Date Range Selector */}
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-600 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#F26522]" /> Date:
              </span>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="bg-white border border-[#FFDCD0] rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-[#F26522]/30 focus:border-[#F26522] cursor-pointer"
              >
                <option value="all">All Time</option>
                <option value="today">Created Today</option>
                <option value="last7days">Last 7 Days</option>
                <option value="last30days">Last 30 Days</option>
                <option value="custom">Custom Date Range</option>
              </select>
            </div>

            {/* Custom Date Inputs */}
            {dateFilter === 'custom' && (
              <div className="flex items-center gap-2 bg-[#FFF6F1] p-1.5 rounded-xl border border-[#FFDCD0]">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-white border border-[#FFDCD0] rounded-lg px-2 py-1 text-[11px] text-slate-800"
                />
                <span className="text-slate-400 font-bold">to</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-white border border-[#FFDCD0] rounded-lg px-2 py-1 text-[11px] text-slate-800"
                />
              </div>
            )}
          </div>

          {/* Sorting Control */}
          <div className="flex items-center justify-between sm:justify-end gap-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-600 flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5 text-[#F26522]" /> Sort By:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-[#FFDCD0] rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-[#F26522]/30 focus:border-[#F26522] cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name_asc">Name (A-Z)</option>
                <option value="name_desc">Name (Z-A)</option>
              </select>
            </div>

            {(search || statusFilter !== 'All' || dateFilter !== 'all' || sortBy !== 'newest') && (
              <button
                onClick={handleResetFilters}
                className="text-[#F26522] hover:underline font-bold text-xs"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Leads Data Table */}
      <div className="bg-white border border-[#FFDCD0] rounded-2xl overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs space-y-2">
            <div className="inline-block w-6 h-6 border-2 border-[#F26522] border-t-transparent rounded-full animate-spin"></div>
            <p>Loading matching leads from MongoDB...</p>
          </div>
        ) : leads.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs bg-[#FFF6F1]/20 space-y-1">
            <Filter className="w-8 h-8 text-[#F26522]/40 mx-auto" />
            <p className="font-bold text-slate-700">No leads match your filter parameters</p>
            <p className="text-slate-400">Try broadening your search term or date range.</p>
            <button
              onClick={handleResetFilters}
              className="mt-2 inline-block px-3 py-1 bg-[#F26522] text-white rounded-lg text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#111111]">
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
                      <div className="font-bold text-xs">{lead.name}</div>
                      <div className="text-[11px] text-[#475569] font-normal">{lead.email} {lead.phone ? `• ${lead.phone}` : ''}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-700 font-semibold">{lead.company || 'N/A'}</td>
                    <td className="px-6 py-4 text-slate-700">{lead.serviceInterested}</td>
                    <td className="px-6 py-4">
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.id || lead._id, e.target.value)}
                        style={{ color: '#F26522', backgroundColor: '#FFFFFF' }}
                        className={`text-xs font-bold px-3 py-1 rounded-full border focus:outline-none cursor-pointer ${getBadgeStyle()}`}
                      >
                        {formStatuses.map(st => (
                          <option key={st} value={st} style={{ color: '#F26522', backgroundColor: '#FFFFFF' }} className="bg-white text-[#F26522] hover:bg-[#FFF6F1] font-medium">
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 font-bold text-[#F26522]">{lead.score || 85}/100</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-3">
                        <Link
                          to={`/leads/${lead.id || lead._id}`}
                          className="text-slate-600 hover:text-[#F26522] text-xs font-semibold flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </Link>
                        <button
                          onClick={() => handleOpenEditModal(lead)}
                          className="text-[#F26522] hover:text-[#D9531E] text-xs font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => setDeletingLead(lead)}
                          className="text-rose-600 hover:text-rose-800 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
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

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
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
                    style={{ color: '#F26522', backgroundColor: '#FFFFFF' }}
                    className="w-full bg-white text-[#F26522] border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold hover:bg-[#FFF6F1] focus:outline-none focus:ring-2 focus:ring-[#F26522]/30 focus:border-[#F26522] transition-colors cursor-pointer"
                  >
                    {formStatuses.map(st => (
                      <option key={st} value={st} style={{ color: '#F26522', backgroundColor: '#FFFFFF' }} className="bg-white text-[#F26522] hover:bg-[#FFF6F1] font-medium">
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
                <Trash2 className="w-6 h-6" />
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
