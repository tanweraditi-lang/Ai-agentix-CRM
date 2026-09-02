import React, { useState, useEffect } from 'react';
import {
  getChatbots,
  createChatbot,
  updateChatbot,
  deleteChatbot,
} from '../services/chatbotService';
import {
  Bot,
  Plus,
  Search,
  Globe,
  Tag,
  CheckCircle2,
  XCircle,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  X,
  Sparkles,
} from 'lucide-react';

function ChatbotsPage() {
  const [chatbots, setChatbots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [selectedBot, setSelectedBot] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    website: '',
    description: '',
    version: 'v1.0',
    status: 'Active',
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchChatbotsList = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getChatbots({ status: statusFilter, search });
      if (res?.success) {
        setChatbots(res.chatbots || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to load chatbots');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChatbotsList();
  }, [statusFilter, search]);

  const handleOpenCreate = () => {
    setFormData({
      name: '',
      website: 'https://',
      description: '',
      version: 'v1.0',
      status: 'Active',
    });
    setIsCreateOpen(true);
  };

  const handleOpenEdit = (bot) => {
    setSelectedBot(bot);
    setFormData({
      name: bot.name || '',
      website: bot.website || '',
      description: bot.description || '',
      version: bot.version || 'v1.0',
      status: bot.status || 'Active',
    });
    setIsEditOpen(true);
  };

  const handleOpenView = (bot) => {
    setSelectedBot(bot);
    setIsViewOpen(true);
  };

  const handleOpenDelete = (bot) => {
    setSelectedBot(bot);
    setIsDeleteOpen(true);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);
      const res = await createChatbot(formData);
      if (res?.success) {
        setSuccessMessage('Chatbot created successfully');
        setIsCreateOpen(false);
        fetchChatbotsList();
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (err) {
      setError(err.message || 'Failed to create chatbot');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBot) return;
    try {
      setSubmitting(true);
      setError(null);
      const res = await updateChatbot(selectedBot.id || selectedBot._id, formData);
      if (res?.success) {
        setSuccessMessage('Chatbot updated successfully');
        setIsEditOpen(false);
        fetchChatbotsList();
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (err) {
      setError(err.message || 'Failed to update chatbot');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedBot) return;
    try {
      setSubmitting(true);
      setError(null);
      const res = await deleteChatbot(selectedBot.id || selectedBot._id);
      if (res?.success) {
        setSuccessMessage('Chatbot removed successfully');
        setIsDeleteOpen(false);
        fetchChatbotsList();
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (err) {
      setError(err.message || 'Failed to delete chatbot');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 text-[#111111]">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#FFDCD0] shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#111111] flex items-center gap-2">
            <Bot className="w-6 h-6 text-[#F26522]" />
            <span>Chatbots Management</span>
          </h1>
          <p className="text-xs text-[#475569] mt-0.5">
            Create, monitor, and deploy AI chatbots across your web properties
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => fetchChatbotsList()}
            className="p-2.5 rounded-xl bg-orange-50 border border-[#FFDCD0] text-[#F26522] hover:bg-[#FFF6F1] transition-all cursor-pointer"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#F26522] to-[#D9531E] text-white font-bold text-xs shadow-sm hover:opacity-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Bot</span>
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
          {['All', 'Active', 'Inactive'].map((st) => (
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
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by bot name, website..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#FFF6F1]/40 border border-[#FFDCD0] rounded-xl text-xs text-[#111111] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F26522]/30 focus:border-[#F26522]"
          />
        </div>
      </div>

      {/* Chatbots Table */}
      <div className="bg-white border border-[#FFDCD0] rounded-2xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-slate-400 text-xs space-y-2">
            <div className="inline-block w-6 h-6 border-2 border-[#F26522] border-t-transparent rounded-full animate-spin"></div>
            <p>Loading chatbots...</p>
          </div>
        ) : chatbots.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs space-y-2 bg-[#FFF6F1]/20">
            <Bot className="w-10 h-10 text-[#F26522]/40 mx-auto" />
            <p className="font-semibold text-slate-700">No chatbots found</p>
            <p className="text-slate-400">Click "Create New Bot" to add your first chatbot instance.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#FFF6F1] border-b border-[#FFDCD0] text-[#475569] uppercase font-bold text-[11px]">
                  <th className="py-3.5 px-4">Bot Details</th>
                  <th className="py-3.5 px-4">Target Website</th>
                  <th className="py-3.5 px-4">Version</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Created Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#FFDCD0]/60">
                {chatbots.map((bot) => (
                  <tr key={bot.id || bot._id} className="hover:bg-[#FFF6F1]/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-orange-100 text-[#F26522] border border-[#FFDCD0] shrink-0">
                          <Bot className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-[#111111] text-xs">{bot.name}</p>
                          <p className="text-[11px] text-[#475569] line-clamp-1 max-w-xs">{bot.description || 'No description provided'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <a
                        href={bot.website}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-[#F26522] hover:underline font-medium"
                      >
                        <Globe className="w-3.5 h-3.5 text-slate-400" />
                        <span>{bot.website}</span>
                      </a>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold text-[11px] border border-slate-200">
                        <Tag className="w-3 h-3 text-slate-400" />
                        {bot.version || 'v1.0'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {bot.status === 'Active' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200 text-[11px] font-semibold">
                          <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span>
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-[#475569]">
                      {bot.createdAt ? new Date(bot.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenView(bot)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-[#F26522] hover:bg-orange-50 transition-colors"
                          title="View Bot"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(bot)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                          title="Edit Bot"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenDelete(bot)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Bot"
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

      {/* Modal: Create Chatbot */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#FFDCD0] rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#FFDCD0] pb-3">
              <h3 className="text-base font-bold text-[#111111] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#F26522]" />
                <span>Create New Chatbot</span>
              </h3>
              <button onClick={() => setIsCreateOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Bot Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sales Assistant Bot"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 bg-[#FFF6F1]/30 border border-[#FFDCD0] rounded-xl text-xs focus:ring-2 focus:ring-[#F26522]/30 focus:border-[#F26522]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Website URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://example.com"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full p-2.5 bg-[#FFF6F1]/30 border border-[#FFDCD0] rounded-xl text-xs focus:ring-2 focus:ring-[#F26522]/30 focus:border-[#F26522]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows="3"
                  placeholder="Describe the bot's capabilities and purpose..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 bg-[#FFF6F1]/30 border border-[#FFDCD0] rounded-xl text-xs focus:ring-2 focus:ring-[#F26522]/30 focus:border-[#F26522]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Version</label>
                  <input
                    type="text"
                    placeholder="v1.0"
                    value={formData.version}
                    onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                    className="w-full p-2.5 bg-[#FFF6F1]/30 border border-[#FFDCD0] rounded-xl text-xs focus:ring-2 focus:ring-[#F26522]/30 focus:border-[#F26522]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full p-2.5 bg-[#FFF6F1]/30 border border-[#FFDCD0] rounded-xl text-xs focus:ring-2 focus:ring-[#F26522]/30 focus:border-[#F26522]"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
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
                  {submitting ? 'Creating...' : 'Create Chatbot'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Chatbot */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#FFDCD0] rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#FFDCD0] pb-3">
              <h3 className="text-base font-bold text-[#111111] flex items-center gap-2">
                <Edit className="w-4 h-4 text-[#F26522]" />
                <span>Edit Chatbot</span>
              </h3>
              <button onClick={() => setIsEditOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Bot Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 bg-[#FFF6F1]/30 border border-[#FFDCD0] rounded-xl text-xs focus:ring-2 focus:ring-[#F26522]/30 focus:border-[#F26522]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Website URL *</label>
                <input
                  type="url"
                  required
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full p-2.5 bg-[#FFF6F1]/30 border border-[#FFDCD0] rounded-xl text-xs focus:ring-2 focus:ring-[#F26522]/30 focus:border-[#F26522]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 bg-[#FFF6F1]/30 border border-[#FFDCD0] rounded-xl text-xs focus:ring-2 focus:ring-[#F26522]/30 focus:border-[#F26522]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Version</label>
                  <input
                    type="text"
                    value={formData.version}
                    onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                    className="w-full p-2.5 bg-[#FFF6F1]/30 border border-[#FFDCD0] rounded-xl text-xs focus:ring-2 focus:ring-[#F26522]/30 focus:border-[#F26522]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full p-2.5 bg-[#FFF6F1]/30 border border-[#FFDCD0] rounded-xl text-xs focus:ring-2 focus:ring-[#F26522]/30 focus:border-[#F26522]"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#FFDCD0]">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl text-white bg-gradient-to-r from-[#F26522] to-[#D9531E] font-bold shadow-xs hover:opacity-95"
                >
                  {submitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: View Chatbot */}
      {isViewOpen && selectedBot && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#FFDCD0] rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#FFDCD0] pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-orange-100 text-[#F26522] border border-[#FFDCD0]">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#111111]">{selectedBot.name}</h3>
                  <p className="text-[11px] text-[#475569]">Chatbot Configuration Profile</p>
                </div>
              </div>
              <button onClick={() => setIsViewOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-[#FFF6F1]/50 border border-[#FFDCD0] space-y-2">
                <div>
                  <span className="font-bold text-slate-500 uppercase text-[10px]">Target Website:</span>
                  <p className="font-bold text-[#F26522]">{selectedBot.website}</p>
                </div>
                <div>
                  <span className="font-bold text-slate-500 uppercase text-[10px]">Description:</span>
                  <p className="text-slate-700">{selectedBot.description || 'No description provided.'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-500 uppercase text-[10px]">Current Version:</span>
                  <p className="font-bold text-slate-800">{selectedBot.version}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-500 uppercase text-[10px]">Status:</span>
                  <p className={`font-bold ${selectedBot.status === 'Active' ? 'text-emerald-600' : 'text-slate-600'}`}>
                    {selectedBot.status}
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-orange-50/50 border border-[#FFDCD0] text-[11px]">
                <span className="font-bold text-[#F26522]">Embed Widget Code:</span>
                <pre className="mt-1 p-2 bg-white rounded-lg border border-[#FFDCD0] text-[10px] font-mono text-slate-800 overflow-x-auto">
                  {`<script src="https://cdn.agentix.ai/bot.js" data-bot-id="${selectedBot.id || selectedBot._id}"></script>`}
                </pre>
              </div>
            </div>

            <div className="pt-3 flex justify-end border-t border-[#FFDCD0]">
              <button
                onClick={() => setIsViewOpen(false)}
                className="px-4 py-2 rounded-xl text-white bg-[#F26522] font-bold text-xs"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Delete Chatbot */}
      {isDeleteOpen && selectedBot && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-rose-200 rounded-2xl max-w-sm w-full p-6 shadow-xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#111111]">Delete Chatbot?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to delete <span className="font-bold text-slate-800">"{selectedBot.name}"</span>?
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
                {submitting ? 'Deleting...' : 'Delete Bot'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatbotsPage;
