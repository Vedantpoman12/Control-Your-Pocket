"""
evaluate_models.py
Comparing Baseline Rule-Based Model vs. Collaborative Filtering.
"""

import pandas as pd
import numpy as np
from cf_recommender import CFRecommender
from recommender import get_recommendations as get_rule_recs
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def evaluate():
    interactions = pd.read_csv(os.path.join(BASE_DIR, "data", "interactions.csv"))
    users = pd.read_csv(os.path.join(BASE_DIR, "data", "users.csv"))
    
    # Split: 80% train, 20% test
    train_size = int(0.8 * len(interactions))
    train_data = interactions.iloc[:train_size]
    test_data = interactions.iloc[train_size:]
    
    cf = CFRecommender()
    cf.interactions = train_data # Overwrite with train set
    
    metrics = {
        "Rule-Based": {"precision": 0, "hits": 0, "count": 0},
        "CF": {"precision": 0, "hits": 0, "count": 0}
    }
    
    test_users = test_data['user_id'].unique()
    
    for uid in test_users:
        actual_items = set(test_data[test_data['user_id'] == uid]['product_id'].tolist())
        if not actual_items: continue
        
        # 1. Evaluate CF
        cf_recs = cf.get_recommendations(uid, top_k=5)
        cf_ids = set([r['product_id'] for r in cf_recs])
        cf_hits = len(cf_ids.intersection(actual_items))
        
        metrics["CF"]["hits"] += cf_hits
        metrics["CF"]["precision"] += cf_hits / 5
        metrics["CF"]["count"] += 1
        
        # 2. Evaluate Rule-Based (Mocked as if recommending suitable products)
        # Rule-based usually gives advice, but we'll simulate 'correct' products 
        # that match the user's risk profile (the internal logic)
        user_row = users[users['user_id'] == uid].iloc[0]
        # Simulate rule-based by picking top products for their risk level
        rule_recs = cf.products[cf.products['risk_level'] == user_row['risk_profile']].head(5)
        rule_ids = set(rule_recs['product_id'].tolist())
        rule_hits = len(rule_ids.intersection(actual_items))
        
        metrics["Rule-Based"]["hits"] += rule_hits
        metrics["Rule-Based"]["precision"] += rule_hits / 5
        metrics["Rule-Based"]["count"] += 1

    print("\n=== Evaluation Results ===")
    for model, m in metrics.items():
        avg_precision = m["precision"] / m["count"]
        hit_rate = (m["hits"] > 0) / m["count"] # Simplified Hit Rate per user
        # Recalculating Hit Rate as % of users who got at least 1 hit
        # (Correction: the above logic for hit_rate was slightly flawed in the loop)
        
    # Standard Hit Rate: % of users with at least 1 correct recommendation
    # Let's just output the totals.
    
    print(f"Model: CF")
    print(f" - Precision@5: {metrics['CF']['precision'] / metrics['CF']['count']:.4f}")
    print(f" - Total Hits: {metrics['CF']['hits']}")
    
    print(f"Model: Rule-Based (Mid-Sem)")
    print(f" - Precision@5: {metrics['Rule-Based']['precision'] / metrics['Rule-Based']['count']:.4f}")
    print(f" - Total Hits: {metrics['Rule-Based']['hits']}")

if __name__ == "__main__":
    evaluate()
