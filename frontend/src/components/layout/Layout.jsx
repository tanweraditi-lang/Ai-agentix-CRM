import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

function Layout() {
  const navItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/leads', label: 'Leads' },
    { path: '/customers', label: 'Customers' },
    { path: '/followups', label: 'Follow Up' },
    { path: '/settings', label: 'Settings' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FCE7F3] text-[#111827]">
      {/* Top Header Navigation */}
      <header className="bg-white border-b border-[#FBCFE8] sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Brand Logo & Name */}
            <div className="flex items-center space-x-3 shrink-0">
              <div className="h-9 w-9 rounded-lg bg-[#EC4899] flex items-center justify-center font-bold text-white text-xl shadow-sm">
                A
              </div>
              <span className="font-bold text-xl tracking-tight text-[#111827]">
                AI-Agentix <span className="text-[#EC4899]">CRM</span>
              </span>
            </div>

            {/* Horizontal X-Axis Navigation Bar (#nav) */}
            <nav id="nav" className="flex flex-row items-center space-x-1 sm:space-x-4 overflow-x-auto scrollbar-none py-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    `px-3.5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex items-center ${
                      isActive
                        ? 'bg-[#FCE7F3] text-[#BE185D] border border-[#FBCFE8] font-bold shadow-xs'
                        : 'text-slate-700 hover:bg-pink-50 hover:text-[#BE185D]'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            {/* User Profile / Login Link */}
            <div className="flex items-center space-x-3 shrink-0">
              <NavLink
                to="/login"
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-[#EC4899] hover:bg-[#BE185D] transition-colors shadow-sm"
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
      <footer className="bg-white border-t border-[#FBCFE8] py-4 text-center text-xs text-slate-500">
        AI-Agentix-CRM &copy; {new Date().getFullYear()} — Premium Soft Pink Edition
      </footer>
    </div>
  );
}

export default Layout;
