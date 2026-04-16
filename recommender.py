"""
recommender.py
Two-stage recommendation engine.

products.csv columns:
  product_id, product_name, product_type, min_income, risk_level,
  interest_rate, tenure_months, annual_fee

interactions.csv columns:
  interaction_id, user_id, product_id, interaction_type,
  interaction_date, interaction_score

transactions.csv columns:
  transaction_id, user_id, amount, category, payment_mode,
  merchant_type, timestamp, is_emi

Dependency: pip install shap
"""

import os
import pickle
import numpy as np
import pandas as pd
import shap

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")

def _load_artifacts():
    with open(os.path.join(BASE_DIR, "risk_model.pkl"), "rb") as f:
        return pickle.load(f)

_art          = _load_artifacts()
_model        = _art["model"]
_scaler       = _art["scaler"]
_risk_encoder = _art["risk_encoder"]
_feature_cols = _art["feature_cols"]

# Build the SHAP TreeExplainer once at module load (fast, no re-init per request)
_explainer = shap.TreeExplainer(_model)

_products     = pd.read_csv(os.path.join(DATA_DIR, "products.csv"))
_interactions = pd.read_csv(os.path.join(DATA_DIR, "interactions.csv"))
_transactions = pd.read_csv(os.path.join(DATA_DIR, "transactions.csv"))

# Normalise product_id dtype for safe merging
_products["product_id"]     = _products["product_id"].astype(str)
_interactions["product_id"] = _interactions["product_id"].astype(str)



def _predict_risk(age, monthly_income, credit_score,
                  savings_ratio, spending_to_income_ratio, dependents) -> dict:
    """
    Returns:
    {
        "risk_level":    "Medium",
        "confidence":    0.82,
        "probabilities": {"High": 0.08, "Low": 0.10, "Medium": 0.82},
        "shap_explanation": {
            "age":                      +0.05,
            "monthly_income":           -0.18,
            "credit_score":             +0.32,
            "savings_ratio":            -0.12,
            "spending_to_income_ratio": +0.28,
            "dependents":               +0.08
        }
    }
    SHAP values are computed on the scaled input to match training.
    Positive value → pushed predicted risk class UP,
    Negative value → pushed predicted risk class DOWN.
    """
    row = np.array([[age, monthly_income, credit_score,
                     savings_ratio, spending_to_income_ratio, dependents]])
    row_scaled  = _scaler.transform(row)
    risk_idx    = int(_model.predict(row_scaled)[0])
    risk_proba  = _model.predict_proba(row_scaled)[0]

    risk_level  = _risk_encoder.inverse_transform([risk_idx])[0]
    confidence  = float(round(risk_proba[risk_idx], 4))

    probabilities = {
        cls: float(round(prob, 4))
        for cls, prob in zip(_risk_encoder.classes_, risk_proba)
    }

    # ── SHAP explanation ─────────────────────────────────────────────────
    # shap_values shape: (n_samples, n_features, n_classes)  for multi-class
    # We take the slice for the predicted class so that:
    #   positive shap value → feature pushed output toward this (predicted) class
    #   negative shap value → feature pushed output away from this class
    shap_values = _explainer.shap_values(row_scaled)   # list[n_classes] or ndarray
    if isinstance(shap_values, list):
        # scikit-learn return: list of (n_samples, n_features) arrays, one per class
        class_shap = shap_values[risk_idx][0]
    else:
        # newer shap may return (n_samples, n_features, n_classes)
        class_shap = shap_values[0, :, risk_idx]

    shap_explanation = {
        feat: float(round(float(val), 4))
        for feat, val in zip(_feature_cols, class_shap)
    }

    return {
        "risk_level":       risk_level,
        "confidence":       confidence,
        "probabilities":    probabilities,
        "shap_explanation": shap_explanation,
    }


def _knowledge_filter(risk_level: str, monthly_income: float) -> pd.DataFrame:
    """
    Hard rules:
      Rule 1: user monthly_income >= product min_income
      Rule 2: predicted risk_level == product risk_level  (relax if no match)
    """
    df = _products.copy()

    # Rule 1 – income gate
    df = df[df["min_income"] <= monthly_income]

    # Rule 2 – risk match (strict first, relax if empty)
    strict = df[df["risk_level"].str.lower() == risk_level.lower()]
    return strict.copy() if not strict.empty else df.copy()


def _interaction_boost(product_ids: list) -> dict:
    """
    Use interactions.csv (implicit feedback — views, clicks, interaction_score)
    to compute a popularity/engagement boost per product.
    Returns dict {product_id_str: boost_score (0–1)}
    """
    relevant = _interactions[_interactions["product_id"].isin(product_ids)]
    if relevant.empty:
        return {pid: 0.0 for pid in product_ids}

    boost = (
        relevant.groupby("product_id")["interaction_score"]
        .sum()
        .reset_index(name="total_interaction_score")
    )
    max_score = boost["total_interaction_score"].max()
    if max_score > 0:
        boost["boost"] = boost["total_interaction_score"] / max_score
    else:
        boost["boost"] = 0.0

    return dict(zip(boost["product_id"], boost["boost"].round(4)))


