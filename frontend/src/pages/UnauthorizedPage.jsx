import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react';

function UnauthorizedPage() {
  const navigate = useNavigate();
  const userStr = localStorage.getItem('user');
  let userRole = 'Agent';
  try {
    const user = userStr ? JSON.parse(userStr) : null;
    if (user && user.role) userRole = user.role;
  } catch {}

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border border-[#FFDCD0] rounded-3xl p-6 sm:p-8 shadow-lg text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-orange-100 border border-[#FFDCD0] text-[#F26522] flex items-center justify-center mx-auto shadow-xs">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#F26522] bg-[#FFF6F1] px-3 py-1 rounded-full border border-[#FFDCD0]">
            403 Access Denied
          </span>
          <h1 className="text-2xl font-extrabold text-[#111111] tracking-tight mt-3">
            Unauthorized Action
          </h1>
          <p className="text-xs text-[#475569] mt-2 leading-relaxed">
            Your assigned role is <span className="font-bold text-[#111111] capitalize">[{userRole}]</span>. 
            Agents have limited administrative permissions and cannot manage users or change system-wide security policies.
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#FFF6F1]/60 border border-[#FFDCD0] text-left text-xs text-slate-700 flex items-start gap-3">
          <Lock className="w-4 h-4 text-[#F26522] shrink-0 mt-0.5" />
          <p>
            If you require elevated <span className="font-bold">Admin</span> privileges, please contact your workspace administrator.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#F26522] to-[#D9531E] text-white font-bold text-xs shadow-sm hover:opacity-95 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default UnauthorizedPage;
