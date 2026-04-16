# 📊 Complete Dataset Links for Personal Finance Recommendation System

## Quick Start

```bash
# 1. Clone your project
cd your-finance-project

# 2. Install dependencies
pip install flask pandas scikit-learn shap yfinance numpy

# 3. Run setup script to create sample datasets
python setup_datasets.py

# 4. Train the ML model
python risk_model_training.py

# 5. Start the app
python app.py
```

---

## 🎯 Recommended Datasets (FREE)

### 1️⃣ MUTUAL FUNDS DATA

**🥇 Best: Kaggle Mutual Funds Dataset**
- Link: https://www.kaggle.com/datasets/ashwini7/mutual-funds-data
- Rows: 1,500+ funds
- Free: ✅ Yes
- Format: CSV
- Download: `kaggle datasets download -d ashwini7/mutual-funds-data`
- Columns: Fund Name, Category, NAV, 1Y Return, 3Y Return, 5Y Return, Expense Ratio

**Official Sources:**
- AMFI (India MF Association): https://www.amfiindia.com/statistics
- Value Research: https://www.valueresearch.com/
- MoneyControl: https://www.moneycontrol.com/mutual-funds/
- Fundsindia: https://www.fundsindia.com/

---

### 2️⃣ USER BEHAVIOR & CREDIT DATA

**🥇 Best for Training Risk Model: Kaggle Credit Card Default**
- Link: https://www.kaggle.com/datasets/uciml/default-of-credit-card-clients
- Rows: 30,000 users
- Free: ✅ Yes
- Format: CSV
- Download: `kaggle datasets download -d uciml/default-of-credit-card-clients`
- Columns: Age, Credit Limit, Income, Education, Spending, Repayment Status

**Alternative 1: Lending Club Dataset**
- Link: https://www.kaggle.com/datasets/wordsforthewise/lending-club
- Rows: 887,000 loans
- Free: ✅ Yes
- Columns: Loan Amount, Income, Employment, Loan Purpose, Risk Profile

**Alternative 2: Home Credit Default Risk**
- Link: https://www.kaggle.com/competitions/home-credit-default-risk/data
- Rows: 307,000 users
- Free: ✅ Yes
- Columns: Age, Income, Education, Family Size, Loan History

**Alternative 3: Bank Marketing Dataset**
- Link: https://archive.ics.uci.edu/ml/datasets/bank+marketing
- Rows: 41,000 customers
- Free: ✅ Yes
- Format: CSV
- Columns: Age, Job, Marital Status, Education, Campaign Response

---

### 3️⃣ INSURANCE DATA

**NSE/Stock Market (For context):**
- NSE: https://www.nseindia.com/
- BSE: https://www.bseindia.com/

**Insurance Companies (India):**
- LIC: https://licindia.in/
- HDFC Life: https://www.hdfclife.com/
- ICICI Prudential: https://www.iciciprumertp.com/
- Bajaj Allianz: https://www.bajajallianz.com/
- Max Bupa: https://www.maxbupa.com/
- Star Health: https://www.starhealth.in/

---

### 4️⃣ BANKING & LOAN PRODUCTS

**RBI Official Data:**
- Link: https://www.rbi.org.in/
- Free: ✅ Yes
- Data: Interest Rates, Reserve Requirements, Policy Rates

**Bank Websites (Manual):**
- HDFC Bank: https://www.hdfcbank.com/
- SBI: https://www.sbi.co.in/
- ICICI Bank: https://www.icicibank.com/
- Axis Bank: https://www.axisbank.com/
- Kotak Mahindra: https://www.kotak.com/

**Comparison Portals:**
- BankBazaar: https://www.bankbazaar.com/
- GetmyCredit: https://www.getmycredit.com/
- Credila: https://www.credila.com/

---

### 5️⃣ STOCK MARKET DATA (If Needed Later)

- yfinance: `pip install yfinance` (Python API)
- Alpha Vantage: https://www.alphavantage.co/
- Finnhub: https://finnhub.io/
- IEX Cloud: https://iexcloud.io/

---

## 📥 Setup Commands

### Create Synthetic Datasets (EASIEST)
```bash
python setup_datasets.py
```
This creates sample data:
- users.csv (1000 users)
- products.csv (50 financial products)
- transactions.csv (user spending)
- interactions.csv (user-product interactions)

### Download from Kaggle
```bash
# Install kaggle
pip install kaggle

# Setup API token
# Go to https://www.kaggle.com/settings/account
# Click "Create New API Token"
# Copy kaggle.json to ~/.kaggle/

# Download datasets
kaggle datasets download -d ashwini7/mutual-funds-data -p data/
kaggle datasets download -d uciml/default-of-credit-card-clients -p data/
kaggle datasets download -d wordsforthewise/lending-club -p data/
```

### Download from Direct Links
```bash
# Bank Marketing (UCI)
wget https://archive.ics.uci.edu/ml/machine-learning-databases/00222/bank.zip -O data/bank.zip
unzip data/bank.zip -d data/

# Lending Club (CSV from Kaggle)
# Manual download from https://www.kaggle.com/datasets/wordsforthewise/lending-club
```

