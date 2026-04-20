"""
financial_recommender.py
AI-powered Financial Product Recommender.
Recommends Credit Cards, Debit Cards, Savings Accounts, Personal Loans, and UPI/Wallets.
"""

import requests, json

# ── Product Database ──────────────────────────────────────────────────────────
FINANCIAL_PRODUCTS = [

    # ── Credit Cards ──────────────────────────────────────────────────────────
    {
        "name": "HDFC Millennia Credit Card",
        "type": "Credit Card",
        "annual_fee": "₹1,000 (waived at ₹1L spend)",
        "cashback": "5%",
        "min_income": 25000,
        "credit_score": ["Good (700-749)", "Excellent (750+)"],
        "best_for": ["Online Shopping", "Dining & Restaurants", "Entertainment"],
        "benefits": ["5% cashback on Amazon/Flipkart", "Smart EMI", "Airport Lounge"],
        "description": "India's most popular millennial credit card with flat 5% cashback on top online platforms and dining.",
        "is_student_friendly": False,
    },
    {
        "name": "SBI SimplyCLICK Credit Card",
        "type": "Credit Card",
        "annual_fee": "₹499",
        "cashback": "10x Rewards",
        "min_income": 20000,
        "credit_score": ["Fair (650-699)", "Good (700-749)", "Excellent (750+)"],
        "best_for": ["Online Shopping", "Entertainment"],
        "benefits": ["10x rewards on Amazon", "1% fuel surcharge waiver", "Complimentary movie tickets"],
        "description": "Excellent entry-level card with 10x reward points on online shopping and entertainment.",
        "is_student_friendly": True,
    },
    {
        "name": "Axis Bank ACE Credit Card",
        "type": "Credit Card",
        "annual_fee": "₹499 (waived at ₹2L spend)",
        "cashback": "5%",
        "min_income": 15000,
        "credit_score": ["Fair (650-699)", "Good (700-749)", "Excellent (750+)"],
        "best_for": ["Utilities", "Online Shopping", "Dining & Restaurants"],
        "benefits": ["5% on Google Pay bill payments", "4% on Swiggy/Zomato", "2% everywhere else"],
        "description": "Best flat cashback card in India — 5% back on utility bills and Google Pay payments.",
        "is_student_friendly": True,
    },
    {
        "name": "Amazon Pay ICICI Credit Card",
        "type": "Credit Card",
        "annual_fee": "₹0 (lifetime free)",
        "cashback": "5%",
        "min_income": 18000,
        "credit_score": ["Fair (650-699)", "Good (700-749)", "Excellent (750+)"],
        "best_for": ["Online Shopping", "Groceries"],
        "benefits": ["5% back on Amazon Prime", "3% on Amazon non-Prime", "2% everywhere"],
        "description": "India's best zero-fee credit card. Lifetime free with excellent rewards for Amazon shoppers.",
        "is_student_friendly": True,
    },
    {
        "name": "HDFC Regalia Gold Credit Card",
        "type": "Credit Card",
        "annual_fee": "₹2,500",
        "cashback": "5x Rewards",
        "min_income": 75000,
        "credit_score": ["Excellent (750+)"],
        "best_for": ["Travel & Flights", "Dining & Restaurants", "Online Shopping"],
        "benefits": ["12 International lounge visits", "8 Domestic lounge visits", "5x reward points"],
        "description": "Premium card for frequent travellers with international lounge access and accelerated rewards on travel.",
        "is_student_friendly": False,
    },
    {
        "name": "Kotak 811 Dream Credit Card",
        "type": "Credit Card",
        "annual_fee": "₹0 (lifetime free)",
        "cashback": "2%",
        "min_income": 0,
        "credit_score": ["No Credit History", "Poor (below 650)", "Fair (650-699)"],
        "best_for": ["Online Shopping", "Groceries"],
        "benefits": ["No minimum income requirement", "Build credit from zero", "Virtual card instantly"],
        "description": "Perfect first credit card. No income proof needed — ideal for students and those with no credit history.",
        "is_student_friendly": True,
    },
    {
        "name": "ICICI Bank Coral Credit Card",
        "type": "Credit Card",
        "annual_fee": "₹500",
        "cashback": "2%",
        "min_income": 30000,
        "credit_score": ["Fair (650-699)", "Good (700-749)", "Excellent (750+)"],
        "best_for": ["Dining & Restaurants", "Entertainment", "Online Shopping"],
        "benefits": ["2 complimentary movie tickets/month", "25% off at restaurants", "Lounge access"],
        "description": "Great lifestyle card with free movie tickets monthly and restaurant discounts.",
        "is_student_friendly": False,
    },

    # ── Debit Cards ───────────────────────────────────────────────────────────
    {
        "name": "SBI Platinum Debit Card",
        "type": "Debit Card",
        "annual_fee": "₹300",
        "cashback": "1%",
        "min_income": 0,
        "credit_score": "__all__",
        "best_for": ["Groceries", "Utilities", "Online Shopping"],
        "benefits": ["1% cashback on online transactions", "Free accident insurance ₹2L", "Wide ATM network"],
        "description": "Most trusted debit card in India with accident insurance and wide ATM access across the country.",
        "is_student_friendly": True,
    },
    {
        "name": "HDFC Bank Millennia Debit Card",
        "type": "Debit Card",
        "annual_fee": "₹500",
        "cashback": "5%",
        "min_income": 0,
        "credit_score": "__all__",
        "best_for": ["Online Shopping", "Dining & Restaurants"],
        "benefits": ["5% cashback on Amazon/Flipkart", "Smart Pay enabled", "Tap & Pay"],
        "description": "Premium debit card delivering credit-card-level rewards — 5% cashback on top e-commerce sites.",
        "is_student_friendly": False,
    },
    {
        "name": "Kotak 811 Virtual Debit Card",
        "type": "Debit Card",
        "annual_fee": "₹0",
        "cashback": "1%",
        "min_income": 0,
        "credit_score": "__all__",
        "best_for": ["Online Shopping", "Groceries"],
        "benefits": ["Zero annual fee", "Instant digital card", "1% cashback on spending"],
        "description": "Fully digital zero-fee debit card. Open account in 5 minutes with zero balance needed.",
        "is_student_friendly": True,
    },

    # ── Savings Accounts ──────────────────────────────────────────────────────
    {
        "name": "Fi Money Savings Account",
        "type": "Savings Account",
        "annual_fee": "₹0",
        "cashback": "Up to 6.75% Interest",
        "min_income": 0,
        "credit_score": "__all__",
        "best_for": ["Utilities", "Online Shopping"],
        "benefits": ["6.75% interest on FD sweeps", "Smart spend analytics", "Instant credit on payroll"],
        "description": "India's best neobank savings account with automated savings jars and high FD sweep interest rates.",
        "is_student_friendly": True,
    },
    {
        "name": "HDFC Bank Savings Max Account",
        "type": "Savings Account",
        "annual_fee": "₹0",
        "cashback": "5% Interest",
        "min_income": 0,
        "credit_score": "__all__",
        "best_for": ["Utilities"],
        "benefits": ["5% p.a. interest", "Premium debit card included", "Free NEFT/RTGS"],
        "description": "Premium savings account with competitive interest rates and complimentary premium debit card.",
        "is_student_friendly": False,
    },
    {
        "name": "IDFC FIRST Bank Savings Account",
        "type": "Savings Account",
        "annual_fee": "₹0",
        "cashback": "7% Interest",
        "min_income": 0,
        "credit_score": "__all__",
        "best_for": ["Utilities", "Groceries"],
        "benefits": ["7% interest (highest in category)", "Zero fee on all ATM withdrawals", "Unlimited transactions"],
        "description": "Highest interest-paying savings account in India with zero-fee unlimited transactions.",
        "is_student_friendly": True,
    },

    # ── Personal Loans ────────────────────────────────────────────────────────
    {
        "name": "MoneyTap Personal Credit Line",
        "type": "Personal Loan",
        "annual_fee": "Interest from 12%",
        "cashback": "Flexible EMI",
        "min_income": 20000,
        "credit_score": ["Fair (650-699)", "Good (700-749)", "Excellent (750+)"],
        "best_for": ["Healthcare"],
        "benefits": ["Instant approval", "Pay interest only on amount used", "Up to ₹5 lakh credit line"],
        "description": "Flexible credit line — borrow what you need and pay interest only on usage. Great for emergencies.",
        "is_student_friendly": False,
    },
    {
        "name": "HDFC Personal Loan",
        "type": "Personal Loan",
        "annual_fee": "Interest from 10.5%",
        "cashback": "Lowest EMI",
        "min_income": 25000,
        "credit_score": ["Good (700-749)", "Excellent (750+)"],
        "best_for": ["Healthcare", "Travel & Flights"],
        "benefits": ["Pre-approved in 10 seconds", "Up to ₹40 lakh amount", "Minimal documentation"],
        "description": "India's most popular personal loan with instant pre-approval and competitive interest rates.",
        "is_student_friendly": False,
    },

    # ── UPI / Wallets ─────────────────────────────────────────────────────────
    {
        "name": "Cred App UPI + CRED Coins",
        "type": "UPI / Wallet",
        "annual_fee": "₹0",
        "cashback": "CRED Coins + Offers",
        "min_income": 0,
        "credit_score": ["Good (700-749)", "Excellent (750+)"],
        "best_for": ["Utilities", "Dining & Restaurants"],
        "benefits": ["Bill payment rewards", "CRED coin marketplace", "Premium brand discounts"],
        "description": "If you have a credit card, CRED rewards you for paying bills on time with exclusive offers.",
        "is_student_friendly": False,
    },
    {
        "name": "PhonePe UPI + SmartSave",
        "type": "UPI / Wallet",
        "annual_fee": "₹0",
        "cashback": "Cashback + Offers",
        "min_income": 0,
        "credit_score": "__all__",
        "best_for": ["Groceries", "Utilities", "Online Shopping"],
        "benefits": ["Mutual fund investments in-app", "Insurance products", "UPI cashback offers"],
        "description": "Most widely accepted UPI app with integrated mutual fund investments and insurance directly in-app.",
        "is_student_friendly": True,
    },
    {
        "name": "Google Pay UPI",
        "type": "UPI / Wallet",
        "annual_fee": "₹0",
        "cashback": "Scratch Cards",
        "min_income": 0,
        "credit_score": "__all__",
        "best_for": ["Utilities", "Online Shopping", "Dining & Restaurants"],
        "benefits": ["Instant scratch-card rewards", "0% fee transactions", "Bill payments with offers"],
        "description": "Most trusted UPI interface with seamless money transfers, bill payments, and reward scratch cards.",
        "is_student_friendly": True,
    },
]

