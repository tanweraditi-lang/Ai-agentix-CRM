import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { logout } from '../../services/authService';
import {
  LayoutDashboard,
  Users,
  Building2,
  CalendarClock,
  Settings,
  LogOut,
  LogIn,
  Menu,
  X,
  Search,
  Bell,
  Sparkles,
} from 'lucide-react';

function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const searchInputRef = useRef(null);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/leads?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileOpen(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const checkAuthStatus = () => {
    const token = localStorage.getItem('token');
    const savedUserStr = localStorage.getItem('user');
    if (token || savedUserStr) {
      let parsedUser = null;
      try {
        parsedUser = savedUserStr ? JSON.parse(savedUserStr) : null;
      } catch {
        parsedUser = null;
      }
      setUser(parsedUser || { name: 'Admin User', role: 'admin' });
      setIsAuthenticated(true);
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return Boolean(localStorage.getItem('token') || localStorage.getItem('user'));
  });

  const [user, setUser] = useState(() => {
    try {
      const savedUserStr = localStorage.getItem('user');
      return savedUserStr
        ? JSON.parse(savedUserStr)
        : localStorage.getItem('token')
        ? { name: 'Admin User', role: 'admin' }
        : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    checkAuthStatus();
  }, [location.pathname]);

  useEffect(() => {
    window.addEventListener('storage', checkAuthStatus);
    return () => window.removeEventListener('storage', checkAuthStatus);
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsAuthenticated(false);
    setUser(null);
    setMobileOpen(false);
    navigate('/login');
  };

  const getUserName = (usr) => {
    if (!usr) return 'Admin User';
    if (usr.name) return usr.name;
    if (usr.first_name || usr.last_name) {
      return [usr.first_name, usr.last_name].filter(Boolean).join(' ');
    }
    return usr.email || 'Admin User';
  };

  const getUserInitials = (usr) => {
    const name = getUserName(usr);
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const navItems = [
    {
      path: '/',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      path: '/leads',
      label: 'Leads',
      icon: <Users className="w-5 h-5" />,
    },
    {
      path: '/customers',
      label: 'Customers',
      icon: <Building2 className="w-5 h-5" />,
    },
    {
      path: '/followups',
      label: 'Follow Up',
      icon: <CalendarClock className="w-5 h-5" />,
    },
    {
      path: '/settings',
      label: 'Settings',
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#FFF6F1] text-[#111111] overflow-x-hidden">
      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Professional Vertical Left Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 z-50 h-screen w-64 bg-white border-r border-[#FFDCD0] flex flex-col justify-between shrink-0 shadow-lg md:shadow-sm transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Sidebar Top: Brand & Menu */}
        <div className="flex flex-col flex-1 min-h-0">
          {/* Brand Logo Header */}
          <div className="p-4 sm:p-5 border-b border-[#FFDCD0] flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-tr from-[#F26522] to-[#D9531E] flex items-center justify-center font-bold text-white shadow-md shadow-orange-500/20">
                <Sparkles className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h1 className="font-bold text-base sm:text-lg tracking-tight text-[#111111]">
                  AI-Agentix <span className="text-[#F26522]">CRM</span>
                </h1>
                <p className="text-[10px] uppercase font-semibold text-[#475569] tracking-wider">Enterprise Suite</p>
              </div>
            </div>
            {/* Mobile close button */}
            <button
              onClick={() => setMobileOpen(false)}
              className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-orange-50"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Vertical Menu Items */}
          <div className="px-3 py-4 sm:py-6 flex-1 overflow-y-auto">
            <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-[#475569] mb-3">
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
                        ? 'bg-[#FFF6F1] text-[#F26522] font-bold border-l-4 border-[#F26522] shadow-xs pl-4'
                        : 'text-slate-700 hover:bg-orange-50 hover:text-[#F26522] hover:pl-5'
                    }`
                  }
                >
                  <span className="transition-transform duration-200">{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        </div>

        {/* Sidebar Bottom: Sign In or Logout */}
        <div className="p-4 border-t border-[#FFDCD0] bg-orange-50/40">
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="flex items-center justify-center space-x-2 w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#F26522] to-[#D9531E] hover:opacity-95 transition-all duration-200 shadow-sm cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          ) : (
            <NavLink
              to="/login"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center space-x-2 w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#F26522] to-[#D9531E] hover:opacity-95 transition-all duration-200 shadow-sm"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </NavLink>
          )}
        </div>
      </aside>

      {/* Main Content Container */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Navbar */}
        <header className="bg-white border-b border-[#FFDCD0] sticky top-0 z-20 shadow-xs px-3 sm:px-6 md:px-8 py-3 flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 max-w-md">
            {/* Mobile Sidebar Toggle Button */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-[#FFF6F1] border border-[#FFDCD0] shrink-0"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Top Bar Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative w-full max-w-[150px] xs:max-w-[200px] sm:max-w-xs">
              <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search leads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 sm:pl-9 pr-2 sm:pr-12 h-10 bg-[#FFF6F1]/40 border border-[#FFDCD0] rounded-xl text-xs text-[#111111] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F26522]/30 focus:border-[#F26522] transition-all"
              />
              <kbd
                onClick={() => searchInputRef.current?.focus()}
                className="hidden sm:inline-block absolute right-2.5 top-2.5 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white border border-[#FFDCD0] rounded shadow-2xs cursor-pointer select-none"
              >
                ⌘K
              </kbd>
            </form>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Quick Status Pill */}
            <div className="hidden lg:flex items-center gap-1.5 bg-orange-50 border border-[#FFDCD0] px-3 py-1 rounded-full text-xs text-[#F26522] font-medium">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live CRM Workspace
            </div>

            {/* Notification Bell */}
            <button className="relative p-1.5 sm:p-2 rounded-xl text-slate-600 hover:text-[#F26522] hover:bg-orange-50 border border-transparent hover:border-[#FFDCD0] transition-all">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 w-2 h-2 bg-[#F26522] rounded-full ring-2 ring-white"></span>
            </button>

            {/* User Profile Avatar / Action */}
            <div className="flex items-center gap-2 sm:gap-3 pl-1.5 sm:pl-2 border-l border-[#FFDCD0]">
              <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-[#FFF6F1] border border-[#FFDCD0] text-[#F26522] font-bold flex items-center justify-center text-xs sm:text-sm shadow-2xs">
                {isAuthenticated ? getUserInitials(user) : 'GU'}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-[#111111] leading-tight">
                  {isAuthenticated ? getUserName(user) : 'Guest User'}
                </p>
                <p className="text-[10px] text-[#475569] leading-tight capitalize">
                  {isAuthenticated ? (user?.role || 'CRM Manager') : 'Not Logged In'}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-3 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-[#FFDCD0] py-3 sm:py-4 px-4 sm:px-8 text-center text-xs text-[#475569]">
          AI-Agentix-CRM &copy; {new Date().getFullYear()} — Enterprise Orange Edition
        </footer>
      </div>
    </div>
  );
}

export default Layout;
