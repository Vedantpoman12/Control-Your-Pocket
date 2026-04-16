import { Link } from 'react-router-dom';
import { ArrowRight, ShieldAlert, Sparkles, TrendingUp } from 'lucide-react';

export default function Home() {
  return (
    <div className="home fade-up">
      <div className="hero">
        <div className="hero-badge">AI-Powered Financial Intelligence</div>
        <h1 className="hero-title">
          Master Your Wealth with <br />
          <span className="gradient-text">Control Your Pocket.</span>
        </h1>
        <p className="hero-subtitle">
          Discover mutual funds, insurance, credit cards, and loans perfectly matched to your real-world risk profile, spending habits, and CIBIL score.
        </p>
        <div className="hero-actions">
          <Link to="/profile" className="btn btn-primary" style={{ padding: '16px 32px', fontSize: '1.05rem' }}>
            Get My Recommendations <ArrowRight size={18} />
          </Link>
          <Link to="/products" className="btn btn-outline" style={{ padding: '16px 32px', fontSize: '1.05rem' }}>
            Browse Catalog
          </Link>
        </div>
      </div>

      <div className="features">
        <div className="card feature-card fade-up" style={{ animationDelay: '0.1s' }}>
          <div className="feature-icon"><ShieldAlert size={28} /></div>
          <h3>Risk-Aware Matching</h3>
          <p>We analyze your income and CIBIL score to calculate a true risk profile, matching you with products you actually qualify for.</p>
        </div>
        <div className="card feature-card fade-up" style={{ animationDelay: '0.2s' }}>
          <div className="feature-icon"><Sparkles size={28} /></div>
          <h3>Smart Credit Cards</h3>
          <p>Tell us where you spend most, and we'll scan 300+ Indian credit cards to find the one with the maximum reward multiplier for you.</p>
        </div>
        <div className="card feature-card fade-up" style={{ animationDelay: '0.3s' }}>
          <div className="feature-icon"><TrendingUp size={28} /></div>
          <h3>Explainable AI</h3>
          <p>See exactly why a product was recommended. Our SHAP-powered engine provides full transparency into your risk score factors.</p>
        </div>
      </div>

      <style>{`
        .home {
          max-width: 1200px;
          margin: 0 auto;
          padding: 80px 24px;
        }
        .hero {
          text-align: center;
          max-width: 800px;
          margin: 0 auto 100px;
        }
        .hero-badge {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          padding: 6px 16px;
          border-radius: 999px;
          background: var(--bg-3);
          border: 1px solid var(--border-2);
          color: var(--accent-2);
          margin-bottom: 32px;
        }
        .hero-title {
          font-size: 4rem;
          font-weight: 900;
          line-height: 1.1;
          letter-spacing: -0.03em;
          margin-bottom: 24px;
        }
        .hero-subtitle {
          font-size: 1.25rem;
          color: var(--text-muted);
          margin-bottom: 48px;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }
        .hero-actions {
          display: flex;
          justify-content: center;
          gap: 16px;
        }
        .features {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
        }
        .feature-card {
          padding: 40px 32px;
          transition: transform var(--t);
        }
        .feature-card:hover {
          transform: translateY(-5px);
        }
        .feature-icon {
          width: 64px; height: 64px;
          border-radius: 16px;
          background: rgba(124, 111, 255, 0.1);
          color: var(--accent);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 24px;
        }
        .feature-card h3 {
          font-size: 1.4rem;
          font-weight: 700;
          margin-bottom: 12px;
        }
        .feature-card p {
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
}
