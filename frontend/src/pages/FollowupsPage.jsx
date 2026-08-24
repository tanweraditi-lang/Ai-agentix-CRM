import React from 'react';

function FollowupsPage() {
  const followups = [
    { id: 'f1', task: 'Follow up on proposal feedback', client: 'Acme Corp', due: 'Today at 2:00 PM', status: 'Pending' },
    { id: 'f2', task: 'Send contract draft for review', client: 'TechNova', due: 'Tomorrow at 10:00 AM', status: 'Upcoming' },
  ];

  return (
    <div className="space-y-6 text-[#111827]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#111827] tracking-tight">Follow-ups Scheduler</h1>
          <p className="text-sm text-slate-500">Track tasks, calls, and reminder schedules</p>
        </div>
        <button className="bg-[#EC4899] hover:bg-[#BE185D] text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors shadow-md">
          + Schedule Task
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {followups.map((item) => (
          <div key={item.id} className="bg-white border border-[#FBCFE8] rounded-xl p-5 shadow-sm flex justify-between items-start">
            <div className="space-y-1">
              <h3 className="font-semibold text-[#111827]">{item.task}</h3>
              <p className="text-xs text-slate-500">Client: <span className="text-slate-800 font-medium">{item.client}</span></p>
              <p className="text-xs text-[#BE185D] font-semibold">{item.due}</p>
            </div>
            <span className="bg-[#FCE7F3] text-[#BE185D] border border-[#FBCFE8] px-2.5 py-1 rounded-full text-xs font-bold">
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FollowupsPage;
