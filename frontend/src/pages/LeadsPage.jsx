import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getLeads } from '../services/leadService';

function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const data = await getLeads();
        if (data?.success) {
          setLeads(data.leads);
        }
      } catch (err) {
        console.error('Error fetching leads:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Leads Pipeline</h1>
          <p className="text-sm text-slate-400">Manage and track your prospect pipeline via Backend API</p>
        </div>
        <button className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold px-4 py-2 rounded-lg text-sm transition-colors shadow-md">
          + Add Lead
        </button>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-lg">
        {loading ? (
          <div className="p-8 text-center text-slate-400 text-sm">Loading leads from API...</div>
        ) : (
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/50 text-slate-400 uppercase text-xs border-b border-slate-700">
              <tr>
                <th className="px-6 py-3">Lead Name</th>
                <th className="px-6 py-3">Company</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">AI Score</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-700/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{lead.name}</td>
                  <td className="px-6 py-4">{lead.company}</td>
                  <td className="px-6 py-4">
                    <span className="bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2.5 py-0.5 rounded-full text-xs font-medium">
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-emerald-400">{lead.score}/100</td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      to={`/leads/${lead.id}`}
                      className="text-sky-400 hover:text-sky-300 font-medium text-xs underline underline-offset-4"
                    >
                      View Details &rarr;
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default LeadsPage;
