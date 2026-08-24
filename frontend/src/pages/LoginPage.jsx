import React from 'react';

function LoginPage() {
  return (
    <div className="max-w-md mx-auto mt-12 bg-slate-800 border border-slate-700 rounded-xl p-8 shadow-xl">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Sign In</h1>
        <p className="text-sm text-slate-400">Enter your credentials to access your CRM account.</p>
      </div>
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
          <input
            type="email"
            placeholder="admin@agentix.com"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold py-2.5 rounded-lg transition-colors shadow-md"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
