import React from 'react';
import { Target, Info, CheckCircle2 } from 'lucide-react';

export default function ProductCard({ item, index }) {
  return (
    <div className="card product-card fade-up" style={{ animationDelay: `${index * 0.1}s` }}>
      <div className="p-card-top">
        <div className="p-card-header">
          <div className="p-brand">
            <div className="p-icon"><Target size={18}/></div>
            <div>
              <h4>{item.product_name}</h4>
              <span className="p-provider">{item.provider} &bull; {item.product_type}</span>
            </div>
          </div>
          <div className="p-score-badge">
            {(item.score * 100).toFixed(0)}
          </div>
        </div>
      </div>
      
      <div className="p-card-body">
        <div className="p-metrics">
          <div className="p-metric">
            <span>Interest / Return</span>
            <strong>{item.interest_rate > 0 ? \`\${item.interest_rate}%\` : 'N/A'}</strong>
          </div>
          <div className="p-metric">
            <span>Min. Income</span>
            <strong>{item.min_income > 0 ? \`₹\${item.min_income.toLocaleString()}\` : 'Any'}</strong>
          </div>
          <div className="p-metric">
            <span>Annual Fee</span>
            <strong>{item.annual_fee > 0 ? \`₹\${item.annual_fee.toLocaleString()}\` : 'Free'}</strong>
          </div>
        </div>
        
        <div className="p-reasons">
          <div className="p-reasons-title"><Info size={14}/> Why this matches you:</div>
          <ul className="p-reason-list">
            {item.reasons.map((r, i) => (
              <li key={i}><CheckCircle2 size={12} color="var(--accent)"/> <span>{r}</span></li>
            ))}
          </ul>
        </div>
      </div>

      <style>{`
        .product-card {
          display: flex; flex-direction: column;
          overflow: hidden;
        }
        .p-card-top {
          padding: 20px;
          border-bottom: 1px solid var(--border);
          background: rgba(255,255,255,0.02);
        }
        .p-card-header {
          display: flex; justify-content: space-between; align-items: flex-start;
        }
        .p-brand {
          display: flex; gap: 12px;
        }
        .p-icon {
          width: 40px; height: 40px;
          border-radius: 10px;
          background: rgba(124, 111, 255, 0.1);
          color: var(--accent);
          display: flex; align-items: center; justify-content: center;
        }
        .p-brand h4 { font-size: 1.1rem; line-height: 1.2; margin-bottom: 4px; }
        .p-provider { font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
        .p-score-badge {
          background: var(--accent);
          color: #fff;
          font-weight: 800; font-size: 0.9rem;
          padding: 4px 10px;
          border-radius: 8px;
        }
        .p-card-body { padding: 20px; flex: 1; display: flex; flex-direction: column; }
        .p-metrics {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;
          margin-bottom: 24px;
        }
        .p-metric { display: flex; flex-direction: column; gap: 4px; }
        .p-metric span { font-size: 0.65rem; color: var(--text-muted); text-transform: uppercase; }
        .p-metric strong { font-size: 0.9rem; }
        
        .p-reasons {
          margin-top: auto;
          background: var(--bg-4);
          padding: 16px;
          border-radius: 10px;
        }
        .p-reasons-title {
          font-size: 0.75rem; font-weight: 700; color: var(--text-dim);
          display: flex; align-items: center; gap: 6px; margin-bottom: 12px;
        }
        .p-reason-list { display: flex; flex-direction: column; gap: 8px; }
        .p-reason-list li {
          display: flex; align-items: flex-start; gap: 8px;
          font-size: 0.8rem; color: var(--text-muted);
        }
        .p-reason-list li span { flex: 1; }
      `}</style>
    </div>
  );
}
