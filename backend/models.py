from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    monthly_income = db.Column(db.Float, default=50000.0)
    savings_ratio = db.Column(db.Float, default=0.2)
    is_student = db.Column(db.Boolean, default=False)
    gender = db.Column(db.String(20), default="Other")
    cart_items = db.relationship('CartItem', backref='owner', lazy=True)

class CartItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    price = db.Column(db.Float, nullable=False)
    quantity = db.Column(db.Integer, default=1)
    category = db.Column(db.String(50), default='General')
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "price": self.price,
            "quantity": self.quantity,
            "category": self.category,
            "timestamp": self.timestamp.isoformat()
        }
