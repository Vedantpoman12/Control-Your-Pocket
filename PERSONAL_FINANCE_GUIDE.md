# Personal Finance Product Recommendation System - Complete Guide

## Your Current Project Status ✅

You ALREADY have the RIGHT architecture for personal finance recommendations:
- ✅ Risk profile prediction (Low/Medium/High)
- ✅ Product database (mutual funds, bonds, loans, credit cards, insurance)
- ✅ Income-based filtering
- ✅ SHAP explainability
- ✅ Personalized scoring

## What's Wrong? ❌

Your `stock_advisor.py` is **misaligned** with a personal finance system:
- It does **daily stock trading analysis** (not personal finance)
- RSI/SMA indicators are for day traders (not long-term investors)
- Should recommend **financial products** instead (e.g., "SIP in Equity Mutual Fund", "Term Insurance Plan", "Home Loan")

---

## What You SHOULD Recommend

Instead of stock picking, focus on these **personal finance products**:

### 1. **Mutual Funds** (Core Product)
- Equity Mutual Funds (growth-focused)
- Debt Mutual Funds (conservative)
- Balanced Mutual Funds (hybrid)
- Index Funds (passive)
- Sector-specific Funds

### 2. **Insurance Products**
- Term Life Insurance
- Health Insurance
- Critical Illness Cover
- Endowment Plans

### 3. **Banking Products**
- Savings Accounts (interest rates vary)
- Fixed Deposits (tenure 1–5 years)
- Recurring Deposits

### 4. **Investment Schemes**
- SIP (Systematic Investment Plans)
- NPS (National Pension Scheme)
- Public Provident Fund (PPF)
- Senior Citizen Savings Scheme (SCSS)

### 5. **Loan Products**
- Personal Loans
- Home Loans
- Education Loans
- Vehicle Loans

### 6. **Credit Products**
- Credit Cards (cashback, travel rewards)
- Buy Now Pay Later (BNPL)

---

## Required Datasets

### **1. Mutual Funds Database**
| Source | Link | Free? | Type | Notes |
|--------|------|-------|------|-------|
| **AMFI** (Association of Mutual Funds) | https://www.amfiindia.com/statistics | ✅ | CSV/HTML | Official MF data (India) |
| **Kaggle - MF Dataset** | https://www.kaggle.com/datasets/ashwini7/mutual-funds-data | ✅ | CSV | 1000+ Indian mutual funds |
| **Value Research** | https://www.valueresearch.com/ | ✅ (limited) | HTML/API | Fund ratings, returns |
| **MoneyControl** | https://www.moneycontrol.com/mutual-funds/ | ✅ | HTML scraping | Fund performance, NAV |
| **CRISIL** | https://www.crisil.com/ | 💰 | API | Fund ratings, risk metrics |

**Download Command:**
```bash
kaggle datasets download -d ashwini7/mutual-funds-data
# Columns: Fund Name, Fund Type, Category, NAV, Expense Ratio, Returns (1Y, 3Y, 5Y), etc.
```

### **2. Insurance Products Database**
| Source | Link | Free? | Type |
|--------|------|-------|------|
| **IRDAI** (Insurance Regulator) | https://www.irdai.gov.in/the-authority/organisational-structure/insurance-companies | ✅ | Directory |
| **Policy Bazaar** | https://www.policybazaar.com/ | ✅ | Web scraping | Compare plans |
| **Insurance companies** | HDFC, LIC, ICICI, etc. | ✅ | Manual entry | Official websites |
| **Kaggle Insurance** | https://www.kaggle.com/datasets/uciml/default-of-credit-card-clients | ✅ | CSV | Customer + insurance behavior |

**Manual CSV Structure:**
```csv
product_id,product_name,product_type,insurance_company,coverage_amount,annual_premium,min_income,risk_level
P001,HDFC Term Plan,Term Insurance,HDFC Life,50000000,15000,300000,Low
P002,LIC Cancer Care,Critical Illness,LIC,1000000,8000,200000,Medium
```

### **3. Banking Products Database**
| Source | Link | Free? |
|--------|------|-------|
| **RBI** | https://www.rbi.org.in/ | ✅ |
| **Bank websites** | HDFC, SBI, ICICI, Axis | ✅ |
| **BankBazaar** | https://www.bankbazaar.com/ | ✅ |

