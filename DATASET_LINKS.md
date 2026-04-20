# 📊 Dataset Requirements for Product-Based Finance Recommender

With the transition to a **Smart Shopping & Consumption Recommender**, the data requirements have shifted from stock market data to consumer behavior and retail intelligence.

## 🎯 Core Required Files

### 1️⃣ Financial Intelligence (`financial_intelligence.pkl`)
This is the "brain" of the recommender. It contains:
- **Retail Alternatives**: A dictionary mapping expensive brands/items to smarter alternatives (Bulk, Refills, Local).
- **Tax Slabs**: Latest 2026-27 Indian Tax regime data.
- **Medical Models**: Coefficients for estimating health premiums.
- **Generation**: Run `python train_advanced_models.py` to regenerate this file.

### 2️⃣ Financial Products Catalog (`data/products.csv`)
A database of financial products (Cards, Loans, FDs) that are recommended based on consumption patterns.
- **Required Columns**: `product_id`, `product_name`, `product_type`, `provider`, `min_income`, `risk_level`, `interest_rate`, `annual_fee`.
- **Match Logic**: If your cart shows high shopping spending, the system recommends cards with "Shopping Reward" multipliers from this file.

### 3️⃣ Personal Smart Cart (`data/cart.json`)
This is the **user-provided** dataset. 
- **Format**: JSON list of objects.
- **Fields**: `name`, `price`, `quantity`, `category`.
- **Usage**: The AI (Ollama) scans this file to provide reasoning on your specific spending habits.

### 4️⃣ User Profile & Risk Data (`data/users.csv`)
Used to train the core Risk Classifier (`risk_model.pkl`).
- **Required Columns**: `age`, `monthly_income`, `credit_score`, `dependents`, `savings_ratio`, `spending_ratio`.
- **Source**: Can be synthetic (generated via script) or exported from anonymized user logs.

---

## 📥 Recommended External Sources (Consumption Data)

Since we no longer use stocks, you can enhance the recommender using these consumer-focused sources:

### 1. Consumer Price Index (CPI) Data
- **Source**: Ministry of Statistics and Programme Implementation (MOSPI) - India.
- **Usage**: To adjust "Savings Advice" based on inflation of specific categories (Food vs Housing).
- **Link**: [MOSPI CPI Reports](https://mospi.gov.in/)

### 2. Credit Card Reward Structures
- **Source**: BankBazaar / CardExpert.
- **Usage**: To accurately populate `data/products.csv` with the best cashback cards for specific shopping categories.
- **Link**: [CardExpert India](https://www.cardexpert.in/)

### 3. FMCG Pricing Benchmarks
- **Source**: Online Grocers (BigBasket / Zepto / Blinkit).
- **Usage**: To update the `retail_alternatives` list with real-world price gaps between branded and generic products.

---

## 🚀 How to Setup
```bash
# 1. Generate the synthetic base data (Users and Products)
# Note: I've updated the training script to be retail-focused.
python train_advanced_models.py

# 2. Train the User Risk Profiler
python risk_model_training.py

# 3. Start adding items to your Smart Cart in the UI!
```

## 💡 Requirement Summary
| Data Type | File | Source | 
|-----------|------|--------|
| **Retail Benchmarks** | `financial_intelligence.pkl` | Generated from `train_advanced_models.py` |
| **Financial Catalog** | `data/products.csv` | Curated list of cards/loans |
| **User Spending** | `data/cart.json` | Created by you via the Smart Cart UI |
| **Risk Patterns** | `risk_model.pkl` | Trained on `data/users.csv` |

The system is now **100% focused on optimizing your wallet** through better product choices and consumption habits.
