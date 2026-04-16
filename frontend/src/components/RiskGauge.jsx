import React from 'react';
import { Activity } from 'lucide-react';

export default function RiskGauge({ prediction }) {
  if (!prediction) return null;

  const { risk_level, confidence, shap_explanation } = prediction;
  const riskClass = `risk-${risk_level.toLowerCase()}`;

  // Basic gauge visualization
  const getRotation = () => {
    if (risk_level === 'Low') return -60;
    if (risk_level === 'Medium') return 0;
    return 60;
  };

  return (
    <div className="card risk-card fade-up">
      <div className="risk-header">
        <h3 className="section-label"><Activity size={14}/> Risk Profile Engine</h3>
        <div className={`pill ${riskClass}`}>{risk_level} Risk</div>
      </div>

      <div className="gauge-container">
        <div className="gauge">
          <div className="gauge-bg"></div>
          <div className="gauge-needle" style={{ transform: `rotate(${getRotation()}deg)` }}></div>
          <div className="gauge-center">
            <span className="gauge-text">{Math.round(confidence * 100)}%</span>
            <span className="gauge-sub">Confidence</span>
          </div>
        </div>
      </div>

      <div className="shap-container">
        <h4 style={{fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px'}}>Top Contributing Factors (SHAP)</h4>
        {Object.entries(shap_explanation || {})
          .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
          .slice(0, 4)
          .map(([feat, val]) => (
            <div key={feat} className="shap-row">
              <span className="shap-label">
                {feat.replace('_enc', '').replace(/_/g, ' ')}
              </span>
              <div className="shap-bar-container">
                <div 
                  className="shap-bar" 
                  style={{
                    width: `${Math.min(Math.abs(val) * 50, 100)}%`,
                    background: val < 0 ? 'var(--green)' : 'var(--red)',
                    marginLeft: val < 0 ? 'auto' : '0',
                    marginRight: val < 0 ? '0' : 'auto'
                  }}
                />
              </div>
              <span className="shap-val" style={{color: val < 0 ? 'var(--green)' : 'var(--red)'}}>
                {val > 0 ? '+' : ''}{val.toFixed(2)}
              </span>
            </div>
          ))}
      </div>

      <style>{`
        .risk-card {
          padding: 24px;
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        .risk-header {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 24px;
        }
        .gauge-container {
          display: flex; justify-content: center;
          margin-bottom: 32px;
        }
        .gauge {
          position: relative; width: 140px; height: 70px;
          overflow: hidden;
        }
        .gauge-bg {
          width: 140px; height: 140px;
          border-radius: 50%;
          border: 12px solid;
          border-color: rgba(34,197,94,0.3) rgba(245,158,11,0.3) rgba(239,68,68,0.3) transparent;
          border-color: transparent transparent var(--bg-3) var(--bg-3);
          transform: rotate(-45deg);
        }
        .gauge-needle {
          position: absolute; bottom: 0; left: 50%;
          width: 4px; height: 60px;
          background: var(--text); border-radius: 4px;
          transform-origin: bottom center;
          transition: transform 1s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .gauge-center {
          position: absolute; bottom: -10px; left: 50%; transform: translateX(-50%);
          width: 50px; height: 50px;
          background: var(--bg-2); border-radius: 50%;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          border: 4px solid var(--bg-3);
        }
        .gauge-text { font-weight: 800; font-size: 0.9rem; }
        .gauge-sub { font-size: 0.5rem; text-transform: uppercase; color: var(--text-muted); }
        .shap-container { margin-top: auto; }
        .shap-row { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; font-size: 0.75rem; }
        .shap-label { flex: 1; text-transform: capitalize; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .shap-bar-container { flex: 2; height: 6px; background: var(--bg-4); border-radius: 3px; display: flex; }
        .shap-bar { height: 100%; border-radius: 3px; }
        .shap-val { width: 35px; text-align: right; font-weight: 700; }
      `}</style>
    </div>
  );
}
