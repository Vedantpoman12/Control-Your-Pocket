import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import FinancialAnalyzer from './pages/FinancialAnalyzer';
import { LayoutDashboard, CreditCard, User, Bell } from 'lucide-react';
import { useCartStore } from './store/useCartStore';
import { motion, AnimatePresence } from 'framer-motion';

import './index.css';

function Sidebar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/', icon: <CreditCard size={18} />, label: 'Financial Analyser' },
    { path: '/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
    { path: '/profile', icon: <User size={18} />, label: 'Profile' },
  ];

  return (
    <aside className="h-screen w-72 flex-shrink-0 bg-white border-r border-border flex flex-col py-10 space-y-2 sticky top-0 font-body text-[10px] uppercase tracking-[0.2em] hidden md:flex">
      <div className="px-10 mb-12">
        <h1 className="font-headline font-black text-2xl text-primary">Control</h1>
        <p className="text-[9px] text-on-surface-variant tracking-[0.3em] uppercase mt-1">Your Pocket</p>
      </div>
      
      <nav className="flex-grow flex flex-col space-y-1">
        {navItems.map(({ path, icon, label }) => (
          <Link
            key={path}
            to={path}
            className={`flex items-center pl-10 py-4 transition-all duration-500 ease-in-out ${
              isActive(path)
                ? 'text-primary font-bold bg-surface-container rounded-xl mx-4'
                : 'text-on-surface-variant hover:bg-surface-container-low'
            }`}
          >
            <span className="mr-4">{icon}</span>
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

function Header() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const pageTitles = {
    '/': 'Financial Analyser',
    '/dashboard': 'Dashboard',
    '/profile': 'Profile',
    '/home': 'Home',
  };
  const pageTitle = pageTitles[location.pathname] || 'Control Your Pocket';
  const { notification, notificationsList, clearNotifications } = useCartStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [readCount, setReadCount] = useState(0);

  const unreadCount = Math.max(0, (notificationsList?.length || 0) - readCount);

  const handleBellClick = () => {
    setIsDropdownOpen(v => !v);
    setProfileOpen(false);
    if (!isDropdownOpen) setReadCount(notificationsList?.length || 0);
  };

  const handleProfileClick = () => {
    setProfileOpen(v => !v);
    setIsDropdownOpen(false);
  };

  // Avatar URL — DiceBear "notionists" style, seeded to "VP"
  const avatarUrl = `https://api.dicebear.com/9.x/notionists/svg?seed=VedantPoman&backgroundColor=b6e3f4,c0aede&scale=85`;

  return (
    <header className="fixed top-0 right-0 left-0 md:left-72 z-50 bg-white/80 backdrop-blur-xl border-b border-border flex justify-between items-center px-12 py-4">
      <div className="flex items-center gap-8">
        <span className="text-lg font-bold tracking-tighter text-primary font-headline">{pageTitle}</span>
        <nav className="hidden lg:flex gap-6 text-[10px] font-headline font-bold uppercase tracking-widest">
          <Link to="/" className={isActive('/') ? 'text-primary border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-primary'}>Analysis</Link>
          <Link to="/dashboard" className={isActive('/dashboard') ? 'text-primary border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-primary'}>Overview</Link>
          <Link to="/profile" className={isActive('/profile') ? 'text-primary border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-primary'}>Profile</Link>
        </nav>
      </div>

      <div className="flex items-center gap-3">

        {/* ── Toast notification pill ─────────────────────────────── */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.9 }}
              className="flex items-center gap-2 bg-[#001b3f] text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full whitespace-nowrap shadow-lg pointer-events-none z-50"
            >
              <span className="w-1.5 h-1.5 bg-[#58cc02] rounded-full animate-pulse" />
              {notification}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Bell button ─────────────────────────────────────────── */}
        <div className="relative">
          <button
            id="notification-bell"
            onClick={handleBellClick}
            className="relative w-10 h-10 flex items-center justify-center hover:bg-surface-container rounded-full transition-colors text-primary border border-border"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-[#ef4444] text-white text-[9px] font-black rounded-full flex items-center justify-center px-1 border-2 border-white shadow"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </motion.span>
            )}
          </button>

          {/* Notification dropdown */}
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.97 }}
                transition={{ duration: 0.18 }}
                className="absolute top-14 right-0 w-96 bg-white border border-border shadow-2xl rounded-2xl overflow-hidden z-50"
              >
                {/* Header */}
                <div className="px-5 py-4 border-b border-border flex justify-between items-center bg-surface-container-low">
                  <div className="flex items-center gap-2">
                    <Bell size={14} className="text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="text-[9px] font-black bg-[#ef4444] text-white px-2 py-0.5 rounded-full">{unreadCount} new</span>
                    )}
                  </div>
                  {notificationsList?.length > 0 && (
                    <button
                      onClick={() => { clearNotifications(); setReadCount(0); setIsDropdownOpen(false); }}
                      className="text-[9px] font-bold text-on-surface-variant hover:text-primary transition-colors"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                {/* List */}
                <div className="max-h-72 overflow-y-auto divide-y divide-border">
                  {!notificationsList?.length ? (
                    <div className="py-12 flex flex-col items-center gap-3 text-center">
                      <div className="w-12 h-12 bg-surface-container rounded-full flex items-center justify-center">
                        <Bell size={20} className="text-border" />
                      </div>
                      <p className="text-xs text-on-surface-variant font-medium">You're all caught up!</p>
                      <p className="text-[10px] text-on-surface-variant/60">No notifications yet.</p>
                    </div>
                  ) : (
                    notificationsList.map((item, idx) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.04 }}
                        className={`px-5 py-4 hover:bg-surface-container-low transition-colors flex gap-3 items-start ${idx >= readCount ? 'bg-secondary/5' : ''}`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${idx >= readCount ? 'bg-secondary/20 text-secondary' : 'bg-surface-container text-on-surface-variant'}`}>
                          <Bell size={13} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-primary leading-snug">{item.msg}</p>
                          <p className="text-[10px] text-on-surface-variant mt-1 font-bold">{item.time}</p>
                        </div>
                        {idx >= readCount && (
                          <span className="w-2 h-2 bg-secondary rounded-full shrink-0 mt-2" />
                        )}
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Profile Avatar ──────────────────────────────────────── */}
        <div className="relative">
          <button
            id="profile-avatar-btn"
            onClick={handleProfileClick}
            className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20 hover:border-secondary transition-all shadow-sm hover:shadow-md hover:scale-105 active:scale-95 duration-200"
          >
            <img
              src={avatarUrl}
              alt="Your profile"
              className="w-full h-full object-cover bg-[#c0aede]"
              onError={e => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = '<span class="w-full h-full flex items-center justify-center text-primary font-black text-sm bg-primary/10">VP</span>';
              }}
            />
          </button>

          {/* Profile mini-dropdown */}
          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.97 }}
                transition={{ duration: 0.18 }}
                className="absolute top-14 right-0 w-56 bg-white border border-border shadow-2xl rounded-2xl overflow-hidden z-50"
              >
                <div className="p-4 border-b border-border bg-surface-container-low flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20 shrink-0">
                    <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover bg-[#c0aede]" />
                  </div>
                  <div>
                    <p className="font-black text-sm text-primary">Vedant Poman</p>
                    <p className="text-[10px] text-on-surface-variant">Financial Analyser</p>
                  </div>
                </div>
                <div className="p-2">
                  <Link
                    to="/profile"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-primary hover:bg-surface-container transition-colors"
                  >
                    Edit Profile
                  </Link>
                  <Link
                    to="/dashboard"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-primary hover:bg-surface-container transition-colors"
                  >
                    Dashboard
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </header>
  );
}

function App() {
  return (
    <Router>
      <div className="flex bg-surface min-h-screen">
        <Sidebar />
        <div className="flex-grow flex flex-col min-w-0">
          <Header />
          <main className="mt-20 p-8 md:p-12 max-w-[1400px]">
            <Routes>
              <Route path="/" element={<FinancialAnalyzer />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/home" element={<Home />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
