"""
app.py (v4) — Full Backend with SQLite Database Integration
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, User, CartItem
from recommender import get_recommendations, analyze_cart_with_ollama
from financial_recommender import get_financial_recommendations
import os

app = Flask(__name__)
CORS(app)

# Database Configuration
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{os.path.join(BASE_DIR, "finance.db")}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

# Initialize Database
with app.app_context():
    db.create_all()
    # Create a default user if none exists
    if not User.query.first():
        default_user = User(username="default_user", monthly_income=60000, savings_ratio=0.25)
        db.session.add(default_user)
        db.session.commit()

# ── API ENDPOINTS ─────────────────────────────────────────────────────────────

@app.route("/api/user", methods=["GET"])
def get_user():
    user = User.query.first()
    return jsonify({
        "username": user.username,
        "monthly_income": user.monthly_income,
        "savings_ratio": user.savings_ratio,
        "is_student": user.is_student,
        "gender": user.gender
    })

@app.route("/api/user", methods=["POST"])
def update_user():
    user = User.query.first()
    data = request.get_json() or {}
    user.monthly_income = data.get("monthly_income", user.monthly_income)
    user.savings_ratio = data.get("savings_ratio", user.savings_ratio)
    user.is_student = data.get("is_student", user.is_student)
    user.gender = data.get("gender", user.gender)
    db.session.commit()
    return jsonify({"success": True})

@app.route("/api/cart", methods=["GET", "POST"])
def cart_manager():
    user = User.query.first()
    if request.method == "POST":
        data = request.get_json() or {}
        item = CartItem(
            name=data.get("name"),
            price=float(data.get("price", 0)),
            quantity=int(data.get("quantity", 1)),
            category=data.get("category", "General"),
            user_id=user.id
        )
        db.session.add(item)
        db.session.commit()
        return jsonify({"success": True, "item": item.to_dict()}), 201

    items = CartItem.query.filter_by(user_id=user.id).all()
    return jsonify([i.to_dict() for i in items])

@app.route("/api/cart/remove", methods=["POST"])
def remove_cart_item():
    data = request.get_json() or {}
    item_id = data.get("id")
    item = CartItem.query.get(item_id)
    if item:
        db.session.delete(item)
        db.session.commit()
    return jsonify({"success": True})

@app.route("/api/cart/analyze", methods=["POST"])
def analyze_cart():
    user = User.query.first()
    items = CartItem.query.filter_by(user_id=user.id).all()
    if not items:
        return jsonify({"error": "No items to analyze."}), 400
    
    cart_list = [i.to_dict() for i in items]
    result = analyze_cart_with_ollama(
        cart_list, 
        user.monthly_income, 
        is_student=user.is_student, 
        gender=user.gender
    )
    return jsonify(result)

@app.route("/api/recommend", methods=["POST"])
def recommend():
    user = User.query.first()
    data = request.get_json() or {}
    
    # Use provided data or fallback to DB user profile
    income = data.get("monthly_income", user.monthly_income)
    savings = data.get("savings_ratio", user.savings_ratio)
    is_student = data.get("is_student", user.is_student)
    gender = data.get("gender", user.gender)

    result = get_recommendations(
        monthly_income=income, 
        savings_ratio=savings, 
        is_student=is_student, 
        gender=gender
    )
    return jsonify(result)

@app.route("/api/financial/recommend", methods=["POST"])
def financial_recommend():
    data = request.get_json() or {}
    result = get_financial_recommendations(data)
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)
