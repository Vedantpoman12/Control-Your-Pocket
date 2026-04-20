# Sovereign Portfolio Intelligence 💰🤖

An institutional-grade personal finance recommendation engine powered by **Llama-3 AI**. This platform transforms your everyday spending habits into a full-spectrum wealth-building strategy, providing personalized matches for Mutual Funds, Insurance, Credit Cards, and Loans.

## 🚀 Key Features

- **AI-Powered Product Matching**: Integrates local Llama-3 intelligence to analyze your risk profile against 50+ real-world financial products.
- **Spending Optimization Engine**: Identifies category-specific saving opportunities (Online Shopping, Healthcare, Dining, etc.) based on your consumption patterns.
- **Collaborative Filtering**: Leverages social-proof data (UBCF) to suggest products "people like you also found valuable."
- **Institutional Design System**: High-contrast, premium UI built with **React**, **Tailwind CSS**, and **Framer Motion**.
- **Privacy-First**: Sensitive financial data stays local. All analysis is performed within your sovereign enclave.

## 🛠️ Technology Stack

- **Frontend**: React 18, Zustand (State Mgmt), Tailwind CSS, Framer Motion, Lucide Icons.
- **Backend**: Flask (Python), SQLAlchemy, Scikit-Learn (ML/CF).
- **AI/ML**: Ollama (Llama-3), Collaborative Filtering (UBCF), Scikit-Learn.
- **Data**: CSV-based product database for easy scaling and auditability.

## 📂 Project Structure

```text
├── backend/
│   ├── data/                 # Products, Users, Intercations (CSV)
│   ├── financial_recommender.py # Main Intelligence Engine
│   ├── cf_recommender.py       # Collaborative Filtering Logic
│   ├── app.py                # RESTful API Endpoints
│   └── models.py             # Database Schema (SQLite)
├── frontend/
│   ├── src/
│   │   ├── pages/            # Financial Analyzer, Dashboard, Profile
│   │   ├── store/            # Global State Management
│   │   └── components/       # Premium UI Components
```

## 🏁 Getting Started

### 1. Backend Setup
```bash
cd backend
pip install -r requirements.txt
python app.py
```
*Note: Ensure Ollama is running with `llama3` pulled for AI insights.*

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 📊 Methodology

Our scoring algorithm uses a weighted matrix of five distinct factors:
1. **Income Headroom** (30%): Eligibility based on disposable income.
2. **Credit Fitness** (25%): Optimized for your Credit Score range.
3. **Savings Ratio** (20%): Matching products to your investment capacity.
4. **Life Stage Match** (15%): Age and profile-appropriate financial tools.
5. **Social Proof (CF)** (10%): Interaction-based boosting from similar profiles.

---
*Built for personalized financial auditing and retail optimization.*
