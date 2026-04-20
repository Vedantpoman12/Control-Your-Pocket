import { useEffect, useState } from 'react';
import { useCartStore } from '../store/useCartStore';
import {
  TrendingUp, ShieldCheck, Wallet, ShoppingCart,
  IndianRupee, PiggyBank, Target, ArrowRight, Brain
} from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { cart, user, fetchUser, fetchCart } = useCartStore();
  const [recommendations, setRecommendations] = useState(null);
  const [finRecs, setFinRecs] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      await fetchUser();
      await fetchCart();

      try {
        // Fetch Shopping Recommendations
        const res = await fetch('http://localhost:5000/api/recommend', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
        });
        const data = await res.json();
        setRecommendations(data);

        // Fetch Full Financial Recommendations
        const finRes = await fetch('http://localhost:5000/api/financial/recommend', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
        });
        const finData = await finRes.json();
        setFinRecs(finData);
      } catch {
        // silently fail
      }
      setLoading(false);
    };
    init();
  }, []);

  if (loading || !user)
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-white/10 border-t-accent rounded-full animate-spin" />
      </div>
    );

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const income = user.monthly_income || 60000;
  const savingsRatio = user.savings_ratio || 0.25;
  const targetSavings = income * (user.is_student ? 0.15 : 0.3);
  const actualSavings = income * savingsRatio;
  const spendBudget = income - actualSavings;
  const cartPercent = spendBudget > 0 ? Math.min(100, Math.round((total / spendBudget) * 100)) : 0;

  // Build category breakdown from actual cart
  const categoryMap = {};
  cart.forEach((item) => {
    const cat = item.category || 'General';
    categoryMap[cat] = (categoryMap[cat] || 0) + item.price * item.quantity;
  });
  const categories = Object.entries(categoryMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const catColors = ['#7c6fff', '#22c55e', '#f59e0b', '#ef4444', '#06b6d4'];

  return (
    <PageTransition>
      <div className="space-y-10">

        {/* Page Header */}
        <header className="border-b border-border pb-8">
          <span className="text-secondary font-black text-[10px] uppercase tracking-[0.3em] mb-2 block">
            Financial Overview
          </span>
          <h1 className="text-4xl font-black text-primary font-headline tracking-tighter">
            Dashboard
          </h1>
          <p className="text-on-surface-variant font-medium mt-2">
            Your spending snapshot — income, savings, and cart at a glance.
          </p>
        </header>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              icon: <Wallet size={20} />,
              label: 'Monthly Income',
              value: `₹${income.toLocaleString()}`,
              color: 'text-primary',
              bg: 'bg-primary/5',
            },
            {
              icon: <PiggyBank size={20} />,
              label: 'Savings Target',
              value: `₹${targetSavings.toLocaleString()}`,
              sub: `${Math.round((user.is_student ? 0.15 : 0.3) * 100)}% of income`,
              color: 'text-secondary',
              bg: 'bg-secondary/10',
            },
            {
              icon: <ShoppingCart size={20} />,
              label: 'Cart Total',
              value: `₹${total.toLocaleString()}`,
              sub: `${cartPercent}% of spend budget`,
              color: 'text-[#7c6fff]',
              bg: 'bg-[#7c6fff]/10',
            },
            {
              icon: <Target size={20} />,
              label: 'Savings Gap',
              value:
                actualSavings >= targetSavings
                  ? 'On Track'
                  : `₹${Math.round(targetSavings - actualSavings).toLocaleString()}`,
              sub: actualSavings >= targetSavings ? 'Great work!' : 'Short of target',
              color: actualSavings >= targetSavings ? 'text-secondary' : 'text-[#f59e0b]',
              bg: actualSavings >= targetSavings ? 'bg-secondary/10' : 'bg-[#f59e0b]/10',
            },
          ].map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center ${card.color}`}>
                  {card.icon}
                </div>
                <TrendingUp size={14} className="text-border group-hover:text-secondary transition-colors" />
              </div>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-1">
                {card.label}
              </p>
              <p className={`text-2xl font-black font-headline tracking-tight ${card.color}`}>
                {card.value}
              </p>
              {card.sub && (
                <p className="text-[10px] text-on-surface-variant font-medium mt-1">{card.sub}</p>
              )}
            </motion.div>
          ))}
        </section>

        {/* Two Column: Chart + Profile */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Spending Breakdown */}
          <div className="lg:col-span-7 bg-white border border-border rounded-2xl p-8 shadow-sm">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-xl font-black text-primary font-headline tracking-tight">
                  Spending Breakdown
                </h3>
                <p className="text-xs text-on-surface-variant mt-1">By category from your cart</p>
              </div>
              <Link
                to="/"
                className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary hover:text-primary transition-colors flex items-center gap-1"
              >
                Go to Cart <ArrowRight size={12} />
              </Link>
            </div>

            {categories.length === 0 ? (
              <div className="py-16 text-center">
                <ShoppingCart size={36} className="mx-auto text-border mb-4" />
                <p className="text-sm text-on-surface-variant font-medium">
                  No items in cart yet.{' '}
                  <Link to="/" className="text-secondary font-bold underline">
                    Add items
                  </Link>{' '}
                  to see your breakdown.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {categories.map(([cat, amount], i) => {
                  const pct = total > 0 ? Math.round((amount / total) * 100) : 0;
                  return (
                    <motion.div
                      key={cat}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.1em] flex items-center gap-2">
                          <div
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: catColors[i] || '#94a3b8' }}
                          />
                          {cat}
                        </span>
                        <span className="text-xs font-bold text-on-surface-variant">
                          ₹{amount.toLocaleString()} ({pct}%)
                        </span>
                      </div>
                      <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.8, delay: i * 0.1 }}
                          style={{ backgroundColor: catColors[i] || '#94a3b8' }}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Profile Summary + Quick Actions */}
          <div className="lg:col-span-5 flex flex-col gap-6">

            {/* User info */}
            <div className="bg-white border border-border rounded-2xl p-8 shadow-sm">
              <h3 className="text-sm font-black text-primary font-headline uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <ShieldCheck size={16} className="text-secondary" />
                Profile Summary
              </h3>
              <div className="space-y-4">
                {[
                  { label: 'Status', value: user.is_student ? 'Student' : 'Professional' },
                  { label: 'Gender', value: user.gender || 'Not set' },
                  { label: 'Income', value: `₹${income.toLocaleString()}/month` },
                  { label: 'Savings Ratio', value: `${Math.round(savingsRatio * 100)}%` },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center py-3 border-b border-border last:border-0">
                    <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                      {label}
                    </span>
                    <span className="text-sm font-bold text-primary">{value}</span>
                  </div>
                ))}
              </div>
              <Link
                to="/profile"
                className="mt-6 block text-center w-full py-3 bg-surface-container-low border border-border rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:bg-primary hover:text-white transition-all"
              >
                Edit Profile
              </Link>
            </div>

            {/* AI recommendation teaser */}
            {recommendations?.shopping_summary?.advice && (
              <div className="bg-[#00193c] text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-bl-full" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <Brain size={16} className="text-[#58cc02]" />
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/50">AI Shopping Insight</span>
                  </div>
                  <p className="text-white/80 text-sm leading-relaxed font-medium italic">
                    "{recommendations.shopping_summary.advice}"
                  </p>
                  <Link
                    to="/"
                    className="mt-6 block text-center w-full py-3 bg-white/10 border border-white/20 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-white hover:bg-white hover:text-[#00193c] transition-all"
                  >
                    Analyse Full Cart
                  </Link>
                </div>
              </div>
            )}

            {/* Financial Product Teaser */}
            {finRecs?.recommendations?.[0] && (
              <div className="bg-white border border-border rounded-2xl p-6 shadow-sm hover:border-secondary transition-all group">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles size={16} className="text-secondary" />
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-on-surface-variant">Top Wealth Opportunity</span>
                </div>
                <h4 className="font-headline font-black text-primary tracking-tight text-sm mb-1">{finRecs.recommendations[0].name}</h4>
                <p className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-3">{finRecs.recommendations[0].type}</p>
                <div className="flex items-center gap-2 text-[11px] font-medium text-on-surface-variant leading-relaxed">
                  <Target size={12} className="text-secondary" />
                  {finRecs.recommendations[0].match_score}% Profile Match
                </div>
                <Link
                  to="/"
                  className="mt-6 flex items-center justify-center gap-2 w-full py-3 border border-border rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:border-secondary hover:text-secondary transition-all"
                >
                  View Recommendations <ArrowRight size={12} />
                </Link>
              </div>
            )}
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
