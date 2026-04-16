#!/usr/bin/env python3
"""
setup_datasets.py
Download and prepare datasets for Personal Finance Recommendation System

Before running:
  pip install pandas numpy kaggle scikit-learn

Setup Kaggle:
  1. Go to https://www.kaggle.com/settings/account
  2. Click "Create New API Token" 
  3. Save kaggle.json to ~/.kaggle/
  4. chmod 600 ~/.kaggle/kaggle.json
"""

import os
import sys
import pandas as pd
import numpy as np
from pathlib import Path

def create_directories():
    """Create necessary directories."""
    dirs = ['data', 'models', 'static', 'templates']
    for d in dirs:
        Path(d).mkdir(exist_ok=True)
    print("✅ Directories created")

def download_kaggle_datasets():
    """Download datasets from Kaggle."""
    print("\n📥 Downloading Kaggle datasets...")
    print("(Make sure you have Kaggle API configured)")
    
    try:
        # Mutual Funds Dataset
        print("\n  → Downloading Mutual Funds dataset...")
        os.system('kaggle datasets download -d ashwini7/mutual-funds-data -p data/ --quiet')
        
        # Credit Card Default Dataset
        print("  → Downloading Credit Card Default dataset...")
        os.system('kaggle datasets download -d uciml/default-of-credit-card-clients -p data/ --quiet')
        
        # Lending Club Dataset
        print("  → Downloading Lending Club dataset...")
        os.system('kaggle datasets download -d wordsforthewise/lending-club -p data/ --quiet')
        
        print("✅ Datasets downloaded successfully!")
        
    except Exception as e:
        print(f"⚠️  Error downloading: {e}")
        print("You can skip this and use the manual datasets below")

def create_users_dataset():
    """Create synthetic users dataset for training."""
    print("\n📊 Creating users dataset...")
    
    np.random.seed(42)
    n_users = 1000
    
    users = pd.DataFrame({
        'user_id': range(1, n_users + 1),
        'age': np.random.randint(25, 75, n_users),
        'gender': np.random.choice(['M', 'F'], n_users),
        'job_type': np.random.choice([
            'Salaried', 'Business Owner', 'Freelancer', 'Retired', 'Homemaker'
        ], n_users),
        'monthly_income': np.random.choice([
            25000, 50000, 75000, 100000, 150000, 200000, 300000, 500000
        ], n_users),
        'credit_score': np.random.randint(300, 850, n_users),
        'risk_profile': np.random.choice(
            ['Low', 'Medium', 'High'], 
            n_users, 
            p=[0.35, 0.40, 0.25]
        ),
        'city_tier': np.random.choice(['Tier 1', 'Tier 2', 'Tier 3'], n_users),
        'savings_ratio': np.random.uniform(0.05, 0.50, n_users),
        'dependents': np.random.randint(0, 4, n_users),
    })
    
    users['savings_ratio'] = users['savings_ratio'].round(2)
    users.to_csv('data/users.csv', index=False)
    print(f"✅ Created users.csv ({len(users)} users)")
    return users

def create_transactions_dataset(users):
    """Create synthetic transactions dataset."""
    print("\n💳 Creating transactions dataset...")
    
    transactions = []
    
    for user_id in users['user_id']:
        n_transactions = np.random.randint(5, 50)
        
        for _ in range(n_transactions):
            transactions.append({
                'transaction_id': len(transactions) + 1,
                'user_id': user_id,
                'amount': np.random.choice([
                    500, 1000, 5000, 10000, 50000
                ], 1)[0],
                'category': np.random.choice([
                    'Groceries', 'Entertainment', 'Utilities', 'Transport', 
                    'Shopping', 'Food & Dining', 'Health'
                ]),
                'payment_mode': np.random.choice(['Cash', 'Card', 'Online', 'UPI']),
                'merchant_type': np.random.choice([
                    'Retail', 'Restaurant', 'Online Store', 'Utility Provider'
                ]),
                'is_emi': np.random.choice([0, 1], p=[0.85, 0.15])
            })
    
    df = pd.DataFrame(transactions)
    df.to_csv('data/transactions.csv', index=False)
    print(f"✅ Created transactions.csv ({len(df)} transactions)")
    return df

