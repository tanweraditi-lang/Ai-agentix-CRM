import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getLeads, createLead, updateLead, deleteLead } from '../services/leadService';

function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const statuses = ['All', 'New', 'Contacted', 'Qualified', 'In Negotiation', 'Converted', 'Lost'];

  const fetchLeadsData = async () => {
    try {
      setLoading(true);
      const data = await getLeads({ search, status: statusFilter });
      if (data?.success) {
        setLeads(data.leads);
      }
    } catch (err) {
      console.error('Error fetching leads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeadsData();
  }, [search, statusFilter]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setAlert(null);

    try {
      await createLead(formData);
      setAlert({ type: 'success', message: 'Lead added successfully!' });
      setIsModalOpen(false);
      setFormData({ name: '', email: '', phone: '', company: '', serviceInterested: '', status: 'New' });
      fetchLeadsData();
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Failed to add lead' });
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

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await deleteLead(id);
        fetchLeadsData();
      } catch (err) {
        console.error('Error deleting lead:', err);
      }
    }
  };

  const getBadgeStyle = (status) => {
    switch (status) {
      case 'New': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      case 'Contacted': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Qualified': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'In Negotiation': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'Converted': return 'bg-teal-500/10 text-teal-400 border-teal-500/20';
      case 'Lost': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default: return 'bg-slate-700 text-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Main Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Leads Pipeline</h1>
          <p className="text-sm text-slate-400">Manage, search, and transition prospect stages</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold px-4 py-2 rounded-lg text-sm transition-colors shadow-md flex items-center gap-1.5 self-start sm:self-auto"
        >
          <span>+</span> Add Lead
        </button>
      </div>

      {alert && (
        <div
          className={`p-3 rounded-lg text-xs font-medium ${
            alert.type === 'success'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
          }`}
        >
          {alert.message}
        </div>
      )}

      {/* Filter & Search Bar Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-md">
        {/* Search Input */}
        <div className="relative flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search leads by name, company, email, or service..."
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center space-x-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                statusFilter === st
                  ? 'bg-sky-500 text-slate-950 font-semibold shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Leads Data Table */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-lg">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">Loading leads data...</div>
        ) : leads.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            No leads found matching your search and filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900/60 text-slate-400 uppercase text-xs border-b border-slate-700">
                <tr>
                  <th className="px-6 py-3.5">Lead Name</th>
                  <th className="px-6 py-3.5">Company</th>
                  <th className="px-6 py-3.5">Service Interested</th>
                  <th className="px-6 py-3.5">Status Stage</th>
                  <th className="px-6 py-3.5">Score</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {leads.map((lead) => (
                  <tr key={lead.id || lead._id} className="hover:bg-slate-700/40 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">
                      <div>{lead.name}</div>
                      <div className="text-xs text-slate-400 font-normal">{lead.email}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-300">{lead.company || 'N/A'}</td>
                    <td className="px-6 py-4 text-slate-300">{lead.serviceInterested}</td>
                    <td className="px-6 py-4">
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.id || lead._id, e.target.value)}
                        className={`text-xs font-medium px-2.5 py-1 rounded-full border border-opacity-30 focus:outline-none cursor-pointer ${getBadgeStyle(
                          lead.status
                        )}`}
                      >
                        {statuses.filter(s => s !== 'All').map(st => (
                          <option key={st} value={st} className="bg-slate-900 text-white">
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 font-semibold text-emerald-400">{lead.score || 85}/100</td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <Link
                        to={`/leads/${lead.id || lead._id}`}
                        className="text-sky-400 hover:text-sky-300 text-xs font-medium underline underline-offset-4"
                      >
                        Details
                      </Link>
                      <button
                        onClick={() => handleDelete(lead.id || lead._id)}
                        className="text-rose-400 hover:text-rose-300 text-xs font-medium"
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

      {/* Modal Dialog Overlay for "+ Add Lead" */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <h2 className="text-lg font-bold text-white">Add New Prospect Lead</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Lead Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Jane Smith"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="jane@company.com"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Company Name</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Acme Inc"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Initial Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-white focus:outline-none focus:border-sky-500"
                  >
                    {statuses.filter(s => s !== 'All').map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Service Interested *</label>
                <input
                  type="text"
                  required
                  value={formData.serviceInterested}
                  onChange={(e) => setFormData({ ...formData, serviceInterested: e.target.value })}
                  placeholder="e.g. Enterprise Cloud CRM"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-700 font-medium text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold px-5 py-2 rounded-lg text-xs transition-colors shadow-md"
                >
                  {submitting ? 'Creating...' : 'Save Lead'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default LeadsPage;
