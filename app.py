"""
app.py
Flask entry-point for the Personalized Financial Product Recommendation System.
The risk level is now predicted by the ML model – the user does NOT select it.
"""

from flask import Flask, render_template, request, redirect, url_for, jsonify
from recommender import get_recommendations
from stock_advisor import get_stock_recommendation
from expense_manager import get_daily_finance_report, add_transaction

app = Flask(__name__)


@app.route("/", methods=["GET"])
def home():
    """Render the landing page with login and signup."""
    return render_template("home.html")


@app.route("/start", methods=["GET"])
def index():
    """Render the user input form."""
    return render_template("index.html")


@app.route("/authenticate", methods=["POST"])
def authenticate():
    """Handle login/signup form submissions and continue to the recommendation form."""
    return redirect(url_for("index"))


@app.route("/recommend", methods=["POST"])
def recommend():
    """Receive form data, run two-stage ML recommender, display results."""
    try:
        age                 = int(request.form.get("age", 0))
        monthly_income      = float(request.form.get("monthly_income", 0))
        credit_score        = int(request.form.get("credit_score", 300))
        savings_ratio       = float(request.form.get("savings_ratio", 0))
        spending_to_income  = float(request.form.get("spending_to_income_ratio", 0))
        dependents          = int(request.form.get("dependents", 0))

        # ── Validation ────────────────────────────────────────────────────
        errors = []
        if not (18 <= age <= 100):
            errors.append("Age must be between 18 and 100.")
        if monthly_income <= 0:
            errors.append("Monthly income must be a positive number.")
        if not (300 <= credit_score <= 850):
            errors.append("Credit score must be between 300 and 850.")
        if not (0.0 <= savings_ratio <= 1.0):
            errors.append("Savings ratio must be between 0.0 and 1.0.")
        if not (0.0 <= spending_to_income <= 1.0):
            errors.append("Spending-to-income ratio must be between 0.0 and 1.0.")
        if not (0 <= dependents <= 10):
            errors.append("Dependents must be between 0 and 10.")

        if errors:
            return render_template("index.html", errors=errors,
                                   form_data=request.form)

        # ── Two-stage ML ──────────────────────────────────────────────────
        result = get_recommendations(
            age=age,
            monthly_income=monthly_income,
            credit_score=credit_score,
            savings_ratio=savings_ratio,
            spending_to_income_ratio=spending_to_income,
            dependents=dependents,
            top_n=3,
        )

        risk_prediction = result["risk_prediction"]   # dict: risk_level, confidence, probabilities
        recommendations = result["recommendations"]   # list of product dicts

        user_data = {
            "age":                      age,
            "monthly_income":           monthly_income,
            "credit_score":             credit_score,
            "predicted_risk_profile":   risk_prediction["risk_level"],
            "risk_confidence":          risk_prediction["confidence"],
            "risk_probabilities":       risk_prediction["probabilities"],
            "shap_explanation":         risk_prediction["shap_explanation"],
            "savings_ratio":            savings_ratio,
            "spending_to_income_ratio": spending_to_income,
            "dependents":               dependents,
        }

        return render_template(
            "results.html",
            recommendations=recommendations,
            user_data=user_data,
        )

    except (ValueError, TypeError) as exc:
        return render_template(
            "index.html",
            errors=[f"Invalid input: {exc}"],
            form_data=request.form,
        )


@app.route("/recommend_ajax", methods=["POST"])
def recommend_ajax():
    """AJAX endpoint – accepts JSON body, returns JSON result (no template)."""
    try:
        data = request.get_json(force=True, silent=True) or {}

        age                = int(data.get("age", 0))
        monthly_income     = float(data.get("monthly_income", 0))
        credit_score       = int(data.get("credit_score", 300))
        savings_ratio      = float(data.get("savings_ratio", 0))
        spending_to_income = float(data.get("spending_to_income_ratio", 0))
        dependents         = int(data.get("dependents", 0))

        # ── Validation ────────────────────────────────────────────────────
        errors = []
        if not (18 <= age <= 100):
            errors.append("Age must be between 18 and 100.")
        if monthly_income <= 0:
            errors.append("Monthly income must be a positive number.")
        if not (300 <= credit_score <= 850):
            errors.append("Credit score must be between 300 and 850.")
        if not (0.0 <= savings_ratio <= 1.0):
            errors.append("Savings ratio must be between 0.0 and 1.0.")
        if not (0.0 <= spending_to_income <= 1.0):
            errors.append("Spending-to-income ratio must be between 0.0 and 1.0.")
        if not (0 <= dependents <= 10):
            errors.append("Dependents must be between 0 and 10.")

        if errors:
            return jsonify({"error": errors}), 400

        result = get_recommendations(
            age=age,
            monthly_income=monthly_income,
            credit_score=credit_score,
            savings_ratio=savings_ratio,
            spending_to_income_ratio=spending_to_income,
            dependents=dependents,
            top_n=3,
        )

        return jsonify(result)

    except (ValueError, TypeError) as exc:
        return jsonify({"error": str(exc)}), 400


@app.route("/stock_analysis", methods=["GET", "POST"])
def stock_analysis():
    """Stock analysis page - allows users to enter a ticker and get AI analysis."""
    stock_data = None
    error = None
    if request.method == "POST":
        ticker = request.form.get("ticker", "").strip().upper()
        if not ticker:
            error = "Please enter a valid ticker symbol (e.g., AAPL, RELIANCE.NS)"
        else:
            result = get_stock_recommendation(ticker)
            if "error" in result:
                error = result["error"]
            else:
                stock_data = result
    
    return render_template("stock_analysis.html", stock_data=stock_data, error=error)


@app.route("/dashboard", methods=["GET", "POST"])
def dashboard():
    """Personal Finance Dashboard - 'Control Your Pocket'."""
    if request.method == "POST":
        amount = float(request.form.get("amount", 0))
        category = request.form.get("category", "")
        merchant = request.form.get("merchant", "")
        payment_mode = request.form.get("payment_mode", "UPI")
        add_transaction("U01", amount, category, payment_mode, merchant)

    report = get_daily_finance_report("U01")
    return render_template("dashboard.html", report=report)


if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)
