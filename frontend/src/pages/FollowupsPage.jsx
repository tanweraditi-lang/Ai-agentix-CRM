import React from 'react';

function FollowupsPage() {
  const followups = [
    { id: 'f1', task: 'Follow up on proposal feedback', client: 'Acme Corp', due: 'Today at 2:00 PM', status: 'Pending' },
    { id: 'f2', task: 'Send contract draft for review', client: 'TechNova', due: 'Tomorrow at 10:00 AM', status: 'Upcoming' },
  ];

  return (
    <div className="space-y-6 text-[#111111]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#FFDCD0] shadow-xs">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#111111] tracking-tight">Follow-ups Scheduler</h1>
          <p className="text-xs sm:text-sm text-[#475569] font-medium">Track tasks, calls, and reminder schedules</p>
        </div>
        <button className="crm-button-primary self-start sm:self-auto">
          + Schedule Task
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {followups.map((item) => (
          <div key={item.id} className="bg-white border border-[#FFDCD0] rounded-2xl p-5 shadow-xs flex justify-between items-start hover:shadow-md transition-all">
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-[#111111]">{item.task}</h3>
              <p className="text-xs text-[#475569]">Client: <span className="text-slate-800 font-semibold">{item.client}</span></p>
              <p className="text-xs text-[#F26522] font-semibold flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{item.due}</span>
              </p>
            </div>
            <span className="bg-[#FFF6F1] text-[#F26522] border border-[#FFDCD0] px-3 py-1 rounded-full text-xs font-bold shrink-0">
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FollowupsPage;