### **4. User/Customer Data (For Training ML Model)**

#### Best FREE datasets:
| Dataset | Link | Rows | Free? | Use |
|---------|------|------|-------|-----|
| **Home Credit Default Risk** | https://www.kaggle.com/competitions/home-credit-default-risk/data | 307k | ✅ | Financial behavior |
| **Credit Card Default** | https://www.kaggle.com/datasets/uciml/default-of-credit-card-clients | 30k | ✅ | Income, spending, risk |
| **Bank Marketing** | https://archive.ics.uci.edu/ml/datasets/bank+marketing | 41k | ✅ | Customer demographics |
| **Lending Club** | https://www.kaggle.com/datasets/wordsforthewise/lending-club | 887k | ✅ | Risk profiles, defaults |
| **Brazilian E-commerce** | https://www.kaggle.com/datasets/olistbrazil/brazilian-ecommerce | 100k | ✅ | Spending patterns |

**Download:**
```bash
kaggle datasets download -d uciml/default-of-credit-card-clients
# Has: age, income, credit_limit, education, marital_status, repayment_status
```

### **5. Financial Products Master Data (Create Yourself)**

Create `data/products.csv` with real Indian products:

```csv
product_id,product_name,product_type,provider,min_income,risk_level,returns_1y,returns_3y,expense_ratio,tenure_months,annual_fee,key_feature
P001,Axis Balanced Advantage Fund,Mutual Fund,Axis,50000,Medium,12.5,14.2,0.73,0,0,Dynamic allocation
P002,HDFC Top 100 Fund,Mutual Fund,HDFC,25000,High,18.3,15.8,0.43,0,0,Large cap growth
P003,Bajaj Finserv Health Insurance,Insurance,Bajaj,100000,Low,0,0,0,12,5000,Cashless medical
P004,SBI Personal Loan,Loan,SBI,300000,Medium,10.49,10.49,0,60,0,No collateral
P005,HDFC Home Loan,Loan,HDFC,500000,Medium,7.65,7.65,0,360,5000,Refinance option
P006,ICICI Bank Credit Card,Credit Card,ICICI,100000,Low,0,0,0,0,2500,10X rewards
P007,LIC Term Insurance,Insurance,LIC,50000,Low,0,0,0,240,18000,Affordable coverage
P008,DSP Top 100 Equity Fund,Mutual Fund,DSP,10000,High,16.8,14.5,0.65,0,0,Small cap exposure
```

**Where to find this data:**
- Manual entry from MFO.in, Value Research, MoneyControl
- AMFI statistics
- Bank annual reports
- Insurance company brochures

---

## Architecture (Corrected)

### **What Your System Should Do:**

```
User Input Form
  ├─ Age
  ├─ Monthly Income
  ├─ Credit Score
  ├─ Savings Ratio
  ├─ Spending-to-Income Ratio
  └─ Dependents
         ↓
  ML Model (Decision Tree)
         ↓
  Risk Profile (Low/Medium/High) ← SHAP Explanation
         ↓
  Filter Products
  ├─ Income eligibility
  ├─ Risk match
  └─ Credit score requirements
         ↓
  Score Products (Weighted)
  ├─ Income headroom (35%)
  ├─ Credit fitness (25%)
  ├─ Savings potential (20%)
  ├─ Spending control (10%)
  └─ Popularity boost (10%)
         ↓
  Top 3 Recommendations
  ├─ Mutual Fund (growth)
  ├─ Insurance (protection)
  └─ Loan/Banking (needs-based)
         ↓
  Explanation
  ├─ Why this product?
  ├─ How it matches your profile
  └─ What are the benefits?
```

---

## Step-by-Step Implementation

### **Step 1: Fix Your Products Database**

Replace/expand `data/products.csv` with real Indian financial products:

