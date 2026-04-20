import pandas as pd
import random
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def seed_interactions():
    users = pd.read_csv(os.path.join(BASE_DIR, "data", "users.csv"))
    products = pd.read_csv(os.path.join(BASE_DIR, "data", "products.csv"))
    
    interactions = []
    
    for _, user in users.iterrows():
        # Each user interacts with 3-7 products
        u_id = user['user_id']
        u_risk = user['risk_profile']
        
        # Risk-based product selection
        suitable_products = products[products['risk_level'] == u_risk]
        if suitable_products.empty:
            suitable_products = products
            
        selected = suitable_products.sample(n=random.randint(3, 7))
        
        for _, prod in selected.iterrows():
            itype = random.choice(['view', 'click', 'apply'])
            score = {'view': 1, 'click': 3, 'apply': 10}[itype]
            interactions.append({
                'interaction_id': f"I{len(interactions):03}",
                'user_id': u_id,
                'product_id': prod['product_id'],
                'interaction_type': itype,
                'interaction_date': '2026-04-15',
                'interaction_score': score
            })
            
    df = pd.DataFrame(interactions)
    df.to_csv(os.path.join(BASE_DIR, "data", "interactions.csv"), index=False)
    print(f"Generated {len(df)} interactions in interactions.csv")

if __name__ == "__main__":
    seed_interactions()
