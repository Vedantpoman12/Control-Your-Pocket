import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const types = ['All', 'Mutual Fund', 'Insurance', 'Loan', 'Fixed Deposit'];
  
  const filtered = filter === 'All' 
    ? products 
    : products.filter(p => p.product_type.includes(filter));

  return (
    <div className="products-page fade-up">
      <div className="page-header">
        <h1>Product <span className="gradient-text">Catalog</span></h1>
        <p>Browse our curated selection of verified financial products.</p>
      </div>

      <div className="filters">
        {types.map(t => (
          <button 
            key={t}
            className={`filter-btn ${filter === t ? 'active' : ''}`}
            onClick={() => setFilter(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{padding: '60px 0'}}><div className="spinner"></div></div>
      ) : (
        <div className="catalog-grid">
          {filtered.map((item, i) => (
            <ProductCard 
              key={item.product_id} 
              item={{...item, score: 0.99, reasons: ['Verified high-quality product', 'Available nationwide']}} 
              index={i} 
            />
          ))}
        </div>
      )}

      <style>{`
        .products-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 60px 24px;
        }
        .page-header { text-align: center; margin-bottom: 48px; }
        .page-header h1 { font-size: 2.5rem; font-weight: 800; margin-bottom: 8px; }
        .page-header p { color: var(--text-muted); font-size: 1.1rem; }
        
        .filters {
          display: flex; gap: 12px; justify-content: center; margin-bottom: 48px;
          flex-wrap: wrap;
        }
        .filter-btn {
          padding: 8px 16px;
          border-radius: 999px;
          background: var(--bg-2);
          border: 1px solid var(--border);
          color: var(--text-muted);
          font-size: 0.9rem; font-weight: 600;
          transition: var(--t);
        }
        .filter-btn:hover { background: var(--bg-3); color: var(--text); }
        .filter-btn.active {
          background: var(--accent); color: #fff; border-color: var(--accent);
        }

        .catalog-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 24px;
        }
      `}</style>
    </div>
  );
}
