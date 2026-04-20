"""
financial_recommender.py
AI-powered Financial Product Recommender.
Now scales with products.csv and integrates Collaborative Filtering.
"""

import os, requests, json
import pandas as pd
import numpy as np
from cf_recommender import CFRecommender

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "data", "products.csv")

# ── Load Product Database ─────────────────────────────────────────────────────
def load_products():
    if os.path.exists(DATA_PATH):
        return pd.read_csv(DATA_PATH).to_dict(orient='records')
    return []

FINANCIAL_PRODUCTS = load_products()

# ── Score & Filter ────────────────────────────────────────────────────────────
def score_product(product: dict, profile: dict, cf_scores: dict = None) -> float:
    score = 50.0  # base
    income = float(profile.get("monthly_income", 0) or 0)
    is_student = bool(profile.get("is_student", False))
    credit_range = profile.get("credit_score_range", "Good (700-749)")
    categories = profile.get("top_categories", [])
    
    product_id = product.get("product_id")
    product_type = product.get("product_type", "")

    # 1. Eligibility Gates
    if income < product.get("min_income", 0):
        return -1  # not eligible

    # 2. Risk Level Matching (If profile has risk preference)
    # Assume: Student = High Risk Appetite (Time on side), Senior/Low Income = Low Risk
    target_risk = "Medium"
    if is_student: target_risk = "High"
    if income < 30000: target_risk = "Low"
    
    prod_risk = product.get("risk_level", "Medium")
    if prod_risk == target_risk:
        score += 15
    elif (target_risk == "Low" and prod_risk == "High"):
        score -= 20

    # 3. Collaborative Filtering Boost
    if cf_scores and product_id in cf_scores:
        score += cf_scores[product_id] * 5

    # 4. Category / Life Stage Match
    # Map product types to relevant spending categories
    type_matches = {
        "Credit Card": ["Online Shopping", "Dining & Restaurants", "Travel & Flights", "Groceries"],
        "Mutual Fund": ["Utilities"], # Savings for future
        "Insurance": ["Healthcare"],
        "Personal Loan": ["Healthcare", "Travel & Flights"],
    }
    
    overlap = len(set(categories) & set(type_matches.get(product_type, [])))
    score += overlap * 10

    # 5. Financial Returns (Interest Rate)
    rate = float(product.get("interest_rate", 0))
    if rate > 0:
        score += min(rate, 20) # Boost based on expected returns

    return round(min(score, 100), 1)


# ── Saving Opportunities Engine ───────────────────────────────────────────────
def compute_saving_opportunities(profile: dict) -> list:
    income     = float(profile.get("monthly_income", 0) or 0)
    raw_spend  = float(profile.get("monthly_spend", 0) or 0)
    savings_r  = float(profile.get("savings_ratio", 0.25))
    categories = profile.get("top_categories", [])
    is_student = bool(profile.get("is_student", False))

    effective_spend = raw_spend if raw_spend > 0 else income * 0.55
    
    cat_weight = {
        "Online Shopping": 0.2, "Dining & Restaurants": 0.15, "Travel & Flights": 0.12,
        "Fuel": 0.1, "Groceries": 0.18, "Entertainment": 0.08, "Healthcare": 0.07, "Utilities": 0.1
    }
    
    total_w = sum(cat_weight.get(c, 0.1) for c in categories) if categories else 1
    cat_spend = {c: effective_spend * (cat_weight.get(c, 0.1) / max(total_w, 0.01)) for c in categories}

    opps = []
    
    if "Online Shopping" in categories:
        s = cat_spend.get("Online Shopping", 0)
        save = round(s * 0.05)
        if save > 100:
            opps.append({
                "icon": "ShoppingBag", "category": "Online Shopping",
                "title": "Earn 5% flat cashback",
                "description": f"Switch to Amazon Pay ICICI. On ₹{int(s):,}/mo spending, save ₹{save*12:,} annually.",
                "monthly_saving": save, "annual_saving": save*12,
                "action": "Apply for Zero-Fee ICICI Card", "difficulty": "Easy", "color": "orange"
            })

    if "Healthcare" in categories:
        s = cat_spend.get("Healthcare", 0)
        save = round(s * 0.08) # Generic meds + insurance
        opps.append({
            "icon": "HeartPulse", "category": "Healthcare",
            "title": "8% Medicine & Lab Savings",
            "description": "Use HDFC Millennia on Apollo/Pharmeasy apps. Save on recurring health costs.",
            "monthly_saving": save, "annual_saving": save*12,
            "action": "Switch to Health-focused Card", "difficulty": "Easy", "color": "rose"
        })

    # Universal: Investment Gap
    target_savings = income * savings_r
    if target_savings > 1000:
        opps.append({
            "icon": "TrendingUp", "category": "Wealth Building",
            "title": f"Invest ₹{int(target_savings):,}/mo in Index Funds",
            "description": "At 12% annual returns, your savings could grow to ₹15L in 7 years.",
            "monthly_saving": 0, "annual_saving": int(target_savings * 0.12),
            "action": "Start Systematic Investment Plan (SIP)", "difficulty": "Medium", "color": "green"
        })

    opps.sort(key=lambda x: x["annual_saving"], reverse=True)
    return opps

def get_financial_recommendations(profile: dict) -> dict:
    income = float(profile.get("monthly_income", 30000))
    
    # Initialize CF Recommender
    cf_scores = {}
    try:
        cfr = CFRecommender()
        cf_recs = cfr.get_recommendations(1) 
        cf_scores = {r['product_id']: r['score'] for r in cf_recs}
    except: pass

    # Refetch products to ensure sync
    products_list = load_products()
    
    scored = []
    for prod in products_list:
        s = score_product(prod, profile, cf_scores)
        if s >= 0:
            entry = dict(prod)
            entry["name"] = prod.get("product_name")
            entry["type"] = prod.get("product_type")
            entry["match_score"] = int(s)
            entry["is_best_match"] = False
            scored.append(entry)

    scored.sort(key=lambda x: x["match_score"], reverse=True)
    for p in scored[:3]: p["is_best_match"] = True

    # Health Score
    health = 60 + (float(profile.get("savings_ratio", 0.2)) * 100) - (float(profile.get("monthly_spend", 0))/income*20 if income else 0)
    health = max(10, min(100, int(health)))

    return {
        "financial_score": health,
        "score_summary": f"{'Exemplary' if health > 80 else 'Good'} performance. Focus on portfolio diversification.",
        "insights": [
            "Your profile matches high-yielding debt instruments.",
            "Consider a term insurance plan to protect future earnings.",
            "You are eligible for premium lifestyle credit cards.",
            "Start a ₹5k SIP in a Nifty 50 Index fund for long-term growth."
        ],
        "saving_opportunities": compute_saving_opportunities(profile),
        "recommendations": scored,
        "profile_context": {"income": income}
    }
