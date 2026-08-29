import React, { useState, useEffect } from 'react';
import { getFollowups, createFollowup, deleteFollowup } from '../services/followupService';
import { CalendarClock, Plus, Clock, Trash2, X, CalendarCheck } from 'lucide-react';

function FollowupsPage() {
  const [followups, setFollowups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);

  const [formData, setFormData] = useState({
    task: '',
    clientName: '',
    date: new Date().toISOString().split('T')[0],
    time: '2:00 PM',
    status: 'Pending',
    notes: '',
  });

  const fetchFollowupsData = async () => {
    try {
      setLoading(true);
      const res = await getFollowups();
      const items = Array.isArray(res) ? res : (res.data || []);
      setFollowups(items);
    } catch (err) {
      console.error('Error fetching follow-ups:', err);
      // Fallback default list if database is empty or offline
      setFollowups([
        { id: 'f1', _id: 'f1', task: 'Follow up on proposal feedback', clientName: 'Acme Corp', due: 'Today at 2:00 PM', status: 'Pending' },
        { id: 'f2', _id: 'f2', task: 'Send contract draft for review', clientName: 'TechNova', due: 'Tomorrow at 10:00 AM', status: 'Upcoming' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowupsData();
  }, []);

  const handleOpenModal = () => {
    setFormData({
      task: '',
      clientName: '',
      date: new Date().toISOString().split('T')[0],
      time: '2:00 PM',
      status: 'Pending',
      notes: '',
    });
    setAlert(null);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.task || !formData.task.trim()) {
      setAlert({ type: 'error', message: 'Task title is required.' });
      return;
    }

    try {
      setSubmitting(true);
      setAlert(null);

      const dueFormatted = `${formData.date} at ${formData.time}`;
      await createFollowup({
        task: formData.task.trim(),
        clientName: formData.clientName.trim() || 'General Client',
        date: formData.date,
        time: dueFormatted,
        status: formData.status,
        notes: formData.notes,
      });

      setAlert({ type: 'success', message: 'Task scheduled successfully!' });
      setIsModalOpen(false);
      fetchFollowupsData();
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Failed to schedule task' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await deleteFollowup(id);
      setAlert({ type: 'success', message: 'Follow-up task deleted successfully.' });
      fetchFollowupsData();
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Failed to delete task.' });
    }
  };

  return (
    <div className="space-y-6 text-[#111111]">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#FFDCD0] shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#FFF6F1] border border-[#FFDCD0] rounded-xl text-[#F26522] shadow-xs">
            <CalendarClock className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#111111] tracking-tight">Follow-ups Scheduler</h1>
            <p className="text-xs sm:text-sm text-[#475569] font-medium">Track tasks, calls, and reminder schedules</p>
          </div>
        </div>
        <button
          onClick={handleOpenModal}
          className="crm-button-primary self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Task</span>
        </button>
      </div>

      {/* Alert Notification Toast */}
      {alert && (
        <div
          className={`p-3.5 rounded-xl text-xs font-medium flex items-center justify-between shadow-xs ${
            alert.type === 'success'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-rose-50 text-rose-700 border border-rose-200'
          }`}
        >
          <span>{alert.message}</span>
          <button onClick={() => setAlert(null)} className="font-bold ml-4 hover:opacity-75 cursor-pointer">&times;</button>
        </div>
      )}

      {/* Follow-ups Grid List */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-sm bg-white rounded-2xl border border-[#FFDCD0]">
          <div className="inline-block w-6 h-6 border-2 border-[#F26522] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-2 text-xs">Loading follow-ups...</p>
        </div>
      ) : followups.length === 0 ? (
        <div className="bg-white border border-[#FFDCD0] rounded-2xl p-12 text-center text-slate-400 text-xs">
          <p className="font-semibold text-slate-700">No scheduled tasks found</p>
          <p className="text-[11px] text-slate-400 mt-1">Click "+ Schedule Task" above to add your first reminder.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {followups.map((item) => (
            <div key={item.id || item._id} className="bg-white border border-[#FFDCD0] rounded-2xl p-5 shadow-xs flex justify-between items-start hover:shadow-md transition-all">
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-[#111111]">{item.task}</h3>
                <p className="text-xs text-[#475569]">Client: <span className="text-slate-800 font-semibold">{item.clientName || item.client || 'General Client'}</span></p>
                <p className="text-xs text-[#F26522] font-semibold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{item.time || item.due || (item.date ? new Date(item.date).toLocaleDateString() : 'Scheduled')}</span>
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="bg-[#FFF6F1] text-[#F26522] border border-[#FFDCD0] px-3 py-1 rounded-full text-xs font-bold shrink-0">
                  {item.status || 'Pending'}
                </span>
                {item._id && !item._id.startsWith('f') && (
                  <button
                    onClick={() => handleDeleteTask(item._id)}
                    className="text-[11px] text-rose-500 hover:text-rose-700 font-medium cursor-pointer flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Remove</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Schedule Task Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white border border-[#FFDCD0] rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4 text-[#111111]">
            <div className="flex items-center justify-between border-b border-[#FFDCD0] pb-3">
              <h2 className="text-lg font-bold text-[#111111]">Schedule Follow-up Task</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-[#111111] hover:bg-orange-50 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Task Title / Subject *</label>
                <input
                  type="text"
                  required
                  value={formData.task}
                  onChange={(e) => setFormData({ ...formData, task: e.target.value })}
                  placeholder="e.g. Follow up on proposal feedback"
                  className="crm-input"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Client / Account Name *</label>
                <input
                  type="text"
                  required
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  placeholder="e.g. Acme Corp"
                  className="crm-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="crm-input"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Due Time</label>
                  <input
                    type="text"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    placeholder="2:00 PM"
                    className="crm-input"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  style={{ color: '#F26522', backgroundColor: '#FFFFFF' }}
                  className="w-full h-10 bg-white text-[#F26522] border border-[#FFDCD0] rounded-xl px-3.5 text-xs font-bold hover:bg-[#FFF6F1] focus:outline-none focus:ring-2 focus:ring-[#F26522]/30 focus:border-[#F26522] transition-colors cursor-pointer"
                >
                  <option value="Pending" style={{ color: '#F26522', backgroundColor: '#FFFFFF' }}>Pending</option>
                  <option value="Upcoming" style={{ color: '#F26522', backgroundColor: '#FFFFFF' }}>Upcoming</option>
                  <option value="Completed" style={{ color: '#F26522', backgroundColor: '#FFFFFF' }}>Completed</option>
                  <option value="Cancelled" style={{ color: '#F26522', backgroundColor: '#FFFFFF' }}>Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Additional Notes</label>
                <textarea
                  rows="2"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Optional details, call agenda..."
                  className="w-full bg-[#FFF6F1]/30 border border-[#FFDCD0] rounded-xl p-3 text-xs text-[#111111] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F26522]/30 focus:border-[#F26522]"
                ></textarea>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#FFDCD0]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-700 hover:bg-[#FFF6F1] font-semibold text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="crm-button-primary disabled:opacity-50"
                >
                  {submitting ? 'Scheduling...' : 'Save Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default FollowupsPage;