# ── Score & Filter ────────────────────────────────────────────────────────────
def score_product(product: dict, profile: dict) -> float:
    score = 50.0  # base
    income = float(profile.get("monthly_income", 0) or 0)
    is_student = bool(profile.get("is_student", False))
    credit_range = profile.get("credit_score_range", "Good (700-749)")
    categories = profile.get("top_categories", [])

    # Income gate
    if income < product.get("min_income", 0):
        return -1  # not eligible

    # Credit score match
    prod_score = product.get("credit_score", "__all__")
    if prod_score != "__all__":
        if credit_range not in prod_score:
            score -= 25

    # Category match
    best_for = product.get("best_for", [])
    overlap = len(set(categories) & set(best_for))
    score += overlap * 12

    # Student friendliness
    if is_student and product.get("is_student_friendly"):
        score += 18
    elif is_student and not product.get("is_student_friendly"):
        score -= 10

    # Annual fee preference (lower = better for lower income)
    if income < 30000:
        fee = product.get("annual_fee", "")
        if "₹0" in fee or "free" in fee.lower():
            score += 15
        elif "₹499" in fee or "₹500" in fee:
            score += 5

    return round(min(score, 100), 1)


# ── Saving Opportunities Engine ───────────────────────────────────────────────
def compute_saving_opportunities(profile: dict) -> list:
    income     = float(profile.get("monthly_income", 0) or 0)
    raw_spend  = float(profile.get("monthly_spend", 0) or 0)
    savings_r  = float(profile.get("savings_ratio", 0.25))
    categories = profile.get("top_categories", [])
    is_student = bool(profile.get("is_student", False))

    # Estimate category-level spend (rough split of monthly_spend)
    cat_weight = {
        "Online Shopping":       0.20,
        "Dining & Restaurants":  0.15,
        "Travel & Flights":      0.12,
        "Fuel":                  0.10,
        "Groceries":             0.18,
        "Entertainment":         0.08,
        "Healthcare":            0.07,
        "Utilities":             0.10,
    }
    effective_spend = raw_spend if raw_spend > 0 else income * 0.55
    total_weight = sum(cat_weight.get(c, 0.1) for c in categories) if categories else 1
    cat_spend = {c: effective_spend * (cat_weight.get(c, 0.1) / max(total_weight, 0.01)) for c in categories}

    opps = []

    # ── Online Shopping ────────────────────────────────────────────────────────
    if "Online Shopping" in categories:
        s = cat_spend.get("Online Shopping", effective_spend * 0.20)
        cashback_5_pct = round(s * 0.05)
        opps.append({
            "icon": "ShoppingBag",
            "category": "Online Shopping",
            "title": "Earn 5% cashback on every online purchase",
            "description": f"Switch to Amazon Pay ICICI (₹0 fee) or HDFC Millennia. On ₹{int(s):,}/month online spend, earn ₹{cashback_5_pct:,} back every month.",
            "monthly_saving": cashback_5_pct,
            "annual_saving":  cashback_5_pct * 12,
            "action": "Apply for Amazon Pay ICICI Credit Card",
            "difficulty": "Easy",
            "color": "orange",
        })

    # ── Dining & Restaurants ──────────────────────────────────────────────────
    if "Dining & Restaurants" in categories:
        s = cat_spend.get("Dining & Restaurants", effective_spend * 0.15)
        zomato_save = round(s * 0.04)
        opps.append({
            "icon": "UtensilsCrossed",
            "category": "Dining",
            "title": "4% back on Swiggy, Zomato & restaurants",
            "description": f"Axis ACE card gives 4% cashback on food delivery apps. At ₹{int(s):,}/month on dining, that's ₹{zomato_save:,} back monthly.",
            "monthly_saving": zomato_save,
            "annual_saving":  zomato_save * 12,
            "action": "Apply for Axis Bank ACE Credit Card",
            "difficulty": "Easy",
            "color": "red",
        })

    # ── Fuel ──────────────────────────────────────────────────────────────────
    if "Fuel" in categories:
        s = cat_spend.get("Fuel", effective_spend * 0.10)
        surcharge_save = round(s * 0.01)
        opps.append({
            "icon": "Fuel",
            "category": "Fuel",
            "title": "Save 1% fuel surcharge on every refuel",
            "description": f"Use SBI SimplyCLICK to waive 1% fuel surcharge. At ₹{int(s):,}/month on fuel, save ₹{surcharge_save:,} monthly.",
            "monthly_saving": surcharge_save,
            "annual_saving":  surcharge_save * 12,
            "action": "Apply for BPCL SBI Credit Card",
            "difficulty": "Easy",
            "color": "yellow",
        })

    # ── Groceries ─────────────────────────────────────────────────────────────
    if "Groceries" in categories:
        s = cat_spend.get("Groceries", effective_spend * 0.18)
        grocery_save = round(s * 0.03)
        opps.append({
            "icon": "ShoppingCart",
            "category": "Groceries",
            "title": "3% cashback at supermarkets & BigBasket",
            "description": f"Amazon Pay ICICI gives 3% on grocery apps. At ₹{int(s):,}/month groceries, earn ₹{grocery_save:,} back.",
            "monthly_saving": grocery_save,
            "annual_saving":  grocery_save * 12,
            "action": "Use Amazon Pay ICICI for all grocery payments",
            "difficulty": "Easy",
            "color": "green",
        })

    # ── Utilities ─────────────────────────────────────────────────────────────
    if "Utilities" in categories:
        s = cat_spend.get("Utilities", effective_spend * 0.10)
        util_save = round(s * 0.05)
        opps.append({
            "icon": "Zap",
            "category": "Utilities & Bills",
            "title": "5% back on all utility & bill payments",
            "description": f"Axis ACE gives 5% on Google Pay bill payments. At ₹{int(s):,}/month utilities, save ₹{util_save:,} monthly — ₹{util_save*12:,}/year.",
            "monthly_saving": util_save,
            "annual_saving":  util_save * 12,
            "action": "Pay all bills via Axis ACE + Google Pay",
            "difficulty": "Easy",
            "color": "blue",
        })

    # ── Travel ────────────────────────────────────────────────────────────────
    if "Travel & Flights" in categories:
        s = cat_spend.get("Travel & Flights", effective_spend * 0.12)
        lounge_val = 1500
        travel_save = round(s * 0.04) + (lounge_val * 2 if income >= 75000 else 0)
        opps.append({
            "icon": "Plane",
            "category": "Travel",
            "title": "Earn miles + free lounge access on travel",
            "description": f"HDFC Regalia Gold gives 4% miles on flights + 20 lounge visits/year (worth ₹{lounge_val*20:,}). At ₹{int(s):,}/month travel, earn ₹{round(s*0.04):,} in rewards.",
            "monthly_saving": round(travel_save / 12),
            "annual_saving":  travel_save,
            "action": "Apply for HDFC Regalia Gold Credit Card",
            "difficulty": "Medium",
            "color": "purple",
        })

    # ── Entertainment ─────────────────────────────────────────────────────────
    if "Entertainment" in categories:
        s = cat_spend.get("Entertainment", effective_spend * 0.08)
        movie_val = 300
        ent_save = round(s * 0.10) + movie_val * 2
        opps.append({
            "icon": "Clapperboard",
            "category": "Entertainment",
            "title": "2 free movie tickets + 10% OTT cashback",
            "description": f"ICICI Coral gives 2 free BookMyShow tickets/month (₹{movie_val*2:,} value) plus 10x rewards on streaming. Estimated ₹{ent_save:,}/month savings.",
            "monthly_saving": ent_save,
            "annual_saving":  ent_save * 12,
            "action": "Apply for ICICI Bank Coral Credit Card",
            "difficulty": "Easy",
            "color": "pink",
        })

    # ── Healthcare ────────────────────────────────────────────────────────────
    if "Healthcare" in categories:
        s = cat_spend.get("Healthcare", effective_spend * 0.07)
        health_save = round(s * 0.05)
        opps.append({
            "icon": "HeartPulse",
            "category": "Healthcare",
            "title": "5% off on medical & pharmacy spends",
            "description": f"Several cards including HDFC Millennia offer 5% on health apps (Practo, Pharmeasy). At ₹{int(s):,}/month healthcare, save ₹{health_save:,}.",
            "monthly_saving": health_save,
            "annual_saving":  health_save * 12,
            "action": "Use HDFC Millennia for all health payments",
            "difficulty": "Easy",
            "color": "rose",
        })

    # ── Universal: Idle Savings Interest ─────────────────────────────────────
    idle_funds = income * savings_r
    if idle_funds > 5000:
        standard_interest = round(idle_funds * 0.035 / 12)
        idfc_interest     = round(idle_funds * 0.07  / 12)
        extra             = idfc_interest - standard_interest
        opps.append({
            "icon": "PiggyBank",
            "category": "Idle Savings",
            "title": "Earn 7% p.a. instead of 3.5% on your savings",
            "description": f"Move ₹{int(idle_funds):,} savings to IDFC FIRST Bank (7% p.a.) instead of a standard savings account (3.5%). Earn ₹{extra:,} extra per month — ₹{extra*12:,}/year.",
            "monthly_saving": extra,
            "annual_saving":  extra * 12,
            "action": "Open IDFC FIRST Bank savings account",
            "difficulty": "Easy",
            "color": "teal",
        })

    # ── Student special ───────────────────────────────────────────────────────
    if is_student:
        opps.append({
            "icon": "GraduationCap",
            "category": "Student Benefits",
            "title": "Zero-fee student card — build credit & save",
            "description": "Kotak 811 Dream Card: no income proof, lifetime free, 2% cashback on all spends. Build your CIBIL score from zero while earning rewards.",
            "monthly_saving": round(effective_spend * 0.02),
            "annual_saving":  round(effective_spend * 0.02 * 12),
            "action": "Apply for Kotak 811 Dream Credit Card",
            "difficulty": "Easy",
            "color": "indigo",
        })

    # Sort by highest annual saving
    opps.sort(key=lambda x: x["annual_saving"], reverse=True)
    return opps


