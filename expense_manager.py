import pandas as pd
import os
from datetime import datetime

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")

def get_daily_finance_report(user_id="U01"):
    """
    Analyzes transactions.csv to provide a daily/monthly financial report.
    """
    try:
        transactions_path = os.path.join(DATA_DIR, "transactions.csv")
        if not os.path.exists(transactions_path):
            return {"error": "No transaction data found."}

        df = pd.read_csv(transactions_path)
        user_df = df[df['user_id'] == user_id].copy()

        if user_df.empty:
            return {"error": "No transactions found for this user."}

        # Basic Stats
        total_spent = user_df['amount'].sum()
        avg_spent = user_df['amount'].mean()
        
        # Category Breakdown
        category_spent = user_df.groupby('category')['amount'].sum().to_dict()
        
        # Recommendations based on spending
        recommendations = []
        top_category = max(category_spent, key=category_spent.get)
        
        if top_category == "Food":
            recommendations.append("You spend a lot on Food. Consider a high-cashback dining card.")
        elif top_category == "Shopping":
            recommendations.append("High shopping expenses detected. We recommend a shopping reward card.")
        
        if total_spent > 10000:
            recommendations.append("Monthly spending is high. Setting a 20% savings goal is recommended.")
        else:
            recommendations.append("Great job! Your spending is well within limits. Consider a Fixed Deposit for your extra savings.")

        return {
            "total_spent": round(total_spent, 2),
            "avg_transaction": round(avg_spent, 2),
            "category_breakdown": category_spent,
            "top_category": top_category,
            "recommendations": recommendations,
            "recent_transactions": user_df.tail(5).to_dict(orient='records')
        }
    except Exception as e:
        return {"error": str(e)}

def add_transaction(user_id, amount, category, payment_mode, merchant):
    """Adds a new transaction to the CSV."""
    try:
        transactions_path = os.path.join(DATA_DIR, "transactions.csv")
        new_id = f"T{pd.read_csv(transactions_path).shape[0] + 1:02d}"
        new_row = {
            "transaction_id": new_id,
            "user_id": user_id,
            "amount": amount,
            "category": category,
            "payment_mode": payment_mode,
            "merchant_type": merchant,
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "is_emi": 0
        }
        df_new = pd.DataFrame([new_row])
        df_new.to_csv(transactions_path, mode='a', header=False, index=False)
        return {"success": True}
    except Exception as e:
        return {"error": str(e)}
