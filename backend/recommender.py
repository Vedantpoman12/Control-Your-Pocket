"""
recommender.py (v7)
Focused exclusively on Shopping Cart Analytics and Retail Optimization.
"""

import os, pickle, requests, json
import numpy as np
import pandas as pd

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# ── Load Intelligence & Metadata ─────────────────────────────────────────────
def _load_pkl(name):
    path = os.path.join(BASE_DIR, name)
    if os.path.exists(path):
        with open(path, "rb") as f:
            return pickle.load(f)
    return None

_intel = _load_pkl("financial_intelligence.pkl") or {
    "retail_alternatives": [],
}

# ── Main Entry Point ──────────────────────────────────────────────────────────
def get_recommendations(monthly_income, savings_ratio, is_student=False, gender="Other", top_n=3) -> dict:
    # Load Cart for Personalization
    cart_path = os.path.join(BASE_DIR, "data", "cart.json")
    cart = []
    if os.path.exists(cart_path):
        try:
            with open(cart_path, "r") as f:
                cart = json.load(f)
        except: cart = []
            
    # 1. Retail Optimization (Savings)
    optimization_recs = []
    for alt in _intel.get("retail_alternatives", [])[:top_n]:
        # Check if alternative is student-appropriate
        impact_bonus = 1.1 if is_student else 1.0
        optimization_recs.append({
            "type": "Optimization",
            "title": f"Switch {alt['original']} to {alt['alternative']}",
            "impact": f"Save ₹{int(alt['savings'] * impact_bonus)} monthly",
            "reason": f"{alt['reason']} {' (Student discount might apply!)' if is_student else ''}"
        })

    # AI-Powered Advice Generation
    target_savings_ratio = 0.3 if not is_student else 0.15
    actual_savings = monthly_income * savings_ratio
    gap = (monthly_income * target_savings_ratio) - actual_savings
    
    items_summary = ", ".join([i['name'] for i in cart]) if cart else "No items"
    
    prompt = f"""Summarize this financial status in ONE short, impactful sentence (max 20 words).
    Context: Income ₹{monthly_income}, Savings Ratio {savings_ratio*100}%, {'Student' if is_student else 'Professional'}.
    Savings Gap: ₹{gap} from target.
    Cart has: {items_summary}.
    Be direct and encouraging but firm on optimization."""

    try:
        res = requests.post("http://localhost:11434/api/generate", json={
            "model": "llama3", 
            "prompt": prompt, 
            "stream": False
        }, timeout=15)
        savings_advice = res.json().get("response", "Consider optimizing your cart to bridge the savings gap.").strip('"')
    except:
        savings_advice = "Your savings are below target. Focus on building an emergency fund by optimizing your cart."

    return {
        "shopping_summary": {
            "total_cart_value": sum(item.get("price", 0) * item.get("quantity", 1) for item in cart),
            "item_count": len(cart),
            "advice": savings_advice,
            "profile_context": f"{gender} | {'Student' if is_student else 'Professional'}"
        },
        "product_recommendations": optimization_recs,
        "message": "AI-Enhanced optimization advice."
    }

def analyze_cart_with_ollama(cart_items: list, monthly_income: float, is_student: bool = False, gender: str = "Other") -> dict:
    if not cart_items: return {"error": "No items in cart to analyze."}
    items_str = ", ".join([f"{i['name']} (₹{i['price']} x {i['quantity']})" for i in cart_items])
    
    student_msg = "The user is a student, focus on student-specific discounts, budgeting for education, and affordable healthy options." if is_student else ""
    gender_msg = f"The user identifies as {gender}."
    
    prompt = f"""System: You are an elite financial advisor and smart shopping expert.
User Context: Income ₹{monthly_income}/month. {gender_msg} {student_msg}
Cart Items: {items_str}

Task:
1. Provide 3 highly specific savings tips related to these items and the user's status.
2. Suggest 1 brand alternative for the most expensive item (if applicable).
3. Sustainability & Health: Briefly evaluate if the cart is balanced.
4. If the user is a student, suggest student-appropriate bulk buying or generic brands.

Output should be a concise, professional analysis in bullet points."""

    try:
        res = requests.post("http://localhost:11434/api/generate", json={
            "model": "llama3", 
            "prompt": prompt, 
            "stream": False
        }, timeout=35)
        return {"analysis": res.json().get("response", "No response from AI.")}
    except Exception as e: 
        return {"error": f"Ollama not reachable or timed out. ensure 'ollama serve' is running and 'llama3' is pulled. Error: {str(e)}"}