def spend_fallback(income):
    return income * 0.55


def get_financial_recommendations(profile: dict) -> dict:
    income       = float(profile.get("monthly_income", 0) or 0)
    spend        = float(profile.get("monthly_spend", 0) or 0)
    savings_r    = float(profile.get("savings_ratio", 0.25))
    is_student   = bool(profile.get("is_student", False))
    gender       = profile.get("gender", "Other")
    categories   = profile.get("top_categories", [])
    credit_range = profile.get("credit_score_range", "Good (700-749)")
    existing     = profile.get("existing_cards", "")

    # Score every product
    scored = []
    for prod in FINANCIAL_PRODUCTS:
        s = score_product(prod, profile)
        if s >= 0:
            entry = dict(prod)
            entry["match_score"] = int(s)
            entry["is_best_match"] = False
            scored.append(entry)

    scored.sort(key=lambda x: x["match_score"], reverse=True)

    # Mark top 3 as best match
    for i, p in enumerate(scored[:3]):
        p["is_best_match"] = True

    # ── Financial health score ────────────────────────────────────────────────
    if income > 0:
        spend_r  = spend / income if spend else 0
        health   = 50 + (savings_r * 40) - (spend_r * 20)
        health   = max(10, min(100, int(health)))
    else:
        health = 50

    # ── AI Insights via Ollama ────────────────────────────────────────────────
    cat_str  = ", ".join(categories) if categories else "general spending"
    top_recs = ", ".join([p["name"] for p in scored[:3]])

    prompt = f"""You are an elite personal finance advisor in India.

User Profile:
- Monthly Income: ₹{income:,.0f}
- Monthly Spend: ₹{spend:,.0f}
- Credit Score: {credit_range}
- Status: {'Student' if is_student else 'Professional'}, {gender}
- Top Spending Categories: {cat_str}
- Existing Products: {existing if existing else 'None'}
- Top Recommended Products: {top_recs}

Provide EXACTLY 4 short, actionable financial insights (bullet points) in this order:
1. Assessment of their credit card situation
2. One specific saving opportunity based on their spending
3. A key risk or warning about their current profile
4. One long-term wealth-building tip

Keep each point under 20 words. Use ₹ for currency. Be direct, concrete, and professional."""

    insights = []
    score_summary = f"{'Solid foundation' if health >= 65 else 'Needs attention'} — focus on {'building credit' if credit_range in ['No Credit History', 'Poor (below 650)'] else 'maximising rewards'}."

    try:
        res = requests.post(
            "http://localhost:11434/api/generate",
            json={"model": "llama3", "prompt": prompt, "stream": False},
            timeout=30
        )
        raw = res.json().get("response", "")
        lines = [l.strip() for l in raw.split("\n") if l.strip()]
        insights = [l.lstrip("0123456789.-•*) ").strip() for l in lines if len(l) > 15][:6]
        if not insights:
            insights = [raw[:120]] if raw else []
    except Exception as e:
        insights = [
            f"With ₹{income:,.0f} income and {credit_range} credit, focus on cashback cards matching your {cat_str} spending.",
            f"Aim to save {int(savings_r*100)}% of income monthly — the recommended 30% target is {'within reach' if savings_r >= 0.3 else 'below current'}.",
            "Avoid multiple hard credit enquiries within 6 months to protect your credit score.",
            "A FD-linked savings sweep account can earn 6-7% on idle funds automatically.",
        ]

    return {
        "financial_score": health,
        "score_summary": score_summary,
        "insights": insights,
        "saving_opportunities": compute_saving_opportunities(profile),
        "recommendations": scored,
        "profile_context": {
            "income": income,
            "credit_range": credit_range,
            "is_student": is_student,
        }
    }
