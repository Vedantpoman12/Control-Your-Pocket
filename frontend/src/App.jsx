import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import { LayoutDashboard, User, ShieldCheck, Wallet, ArrowRight } from 'lucide-react';
import './index.css';

function Navbar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="brand">
          <div className="brand-logo">
            <ShieldCheck size={22} color="var(--bg)" strokeWidth={2.5} />
          </div>
          <span className="brand-text">Control <span className="gradient-text">Your Pocket</span></span>
        </Link>
        <ul className="nav-links">
          <li>
            <Link to="/products" className={`nav-link ${isActive('/products')}`}>
              <Wallet size={16} /> Products
            </Link>
          </li>
          <li>
            <Link to="/profile" className={`nav-link ${isActive('/profile')}`}>
              <User size={16} /> Profile
            </Link>
          </li>
          <li>
            <Link to="/dashboard" className="btn btn-primary" style={{ padding: '8px 16px', gap: '6px' }}>
              Dashboard <ArrowRight size={14} />
            </Link>
          </li>
        </ul>
      </div>
      <style>{`
        .navbar {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(8, 8, 16, 0.7);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border);
          padding: 16px 0;
        }
        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .brand-logo {
          width: 32px; height: 32px;
          background: linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
        }
        .brand-text {
          font-size: 1.15rem;
          font-weight: 800;
          letter-spacing: -0.02em;
        }
        .nav-links {
          display: flex;
          align-items: center;
          gap: 24px;
        }
        .nav-link {
          display: flex; align-items: center; gap: 8px;
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-muted);
          transition: var(--t);
        }
        .nav-link:hover, .nav-link.active {
          color: var(--text);
        }
      `}</style>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - 70px)' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
