import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';

function LoginPage() {
  const [email, setEmail] = useState('admin@agentix.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    try {
      const data = await login({ email, password });
      setAlert({ type: 'success', message: `Welcome back, ${data.user.name}!` });
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Authentication failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-4 sm:my-12 bg-white border border-[#FFDCD0] rounded-2xl p-5 sm:p-8 shadow-xl text-[#111111]">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-[#111111] mb-2">Sign In</h1>
        <p className="text-sm text-[#475569]">Enter your credentials to access AI-Agentix CRM.</p>
      </div>

      {alert && (
        <div
          className={`p-3 rounded-lg text-xs font-medium mb-4 ${
            alert.type === 'success'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-rose-50 text-rose-700 border border-rose-200'
          }`}
        >
          {alert.message}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@agentix.com"
            required
            className="crm-input"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="crm-input"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="crm-button-primary w-full"
        >
          {loading ? (
            <>
              <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Authenticating...
            </>
          ) : (
            'Sign In'
          )}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
