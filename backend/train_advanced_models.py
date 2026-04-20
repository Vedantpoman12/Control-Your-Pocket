"""
train_advanced_models.py (v3)
Product-Based Finance Recommender Training.
Focuses on retail product alternatives and financial benchmarks.
"""

import os, pickle, json
import numpy as np
import pandas as pd

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def train():
    intel = {}

    # 1. Retail Optimization Logic
    print("Generating retail product alternatives...")
    intel["retail_alternatives"] = [
        {"original": "Premium Milk (1L)", "alternative": "Local Dairy Subscription", "savings": 450, "reason": "Better value for monthly consumption and direct sourcing."},
        {"original": "Instant Coffee (50g)", "alternative": "Coffee Beans (Bulk 500g)", "savings": 1200, "reason": "Buying in bulk reduces cost per gram by 40%."},
        {"original": "Branded Detergent", "alternative": "Refill Store Packs", "savings": 180, "reason": "Refill packs avoid 'branding tax' and high marketing costs."},
        {"original": "Bottled Water (Daily)", "alternative": "RO Purifier Installation", "savings": 2500, "reason": "Monthly purifier cost is 70% lower than buying 30 bottles."},
        {"original": "Gourmet Pasta", "alternative": "Traditional Wheat Pasta", "savings": 320, "reason": "Similar nutritional profile at 1/3rd of the generic price."}
    ]

    # 2. Medical Premium (Dummy Fallback)
    intel['medical_model'] = {
        "base_premium": 6500,
        "age_coeff": 220,
        "chronic_impact": 3500
    }

    # 3. Tax Logic (Budget 2026-27 New Regime)
    intel['tax_slabs_2026'] = [
        {"limit": 400000, "rate": 0},
        {"limit": 800000, "rate": 0.05},
        {"limit": 1200000, "rate": 0.10},
        {"limit": 1600000, "rate": 0.15},
        {"limit": 2000000, "rate": 0.20},
        {"limit": 2400000, "rate": 0.25},
        {"limit": 99999999, "rate": 0.30}
    ]

    # Save Intelligence
    out_path = os.path.join(BASE_DIR, "financial_intelligence.pkl")
    with open(out_path, "wb") as f:
        pickle.dump(intel, f)
    
    print(f"Successfully updated intelligence -> {out_path}")

if __name__ == "__main__":
    train()
