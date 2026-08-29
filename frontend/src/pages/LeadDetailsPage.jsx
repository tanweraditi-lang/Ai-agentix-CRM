import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getLeadById, updateLead } from '../services/leadService';
import {
  getLeadNotes,
  createNote,
  updateNote,
  deleteNote,
  getLeadActivity,
} from '../services/noteService';

function LeadDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lead, setLead] = useState(null);
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

  // Tabs state: 'notes' | 'activity'
  const [activeTab, setActiveTab] = useState('notes');

  // Notes state
  const [notes, setNotes] = useState([]);
  const [newNoteText, setNewNoteText] = useState('');
  const [notesLoading, setNotesLoading] = useState(false);
  const [addingNote, setAddingNote] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editingNoteText, setEditingNoteText] = useState('');

  // Activity Timeline state
  const [activities, setActivities] = useState([]);
  const [activityLoading, setActivityLoading] = useState(false);

  const statuses = ['New', 'Contacted', 'Qualified', 'In Negotiation', 'Converted', 'Lost'];

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const data = await getLeadById(id);
      const leadItem = data?.lead || data?.data?.lead || (data?.success ? data.lead : null);
      if (leadItem) {
        setLead(leadItem);
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

  const fetchNotesData = async () => {
    try {
      setNotesLoading(true);
      const res = await getLeadNotes(id);
      if (res?.success) {
        setNotes(res.notes || []);
      }
    } catch (err) {
      console.error('Error fetching notes:', err);
    } finally {
      setNotesLoading(false);
    }
  };

  const fetchActivitiesData = async () => {
    try {
      setActivityLoading(true);
      const res = await getLeadActivity(id);
      if (res?.success) {
        setActivities(res.activities || []);
      }
    } catch (err) {
      console.error('Error fetching activities:', err);
    } finally {
      setActivityLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
    fetchNotesData();
    fetchActivitiesData();
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
      await updateLead(id, formData);
      setLead(prev => ({ ...prev, ...formData }));
      setIsEditModalOpen(false);
      setAlert({ type: 'success', message: 'Lead updated successfully!' });
      fetchActivitiesData();
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
      setAlert({ type: 'success', message: `Lead status updated to ${newStatus}` });
      fetchActivitiesData();
    } catch (err) {
      console.error('Error updating status:', err);
      setAlert({ type: 'error', message: 'Failed to update status' });
    } finally {
      setUpdating(false);
    }
  };

  const handleAddNoteSubmit = async (e) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    try {
      setAddingNote(true);
      await createNote(id, { note: newNoteText, createdBy: 'System Admin' });
      setNewNoteText('');
      setAlert({ type: 'success', message: 'Note added successfully!' });
      fetchNotesData();
      fetchActivitiesData();
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Failed to add note' });
    } finally {
      setAddingNote(false);
    }
  };

  const handleStartEditNote = (n) => {
    setEditingNoteId(n.id || n._id);
    setEditingNoteText(n.note || '');
  };

  const handleSaveEditNote = async (noteId) => {
    if (!editingNoteText.trim()) return;

    try {
      await updateNote(noteId, { note: editingNoteText.trim() });
      setEditingNoteId(null);
      setEditingNoteText('');
      setAlert({ type: 'success', message: 'Note updated successfully!' });
      fetchNotesData();
      fetchActivitiesData();
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Failed to update note' });
    }
  };

  const handleDeleteNoteItem = async (noteId) => {
    try {
      await deleteNote(noteId);
      setAlert({ type: 'success', message: 'Note deleted successfully!' });
      fetchNotesData();
      fetchActivitiesData();
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Failed to delete note' });
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getActivityBadge = (action) => {
    const act = (action || '').toLowerCase();
    if (act.includes('created')) {
      return { bg: 'bg-indigo-100 text-indigo-700 border-indigo-200', icon: '✨' };
    } else if (act.includes('status')) {
      return { bg: 'bg-amber-100 text-amber-700 border-amber-200', icon: '🔄' };
    } else if (act.includes('note')) {
      return { bg: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: '📝' };
    } else {
      return { bg: 'bg-orange-100 text-[#F26522] border-[#FFDCD0]', icon: '⚡' };
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-500 text-sm space-y-2">
        <div className="inline-block w-6 h-6 border-2 border-[#F26522] border-t-transparent rounded-full animate-spin"></div>
        <p>Loading lead profile & timeline...</p>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-[#475569] font-medium">Lead profile not found.</p>
        <Link to="/leads" className="text-[#F26522] hover:underline text-sm font-semibold inline-block">
          &larr; Back to Leads Pipeline
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-[#111111]">
      {/* Top Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-[#FFDCD0] shadow-xs">
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          <Link
            to="/leads"
            className="text-[#475569] hover:text-[#F26522] text-xs font-semibold transition-colors flex items-center gap-1 bg-[#FFF6F1] px-3 py-1.5 rounded-xl border border-[#FFDCD0]"
          >
            &larr; Back to Leads
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold text-[#111111]">{lead.name}</h1>
          <span className="bg-[#FFF6F1] text-[#F26522] border border-[#FFDCD0] px-3 py-1 rounded-full text-xs font-bold">
            {lead.status}
          </span>
        </div>

        <div className="flex items-center space-x-3 self-start sm:self-auto">
          <button
            onClick={handleOpenEditModal}
            className="bg-orange-50 hover:bg-[#FFF6F1] text-[#F26522] border border-[#FFDCD0] font-semibold px-4 py-1.5 rounded-xl text-xs transition-colors cursor-pointer"
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
        <div className="md:col-span-2 bg-white border border-[#FFDCD0] rounded-2xl p-4 sm:p-6 shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-[#111111] border-b border-[#FFDCD0] pb-2 mb-4">
              Prospect Profile
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
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

          {/* Interactive Notes & Activity Tabs Section */}
          <div className="border-t border-[#FFDCD0] pt-6 space-y-4">
            {/* Tab Control Buttons */}
            <div className="flex items-center space-x-2 border-b border-[#FFDCD0] pb-2">
              <button
                onClick={() => setActiveTab('notes')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'notes'
                    ? 'bg-gradient-to-r from-[#F26522] to-[#D9531E] text-white shadow-xs'
                    : 'bg-[#FFF6F1] text-[#F26522] hover:bg-orange-100'
                }`}
              >
                Notes ({notes.length})
              </button>
              <button
                onClick={() => setActiveTab('activity')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'activity'
                    ? 'bg-gradient-to-r from-[#F26522] to-[#D9531E] text-white shadow-xs'
                    : 'bg-[#FFF6F1] text-[#F26522] hover:bg-orange-100'
                }`}
              >
                Activity Timeline ({activities.length})
              </button>
            </div>

            {/* Tab 1: Notes Section */}
            {activeTab === 'notes' && (
              <div className="space-y-4">
                {/* Add Note Form */}
                <form onSubmit={handleAddNoteSubmit} className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-700">Add New Note</label>
                  <textarea
                    rows="3"
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder="Type call notes, client feedback, or follow-up details..."
                    className="w-full bg-[#FFF6F1]/30 border border-[#FFDCD0] rounded-xl p-3 text-xs text-[#111111] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F26522]/30 focus:border-[#F26522]"
                  ></textarea>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={addingNote || !newNoteText.trim()}
                      className="bg-gradient-to-r from-[#F26522] to-[#D9531E] hover:opacity-95 text-white font-semibold px-4 py-1.5 rounded-xl text-xs transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                    >
                      {addingNote ? 'Saving Note...' : 'Save Note'}
                    </button>
                  </div>
                </form>

                {/* Notes List */}
                {notesLoading ? (
                  <div className="py-6 text-center text-xs text-slate-400">Loading notes...</div>
                ) : notes.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 text-xs bg-[#FFF6F1]/20 rounded-xl border border-dashed border-[#FFDCD0]">
                    <p className="font-medium text-slate-700">No notes recorded yet</p>
                    <p className="text-[11px] text-slate-400 mt-1">Use the box above to add your first note for this lead.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {notes.map((n) => (
                      <div key={n.id || n._id} className="bg-[#FFF6F1]/30 border border-[#FFDCD0] rounded-xl p-4 text-xs space-y-2 shadow-2xs">
                        <div className="flex items-center justify-between text-[#475569]">
                          <span className="font-bold text-[#111111]">{n.createdBy || 'System Admin'}</span>
                          <span className="text-[11px] text-slate-500">{formatDate(n.createdAt)}</span>
                        </div>

                        {editingNoteId === (n.id || n._id) ? (
                          <div className="space-y-2 pt-1">
                            <textarea
                              rows="2"
                              value={editingNoteText}
                              onChange={(e) => setEditingNoteText(e.target.value)}
                              className="w-full bg-white border border-[#F26522] rounded-xl p-2 text-xs text-[#111111] focus:outline-none"
                            ></textarea>
                            <div className="flex justify-end space-x-2">
                              <button
                                type="button"
                                onClick={() => setEditingNoteId(null)}
                                className="px-3 py-1 rounded-lg text-slate-600 hover:bg-slate-100 text-[11px] font-semibold"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSaveEditNote(n.id || n._id)}
                                className="bg-[#F26522] text-white px-3 py-1 rounded-lg text-[11px] font-semibold"
                              >
                                Save Changes
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-[#111111] leading-relaxed whitespace-pre-wrap">{n.note}</p>
                        )}

                        {editingNoteId !== (n.id || n._id) && (
                          <div className="flex justify-end space-x-3 pt-1 border-t border-[#FFDCD0]/40">
                            <button
                              onClick={() => handleStartEditNote(n)}
                              className="text-[#F26522] hover:underline font-semibold text-[11px]"
                            >
                              Edit Note
                            </button>
                            <button
                              onClick={() => handleDeleteNoteItem(n.id || n._id)}
                              className="text-rose-600 hover:underline font-semibold text-[11px]"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Activity Timeline Section */}
            {activeTab === 'activity' && (
              <div className="space-y-3">
                {activityLoading ? (
                  <div className="py-6 text-center text-xs text-slate-400">Loading timeline...</div>
                ) : activities.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 text-xs bg-[#FFF6F1]/20 rounded-xl border border-dashed border-[#FFDCD0]">
                    <p className="font-medium text-slate-700">No activity history</p>
                    <p className="text-[11px] text-slate-400 mt-1">Activities will log automatically when status, notes, or profile change.</p>
                  </div>
                ) : (
                  <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#FFDCD0]">
                    {activities.map((act, idx) => {
                      const badge = getActivityBadge(act.action);
                      return (
                        <div key={idx} className="relative flex items-start space-x-3">
                          <div className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full border text-xs flex items-center justify-center bg-white shadow-2xs`}>
                            {badge.icon}
                          </div>
                          <div className="bg-[#FFF6F1]/30 border border-[#FFDCD0] rounded-xl p-3 text-xs w-full space-y-1">
                            <div className="flex items-center justify-between">
                              <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] border ${badge.bg}`}>
                                {act.action}
                              </span>
                              <span className="text-[11px] text-slate-500 font-medium">
                                {formatDate(act.createdAt || act.timestamp)}
                              </span>
                            </div>
                            <p className="text-[#111111] font-medium pt-0.5">{act.description}</p>
                            <p className="text-[10px] text-slate-400">By {act.user || 'System Admin'}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
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