```python
import pandas as pd

# Create comprehensive product database
products_data = [
    # MUTUAL FUNDS
    {
        'product_id': 'MF001',
        'product_name': 'HDFC Top 100 Fund',
        'product_type': 'Equity Mutual Fund',
        'provider': 'HDFC Asset Management',
        'min_income': 25000,
        'risk_level': 'High',
        'interest_rate': 16.5,  # Expected return %
        'tenure_months': 0,  # 0 = no tenure
        'annual_fee': 0.43,  # Expense ratio in %
        'category': 'Large Cap Equity',
        'is_sip_eligible': True,
        'minimum_investment': 500,
        'aum': 25000000000  # Assets Under Management
    },
    # INSURANCE
    {
        'product_id': 'INS001',
        'product_name': 'HDFC Life Term Insurance',
        'product_type': 'Life Insurance',
        'provider': 'HDFC Life',
        'min_income': 50000,
        'risk_level': 'Low',
        'interest_rate': 0,
        'tenure_months': 240,  # 20 year term
        'annual_fee': 18000,
        'category': 'Protection',
        'coverage_amount': 50000000,
        'is_sip_eligible': False,
        'minimum_investment': 18000
    },
    # BANKING
    {
        'product_id': 'BANK001',
        'product_name': 'HDFC Bank Fixed Deposit',
        'product_type': 'Fixed Deposit',
        'provider': 'HDFC Bank',
        'min_income': 0,
        'risk_level': 'Low',
        'interest_rate': 6.5,
        'tenure_months': 60,
        'annual_fee': 0,
        'category': 'Savings',
        'is_sip_eligible': False,
        'minimum_investment': 10000
    },
    # LOANS
    {
        'product_id': 'LOAN001',
        'product_name': 'SBI Personal Loan',
        'product_type': 'Personal Loan',
        'provider': 'SBI',
        'min_income': 300000,
        'risk_level': 'Medium',
        'interest_rate': 10.49,
        'tenure_months': 60,
        'annual_fee': 0,
        'category': 'Credit',
        'max_amount': 5000000,
        'minimum_investment': 100000
    },
]

df = pd.DataFrame(products_data)
df.to_csv('data/products.csv', index=False)
print("✅ Products database created!")
```

### **Step 2: Update `recommender.py` Scoring**

Modify the `_score()` function to be more relevant for personal finance:

```python
def _score(product: pd.Series, monthly_income: float, credit_score: int,
           savings_ratio: float, spending_to_income_ratio: float,
           interaction_boost: float, age: int = 30) -> float:
    """
    Score a financial product for a user.
    
    Weighted factors:
      30% - Income headroom (can afford this product?)
      25% - Credit fitness (eligible for credit products?)
      20% - Savings capacity (can invest/afford premium?)
      15% - Life stage match (age-appropriate?)
      10% - Engagement/popularity (other users like it?)
    """
    
    product_type = str(product.get('product_type', '')).lower()
    min_inc = float(product.get('min_income', 0))
    
    # 1. Income Headroom (30%)
    if monthly_income >= min_inc:
        headroom = (monthly_income - min_inc) / (monthly_income + 1)
        income_score = max(0.0, min(1.0, headroom))
    else:
        income_score = 0.0  # Doesn't meet minimum income
    
    # 2. Credit Fitness (25%)
    if 'insurance' in product_type or 'deposit' in product_type:
        # Insurance & savings need good credit
        credit_norm = (credit_score - 300) / 550
    elif 'loan' in product_type or 'credit card' in product_type:
        # Loans need EXCELLENT credit
        credit_norm = (credit_score - 600) / 250  # Stricter for credit
    else:
        # Mutual funds don't care much about credit
        credit_norm = 0.5
    
    credit_norm = max(0.0, min(1.0, credit_norm))
    
    # 3. Savings Capacity (20%)
    if 'sip' in product_type or 'mutual' in product_type:
        # SIPs need good savings ratio
        savings_score = max(0.0, min(1.0, savings_ratio * 3))  # Max at 33% savings
    else:
        savings_score = 0.5 if savings_ratio > 0.1 else 0.2
    
    # 4. Life Stage Match (15%)
    if 'insurance' in product_type or 'term' in product_type:
        # Life insurance more important when young with dependents
        life_stage = 1.0 - (age / 100)  # 1.0 at age 0, 0.0 at age 100
    elif 'pension' in product_type or 'retirement' in product_type:
        # Pension products important for 40+
        life_stage = max(0.0, (age - 40) / 25)  # 0.0 at 40, 1.0 at 65+
    else:
        life_stage = 0.5
    
    # 5. Engagement Boost (10%)
    engagement_score = float(min(interaction_boost, 1.0))
    
    return round(
        0.30 * income_score +
        0.25 * credit_norm +
        0.20 * savings_score +
        0.15 * life_stage +
        0.10 * engagement_score,
        4,
    )
```

