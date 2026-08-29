import React from 'react';

function FollowupsPage() {
  const followups = [
    { id: 'f1', task: 'Follow up on proposal feedback', client: 'Acme Corp', due: 'Today at 2:00 PM', status: 'Pending' },
    { id: 'f2', task: 'Send contract draft for review', client: 'TechNova', due: 'Tomorrow at 10:00 AM', status: 'Upcoming' },
  ];

  return (
    <div className="space-y-6 text-[#111111]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#FFDCD0] shadow-xs">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#111111] tracking-tight">Follow-ups Scheduler</h1>
          <p className="text-xs sm:text-sm text-[#475569]">Track tasks, calls, and reminder schedules</p>
        </div>
        <button className="bg-[#F26522] hover:bg-[#D9531E] text-white font-semibold px-4 py-2 rounded-xl text-xs sm:text-sm transition-colors shadow-sm self-start sm:self-auto cursor-pointer">
          + Schedule Task
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {followups.map((item) => (
          <div key={item.id} className="bg-white border border-[#FFDCD0] rounded-xl p-5 shadow-sm flex justify-between items-start">
            <div className="space-y-1">
              <h3 className="font-semibold text-[#111111]">{item.task}</h3>
              <p className="text-xs text-[#475569]">Client: <span className="text-slate-800 font-medium">{item.client}</span></p>
              <p className="text-xs text-[#F26522] font-semibold">{item.due}</p>
            </div>
            <span className="bg-[#FFF6F1] text-[#F26522] border border-[#FFDCD0] px-2.5 py-1 rounded-full text-xs font-bold">
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FollowupsPage;
