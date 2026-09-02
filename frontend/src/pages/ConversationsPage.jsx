import React, { useState, useEffect } from 'react';
import {
  getConversations,
  createConversation,
  updateConversation,
  convertConversationToLead,
  deleteConversation,
} from '../services/conversationService';
import {
  MessageSquare,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Eye,
  Trash2,
  UserPlus,
  RefreshCw,
  Plus,
  X,
  Send,
  User,
  Bot,
  Sparkles,
} from 'lucide-react';

function ConversationsPage() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Modals
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedConv, setSelectedConv] = useState(null);

  const [formData, setFormData] = useState({
    visitorName: '',
    visitorEmail: '',
    message: '',
    botResponse: '',
    status: 'Pending',
    assignedAgent: 'AI Bot Agent',
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchConversationsList = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getConversations({ status: statusFilter, search });
      if (res?.success) {
        setConversations(res.conversations || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversationsList();
  }, [statusFilter, search]);

  const handleOpenView = (conv) => {
    setSelectedConv(conv);
    setIsViewOpen(true);
  };

  const handleOpenCreate = () => {
    setFormData({
      visitorName: '',
      visitorEmail: '',
      message: '',
      botResponse: 'Hello! I am AI-Agentix Assistant. How can I help you today?',
      status: 'Pending',
      assignedAgent: 'AI Bot Agent',
    });
    setIsCreateOpen(true);
  };

  const handleOpenDelete = (conv) => {
    setSelectedConv(conv);
    setIsDeleteOpen(true);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);
      const res = await createConversation(formData);
      if (res?.success) {
        setSuccessMessage('Conversation saved successfully');
        setIsCreateOpen(false);
        fetchConversationsList();
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (err) {
      setError(err.message || 'Failed to save conversation');
    } finally {
      setSubmitting(false);
    }
  };

  const handleConvertToLead = async (conv) => {
    try {
      setSubmitting(true);
      setError(null);
      const res = await convertConversationToLead(conv.id || conv._id);
      if (res?.success) {
        setSuccessMessage(`Visitor "${conv.visitorName}" successfully converted into a Lead!`);
        fetchConversationsList();
        setTimeout(() => setSuccessMessage(null), 3500);
      }
    } catch (err) {
      setError(err.message || 'Failed to convert conversation into Lead');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (convId, newStatus) => {
    try {
      const res = await updateConversation(convId, { status: newStatus });
      if (res?.success) {
        setSuccessMessage(`Status updated to ${newStatus}`);
        fetchConversationsList();
        setTimeout(() => setSuccessMessage(null), 2500);
      }
    } catch (err) {
      setError(err.message || 'Failed to update status');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedConv) return;
    try {
      setSubmitting(true);
      setError(null);
      const res = await deleteConversation(selectedConv.id || selectedConv._id);
      if (res?.success) {
        setSuccessMessage('Conversation transcript removed');
        setIsDeleteOpen(false);
        fetchConversationsList();
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (err) {
      setError(err.message || 'Failed to delete conversation');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (st) => {
    switch (st) {
      case 'Resolved':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Resolved
          </span>
        );
      case 'Escalated':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            Escalated
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-bold">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            Pending
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 text-[#111111]">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#FFDCD0] shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#111111] flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-[#F26522]" />
            <span>Conversations Module</span>
          </h1>
          <p className="text-xs text-[#475569] mt-0.5">
            Real-time AI Chatbot transcripts, visitor queries, agent escalation, and lead conversion
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => fetchConversationsList()}
            className="p-2.5 rounded-xl bg-orange-50 border border-[#FFDCD0] text-[#F26522] hover:bg-[#FFF6F1] transition-all cursor-pointer"
            title="Refresh transcripts"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#F26522] to-[#D9531E] text-white font-bold text-xs shadow-sm hover:opacity-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Log Conversation</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}
      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="underline font-bold text-rose-900">Dismiss</button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-[#FFDCD0] shadow-xs">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {['All', 'Resolved', 'Escalated', 'Pending'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-[#F26522] text-white shadow-xs'
                  : 'bg-orange-50/60 text-slate-700 hover:bg-orange-100/60 border border-[#FFDCD0]/50'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by visitor name, email, or message..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#FFF6F1]/40 border border-[#FFDCD0] rounded-xl text-xs text-[#111111] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F26522]/30 focus:border-[#F26522]"
          />
        </div>
      </div>

      {/* Conversations Table */}
      <div className="bg-white border border-[#FFDCD0] rounded-2xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-slate-400 text-xs space-y-2">
            <div className="inline-block w-6 h-6 border-2 border-[#F26522] border-t-transparent rounded-full animate-spin"></div>
            <p>Loading conversation transcripts...</p>
          </div>
        ) : conversations.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs space-y-2 bg-[#FFF6F1]/20">
            <MessageSquare className="w-10 h-10 text-[#F26522]/40 mx-auto" />
            <p className="font-semibold text-slate-700">No conversations found</p>
            <p className="text-slate-400">Click "Log Conversation" to record a chat transcript.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#FFF6F1] border-b border-[#FFDCD0] text-[#475569] uppercase font-bold text-[11px]">
                  <th className="py-3.5 px-4">Visitor Name</th>
                  <th className="py-3.5 px-4">Visitor Email</th>
                  <th className="py-3.5 px-4">Visitor Message</th>
                  <th className="py-3.5 px-4">Bot Reply</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Created Time</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#FFDCD0]/60">
                {conversations.map((conv) => (
                  <tr key={conv.id || conv._id} className="hover:bg-[#FFF6F1]/40 transition-colors">
                    {/* Visitor Name */}
                    <td className="py-3.5 px-4 font-bold text-[#111111]">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-orange-100 text-[#F26522] border border-[#FFDCD0] shrink-0">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <p>{conv.visitorName}</p>
                          {conv.isConvertedToLead && (
                            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                              Converted Lead
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Visitor Email */}
                    <td className="py-3.5 px-4 text-slate-700 font-medium whitespace-nowrap">
                      {conv.visitorEmail}
                    </td>

                    {/* Visitor Message */}
                    <td className="py-3.5 px-4 text-slate-800 max-w-xs truncate">
                      "{conv.message || conv.question}"
                    </td>

                    {/* Bot Reply */}
                    <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate italic">
                      "{conv.botResponse}"
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <select
                        value={conv.status}
                        onChange={(e) => handleStatusChange(conv.id || conv._id, e.target.value)}
                        className="bg-white border border-[#FFDCD0] rounded-lg px-2 py-1 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-[#F26522]/30 focus:border-[#F26522] cursor-pointer"
                      >
                        <option value="Resolved">Resolved</option>
                        <option value="Escalated">Escalated</option>
                        <option value="Pending">Pending</option>
                      </select>
                    </td>

                    {/* Created Time */}
                    <td className="py-3.5 px-4 text-[#475569] whitespace-nowrap">
                      {conv.conversationTime ? new Date(conv.conversationTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'Recently'}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenView(conv)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-[#F26522] hover:bg-orange-50 transition-colors"
                          title="View Transcript"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {!conv.isConvertedToLead && (
                          <button
                            onClick={() => handleConvertToLead(conv)}
                            disabled={submitting}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 font-bold text-[11px] transition-colors cursor-pointer"
                            title="Convert Visitor into CRM Lead"
                          >
                            <UserPlus className="w-3.5 h-3.5" />
                            <span>Convert to Lead</span>
                          </button>
                        )}

                        <button
                          onClick={() => handleOpenDelete(conv)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Transcript"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Modal: Log New Conversation */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#FFDCD0] rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#FFDCD0] pb-3">
              <h3 className="text-base font-bold text-[#111111] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#F26522]" />
                <span>Log Conversation Transcript</span>
              </h3>
              <button onClick={() => setIsCreateOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Visitor Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Jenkins"
                    value={formData.visitorName}
                    onChange={(e) => setFormData({ ...formData, visitorName: e.target.value })}
                    className="w-full p-2.5 bg-[#FFF6F1]/30 border border-[#FFDCD0] rounded-xl text-xs focus:ring-2 focus:ring-[#F26522]/30 focus:border-[#F26522]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Visitor Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="sarah@example.com"
                    value={formData.visitorEmail}
                    onChange={(e) => setFormData({ ...formData, visitorEmail: e.target.value })}
                    className="w-full p-2.5 bg-[#FFF6F1]/30 border border-[#FFDCD0] rounded-xl text-xs focus:ring-2 focus:ring-[#F26522]/30 focus:border-[#F26522]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Visitor Message / Question *</label>
                <textarea
                  rows="2"
                  required
                  placeholder="e.g. Can you provide custom enterprise pricing and API documentation?"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full p-2.5 bg-[#FFF6F1]/30 border border-[#FFDCD0] rounded-xl text-xs focus:ring-2 focus:ring-[#F26522]/30 focus:border-[#F26522]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Bot Reply *</label>
                <textarea
                  rows="2"
                  required
                  placeholder="e.g. Our custom plan starts at $499/mo. An agent will contact you shortly."
                  value={formData.botResponse}
                  onChange={(e) => setFormData({ ...formData, botResponse: e.target.value })}
                  className="w-full p-2.5 bg-[#FFF6F1]/30 border border-[#FFDCD0] rounded-xl text-xs focus:ring-2 focus:ring-[#F26522]/30 focus:border-[#F26522]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full p-2.5 bg-[#FFF6F1]/30 border border-[#FFDCD0] rounded-xl text-xs focus:ring-2 focus:ring-[#F26522]/30 focus:border-[#F26522]"
                  >
                    <option value="Resolved">Resolved</option>
                    <option value="Escalated">Escalated</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Assigned Agent</label>
                  <input
                    type="text"
                    value={formData.assignedAgent}
                    onChange={(e) => setFormData({ ...formData, assignedAgent: e.target.value })}
                    className="w-full p-2.5 bg-[#FFF6F1]/30 border border-[#FFDCD0] rounded-xl text-xs focus:ring-2 focus:ring-[#F26522]/30 focus:border-[#F26522]"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#FFDCD0]">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl text-white bg-gradient-to-r from-[#F26522] to-[#D9531E] font-bold shadow-xs hover:opacity-95"
                >
                  {submitting ? 'Saving...' : 'Save Transcript'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: View Chat Transcript */}
      {isViewOpen && selectedConv && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#FFDCD0] rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#FFDCD0] pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-orange-100 text-[#F26522] border border-[#FFDCD0]">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#111111]">{selectedConv.visitorName}</h3>
                  <p className="text-[11px] text-[#475569]">{selectedConv.visitorEmail}</p>
                </div>
              </div>
              <button onClick={() => setIsViewOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Bubbles Container */}
            <div className="space-y-3 p-4 rounded-xl bg-[#FFF6F1]/40 border border-[#FFDCD0] max-h-80 overflow-y-auto text-xs">
              {/* Visitor Bubble */}
              <div className="flex items-start gap-2 max-w-[85%]">
                <div className="p-1.5 rounded-full bg-slate-200 text-slate-700 shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5" />
                </div>
                <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">{selectedConv.visitorName}</span>
                  <p className="text-slate-900 font-medium">"{selectedConv.message || selectedConv.question}"</p>
                </div>
              </div>

              {/* Bot Bubble */}
              <div className="flex items-start gap-2 max-w-[85%] ml-auto flex-row-reverse">
                <div className="p-1.5 rounded-full bg-[#F26522] text-white shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="p-3 rounded-2xl bg-[#F26522] text-white shadow-2xs space-y-1">
                  <span className="text-[10px] font-bold text-orange-200 uppercase">AI Bot Agent</span>
                  <p className="font-medium">"{selectedConv.botResponse}"</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#FFDCD0] text-xs">
              <div>{getStatusBadge(selectedConv.status)}</div>
              <button
                onClick={() => setIsViewOpen(false)}
                className="px-4 py-2 rounded-xl text-white bg-[#F26522] font-bold text-xs"
              >
                Close Transcript
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Delete Confirmation */}
      {isDeleteOpen && selectedConv && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-rose-200 rounded-2xl max-w-sm w-full p-6 shadow-xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#111111]">Delete Transcript?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to delete conversation record with <span className="font-bold text-slate-800">"{selectedConv.visitorName}"</span>?
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setIsDeleteOpen(false)}
                className="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={submitting}
                className="px-5 py-2 rounded-xl text-white bg-rose-600 font-bold text-xs shadow-xs hover:bg-rose-700"
              >
                {submitting ? 'Deleting...' : 'Delete Transcript'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ConversationsPage;
