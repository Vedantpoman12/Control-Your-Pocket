"""
risk_model_training.py (v3)
Trains a RandomForest classifier to predict user risk level (Low / Medium / High).
Uses data/users.csv which follows the Personal Finance ML Dataset schema.
"""

import os, pickle
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def train_model():
    users_path = os.path.join(BASE_DIR, "data", "users.csv")
    if not os.path.exists(users_path):
        print(f"Error: {users_path} not found.")
        return

    # Load and clean
    df = pd.read_csv(users_path)
    
    # We use these features as suggested by the Personal Finance ML schema
    # monthly_income, age, savings_ratio, credit_score, spending_ratio, etc.
    
    FEATURES = [
        "monthly_income",
        "credit_score",
        "age",
        "savings_ratio",
        "spending_ratio",
        "no_of_dependents",
        "education_enc",
        "self_employed_enc"
    ]
    TARGET = "risk_profile"

    # Ensure all features exist in the CSV
    missing = [f for f in FEATURES if f not in df.columns]
    if missing:
        print(f"Error: Missing columns {missing} in users.csv")
        return

    data = df[FEATURES + [TARGET]].dropna().copy()
    print(f"Training on {len(data)} rows...")

    risk_encoder = LabelEncoder()
    data["risk_encoded"] = risk_encoder.fit_transform(data[TARGET])
    print("Risk Classes:", risk_encoder.classes_.tolist())

    X = data[FEATURES].values
    y = data["risk_encoded"].values

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    X_train, X_test, y_train, y_test = train_test_split(
        X_scaled, y, test_size=0.2, random_state=42, stratify=y
    )

    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=6,
        random_state=42,
        class_weight="balanced"
    )
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    print(f"Model Accuracy: {accuracy_score(y_test, y_pred):.2%}")

    # Save
    artifacts = {
        "model": model,
        "scaler": scaler,
        "risk_encoder": risk_encoder,
        "feature_cols": FEATURES,
    }
    
    out_path = os.path.join(BASE_DIR, "risk_model.pkl")
    with open(out_path, "wb") as f:
        pickle.dump(artifacts, f)
    
    print(f"Successfully saved risk_model.pkl -> {out_path}")

if __name__ == "__main__":
    train_model()