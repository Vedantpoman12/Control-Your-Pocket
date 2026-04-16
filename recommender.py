"""
recommender.py  (v2)
Personal Finance Product Recommender.

Products loaded from root products.csv (54 products):
  MF, Insurance, Loans, Credit Cards, Savings, Retirement

Credit cards loaded from datasets/credit_card_reward.csv (300 cards).
"""

import os, pickle
import numpy as np
import pandas as pd
import shap

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# ── Load ML artifacts ─────────────────────────────────────────────────────────
def _load_artifacts():
    with open(os.path.join(BASE_DIR, "risk_model.pkl"), "rb") as f:
        return pickle.load(f)

_art          = _load_artifacts()
_model        = _art["model"]
_scaler       = _art["scaler"]
_risk_encoder = _art["risk_encoder"]
_feature_cols = _art["feature_cols"]
_explainer    = shap.TreeExplainer(_model)

# ── Load product catalogs ─────────────────────────────────────────────────────
_products = pd.read_csv(os.path.join(BASE_DIR, "products.csv"))
_products["product_id"] = _products["product_id"].astype(str)

_cards = pd.read_csv(os.path.join(BASE_DIR, "datasets", "credit_card_reward.csv"))

# ── Risk prediction ───────────────────────────────────────────────────────────
def _predict_risk(monthly_income, credit_score, dependents,
                  education_enc, self_employed_enc,
                  spending_ratio, savings_ratio) -> dict:
    row = np.array([[monthly_income, credit_score, dependents,
                     education_enc, self_employed_enc,
                     spending_ratio, savings_ratio]])
    row_scaled = _scaler.transform(row)
    risk_idx   = int(_model.predict(row_scaled)[0])
    risk_proba = _model.predict_proba(row_scaled)[0]
    risk_level = _risk_encoder.inverse_transform([risk_idx])[0]
    confidence = float(round(risk_proba[risk_idx], 4))

    probabilities = {
        cls: float(round(p, 4))
        for cls, p in zip(_risk_encoder.classes_, risk_proba)
    }

    shap_vals = _explainer.shap_values(row_scaled)
    if isinstance(shap_vals, list):
        class_shap = shap_vals[risk_idx][0]
    else:
        class_shap = shap_vals[0, :, risk_idx]

    shap_explanation = {
        feat: float(round(float(v), 4))
        for feat, v in zip(_feature_cols, class_shap)
    }

    return {
        "risk_level":       risk_level,
        "confidence":       confidence,
        "probabilities":    probabilities,
        "shap_explanation": shap_explanation,
    }


def _score_product(product: pd.Series, monthly_income: float,
                   credit_score: int, savings_ratio: float,
                   spending_ratio: float) -> float:
    min_inc = float(product.get("min_income", 0))
    headroom = (monthly_income - min_inc) / (monthly_income + 1) if monthly_income > min_inc else 0
    income_score = max(0.0, min(1.0, headroom))

    credit_norm = max(0.0, min(1.0, (credit_score - 300) / 600))
    savings_score = max(0.0, min(1.0, savings_ratio))
    spending_score = max(0.0, 1.0 - min(spending_ratio, 1.0))

    return round(
        0.35 * income_score +
        0.30 * credit_norm +
        0.20 * savings_score +
        0.15 * spending_score,
        4,
    )


def _build_reasons(product: pd.Series, risk_level: str,
                   monthly_income: float, credit_score: int,
                   savings_ratio: float, spending_ratio: float) -> list:
    reasons = []
    product_type = str(product.get("product_type", "")).lower()
    min_inc = float(product.get("min_income", 0))
    prod_risk = str(product.get("risk_level", ""))

    reasons.append(
        f"Income eligible: your monthly income Rs{monthly_income:,.0f} "
        f"meets the minimum requirement of Rs{min_inc:,.0f}."
    )
    if prod_risk.lower() == risk_level.lower():
        reasons.append(f"Risk match: product risk level '{prod_risk}' aligns with your profile '{risk_level}'.")
    else:
        reasons.append(f"Closest match: your risk is '{risk_level}', product targets '{prod_risk}'.")

    if credit_score >= 750:
        reasons.append("Excellent credit score (750+) strongly supports eligibility.")
    elif credit_score >= 600:
        reasons.append(f"Good credit score ({credit_score}) qualifies you for standard rates.")
    else:
        reasons.append(f"Credit score ({credit_score}) is below 600 — improving it unlocks better products.")

    if "mutual" in product_type or "equity" in product_type or "debt" in product_type:
        if savings_ratio >= 0.2:
            reasons.append(f"Strong savings ratio ({savings_ratio:.0%}) supports regular SIP investments.")
        else:
            reasons.append("Start small with a monthly SIP — even Rs500/month compounds well.")
    elif "insurance" in product_type or "term" in product_type or "health" in product_type:
        reasons.append("Insurance protects your financial plan from unexpected medical or life events.")
    elif "loan" in product_type:
        if spending_ratio < 0.4:
            reasons.append(f"Low spending ratio ({spending_ratio:.0%}) indicates good loan repayment capacity.")
        else:
            reasons.append("Ensure EMI stays under 40% of income for healthy cash flow.")

    interest_rate = product.get("interest_rate", 0)
    annual_fee = product.get("annual_fee", 0)
    tenure = product.get("tenure_months", 0)
    key_feature = product.get("key_feature", "")

    detail_parts = []
    if interest_rate > 0:
        detail_parts.append(f"Rate: {interest_rate}%")
    if annual_fee > 0:
        detail_parts.append(f"Annual fee: Rs{annual_fee:,.0f}")
    if tenure > 0:
        detail_parts.append(f"Tenure: {tenure} months")
    if key_feature:
        detail_parts.append(f"Key: {key_feature}")
    if detail_parts:
        reasons.append(" | ".join(detail_parts))

    return reasons


