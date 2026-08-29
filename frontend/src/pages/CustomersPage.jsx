import React from 'react';

function CustomersPage() {
  const customers = [
    { id: 'c1', name: 'Acme Enterprise', plan: 'Pro Annual', value: '$12,000/yr', since: '2024-01-15' },
    { id: 'c2', name: 'Global Tech Solutions', plan: 'Enterprise', value: '$45,000/yr', since: '2023-11-01' },
  ];

  return (
    <div className="space-y-6 text-[#111111]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#111111] tracking-tight">Active Customers</h1>
          <p className="text-sm text-[#475569]">Directory of converted clients and accounts</p>
        </div>
      </div>

      <div className="bg-white border border-[#FFDCD0] rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm text-[#111111]">
          <thead className="bg-[#FFF6F1]/50 text-slate-700 uppercase text-xs border-b border-[#FFDCD0]">
            <tr>
              <th className="px-6 py-3 font-semibold">Account Name</th>
              <th className="px-6 py-3 font-semibold">Subscription Plan</th>
              <th className="px-6 py-3 font-semibold">Contract Value</th>
              <th className="px-6 py-3 font-semibold">Member Since</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#FFDCD0]">
            {customers.map((c) => (
              <tr key={c.id} className="hover:bg-orange-50/50 transition-colors">
                <td className="px-6 py-4 font-medium text-[#111111]">{c.name}</td>
                <td className="px-6 py-4 text-slate-700">{c.plan}</td>
                <td className="px-6 py-4 font-bold text-[#F26522]">{c.value}</td>
                <td className="px-6 py-4 text-[#475569]">{c.since}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CustomersPage;
