import React from 'react';
import { CreditCard, Sparkles } from 'lucide-react';

export default function CreditCardCard({ card, index }) {
  return (
    <div className="card cc-card fade-up" style={{ animationDelay: `${index * 0.1}s` }}>
      <div className="cc-header">
        <CreditCard size={20} color="var(--accent)"/>
        <div className="cc-bank">{card.bank}</div>
      </div>
      
      <div className="cc-body">
        <h3>{card.card_name}</h3>
        <div className="cc-tags">
          <span className="pill pill-accent">{card.best_category.replace('_', ' ')}</span>
          <span className="pill pill-green">{card.points_rate}x Points</span>
        </div>
      </div>
      
      <div className="cc-footer">
        <p className="cc-reason"><Sparkles size={12}/> {card.reason}</p>
      </div>

      <style>{`
        .cc-card {
          padding: 20px;
          background: linear-gradient(145deg, var(--bg-2) 0%, var(--bg-3) 100%);
          border-top: 2px solid var(--accent);
          display: flex; flex-direction: column;
        }
        .cc-header {
          display: flex; align-items: center; gap: 8px;
          margin-bottom: 16px;
        }
        .cc-bank {
          font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em;
          color: var(--text-muted); font-weight: 700;
        }
        .cc-body h3 {
          font-size: 1.1rem; font-weight: 700;
          margin-bottom: 12px;
        }
        .cc-tags {
          display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px;
        }
        .cc-footer {
          margin-top: auto;
          padding-top: 16px;
          border-top: 1px solid var(--border);
        }
        .cc-reason {
          font-size: 0.75rem; color: var(--text-muted);
          display: flex; align-items: flex-start; gap: 6px; line-height: 1.5;
        }
        .cc-reason svg { flex-shrink: 0; margin-top: 2px; color: var(--accent-2); }
      `}</style>
    </div>
  );
}