# ── Credit card recommender ───────────────────────────────────────────────────
CATEGORY_MAP = {
    "Food":          "dining",
    "Travel":        "travel",
    "Shopping":      "shopping",
    "Fuel":          "fuel",
    "Groceries":     "groceries",
    "Entertainment": "dining",
    "Online":        "online_spends",
    "Bills":         "fuel",
    "Health":        "shopping",
    "Other":         "shopping",
}

def get_card_recommendations(top_spending_category: str = "Shopping",
                              max_annual_fee: float = 5000,
                              top_n: int = 3) -> list:
    mapped = CATEGORY_MAP.get(top_spending_category, "shopping")
    filtered = _cards[
        (_cards["primary_usage_category"] == mapped) &
        (_cards["annual_charges_in_inr"] <= max_annual_fee)
    ].copy()
    if filtered.empty:
        filtered = _cards[_cards["annual_charges_in_inr"] <= max_annual_fee].copy()
    if filtered.empty:
        filtered = _cards.copy()

    filtered = filtered.sort_values("points_accumulation_rate", ascending=False).head(top_n)

    results = []
    for _, row in filtered.iterrows():
        results.append({
            "card_name":      str(row["credit_card_name"]),
            "bank":           str(row["bank_name"]),
            "reward_type":    str(row["reward_type"]),
            "speciality":     str(row["speciality"]),
            "points_rate":    float(row["points_accumulation_rate"]),
            "best_category":  str(row["primary_usage_category"]),
            "annual_fee":     float(row["annual_charges_in_inr"]),
            "reason": (
                f"Best for {row['primary_usage_category']} spending with "
                f"{row['points_accumulation_rate']}x points. "
                f"Annual fee: Rs{row['annual_charges_in_inr']:,.0f}. "
                f"Speciality: {row['speciality'].replace('_', ' ')}."
            ),
        })
    return results


# ── Main recommendation entry point ──────────────────────────────────────────
def get_recommendations(age: int, monthly_income: float, credit_score: int,
                        savings_ratio: float, spending_ratio: float,
                        dependents: int, education: str = "Graduate",
                        self_employed: bool = False,
                        top_spending_category: str = "Shopping",
                        max_card_fee: float = 5000,
                        top_n: int = 3) -> dict:

    education_enc     = 1 if education == "Graduate" else 0
    self_employed_enc = 1 if self_employed else 0

    risk_prediction = _predict_risk(
        monthly_income, credit_score, dependents,
        education_enc, self_employed_enc,
        spending_ratio, savings_ratio
    )
    risk_level = risk_prediction["risk_level"]

    # Filter products by income and risk
    df = _products.copy()
    df = df[df["min_income"] <= monthly_income]
    strict = df[df["risk_level"].str.lower() == risk_level.lower()]
    eligible = strict if not strict.empty else df

    if eligible.empty:
        return {
            "risk_prediction":  risk_prediction,
            "recommendations":  [],
            "card_recommendations": get_card_recommendations(top_spending_category, max_card_fee, top_n),
        }

    eligible = eligible.copy()
    eligible["score"] = eligible.apply(
        lambda r: _score_product(r, monthly_income, credit_score, savings_ratio, spending_ratio), axis=1
    )
    top = eligible.sort_values("score", ascending=False).head(top_n)

    recommendations = []
    for _, prod in top.iterrows():
        recommendations.append({
            "product_id":    str(prod["product_id"]),
            "product_name":  str(prod["product_name"]),
            "product_type":  str(prod["product_type"]),
            "provider":      str(prod.get("provider", "")),
            "risk_level":    str(prod["risk_level"]),
            "min_income":    float(prod["min_income"]),
            "interest_rate": float(prod["interest_rate"]),
            "tenure_months": int(prod["tenure_months"]),
            "annual_fee":    float(prod["annual_fee"]),
            "category":      str(prod.get("category", "")),
            "key_feature":   str(prod.get("key_feature", "")),
            "score":         float(prod["score"]),
            "reasons":       _build_reasons(prod, risk_level, monthly_income,
                                            credit_score, savings_ratio, spending_ratio),
        })

    return {
        "risk_prediction":    risk_prediction,
        "recommendations":    recommendations,
        "card_recommendations": get_card_recommendations(top_spending_category, max_card_fee, top_n),
    }