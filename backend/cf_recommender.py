"""
cf_recommender.py
Implementation of User-Based Collaborative Filtering (UBCF).
"""

import os
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")

class CFRecommender:
    def __init__(self):
        self.load_data()

    def load_data(self):
        self.users = pd.read_csv(os.path.join(DATA_DIR, "users.csv"))
        self.products = pd.read_csv(os.path.join(DATA_DIR, "products.csv"))
        self.interactions = pd.read_csv(os.path.join(DATA_DIR, "interactions.csv"))

    def get_recommendations(self, target_user_id, top_k=5):
        # 1. Construct User-Item Interaction Matrix
        # Rows = Users, Columns = Products, Values = Interaction Scores
        matrix = self.interactions.pivot_table(
            index='user_id', 
            columns='product_id', 
            values='interaction_score',
            fill_value=0
        )

        if target_user_id not in matrix.index:
            # Fallback to Popularity-Based if user has no interactions
            return self.get_popularity_recommendations(top_k)

        # 2. Compute Similarities (Cosine Similarity)
        # Mathematical Step: sim(u, v) = (u . v) / (||u|| * ||v||)
        user_similarities = cosine_similarity(matrix)
        sim_df = pd.DataFrame(user_similarities, index=matrix.index, columns=matrix.index)

        # 3. Score Candidates
        # Find similar users (excluding current user)
        similar_users = sim_df[target_user_id].sort_values(ascending=False)[1:6] # Top 5 similar
        
        # Aggregate scores from similar users
        target_indices = matrix.columns
        user_vector = matrix.loc[target_user_id]
        
        scores = pd.Series(0, index=target_indices)
        
        for other_user, similarity in similar_users.items():
            other_vector = matrix.loc[other_user]
            scores += similarity * other_vector

        # 4. Filter "Seen" items (already interacted)
        interacted_items = self.interactions[self.interactions['user_id'] == target_user_id]['product_id'].unique()
        scores = scores.drop(interacted_items, errors='ignore')

        # 5. Get Top-K
        top_ids = scores.sort_values(ascending=False).head(top_k).index.tolist()
        
        results = []
        for pid in top_ids:
            product = self.products[self.products['product_id'] == pid].iloc[0]
            results.append({
                "product_id": pid,
                "name": product['product_name'],
                "provider": product['provider'],
                "score": float(scores[pid])
            })
            
        return results

    def get_popularity_recommendations(self, top_k=5):
        pop_scores = self.interactions.groupby('product_id')['interaction_score'].sum().sort_values(ascending=False)
        top_ids = pop_scores.head(top_k).index.tolist()
        
        results = []
        for pid in top_ids:
            product = self.products[self.products['product_id'] == pid].iloc[0]
            results.append({
                "product_id": pid,
                "name": product['product_name'],
                "provider": product['provider'],
                "score": float(pop_scores[pid])
            })
        return results

if __name__ == "__main__":
    recommender = CFRecommender()
    print("Testing CF for User 1...")
    recs = recommender.get_recommendations(1)
    for r in recs:
        print(f"- {r['name']} by {r['provider']} (Score: {r['score']:.2f})")
