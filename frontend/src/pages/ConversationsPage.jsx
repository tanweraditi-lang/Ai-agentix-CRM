import React, { useState, useEffect } from 'react';
import {
  getConversations,
  updateConversation,
  deleteConversation,
} from '../services/conversationService';
import {
  MessageSquare,
  Search,
  CheckCircle,
  AlertTriangle,
  Clock,
  UserCheck,
  Eye,
  Trash2,
  RefreshCw,
  X,
  Bot,
  User,
  Send,
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
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedConv, setSelectedConv] = useState(null);
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

  const handleOpenDelete = (conv) => {
    setSelectedConv(conv);
    setIsDeleteOpen(true);
  };

  const handleStatusUpdate = async (conv, newStatus) => {
    try {
      setError(null);
      const res = await updateConversation(conv.id || conv._id, { status: newStatus });
      if (res?.success) {
        setSuccessMessage(`Status updated to ${newStatus}`);
        fetchConversationsList();
        if (selectedConv) {
          setSelectedConv({ ...selectedConv, status: newStatus });
        }
        setTimeout(() => setSuccessMessage(null), 3000);
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
        setSuccessMessage('Conversation deleted successfully');
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

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Resolved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            Resolved
          </span>
        );
      case 'Escalated':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-bold">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            Escalated
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
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
            <span>Conversation Management</span>
          </h1>
          <p className="text-xs text-[#475569] mt-0.5">
            Monitor AI chatbot transcripts, resolution status, and agent escalations
          </p>
        </div>

        <button
          onClick={() => fetchConversationsList()}
          className="p-2.5 rounded-xl bg-orange-50 border border-[#FFDCD0] text-[#F26522] hover:bg-[#FFF6F1] transition-all cursor-pointer self-start sm:self-auto"
          title="Refresh conversations"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
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

        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search visitor, email, or question..."
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
            <p>Loading conversations...</p>
          </div>
        ) : conversations.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs space-y-2 bg-[#FFF6F1]/20">
            <MessageSquare className="w-10 h-10 text-[#F26522]/40 mx-auto" />
            <p className="font-semibold text-slate-700">No conversations recorded</p>
            <p className="text-slate-400">Visitor messages will appear here in real time as chatbots interact.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#FFF6F1] border-b border-[#FFDCD0] text-[#475569] uppercase font-bold text-[11px]">
                  <th className="py-3.5 px-4">Visitor Info</th>
                  <th className="py-3.5 px-4">Visitor Question</th>
                  <th className="py-3.5 px-4">Bot Response</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Assigned Agent</th>
                  <th className="py-3.5 px-4">Time</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#FFDCD0]/60">
                {conversations.map((conv) => (
                  <tr key={conv.id || conv._id} className="hover:bg-[#FFF6F1]/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div>
                        <p className="font-bold text-[#111111]">{conv.visitorName}</p>
                        <p className="text-[11px] text-[#475569]">{conv.visitorEmail}</p>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="line-clamp-2 text-slate-800 font-medium">{conv.question}</p>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="line-clamp-2 text-slate-600">{conv.botResponse}</p>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getStatusBadge(conv.status)}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-[#475569] font-medium">
                      <span className="inline-flex items-center gap-1 text-[11px] bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-200">
                        <UserCheck className="w-3 h-3 text-[#F26522]" />
                        {conv.assignedAgent || 'AI Bot Agent'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-[#475569]">
                      {conv.conversationTime ? new Date(conv.conversationTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently'}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenView(conv)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-[#F26522] hover:bg-orange-50 transition-colors"
                          title="View Full Conversation"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenDelete(conv)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Conversation"
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

      {/* Modal: View Full Transcript & Change Status */}
      {isViewOpen && selectedConv && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#FFDCD0] rounded-2xl max-w-xl w-full p-6 shadow-xl space-y-4 max-h-[90vh] flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-[#FFDCD0] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#111111] flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-[#F26522]" />
                  <span>Conversation Transcript</span>
                </h3>
                <p className="text-[11px] text-[#475569]">
                  Visitor: <span className="font-bold text-slate-800">{selectedConv.visitorName}</span> ({selectedConv.visitorEmail})
                </p>
              </div>
              <button onClick={() => setIsViewOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Messages Simulation Stream */}
            <div className="flex-1 overflow-y-auto space-y-3 p-3 bg-[#FFF6F1]/40 rounded-xl border border-[#FFDCD0]">
              {/* Visitor Message */}
              <div className="flex items-start gap-2 max-w-[85%]">
                <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-[#FFDCD0] shadow-2xs space-y-1">
                  <p className="text-[10px] font-bold text-slate-500">{selectedConv.visitorName}</p>
                  <p className="text-xs text-[#111111]">{selectedConv.question}</p>
                </div>
              </div>

              {/* Bot Response Message */}
              <div className="flex items-start gap-2 max-w-[85%] ml-auto flex-row-reverse">
                <div className="w-7 h-7 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-[#FFF6F1] p-3 rounded-2xl rounded-tr-none border border-[#FFDCD0] text-right shadow-2xs space-y-1">
                  <p className="text-[10px] font-bold text-[#F26522]">AI Agent (Bot)</p>
                  <p className="text-xs text-[#111111]">{selectedConv.botResponse}</p>
                </div>
              </div>
            </div>

            {/* Status & Agent Controls */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700">Update Status:</span>
                <div className="flex items-center gap-1">
                  {['Resolved', 'Escalated', 'Pending'].map((st) => (
                    <button
                      key={st}
                      onClick={() => handleStatusUpdate(selectedConv, st)}
                      className={`px-2.5 py-1 rounded-lg font-bold text-[11px] cursor-pointer ${
                        selectedConv.status === st
                          ? 'bg-[#F26522] text-white'
                          : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-[11px] text-slate-500">
                Assigned: <span className="font-bold text-slate-800">{selectedConv.assignedAgent || 'AI Bot Agent'}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end border-t border-[#FFDCD0]">
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

      {/* Modal: Delete Conversation */}
      {isDeleteOpen && selectedConv && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-rose-200 rounded-2xl max-w-sm w-full p-6 shadow-xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#111111]">Delete Conversation Log?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Remove conversation transcript with <span className="font-bold text-slate-800">"{selectedConv.visitorName}"</span>?
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
                {submitting ? 'Deleting...' : 'Delete Log'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ConversationsPage;
