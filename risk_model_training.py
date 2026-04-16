"""
risk_model_training.py
Trains a Decision Tree classifier to predict user risk_profile.

users.csv columns:
  user_id, age, gender, job_type, monthly_income, credit_score,
  risk_profile, city_tier, savings_ratio, dependents

transactions.csv columns:
  transaction_id, user_id, amount, category, payment_mode,
  merchant_type, timestamp, is_emi
"""

import os
import pickle
import pandas as pd
import numpy as np
from sklearn.tree import DecisionTreeClassifier
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")

users        = pd.read_csv(os.path.join(DATA_DIR, "users.csv"))
transactions = pd.read_csv(os.path.join(DATA_DIR, "transactions.csv"))

print("Users columns      :", users.columns.tolist())
print("Transaction columns:", transactions.columns.tolist())
print("Users shape        :", users.shape)


spending = (
    transactions.groupby("user_id")["amount"]
    .agg(
        total_spending="sum",
        avg_transaction_amount="mean",
        transaction_count="count"
    )
    .reset_index()
)

users = users.merge(spending, on="user_id", how="left")
users["total_spending"].fillna(0, inplace=True)
users["avg_transaction_amount"].fillna(0, inplace=True)
users["transaction_count"].fillna(0, inplace=True)


users["spending_to_income_ratio"] = (
    users["total_spending"] / users["monthly_income"].replace(0, np.nan)
).fillna(0).clip(0, 1)


emi_counts = (
    transactions[transactions["is_emi"] == 1]
    .groupby("user_id")
    .size()
    .reset_index(name="emi_count")
)
users = users.merge(emi_counts, on="user_id", how="left")
users["emi_count"].fillna(0, inplace=True)

print("\nRisk profile distribution:\n", users["risk_profile"].value_counts())


FEATURES = [
    "age",
    "monthly_income",
    "credit_score",
    "savings_ratio",
    "spending_to_income_ratio",
    "dependents",
]
TARGET = "risk_profile"

df = users[FEATURES + [TARGET]].dropna().copy()
print(f"\nTraining rows: {len(df)}")

risk_encoder = LabelEncoder()
df["risk_encoded"] = risk_encoder.fit_transform(df[TARGET])
print("Risk classes:", risk_encoder.classes_.tolist()) 

X = df[FEATURES]
y = df["risk_encoded"]


scaler   = StandardScaler()
X_scaled = scaler.fit_transform(X)


X_train, X_test, y_train, y_test = train_test_split(
    X_scaled, y, test_size=0.2, random_state=42, stratify=y
)


model = DecisionTreeClassifier(
    max_depth=5,
    random_state=42,
    class_weight="balanced",
)
model.fit(X_train, y_train)


y_pred = model.predict(X_test)
print("\nAccuracy:", round(accuracy_score(y_test, y_pred), 4))
print("\nClassification Report:")
print(classification_report(
    y_test, y_pred,
    target_names=risk_encoder.classes_,
    zero_division=0
))

importance = pd.Series(model.feature_importances_, index=FEATURES).sort_values(ascending=False)
print("\nFeature Importances:")
print(importance.round(4))

artifacts = {
    "model":        model,
    "scaler":       scaler,
    "risk_encoder": risk_encoder,
    "feature_cols": FEATURES,
}

out_path = os.path.join(BASE_DIR, "risk_model.pkl")
with open(out_path, "wb") as f:
    pickle.dump(artifacts, f)

print(f"\n risk_model.pkl saved → {out_path}")