def _score(product: pd.Series, monthly_income: float, credit_score: int,
           savings_ratio: float, spending_to_income_ratio: float,
           interaction_boost: float) -> float:
    """
    Weighted score (all components 0–1):
      35 % – income headroom above product min_income
      25 % – credit score fitness (300–850 scale)
      20 % – savings ratio (higher = better)
      10 % – low spending-to-income ratio (lower = better)
      10 % – interaction boost (implicit engagement from interactions.csv)
    """
    min_inc = float(product["min_income"])

    # Income headroom
    headroom = (monthly_income - min_inc) / (monthly_income + 1)
    income_score = max(0.0, min(1.0, headroom))

    # Credit score normalised (300 worst → 850 best)
    credit_norm = (credit_score - 300) / 550
    credit_norm = max(0.0, min(1.0, credit_norm))

    # Savings (0–1)
    savings_score = max(0.0, min(1.0, savings_ratio))

    # Spending health
    spending_score = max(0.0, 1.0 - min(spending_to_income_ratio, 1.0))

    return round(
        0.35 * income_score +
        0.25 * credit_norm +
        0.20 * savings_score +
        0.10 * spending_score +
        0.10 * interaction_boost,
        4,
    )


def _build_reasons(product: pd.Series, risk_level: str,
                   monthly_income: float, credit_score: int,
                   savings_ratio: float,
                   spending_to_income_ratio: float) -> list:
    reasons = []

    # Income eligibility
    min_inc = float(product["min_income"])
    reasons.append(
        f"Income eligible: your monthly income ₹{monthly_income:,.0f} "
        f"meets the minimum requirement of ₹{min_inc:,.0f}."
    )

    # Risk match
    prod_risk = product["risk_level"]
    if prod_risk.lower() == risk_level.lower():
        reasons.append(
            f"Risk match: product risk level '{prod_risk}' aligns with "
            f"your predicted risk profile '{risk_level}'."
        )
    else:
        reasons.append(
            f"Closest available match — your predicted risk is '{risk_level}' "
            f"and this product targets '{prod_risk}'."
        )

    # Credit score
    if credit_score >= 750:
        reasons.append("Excellent credit score (750+) strongly supports eligibility.")
    elif credit_score >= 650:
        reasons.append("Good credit score (650–749) supports this recommendation.")
    else:
        reasons.append("Credit score is below 650 — improving it will unlock better products.")

    # Spending behaviour
    if spending_to_income_ratio < 0.3:
        reasons.append("Low spending-to-income ratio indicates strong financial discipline.")
    elif spending_to_income_ratio < 0.6:
        reasons.append("Moderate spending-to-income ratio.")
    else:
        reasons.append("High spending-to-income ratio — reducing expenses may improve eligibility.")

    # Savings
    if savings_ratio >= 0.2:
        reasons.append(f"Healthy savings ratio ({savings_ratio:.0%}) shows good financial planning.")
    elif savings_ratio >= 0.1:
        reasons.append(f"Moderate savings ratio ({savings_ratio:.0%}).")
    else:
        reasons.append(f"Low savings ratio ({savings_ratio:.0%}) — consider increasing savings.")

    # Product details
    reasons.append(
        f"Product details: {product['product_type']} | "
        f"Interest rate: {product['interest_rate']}% | "
        f"Tenure: {product['tenure_months']} months | "
        f"Annual fee: ₹{product['annual_fee']:,.0f}."
    )

    return reasons


def get_recommendations(age: int, monthly_income: float, credit_score: int,
                        savings_ratio: float, spending_to_income_ratio: float,
                        dependents: int, top_n: int = 3) -> dict:
    """
    Returns:
    {
        "risk_prediction": {
            "risk_level":    "Medium",
            "confidence":    0.82,
            "probabilities": {"High": 0.08, "Low": 0.10, "Medium": 0.82},
            "shap_explanation": {
                "age":                      +0.05,
                "monthly_income":           -0.18,
                "credit_score":             +0.32,
                "savings_ratio":            -0.12,
                "spending_to_income_ratio": +0.28,
                "dependents":               +0.08
            }
        },
        "recommendations": [
            {
                "product_id":    "P01",
                "product_name":  "Credit Card",
                "product_type":  "Credit Card",
                "risk_level":    "Medium",
                "min_income":    25000,
                "interest_rate": 0.0,
                "tenure_months": 0,
                "annual_fee":    500,
                "score":         0.74,
                "reasons":       ["...", "..."]
            },
            ...
        ]
    }
    """

    risk_prediction = _predict_risk(
        age, monthly_income, credit_score,
        savings_ratio, spending_to_income_ratio, dependents
    )
    risk_level = risk_prediction["risk_level"]


    eligible = _knowledge_filter(risk_level, monthly_income)

    if eligible.empty:
        return {"risk_prediction": risk_prediction, "recommendations": []}


    product_ids = eligible["product_id"].tolist()
    boosts      = _interaction_boost(product_ids)

    eligible = eligible.copy()
    eligible["interaction_boost"] = eligible["product_id"].map(
        lambda pid: boosts.get(str(pid), 0.0)
    )
    eligible["score"] = eligible.apply(
        lambda row: _score(
            row, monthly_income, credit_score,
            savings_ratio, spending_to_income_ratio,
            row["interaction_boost"]
        ),
        axis=1,
    )

    top = eligible.sort_values("score", ascending=False).head(top_n)

    recommendations = []
    for _, prod in top.iterrows():
        recommendations.append({
            "product_id":    str(prod["product_id"]),
            "product_name":  str(prod["product_name"]),
            "product_type":  str(prod["product_type"]),
            "risk_level":    str(prod["risk_level"]),
            "min_income":    float(prod["min_income"]),
            "interest_rate": float(prod["interest_rate"]),
            "tenure_months": int(prod["tenure_months"]),
            "annual_fee":    float(prod["annual_fee"]),
            "score":         float(prod["score"]),
            "reasons":       _build_reasons(
                                 prod, risk_level, monthly_income,
                                 credit_score, savings_ratio,
                                 spending_to_income_ratio
                             ),
        })

    return {
        "risk_prediction": risk_prediction,
        "recommendations": recommendations,
    }