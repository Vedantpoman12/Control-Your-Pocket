import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import CartTracker from './pages/CartTracker';
import { LayoutDashboard, ShoppingCart, User, Bell } from 'lucide-react';

import './index.css';

function Sidebar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/', icon: <ShoppingCart size={18} />, label: 'Cart Analysis' },
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

  // Derive page title from route
  const pageTitles = {
    '/': 'Cart Analysis',
    '/dashboard': 'Dashboard',
    '/profile': 'Profile',
    '/home': 'Home',
  };
  const pageTitle = pageTitles[location.pathname] || 'Control Your Pocket';

  return (
    <header className="fixed top-0 right-0 left-0 md:left-72 z-50 bg-white/80 backdrop-blur-xl border-b border-border flex justify-between items-center px-12 py-5">
      <div className="flex items-center gap-8">
        <span className="text-lg font-bold tracking-tighter text-primary font-headline">{pageTitle}</span>
        <nav className="hidden lg:flex gap-6 text-[10px] font-headline font-bold uppercase tracking-widest">
          <Link to="/" className={isActive('/') ? 'text-primary border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-primary'}>Analysis</Link>
          <Link to="/dashboard" className={isActive('/dashboard') ? 'text-primary border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-primary'}>Overview</Link>
          <Link to="/profile" className={isActive('/profile') ? 'text-primary border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-primary'}>Profile</Link>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-surface-container rounded-full transition-colors text-primary shadow-sm border border-border">
          <Bell size={20} />
        </button>
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-sm border-2 border-primary/20">
          VP
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
              <Route path="/" element={<CartTracker />} />
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
