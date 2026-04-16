"""
app.py  (v2)  — Flask REST API for Control Your Pocket
All responses are JSON. React frontend calls these endpoints.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from recommender import get_recommendations, get_card_recommendations
import pandas as pd, os, json
from datetime import datetime

app = Flask(__name__)
CORS(app)   # allow React (port 5173) to call Flask (port 5000)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
EXPENSES_FILE = os.path.join(BASE_DIR, "data", "expenses.json")

os.makedirs(os.path.join(BASE_DIR, "data"), exist_ok=True)
if not os.path.exists(EXPENSES_FILE):
    with open(EXPENSES_FILE, "w") as f:
        json.dump([], f)


# ── /api/recommend ─────────────────────────────────────────────────────────────
@app.route("/api/recommend", methods=["POST"])
def recommend():
    """
    Body JSON:
      age, monthly_income, credit_score, savings_ratio, spending_ratio,
      dependents, education, self_employed, top_spending_category, max_card_fee
    """
    try:
        data = request.get_json(force=True, silent=True) or {}

        age                    = int(data.get("age", 25))
        monthly_income         = float(data.get("monthly_income", 50000))
        credit_score           = int(data.get("credit_score", 700))
        savings_ratio          = float(data.get("savings_ratio", 0.2))
        spending_ratio         = float(data.get("spending_ratio", 0.5))
        dependents             = int(data.get("dependents", 0))
        education              = str(data.get("education", "Graduate"))
        self_employed          = bool(data.get("self_employed", False))
        top_spending_category  = str(data.get("top_spending_category", "Shopping"))
        max_card_fee           = float(data.get("max_card_fee", 5000))

        errors = []
        if not 18 <= age <= 100:    errors.append("Age must be 18–100.")
        if monthly_income <= 0:     errors.append("Monthly income must be positive.")
        if not 300 <= credit_score <= 900: errors.append("Credit score must be 300–900.")
        if not 0 <= savings_ratio <= 1:    errors.append("Savings ratio must be 0–1.")
        if not 0 <= spending_ratio <= 5:   errors.append("Spending ratio must be 0–5.")
        if errors:
            return jsonify({"error": errors}), 400

        result = get_recommendations(
            age=age,
            monthly_income=monthly_income,
            credit_score=credit_score,
            savings_ratio=savings_ratio,
            spending_ratio=spending_ratio,
            dependents=dependents,
            education=education,
            self_employed=self_employed,
            top_spending_category=top_spending_category,
            max_card_fee=max_card_fee,
            top_n=3,
        )
        return jsonify(result)

    except (ValueError, TypeError) as exc:
        return jsonify({"error": str(exc)}), 400


# ── /api/cards ────────────────────────────────────────────────────────────────
@app.route("/api/cards", methods=["GET"])
def cards():
    category = request.args.get("category", "Shopping")
    max_fee  = float(request.args.get("max_fee", 5000))
    top_n    = int(request.args.get("top_n", 10))
    return jsonify(get_card_recommendations(category, max_fee, top_n))


# ── /api/products ─────────────────────────────────────────────────────────────
@app.route("/api/products", methods=["GET"])
def products():
    df = pd.read_csv(os.path.join(BASE_DIR, "products.csv"))
    ptype    = request.args.get("type", None)
    category = request.args.get("category", None)
    if ptype:
        df = df[df["product_type"].str.contains(ptype, case=False, na=False)]
    if category:
        df = df[df["category"].str.lower() == category.lower()]
    return jsonify(df.fillna("").to_dict(orient="records"))


# ── /api/expenses (GET + POST) ────────────────────────────────────────────────
@app.route("/api/expenses", methods=["GET", "POST"])
def expenses():
    with open(EXPENSES_FILE) as f:
        all_expenses = json.load(f)

    if request.method == "POST":
        data = request.get_json(force=True, silent=True) or {}
        entry = {
            "id":        len(all_expenses) + 1,
            "amount":    float(data.get("amount", 0)),
            "category":  str(data.get("category", "Other")),
            "merchant":  str(data.get("merchant", "")),
            "note":      str(data.get("note", "")),
            "timestamp": datetime.now().isoformat(),
        }
        all_expenses.append(entry)
        with open(EXPENSES_FILE, "w") as f:
            json.dump(all_expenses, f, indent=2)
        return jsonify({"success": True, "entry": entry}), 201

    return jsonify(all_expenses)


# ── /api/summary ──────────────────────────────────────────────────────────────
@app.route("/api/summary", methods=["GET"])
def summary():
    with open(EXPENSES_FILE) as f:
        all_expenses = json.load(f)
    if not all_expenses:
        return jsonify({"total": 0, "by_category": {}, "count": 0})

    total = sum(e["amount"] for e in all_expenses)
    by_cat = {}
    for e in all_expenses:
        by_cat[e["category"]] = by_cat.get(e["category"], 0) + e["amount"]

    return jsonify({
        "total":       round(total, 2),
        "by_category": {k: round(v, 2) for k, v in by_cat.items()},
        "count":       len(all_expenses),
        "recent":      all_expenses[-5:][::-1],
    })


if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)
