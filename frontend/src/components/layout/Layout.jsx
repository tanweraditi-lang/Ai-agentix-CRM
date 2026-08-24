import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    {
      path: '/',
      label: 'Dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
    {
      path: '/leads',
      label: 'Leads',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      path: '/customers',
      label: 'Customers',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      path: '/followups',
      label: 'Follow Up',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      path: '/settings',
      label: 'Settings',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#FCE7F3] text-[#111827]">
      {/* Mobile Header Bar */}
      <div className="md:hidden bg-white border-b border-[#FBCFE8] p-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-lg bg-[#EC4899] flex items-center justify-center font-bold text-white text-lg">
            A
          </div>
          <span className="font-bold text-lg text-[#111827]">
            AI-Agentix <span className="text-[#EC4899]">CRM</span>
          </span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg text-slate-700 hover:bg-[#FCE7F3]"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {/* Professional Vertical Left Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 z-40 h-screen w-64 bg-white border-r border-[#FBCFE8] flex flex-col justify-between shrink-0 shadow-sm transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Sidebar Top: Brand & Menu */}
        <div className="flex flex-col flex-1">
          {/* Brand Logo Header */}
          <div className="p-6 border-b border-[#FBCFE8] flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-[#EC4899] flex items-center justify-center font-bold text-white text-2xl shadow-sm">
              A
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight text-[#111827]">
                AI-Agentix <span className="text-[#EC4899]">CRM</span>
              </h1>
              <p className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Enterprise Suite</p>
            </div>
          </div>

          {/* Vertical Menu Items (Y-Axis Direction) */}
          <div className="px-3 py-6 flex-1">
            <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">
              Main Menu
            </p>
            <nav id="nav" className="flex flex-col space-y-1.5">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ease-in-out ${
                      isActive
                        ? 'bg-[#FCE7F3] text-[#BE185D] font-bold border-l-4 border-[#EC4899] shadow-xs pl-4'
                        : 'text-slate-700 hover:bg-pink-50 hover:text-[#BE185D] hover:pl-5'
                    }`
                  }
                >
                  <span className="transition-transform duration-200 group-hover:scale-110">{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        </div>

        {/* Sidebar Bottom: Sign In & User Account */}
        <div className="p-4 border-t border-[#FBCFE8] bg-pink-50/40">
          <NavLink
            to="/login"
            onClick={() => setMobileOpen(false)}
            className="flex items-center justify-center space-x-2 w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-[#EC4899] hover:bg-[#BE185D] transition-all duration-200 shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            <span>Sign In</span>
          </NavLink>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-[#FBCFE8] py-4 px-8 text-center text-xs text-slate-500">
          AI-Agentix-CRM &copy; {new Date().getFullYear()} — Professional Sidebar CRM Edition
        </footer>
      </div>
    </div>
  );
}

export default Layout;