### **Step 3: Update Recommendation Reasons**

Make explanations relevant to personal finance:

```python
def _build_reasons(product: pd.Series, risk_level: str,
                   monthly_income: float, credit_score: int,
                   savings_ratio: float, age: int) -> list:
    """Build personalized reasons for recommending a financial product."""
    
    reasons = []
    product_type = str(product.get('product_type', '')).lower()
    
    # Income eligibility
    min_inc = float(product.get('min_income', 0))
    if monthly_income >= min_inc:
        leftover = monthly_income - min_inc
        reasons.append(
            f"💰 Income eligible: Your ₹{monthly_income:,.0f} monthly income exceeds "
            f"the minimum requirement of ₹{min_inc:,.0f}, leaving ₹{leftover:,.0f} for other expenses."
        )
    
    # Risk profile match
    prod_risk = str(product.get('risk_level', '')).lower()
    if prod_risk == risk_level.lower():
        reasons.append(
            f"📊 Risk match: Your predicted risk profile '{risk_level}' aligns perfectly "
            f"with this product's risk level."
        )
    
    # Credit score impact
    if 'loan' in product_type or 'credit' in product_type:
        if credit_score >= 750:
            reasons.append(
                f"⭐ Excellent credit score ({credit_score}): You qualify for premium rates "
                f"and higher limits."
            )
        elif credit_score >= 650:
            reasons.append(
                f"👍 Good credit score ({credit_score}): You're eligible with standard rates."
            )
        else:
            reasons.append(
                f"⚠️ Credit score ({credit_score}) is acceptable. Improving it will unlock "
                f"better interest rates."
            )
    
    # Insurance/Protection
    if 'insurance' in product_type or 'term' in product_type:
        if age < 40:
            reasons.append(
                f"🛡️ Protection timing: At age {age}, securing life insurance now locks in "
                f"lower premiums for decades."
            )
        else:
            reasons.append(
                f"🛡️ Essential protection: Your family deserves financial security "
                f"at any life stage."
            )
    
    # Investment/SIP
    if 'mutual' in product_type or 'sip' in product_type:
        if savings_ratio >= 0.2:
            reasons.append(
                f"📈 Strong savings capacity ({savings_ratio:.0%} of income): Perfect for "
                f"regular SIP contributions."
            )
        else:
            reasons.append(
                f"📈 Flexible investment: Start small with SIP, increase as income grows."
            )
    
    # Product features
    interest_rate = product.get('interest_rate', 0)
    annual_fee = product.get('annual_fee', 0)
    tenure = product.get('tenure_months', 0)
    
    if interest_rate > 0 and 'deposit' in product_type:
        reasons.append(
            f"💵 Returns: Earn {interest_rate}% annually (₹{monthly_income * interest_rate / 100 * tenure / 12:,.0f} "
            f"over {tenure} months)."
        )
    
    if annual_fee > 0 and 'insurance' not in product_type:
        reasons.append(
            f"💳 Cost: Annual fee ₹{annual_fee:,.0f}. Value for money given benefits."
        )
    
    return reasons
```

### **Step 4: Remove Stock Analysis, Add Product Categories**

In `app.py`, replace the stock analysis route:

```python
# REMOVE this:
@app.route("/stock_analysis", methods=["GET", "POST"])
def stock_analysis():
    ...

# REPLACE with this:
@app.route("/explore_products", methods=["GET"])
def explore_products():
    """Browse all available financial products by category."""
    category = request.args.get('category', 'Mutual Fund')  # MF, Insurance, Banking, Loans
    
    products = _products[_products['product_type'].str.contains(category, case=False)]
    
    return render_template(
        "explore_products.html",
        products=products.to_dict(orient='records'),
        category=category
    )
```

---

## Dataset Download Script