def create_products_dataset():
    """Create comprehensive products dataset."""
    print("\n🛍️  Creating products dataset...")
    
    products = pd.DataFrame({
        'product_id': [f'P{i:03d}' for i in range(1, 51)],
        'product_name': [
            # Mutual Funds
            'HDFC Top 100 Fund', 'Axis Focused 25 Fund', 'SBI Balanced Advantage',
            'ICICI Prudential Nifty Next 50', 'Mirae Asset Emerging Bluechip',
            'Kotak Standard Multicap Fund', 'UTIMF Dividend Yield Fund',
            'DSP Top 100 Equity Fund', 'Aditya Birla Sun Life Equity',
            'Sundaram Mid-Cap Fund',
            # Debt Funds
            'HDFC Short Term Debt Fund', 'SBI Banking & PSU Fund',
            'ICICI Prudential Liquid Fund', 'Axis Ultra Short Fund',
            'Kotak Low Duration Fund',
            # Insurance
            'HDFC Life Term Insurance', 'LIC Term Assurance',
            'ICICI Prudential LifeTime', 'Bajaj Health Insurance',
            'HDFC Ergo Health Insurance',
            # Banking
            'HDFC Bank Fixed Deposit', 'SBI Fixed Deposit',
            'ICICI Bank Fixed Deposit', 'Axis Bank Fixed Deposit',
            'Kotak Mahindra Bank FD',
            # Loans
            'SBI Personal Loan', 'HDFC Bank Personal Loan',
            'ICICI Bank Personal Loan', 'Axis Bank Personal Loan',
            'HDFC Home Loan',
            # Credit Cards
            'HDFC Bank Credit Card', 'ICICI Bank Credit Card',
            'Axis Bank Credit Card', 'SBI Credit Card',
            'Amazon Pay ICICI Card',
            # Investment Plans
            'National Pension Scheme', 'Public Provident Fund',
            'Senior Citizen Savings Scheme', 'Sukanya Samriddhi Yojana',
            'Pradhan Mantri Jan Dhan Account', 'PMJDY Extended Plan'
        ][:50],
        'product_type': [
            # Mutual Funds (10)
            'Equity Mutual Fund', 'Equity Mutual Fund', 'Balanced Mutual Fund',
            'Equity Mutual Fund', 'Equity Mutual Fund', 'Equity Mutual Fund',
            'Equity Mutual Fund', 'Equity Mutual Fund', 'Equity Mutual Fund',
            'Equity Mutual Fund',
            # Debt Funds (5)
            'Debt Mutual Fund', 'Debt Mutual Fund', 'Debt Mutual Fund',
            'Debt Mutual Fund', 'Debt Mutual Fund',
            # Insurance (5)
            'Life Insurance', 'Life Insurance', 'Life Insurance',
            'Health Insurance', 'Health Insurance',
            # Banking (5)
            'Fixed Deposit', 'Fixed Deposit', 'Fixed Deposit',
            'Fixed Deposit', 'Fixed Deposit',
            # Loans (5)
            'Personal Loan', 'Personal Loan', 'Personal Loan',
            'Personal Loan', 'Home Loan',
            # Credit Cards (5)
            'Credit Card', 'Credit Card', 'Credit Card',
            'Credit Card', 'Credit Card',
            # Investment (10)
            'Pension Plan', 'Savings Scheme', 'Savings Scheme',
            'Child Plan', 'Savings Account', 'Savings Account'
        ][:50],
        'min_income': [
            # MF (10)
            25000, 50000, 50000, 25000, 25000, 50000, 50000, 25000, 50000, 25000,
            # Debt (5)
            100000, 100000, 50000, 100000, 100000,
            # Insurance (5)
            50000, 50000, 75000, 100000, 100000,
            # Banking (5)
            0, 0, 0, 0, 0,
            # Loans (5)
            300000, 350000, 300000, 300000, 500000,
            # Credit (5)
            100000, 100000, 100000, 100000, 75000,
            # Investment (10)
            50000, 50000, 250000, 100000, 0, 0
        ][:50],
        'risk_level': [
            # MF (10)
            'High', 'High', 'Medium', 'High', 'High', 'Medium', 'High', 'High',
            'High', 'High',
            # Debt (5)
            'Low', 'Low', 'Low', 'Low', 'Low',
            # Insurance (5)
            'Low', 'Low', 'Low', 'Low', 'Low',
            # Banking (5)
            'Low', 'Low', 'Low', 'Low', 'Low',
            # Loans (5)
            'Medium', 'Medium', 'Medium', 'Medium', 'Medium',
            # Credit (5)
            'Low', 'Low', 'Low', 'Low', 'Low',
            # Investment (10)
            'Medium', 'Low', 'Low', 'Low', 'Low', 'Low'
        ][:50],
        'interest_rate': [
            # MF (10) - expected returns
            16.5, 18.2, 12.0, 17.8, 17.5, 14.2, 13.8, 16.8, 15.6, 17.2,
            # Debt (5)
            6.5, 7.2, 5.8, 6.8, 7.0,
            # Insurance (5)
            0, 0, 0, 0, 0,
            # Banking (5) - deposit rates
            6.5, 6.0, 6.25, 6.1, 6.3,
            # Loans (5) - interest rates
            10.49, 10.99, 10.75, 10.24, 7.65,
            # Credit (5)
            0, 0, 0, 0, 0,
            # Investment (10)
            7.5, 7.1, 8.2, 7.6, 4.0, 5.0
        ][:50],
        'tenure_months': [
            # MF (10)
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            # Debt (5)
            0, 0, 0, 0, 0,
            # Insurance (5)
            240, 240, 240, 12, 12,
            # Banking (5)
            60, 60, 60, 60, 60,
            # Loans (5)
            60, 60, 60, 60, 360,
            # Credit (5)
            0, 0, 0, 0, 0,
            # Investment (10)
            0, 240, 60, 264, 0, 0
        ][:50],
        'annual_fee': [
            # MF (10) - expense ratios
            0.43, 0.66, 0.65, 0.55, 0.71, 0.60, 0.63, 0.65, 0.67, 0.61,
            # Debt (5)
            0.30, 0.35, 0.25, 0.28, 0.32,
            # Insurance (5)
            18000, 12000, 22000, 8500, 6500,
            # Banking (5)
            0, 0, 0, 0, 0,
            # Loans (5)
            0, 0, 0, 0, 5000,
            # Credit (5)
            2500, 2500, 2000, 499, 0,
            # Investment (10)
            0, 0, 0, 0, 0, 0
        ][:50],
    })
    
    products.to_csv('data/products.csv', index=False)
    print(f"✅ Created products.csv ({len(products)} products)")
    return products

