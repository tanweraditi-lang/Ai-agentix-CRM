import React from 'react';

function CustomersPage() {
  const customers = [
    { id: 'c1', name: 'Acme Enterprise', plan: 'Pro Annual', value: '$12,000/yr', since: '2024-01-15' },
    { id: 'c2', name: 'Global Tech Solutions', plan: 'Enterprise', value: '$45,000/yr', since: '2023-11-01' },
  ];

  return (
    <div className="space-y-6 text-[#111111]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#FFDCD0] shadow-xs">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#111111] tracking-tight">Active Customers</h1>
          <p className="text-xs sm:text-sm text-[#475569] font-medium">Directory of converted clients and accounts</p>
        </div>
      </div>

      <div className="bg-white border border-[#FFDCD0] rounded-2xl overflow-x-auto shadow-xs">
        <table className="w-full text-left text-sm text-[#111111]">
          <thead className="bg-[#FFF6F1]/60 text-slate-700 uppercase text-[11px] font-bold tracking-wider border-b border-[#FFDCD0]">
            <tr>
              <th className="px-6 py-3.5 align-middle font-semibold">Account Name</th>
              <th className="px-6 py-3.5 align-middle font-semibold">Subscription Plan</th>
              <th className="px-6 py-3.5 align-middle font-semibold">Contract Value</th>
              <th className="px-6 py-3.5 align-middle font-semibold">Member Since</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#FFDCD0]">
            {customers.map((c) => (
              <tr key={c.id} className="hover:bg-orange-50/50 transition-colors">
                <td className="px-6 py-4 align-middle font-semibold text-[#111111]">{c.name}</td>
                <td className="px-6 py-4 align-middle text-slate-700 font-medium">{c.plan}</td>
                <td className="px-6 py-4 align-middle font-bold text-[#F26522]">{c.value}</td>
                <td className="px-6 py-4 align-middle text-[#475569] font-medium">{c.since}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CustomersPage;
