import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { login } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, LogIn, UserCheck, Lock, Sparkles } from 'lucide-react';

function LoginPage() {
  const [email, setEmail] = useState('admin@agentix.com');
  const [password, setPassword] = useState('password123');
  const [selectedRole, setSelectedRole] = useState('admin');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loginSuccess, isAuthenticated } = useAuth();

  useEffect(() => {
    if (searchParams.get('expired') === '1') {
      setAlert({
        type: 'error',
        message: 'Your session token has expired. Please sign in again.',
      });
    } else if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [searchParams, isAuthenticated, navigate]);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    if (role === 'admin') {
      setEmail('admin@agentix.com');
      setPassword('password123');
    } else {
      setEmail('agent@agentix.com');
      setPassword('password123');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    try {
      const data = await login({ email, password });
      if (data?.token && data?.user) {
        loginSuccess(data.token, data.user);
      }
      
      const userName = data.user?.name || data.user?.first_name || 'User';
      const userRole = data.user?.role || 'Agent';

      setAlert({
        type: 'success',
        message: `Welcome back, ${userName}! Signed in as [${userRole}].`,
      });

      setTimeout(() => {
        navigate('/', { replace: true });
      }, 500);
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Authentication failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-4 sm:my-10 bg-white border border-[#FFDCD0] rounded-3xl p-6 sm:p-8 shadow-xl text-[#111111]">
      <div className="text-center mb-6 space-y-1">
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-orange-100 border border-[#FFDCD0] text-[#F26522] mb-1 shadow-xs">
          <Sparkles className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-extrabold text-[#111111] tracking-tight">AI-Agentix CRM Login</h1>
        <p className="text-xs text-[#475569]">Sign in to access your AI Chatbot CRM workspace.</p>
      </div>

      {/* Role Quick Selector */}
      <div className="mb-5 p-1 bg-[#FFF6F1] rounded-2xl border border-[#FFDCD0] flex items-center">
        <button
          type="button"
          onClick={() => handleRoleSelect('admin')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            selectedRole === 'admin'
              ? 'bg-[#F26522] text-white shadow-xs'
              : 'text-slate-600 hover:text-[#F26522]'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Admin Demo</span>
        </button>
        <button
          type="button"
          onClick={() => handleRoleSelect('agent')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            selectedRole === 'agent'
              ? 'bg-[#F26522] text-white shadow-xs'
              : 'text-slate-600 hover:text-[#F26522]'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Agent Demo</span>
        </button>
      </div>

      {alert && (
        <div
          className={`p-3.5 rounded-xl text-xs font-semibold mb-4 flex items-center gap-2 ${
            alert.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {alert.message}
        </div>
      )}

      <form className="space-y-4 text-xs" onSubmit={handleSubmit}>
        <div>
          <label className="block font-bold text-slate-700 mb-1">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@agentix.com"
            required
            className="w-full p-3 bg-[#FFF6F1]/30 border border-[#FFDCD0] rounded-xl text-xs text-[#111111] focus:ring-2 focus:ring-[#F26522]/30 focus:border-[#F26522]"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full p-3 bg-[#FFF6F1]/30 border border-[#FFDCD0] rounded-xl text-xs text-[#111111] focus:ring-2 focus:ring-[#F26522]/30 focus:border-[#F26522]"
          />
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <Lock className="w-3.5 h-3.5 text-[#F26522]" /> Role Selected:
          </span>
          <span className="font-bold text-[#111111] capitalize">[{selectedRole}]</span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#F26522] to-[#D9531E] text-white font-bold text-xs shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <>
              <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>Authenticating...</span>
            </>
          ) : (
            <>
              <LogIn className="w-4 h-4" />
              <span>Sign In to CRM</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
