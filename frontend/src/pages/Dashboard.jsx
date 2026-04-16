import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import RiskGauge from '../components/RiskGauge';
import ProductCard from '../components/ProductCard';
import CreditCardCard from '../components/CreditCardCard';
import { LayoutDashboard, CreditCard, Box, PieChart } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem('dashboard_data');
    if (!raw) {
      navigate('/profile');
    } else {
      setData(JSON.parse(raw));
    }
  }, [navigate]);

  if (!data) return null;

  const chartData = {
    labels: ['Housing', 'Food', 'Transport', 'Shopping', 'Other'],
    datasets: [
      {
        data: [35, 20, 15, 20, 10], // Placeholder distribution
        backgroundColor: [
          '#7c6fff', '#22c55e', '#f59e0b', '#ef4444', '#06b6d4'
        ],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: { position: 'bottom', labels: { color: '#8888a8', padding: 20 } }
    },
    cutout: '75%',
  };

  return (
    <div className="dashboard fade-up">
      <div className="dash-header">
        <h1>Your Financial <span className="gradient-text">Dashboard</span></h1>
        <p>AI-tailored recommendations based on your unique profile.</p>
      </div>

      <div className="dash-grid-top">
        {/* Risk Panel */}
        <div className="dash-panel">
          <RiskGauge prediction={data.risk_prediction} />
        </div>

        {/* Expenses Panel (Mocked for dashboard structure) */}
        <div className="dash-panel card p-6">
          <div className="mb-4">
            <h3 className="section-label"><PieChart size={14}/> Expense Distribution</h3>
          </div>
          <div style={{ height: '220px', display: 'flex', justifyContent: 'center' }}>
            <Doughnut data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Main Recommendations */}
      <div className="dash-section">
        <div className="section-header">
          <h2><Box size={20} color="var(--accent)"/> Top Product Matches</h2>
          <Link to="/products" className="view-all">Browse all</Link>
        </div>
        <div className="products-grid">
          {data.recommendations?.map((item, i) => (
            <ProductCard key={item.product_id} item={item} index={i} />
          ))}
          {(!data.recommendations || data.recommendations.length === 0) && (
            <div className="empty-state">No matching products found for this profile.</div>
          )}
        </div>
      </div>

      {/* Credit Card Recommendations */}
      <div className="dash-section">
        <div className="section-header">
          <h2><CreditCard size={20} color="var(--accent)"/> Smart Credit Cards</h2>
          <span className="subtitle">Based on your top spending category</span>
        </div>
        <div className="cards-grid">
          {data.card_recommendations?.map((card, i) => (
            <CreditCardCard key={i} card={card} index={i} />
          ))}
        </div>
      </div>

      <style>{`
        .dashboard {
          max-width: 1200px;
          margin: 0 auto;
          padding: 60px 24px;
        }
        .dash-header {
          margin-bottom: 40px;
        }
        .dash-header h1 {
          font-size: 2.5rem; font-weight: 800; margin-bottom: 8px;
        }
        .dash-header p {
          color: var(--text-muted); font-size: 1.1rem;
        }
        .dash-grid-top {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
          margin-bottom: 48px;
        }
        .dash-panel {
          height: 100%;
        }
        .p-6 { padding: 24px; }
        .mb-4 { margin-bottom: 16px; }
        
        .dash-section { margin-bottom: 60px; }
        .section-header {
          display: flex; justify-content: space-between; align-items: flex-end;
          margin-bottom: 24px; padding-bottom: 12px;
          border-bottom: 1px solid var(--border);
        }
        .section-header h2 {
          font-size: 1.5rem; font-weight: 700;
          display: flex; align-items: center; gap: 12px;
        }
        .subtitle { font-size: 0.9rem; color: var(--text-muted); }
        .view-all { font-size: 0.9rem; color: var(--accent-2); font-weight: 600; }
        
        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 24px;
        }
        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
        }
        .empty-state {
          grid-column: 1 / -1;
          padding: 40px; text-align: center; color: var(--text-muted);
          background: var(--bg-2); border-radius: var(--radius); border: 1px dashed var(--border);
        }
      `}</style>
    </div>
  );
}