```python
import pandas as pd
import os

# Create data directory
os.makedirs('data', exist_ok=True)

# 1. Download Kaggle datasets
print("📥 Downloading datasets...")
os.system('kaggle datasets download -d ashwini7/mutual-funds-data -p data/')
os.system('kaggle datasets download -d uciml/default-of-credit-card-clients -p data/')

# 2. Create users.csv (sample training data)
users_sample = pd.DataFrame({
    'user_id': range(1, 1001),
    'age': np.random.randint(25, 65, 1000),
    'monthly_income': np.random.choice([25000, 50000, 100000, 200000, 500000], 1000),
    'credit_score': np.random.randint(300, 850, 1000),
    'risk_profile': np.random.choice(['Low', 'Medium', 'High'], 1000, p=[0.3, 0.4, 0.3]),
    'savings_ratio': np.random.uniform(0, 0.5, 1000),
    'dependents': np.random.randint(0, 4, 1000),
})
users_sample.to_csv('data/users.csv', index=False)

# 3. Create products.csv (financial products)
products_sample = pd.DataFrame({
    'product_id': ['P001', 'P002', 'P003', 'P004', 'P005', 'P006', 'P007', 'P008'],
    'product_name': [
        'HDFC Top 100 Fund',
        'SBI Balanced Advantage',
        'LIC Term Insurance',
        'HDFC Bank Credit Card',
        'SBI Personal Loan',
        'HDFC Home Loan',
        'Bajaj Health Insurance',
        'DSP Dividend Yield Fund'
    ],
    'product_type': [
        'Equity Mutual Fund',
        'Balanced Mutual Fund',
        'Life Insurance',
        'Credit Card',
        'Personal Loan',
        'Home Loan',
        'Health Insurance',
        'Equity Mutual Fund'
    ],
    'min_income': [25000, 50000, 50000, 100000, 300000, 500000, 100000, 25000],
    'risk_level': ['High', 'Medium', 'Low', 'Low', 'Medium', 'Medium', 'Low', 'High'],
    'interest_rate': [16.5, 12.0, 0, 0, 10.49, 7.65, 0, 14.5],
    'tenure_months': [0, 0, 240, 0, 60, 360, 12, 0],
    'annual_fee': [0.43, 0.65, 18000, 2500, 0, 5000, 5000, 0.52],
})
products_sample.to_csv('data/products.csv', index=False)

print("✅ All datasets ready in data/ folder!")
```

---

## Summary: Personal Finance vs Stock Trading

| Aspect | Your Project (Personal Finance) | NOT Stock Trading |
|--------|--------------------------------|-------------------|
| **Goal** | Match users to suitable financial products | Daily profit from stock price movements |
| **Products** | Mutual Funds, Insurance, Loans, Credit Cards | Individual stocks, Options, Futures |
| **Decision Factors** | Risk profile, income, life stage, family needs | RSI, MACD, Moving Averages, Volume |
| **Time Horizon** | Years/decades (long-term) | Days/weeks (short-term) |
| **ML Model** | Classify risk profile, score products | Predict next day's price movement |
| **User Type** | Regular people saving for future | Traders, investors |
| **Complexity** | Medium (personalization) | High (market prediction) |

---

## Next Steps

1. **Download data:** Use Kaggle datasets above
2. **Create products.csv:** Add real Indian financial products
3. **Train model:** Use Home Credit or Lending Club data
4. **Remove stock_advisor.py:** Not needed for personal finance
5. **Add categories:** Mutual Funds, Insurance, Banking, Loans
6. **Build UI:** Show top 3 products with explanations
7. **Deploy:** Use Flask + Heroku/AWS

---

## Recommended Datasets to Download NOW

```bash
# Mutual Funds (India)
kaggle datasets download -d ashwini7/mutual-funds-data

# User behavior (for training risk model)
kaggle datasets download -d uciml/default-of-credit-card-clients

# Lending behavior
kaggle datasets download -d wordsforthewise/lending-club

# Financial data
kaggle datasets download -d competitions/home-credit-default-risk
```

**Links:**
- 🇮🇳 AMFI MF Data: https://www.amfiindia.com/statistics
- 📊 Value Research: https://www.valueresearch.com/
- 💳 MoneyControl: https://www.moneycontrol.com/mutual-funds/
- 🏦 Insurance: https://www.policybazaar.com/

Would you like me to:
1. Create the `products.csv` with 50+ real Indian financial products?
2. Update your `recommender.py` with personal finance scoring?
3. Create new HTML templates for product comparison?
4. Build the training dataset from Kaggle?