---

## 📊 CSV Structure for Products Database

```csv
product_id,product_name,product_type,provider,min_income,risk_level,interest_rate,tenure_months,annual_fee
MF001,HDFC Top 100 Fund,Equity Mutual Fund,HDFC,25000,High,16.5,0,0.43
MF002,SBI Balanced Fund,Balanced Fund,SBI,50000,Medium,12.0,0,0.65
INS001,HDFC Life Term,Life Insurance,HDFC Life,50000,Low,0,240,18000
LOAN001,SBI Personal Loan,Personal Loan,SBI,300000,Medium,10.49,60,0
CARD001,HDFC Credit Card,Credit Card,HDFC,100000,Low,0,0,2500
```

---

## 🔗 Real Product Lists (India)

### Mutual Funds
- **AMFI Official**: https://www.amfiindia.com/spider/PublicPages/Statistics.aspx?category=HistoricalNAV
- **Morningstar**: https://www.morningstarsoftware.com/
- **Value Research**: https://www.valueresearch.com/funds/list

### Insurance
- **IRDA Approved Companies**: https://www.irdai.gov.in/the-authority/organisational-structure/insurance-companies
- **Policy Bazaar**: https://www.policybazaar.com/
- **Insurance Info**: https://www.irdai.gov.in/

### Banking
- **CIBIL Credit Scores**: https://www.cibil.com/
- **RBI Guidelines**: https://www.rbi.org.in/
- **Bank Compare**: https://www.bankbazaar.com/

### Stocks (NSE/BSE)
- **NSE Listing**: https://www.nseindia.com/products/content/equities/equities/eq_listing.htm
- **BSE Listing**: https://www.bseindia.com/corporates/List_of_Companies.aspx
- **NIFTY 50 Data**: https://www.kaggle.com/datasets/rohanrao/nifty50-stock-market-data

---

## 📋 Data You Already Have

Your project already uses:
- **yfinance** ✅ (can get stock data, but not needed for personal finance)
- **Flask** ✅ (web framework)
- **scikit-learn** ✅ (ML models)
- **SHAP** ✅ (explainability)

---

## 🎓 Training Data Format

Your `users.csv` should have:
```
user_id, age, monthly_income, credit_score, risk_profile, savings_ratio, dependents
1,      35,  100000,          750,           High,        0.25,         2
2,      45,  200000,          800,           Medium,      0.35,         1
3,      28,  50000,           650,           Low,         0.15,         0
```

---

## 🚀 Step-by-Step to Get Started

### Option 1: Synthetic Data (FASTEST - 5 minutes)
```bash
python setup_datasets.py
python risk_model_training.py
python app.py
```
✅ Ready to use immediately
✅ No API setup needed
⚠️ Data is synthetic (not real)

### Option 2: Download Kaggle (30 minutes)
```bash
# Install kaggle, setup API token
pip install kaggle
# Copy kaggle.json to ~/.kaggle/

# Download datasets
kaggle datasets download -d uciml/default-of-credit-card-clients
kaggle datasets download -d ashwini7/mutual-funds-data

# Use real data for training
python risk_model_training.py
python app.py
```
✅ Real user data
✅ Better model accuracy
⚠️ Need Kaggle account

### Option 3: Manual Data Entry (SLOW - weeks)
- Collect real product data from banks/insurance
- Manually enter into products.csv
- Collect real customer data
- Not recommended for MVP

---

## 🔥 Most Important Datasets (Priority Order)

1. **Users Data** (for training risk model)
   - Use: `uciml/default-of-credit-card-clients` OR synthetic from `setup_datasets.py`

2. **Products Data** (your financial products)
   - Use: `products.csv` (already provided)

3. **Mutual Funds List** (if including MF recommendations)
   - Use: `ashwini7/mutual-funds-data` OR manual from AMFI

4. **Interactions Data** (what users look at)
   - Use: Synthetic from `setup_datasets.py` OR your own logs

---

## 💡 Pro Tips

1. **Start Simple**: Use synthetic data first, add real data later
2. **Test Early**: Don't wait for all datasets, MVP with 20 products
3. **Iterate**: Add more products and data as you grow
4. **Real Products**: Start with top 10 products from each category
5. **User Data**: Even 100 real users beats 10,000 synthetic ones

---

## 🆘 Troubleshooting

**Issue: Can't download Kaggle datasets**
```bash
# Solution: Use synthetic data instead
python setup_datasets.py
```

**Issue: Missing mutual funds data**
```bash
# Solution: Manually create from Value Research
# https://www.valueresearch.com/funds/list
```

**Issue: Can't find insurance products**
```bash
# Solution: Use provided products.csv with 50+ products
# Expand later with real data from insurance company websites
```

---

## Summary

| Stage | Dataset | Source | Time |
|-------|---------|--------|------|
| **MVP** | Synthetic | `setup_datasets.py` | 5 min |
| **Beta** | Kaggle | `kaggle datasets` | 30 min |
| **Production** | Real | Manual + APIs | weeks |

Start with MVP, test with users, then add real data! ✅
