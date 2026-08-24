import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

function Layout() {
  const navItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/leads', label: 'Leads' },
    { path: '/customers', label: 'Customers' },
    { path: '/followups', label: 'Follow-ups' },
    { path: '/settings', label: 'Settings' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100">
      {/* Top Header Navigation */}
      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="h-9 w-9 rounded-lg bg-sky-500 flex items-center justify-center font-bold text-slate-950 text-xl">
                A
              </div>
              <span className="font-bold text-xl tracking-tight text-white">
                AI-Agentix <span className="text-sky-400">CRM</span>
              </span>
            </div>

            {/* Navigation Links */}
            <nav className="flex items-center space-x-1 sm:space-x-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            {/* User Profile / Login Link */}
            <div className="flex items-center space-x-3">
              <NavLink
                to="/login"
                className="px-3.5 py-1.5 rounded-lg text-sm font-medium text-slate-300 bg-slate-700 hover:bg-slate-600 hover:text-white transition-colors"
              >
                Sign In
              </NavLink>
            </div>
          </div>
        </div>
      </header>

      {/* Main Page Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 py-4 text-center text-xs text-slate-500">
        AI-Agentix-CRM &copy; {new Date().getFullYear()} — Production Ready Architecture
      </footer>
    </div>
  );
}

export default Layout;
