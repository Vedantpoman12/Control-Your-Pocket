import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings2, ArrowRight } from 'lucide-react';

export default function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    age: 28,
    monthly_income: 60000,
    credit_score: 720,
    savings_ratio: 0.25,
    spending_ratio: 0.40,
    dependents: 1,
    education: "Graduate",
    self_employed: false,
    top_spending_category: "Shopping",
    max_card_fee: 5000
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      localStorage.setItem('dashboard_data', JSON.stringify(data));
      navigate('/dashboard');
    } catch (err) {
      alert("Error connecting to backend API.");
      setLoading(false);
    }
  };

  return (
    <div className="profile-page fade-up">
      <div className="page-header">
        <h1>Your Financial Profile</h1>
        <p>Help us understand your financial health to generate AI-driven personalized recommendations.</p>
      </div>

      <form className="card profile-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          {/* Core Info */}
          <div className="form-section">
            <h3 className="section-label"><Settings2 size={12}/> Core Demographics</h3>
            <div className="form-group">
              <label className="form-label">Age</label>
              <input type="number" name="age" className="form-input" value={formData.age} onChange={handleChange} required min="18" max="100"/>
            </div>
            <div className="form-group" style={{marginTop: '16px'}}>
              <label className="form-label">Education</label>
              <select name="education" className="form-input" value={formData.education} onChange={handleChange}>
                <option value="Graduate">Graduate</option>
                <option value="Not Graduate">Not Graduate</option>
              </select>
            </div>
            <div className="form-group" style={{marginTop: '16px', flexDirection: 'row', alignItems: 'center'}}>
              <input type="checkbox" name="self_employed" id="self_employed" checked={formData.self_employed} onChange={handleChange}/>
              <label htmlFor="self_employed" style={{fontSize: '0.9rem'}}>Self Employed</label>
            </div>
            <div className="form-group" style={{marginTop: '16px'}}>
              <label className="form-label">Dependents</label>
              <input type="number" name="dependents" className="form-input" value={formData.dependents} onChange={handleChange} required min="0"/>
            </div>
          </div>

          {/* Finances */}
          <div className="form-section">
            <h3 className="section-label"><Settings2 size={12}/> Financial Health</h3>
            <div className="form-group">
              <label className="form-label">Monthly Income (Rs)</label>
              <input type="number" name="monthly_income" className="form-input" value={formData.monthly_income} onChange={handleChange} required min="1000"/>
            </div>
            <div className="form-group" style={{marginTop: '16px'}}>
              <label className="form-label">CIBIL Score</label>
              <input type="number" name="credit_score" className="form-input" value={formData.credit_score} onChange={handleChange} required min="300" max="900"/>
            </div>
            <div className="form-group" style={{marginTop: '16px'}}>
              <label className="form-label">Savings Ratio (0-1)</label>
              <input type="number" step="0.01" name="savings_ratio" className="form-input" value={formData.savings_ratio} onChange={handleChange} required min="0" max="1"/>
            </div>
            <div className="form-group" style={{marginTop: '16px'}}>
              <label className="form-label">Debt-to-Income / Spending (0-5)</label>
              <input type="number" step="0.01" name="spending_ratio" className="form-input" value={formData.spending_ratio} onChange={handleChange} required min="0" max="5"/>
            </div>
          </div>

          {/* Credit Card Preferences */}
          <div className="form-section">
            <h3 className="section-label"><Settings2 size={12}/> Credit Card Preferences</h3>
            <div className="form-group">
              <label className="form-label">Top Spending Category</label>
              <select name="top_spending_category" className="form-input" value={formData.top_spending_category} onChange={handleChange}>
                <option value="Shopping">Shopping</option>
                <option value="Dining">Dining</option>
                <option value="Travel">Travel</option>
                <option value="Fuel">Fuel</option>
                <option value="Groceries">Groceries</option>
              </select>
            </div>
            <div className="form-group" style={{marginTop: '16px'}}>
              <label className="form-label">Maximum Annual Card Fee (Rs)</label>
              <input type="number" name="max_card_fee" className="form-input" value={formData.max_card_fee} onChange={handleChange} required min="0"/>
            </div>
          </div>
        </div>

        <div className="form-footer">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <div className="spinner" style={{width: '20px', height: '20px', borderWidth: '2px'}}></div> : <>Analyze Profile <ArrowRight size={16}/></>}
          </button>
        </div>
      </form>

      <style>{`
        .profile-page {
          max-width: 800px;
          margin: 0 auto;
          padding: 60px 24px;
        }
        .page-header {
          text-align: center;
          margin-bottom: 48px;
        }
        .page-header h1 {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 12px;
        }
        .page-header p {
          color: var(--text-muted);
          font-size: 1.1rem;
        }
        .profile-form {
          padding: 40px;
        }
        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 40px;
          margin-bottom: 40px;
        }
        .form-section {
          display: flex;
          flex-direction: column;
        }
        .form-footer {
          display: flex;
          justify-content: flex-end;
          border-top: 1px solid var(--border);
          padding-top: 24px;
        }
      `}</style>
    </div>
  );
}
