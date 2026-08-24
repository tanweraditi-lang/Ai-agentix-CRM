import React from 'react';

function FollowupsPage() {
  const followups = [
    { id: 'f1', task: 'Follow up on proposal feedback', client: 'Acme Corp', due: 'Today at 2:00 PM', status: 'Pending' },
    { id: 'f2', task: 'Send contract draft for review', client: 'TechNova', due: 'Tomorrow at 10:00 AM', status: 'Upcoming' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Follow-ups Scheduler</h1>
          <p className="text-sm text-slate-400">Track tasks, calls, and reminder schedules</p>
        </div>
        <button className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold px-4 py-2 rounded-lg text-sm transition-colors shadow-md">
          + Schedule Task
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {followups.map((item) => (
          <div key={item.id} className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-md flex justify-between items-start">
            <div className="space-y-1">
              <h3 className="font-semibold text-white">{item.task}</h3>
              <p className="text-xs text-slate-400">Client: <span className="text-slate-200">{item.client}</span></p>
              <p className="text-xs text-sky-400 font-medium">{item.due}</p>
            </div>
            <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-full text-xs font-medium">
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FollowupsPage;