def create_interactions_dataset(products):
    """Create user-product interactions."""
    print("\n👥 Creating interactions dataset...")
    
    interactions = []
    product_ids = products['product_id'].tolist()
    
    for user_id in range(1, 1001):
        # Each user has 2-10 interactions
        n_interactions = np.random.randint(2, 11)
        selected_products = np.random.choice(product_ids, n_interactions, replace=False)
        
        for product_id in selected_products:
            interactions.append({
                'interaction_id': len(interactions) + 1,
                'user_id': user_id,
                'product_id': product_id,
                'interaction_type': np.random.choice(['view', 'click', 'read', 'save']),
                'interaction_date': f'2024-{np.random.randint(1,13):02d}-{np.random.randint(1,29):02d}',
                'interaction_score': np.random.uniform(0.1, 1.0)
            })
    
    df = pd.DataFrame(interactions)
    df.to_csv('data/interactions.csv', index=False)
    print(f"✅ Created interactions.csv ({len(df)} interactions)")
    return df

def create_requirements_file():
    """Create requirements.txt."""
    reqs = """Flask==2.3.3
pandas==2.0.3
numpy==1.24.3
scikit-learn==1.3.0
shap==0.42.3
yfinance==0.2.28
python-dotenv==1.0.0
gunicorn==21.2.0
Werkzeug==2.3.7
"""
    with open('requirements.txt', 'w') as f:
        f.write(reqs)
    print("✅ Created requirements.txt")

def print_summary():
    """Print setup summary."""
    print("""
╔════════════════════════════════════════════════════════════════╗
║     ✅ DATASETS SETUP COMPLETE                                 ║
╚════════════════════════════════════════════════════════════════╝

📊 Created Files:
  ├─ data/users.csv               (1000 users)
  ├─ data/products.csv            (50 financial products)
  ├─ data/transactions.csv         (user spending)
  ├─ data/interactions.csv         (user-product interactions)
  └─ requirements.txt              (Python dependencies)

🎯 Next Steps:
  1. Train the risk model:
     python risk_model_training.py

  2. Start the Flask app:
     python app.py

  3. Open browser:
     http://localhost:5000

📥 Additional Kaggle Datasets (Optional):
  • Mutual Funds: ashwini7/mutual-funds-data
  • Credit Default: uciml/default-of-credit-card-clients
  • Lending Club: wordsforthewise/lending-club

🔗 Dataset Links:
  • AMFI MF Data: https://www.amfiindia.com/statistics
  • NSE Data: https://www.nseindia.com/
  • Insurance: https://www.irdai.gov.in/
  • Value Research: https://www.valueresearch.com/

💡 Tips:
  - Use synthetic data for initial testing
  - Add real products from AMFI/NSE when ready
  - Train model with actual user data for better results
    """)

if __name__ == "__main__":
    print("\n🚀 Setting up Personal Finance Recommendation System...")
    
    create_directories()
    download_kaggle_datasets()
    
    users = create_users_dataset()
    transactions = create_transactions_dataset(users)
    products = create_products_dataset()
    interactions = create_interactions_dataset(products)
    create_requirements_file()
    
    print_summary()
