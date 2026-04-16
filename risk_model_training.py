"""
risk_model_training.py  (v2)
Trains a RandomForest classifier to predict user risk level (Low / Medium / High)
using the real loan_approval_dataset.csv (4 269 rows, cibil_score 300-900).

Risk mapping from CIBIL score:
  >= 750  → Low
  600-749 → Medium
  < 600   → High
"""

import os, pickle
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "datasets")

# ── Load & clean ─────────────────────────────────────────────────────────────
df = pd.read_csv(os.path.join(DATA_DIR, "loan_approval_dataset.csv"))
df.columns = df.columns.str.strip()
df["education"]     = df["education"].str.strip()
df["self_employed"] = df["self_employed"].str.strip()
df["loan_status"]   = df["loan_status"].str.strip()

print("Shape:", df.shape)
print("Loan status dist:\n", df["loan_status"].value_counts())

# ── Derive risk_profile from cibil_score ─────────────────────────────────────
def cibil_to_risk(score):
    if score >= 750: return "Low"
    if score >= 600: return "Medium"
    return "High"

df["risk_profile"] = df["cibil_score"].apply(cibil_to_risk)
print("\nRisk profile dist:\n", df["risk_profile"].value_counts())

# ── Encode categoricals ───────────────────────────────────────────────────────
df["education_enc"]     = (df["education"] == "Graduate").astype(int)
df["self_employed_enc"] = (df["self_employed"] == "Yes").astype(int)

# ── monthly_income from income_annum ─────────────────────────────────────────
df["monthly_income"] = df["income_annum"] / 12

# ── spending_to_income_ratio proxy from loan_amount / income ─────────────────
df["spending_ratio"] = (df["loan_amount"] / df["income_annum"]).clip(0, 5)

# ── savings_ratio proxy ───────────────────────────────────────────────────────
total_assets = (df["residential_assets_value"] + df["commercial_assets_value"]
                + df["luxury_assets_value"] + df["bank_asset_value"])
df["savings_ratio"] = (df["bank_asset_value"] / (total_assets + 1)).clip(0, 1)

FEATURES = [
    "monthly_income",
    "cibil_score",
    "no_of_dependents",
    "education_enc",
    "self_employed_enc",
    "spending_ratio",
    "savings_ratio",
]
TARGET = "risk_profile"

data = df[FEATURES + [TARGET]].dropna().copy()
print(f"\nTraining rows: {len(data)}")

risk_encoder = LabelEncoder()
data["risk_encoded"] = risk_encoder.fit_transform(data[TARGET])
print("Classes:", risk_encoder.classes_.tolist())

X = data[FEATURES].values
y = data["risk_encoded"].values

scaler   = StandardScaler()
X_scaled = scaler.fit_transform(X)

X_train, X_test, y_train, y_test = train_test_split(
    X_scaled, y, test_size=0.2, random_state=42, stratify=y
)

model = RandomForestClassifier(
    n_estimators=200,
    max_depth=8,
    random_state=42,
    class_weight="balanced",
)
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
acc = accuracy_score(y_test, y_pred)
print(f"\nAccuracy: {acc:.4f}")
print("\nClassification Report:")
print(classification_report(y_test, y_pred, target_names=risk_encoder.classes_, zero_division=0))

artifacts = {
    "model":        model,
    "scaler":       scaler,
    "risk_encoder": risk_encoder,
    "feature_cols": FEATURES,
}
out = os.path.join(BASE_DIR, "risk_model.pkl")
with open(out, "wb") as f:
    pickle.dump(artifacts, f)
print(f"\nDone. risk_model.pkl saved -> {out}")