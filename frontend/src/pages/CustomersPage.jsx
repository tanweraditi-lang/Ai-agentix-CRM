import React from 'react';

function CustomersPage() {
  const customers = [
    { id: 'c1', name: 'Acme Enterprise', plan: 'Pro Annual', value: '$12,000/yr', since: '2024-01-15' },
    { id: 'c2', name: 'Global Tech Solutions', plan: 'Enterprise', value: '$45,000/yr', since: '2023-11-01' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Active Customers</h1>
          <p className="text-sm text-slate-400">Directory of converted clients and accounts</p>
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-lg">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-900/50 text-slate-400 uppercase text-xs border-b border-slate-700">
            <tr>
              <th className="px-6 py-3">Account Name</th>
              <th className="px-6 py-3">Subscription Plan</th>
              <th className="px-6 py-3">Contract Value</th>
              <th className="px-6 py-3">Member Since</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {customers.map((c) => (
              <tr key={c.id} className="hover:bg-slate-700/50 transition-colors">
                <td className="px-6 py-4 font-medium text-white">{c.name}</td>
                <td className="px-6 py-4">{c.plan}</td>
                <td className="px-6 py-4 font-semibold text-emerald-400">{c.value}</td>
                <td className="px-6 py-4 text-slate-400">{c.since}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CustomersPage;
