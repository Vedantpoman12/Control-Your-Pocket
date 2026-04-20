import React, { useState, useEffect } from 'react';
import {
  CreditCard, Landmark, Wallet2, TrendingUp, TrendingDown, Sparkles, Brain,
  Loader2, AlertCircle, CheckCircle2, ChevronRight, ShieldCheck,
  BadgePercent, Zap, Star, ArrowRight, BarChart3, PiggyBank,
  RefreshCw, IndianRupee, Target, Receipt, ShoppingBag, Plane,
  UtensilsCrossed, Fuel, ShoppingCart as CartIcon, Clapperboard,
  HeartPulse, GraduationCap, TrendingUp as TUp
} from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import PageTransition from '../components/PageTransition';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORY_OPTIONS = [
  'Online Shopping', 'Dining & Restaurants', 'Travel & Flights',
  'Fuel', 'Groceries', 'Entertainment', 'Healthcare', 'Utilities'
];

const TAG_COLORS = {
  'Credit Card': 'bg-[#7c6fff]/10 text-[#7c6fff] border-[#7c6fff]/20',
  'Debit Card':  'bg-secondary/10 text-secondary border-secondary/20',
  'Savings Account': 'bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/20',
  'Personal Loan': 'bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/20',
  'UPI / Wallet':  'bg-[#06b6d4]/10 text-[#06b6d4] border-[#06b6d4]/20',
  'Mutual Fund': 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  'Insurance': 'bg-rose-500/10 text-rose-600 border-rose-500/20',
  'Fixed Deposit': 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
  'Wealth Management': 'bg-violet-500/10 text-violet-600 border-violet-500/20',
};

const PRODUCT_ICONS = {
  'Credit Card': <CreditCard size={20} />,
  'Debit Card':  <Wallet2 size={20} />,
  'Savings Account': <Landmark size={20} />,
  'Personal Loan': <IndianRupee size={20} />,
  'UPI / Wallet':  <Zap size={20} />,
  'Mutual Fund': <TrendingUp size={20} />,
  'Insurance': <ShieldCheck size={20} />,
  'Fixed Deposit': <Target size={20} />,
  'Wealth Management': <Sparkles size={20} />,
};

const OPP_ICON_MAP = {
  ShoppingBag: <ShoppingBag size={18} />,
  UtensilsCrossed: <UtensilsCrossed size={18} />,
  Fuel: <Fuel size={18} />,
  ShoppingCart: <CartIcon size={18} />,
  Zap: <Zap size={18} />,
  Plane: <Plane size={18} />,
  Clapperboard: <Clapperboard size={18} />,
  HeartPulse: <HeartPulse size={18} />,
  PiggyBank: <PiggyBank size={18} />,
  GraduationCap: <GraduationCap size={18} />,
};

const OPP_COLOR = {
  orange: { bg: 'bg-orange-50',   border: 'border-orange-200', icon: 'bg-orange-100 text-orange-600', bar: 'bg-orange-400', tag: 'text-orange-600' },
  red:    { bg: 'bg-red-50',      border: 'border-red-200',    icon: 'bg-red-100 text-red-600',    bar: 'bg-red-400',    tag: 'text-red-600' },
  yellow: { bg: 'bg-yellow-50',   border: 'border-yellow-200', icon: 'bg-yellow-100 text-yellow-600', bar: 'bg-yellow-400', tag: 'text-yellow-600' },
  green:  { bg: 'bg-green-50',    border: 'border-green-200',  icon: 'bg-green-100 text-green-700', bar: 'bg-green-500',  tag: 'text-green-700' },
  blue:   { bg: 'bg-blue-50',     border: 'border-blue-200',   icon: 'bg-blue-100 text-blue-600',  bar: 'bg-blue-500',   tag: 'text-blue-600' },
  purple: { bg: 'bg-purple-50',   border: 'border-purple-200', icon: 'bg-purple-100 text-purple-600', bar: 'bg-purple-500', tag: 'text-purple-600' },
  pink:   { bg: 'bg-pink-50',     border: 'border-pink-200',   icon: 'bg-pink-100 text-pink-600',  bar: 'bg-pink-500',   tag: 'text-pink-600' },
  teal:   { bg: 'bg-teal-50',     border: 'border-teal-200',   icon: 'bg-teal-100 text-teal-700',  bar: 'bg-teal-500',   tag: 'text-teal-700' },
  rose:   { bg: 'bg-rose-50',     border: 'border-rose-200',   icon: 'bg-rose-100 text-rose-600',  bar: 'bg-rose-500',   tag: 'text-rose-600' },
  indigo: { bg: 'bg-indigo-50',   border: 'border-indigo-200', icon: 'bg-indigo-100 text-indigo-600', bar: 'bg-indigo-500', tag: 'text-indigo-600' },
};

export default function FinancialAnalyzer() {
  const { fetchUser, user, setNotification } = useCartStore();

  // ── Profile state ──────────────────────────────────────────────────────────
  const [profile, setProfile] = useState({
    monthly_income: '',
    monthly_spend: '',
    savings_ratio: 0.25,
    is_student: false,
    gender: 'Other',
    top_categories: [],
    existing_cards: '',
    credit_score_range: 'Good (700-749)',
  });

  const [analysis, setAnalysis]           = useState(null);
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState('');
  const [activeTab, setActiveTab]         = useState('all');

  useEffect(() => {
    fetchUser().then(() => {
      if (user) {
        setProfile(p => ({
          ...p,
          monthly_income: user.monthly_income || '',
          savings_ratio: user.savings_ratio || 0.25,
          is_student: user.is_student || false,
          gender: user.gender || 'Other',
        }));
      }
    });
  }, []);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const toggleCategory = (cat) => {
    setProfile(p => ({
      ...p,
      top_categories: p.top_categories.includes(cat)
        ? p.top_categories.filter(c => c !== cat)
        : [...p.top_categories, cat],
    }));
  };

  // ── Run Analysis ───────────────────────────────────────────────────────────
  const runAnalysis = async () => {
    if (!profile.monthly_income) { setError('Please enter your monthly income.'); return; }
    setLoading(true); setError(''); setAnalysis(null);

    try {
      const res = await fetch('http://localhost:5000/api/financial/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      const data = await res.json();
      if (data.error) { setError(data.error); }
      else {
        setAnalysis(data);
        // 🔔 Notify: analysis complete
        const topOpp = data.saving_opportunities?.[0];
        if (topOpp) {
          setNotification(`💡 Save ₹${topOpp.annual_saving.toLocaleString()}/yr — ${topOpp.category}`);
        } else {
          setNotification('✅ Financial analysis complete!');
        }
      }
    } catch {
      setError('Could not connect to the financial engine. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  // ── Filter tabs ────────────────────────────────────────────────────────────
  const productTypes = ['all', 'Credit Card', 'Mutual Fund', 'Insurance', 'Savings Account', 'Personal Loan', 'Fixed Deposit', 'Wealth Management'];
  const filteredRecs = analysis?.recommendations?.filter(r =>
    activeTab === 'all' || r.type === activeTab
  ) || [];

  return (
    <PageTransition>
      <div className="space-y-10">

        {/* ── Page Header ─────────────────────────────────────────────────── */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-border pb-10 gap-6">
          <div>
            <span className="text-secondary font-black text-[10px] uppercase tracking-[0.3em] mb-2 block">
              AI Financial Advisor
            </span>
            <h1 className="text-5xl font-black text-primary font-headline tracking-tighter leading-none">
              Financial Product<br/>Analyser
            </h1>
            <p className="text-on-surface-variant font-medium mt-3 italic max-w-lg">
              Tell us about your spending habits and get personalised credit card, debit card, loan, and savings recommendations.
            </p>
          </div>
          <div className="flex items-center gap-4 bg-white px-8 py-5 rounded-2xl border border-border shadow-sm">
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">Powered by</span>
              <span className="font-headline font-black text-primary text-lg tracking-tighter">Llama-3 AI</span>
            </div>
            <div className="h-10 w-px bg-border mx-2" />
            <Brain className="text-secondary" size={24} />
          </div>
        </header>

        {/* ── Profile Form ─────────────────────────────────────────────────── */}
        <section className="bg-white border border-border rounded-2xl p-8 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-secondary opacity-0 group-hover:opacity-100 transition-opacity" />

          <h3 className="text-sm font-black text-primary font-headline mb-8 uppercase tracking-[0.2em] flex items-center gap-3">
            <BarChart3 size={16} className="text-secondary" />
            Your Financial Profile
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

            {/* Monthly Income */}
            <div>
              <label className="text-[9px] font-black uppercase text-on-surface-variant tracking-widest mb-2 block ml-1">
                Monthly Income (₹)
              </label>
              <input type="number" placeholder="e.g. 60000"
                value={profile.monthly_income}
                onChange={e => setProfile({ ...profile, monthly_income: e.target.value })}
                className="w-full bg-surface-container-low border border-border rounded-xl px-4 py-3.5 text-sm font-bold text-primary outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/5 transition-all"
              />
            </div>

            {/* Monthly Spend */}
            <div>
              <label className="text-[9px] font-black uppercase text-on-surface-variant tracking-widest mb-2 block ml-1">
                Monthly Spend (₹)
              </label>
              <input type="number" placeholder="e.g. 35000"
                value={profile.monthly_spend}
                onChange={e => setProfile({ ...profile, monthly_spend: e.target.value })}
                className="w-full bg-surface-container-low border border-border rounded-xl px-4 py-3.5 text-sm font-bold text-primary outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/5 transition-all"
              />
            </div>

            {/* Credit Score */}
            <div>
              <label className="text-[9px] font-black uppercase text-on-surface-variant tracking-widest mb-2 block ml-1">
                Credit Score Range
              </label>
              <select
                value={profile.credit_score_range}
                onChange={e => setProfile({ ...profile, credit_score_range: e.target.value })}
                className="w-full bg-surface-container-low border border-border rounded-xl px-4 py-3.5 text-sm font-bold text-primary outline-none focus:border-secondary transition-all"
              >
                <option>Excellent (750+)</option>
                <option>Good (700-749)</option>
                <option>Fair (650-699)</option>
                <option>Poor (below 650)</option>
                <option>No Credit History</option>
              </select>
            </div>

            {/* Savings Ratio */}
            <div>
              <label className="text-[9px] font-black uppercase text-on-surface-variant tracking-widest mb-2 block ml-1">
                Target Savings — {Math.round(profile.savings_ratio * 100)}%
              </label>
              <input type="range" min="0.05" max="0.6" step="0.05"
                value={profile.savings_ratio}
                onChange={e => setProfile({ ...profile, savings_ratio: parseFloat(e.target.value) })}
                className="w-full accent-secondary mt-3"
              />
            </div>

            {/* Status */}
            <div>
              <label className="text-[9px] font-black uppercase text-on-surface-variant tracking-widest mb-2 block ml-1">
                Status
              </label>
              <div className="flex gap-3 mt-1">
                {['Professional', 'Student'].map(s => (
                  <button key={s}
                    onClick={() => setProfile({ ...profile, is_student: s === 'Student' })}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] border transition-all ${
                      (s === 'Student') === profile.is_student
                        ? 'bg-primary text-white border-primary shadow-sm'
                        : 'border-border text-on-surface-variant hover:border-secondary hover:text-secondary'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className="text-[9px] font-black uppercase text-on-surface-variant tracking-widest mb-2 block ml-1">
                Gender
              </label>
              <select
                value={profile.gender}
                onChange={e => setProfile({ ...profile, gender: e.target.value })}
                className="w-full bg-surface-container-low border border-border rounded-xl px-4 py-3.5 text-sm font-bold text-primary outline-none focus:border-secondary transition-all"
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          {/* Spending Categories */}
          <div className="mb-8">
            <label className="text-[9px] font-black uppercase text-on-surface-variant tracking-widest mb-3 block ml-1">
              Top Spending Categories (select all that apply)
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_OPTIONS.map(cat => (
                <button key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.1em] border transition-all ${
                    profile.top_categories.includes(cat)
                      ? 'bg-secondary text-white border-secondary shadow-sm'
                      : 'border-border text-on-surface-variant hover:border-secondary hover:text-secondary bg-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Existing cards */}
          <div className="mb-8">
            <label className="text-[9px] font-black uppercase text-on-surface-variant tracking-widest mb-2 block ml-1">
              Existing Cards / Products (optional)
            </label>
            <input type="text" placeholder="e.g. HDFC Millennia Credit Card, SBI Debit Card"
              value={profile.existing_cards}
              onChange={e => setProfile({ ...profile, existing_cards: e.target.value })}
              className="w-full bg-surface-container-low border border-border rounded-xl px-4 py-3.5 text-sm font-bold text-primary outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/5 transition-all"
            />
          </div>

          {/* CTA */}
          <button
            onClick={runAnalysis}
            disabled={loading}
            className="w-full md:w-auto flex items-center justify-center gap-3 bg-[#001b3f] text-white px-12 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-[#002a5c] transition-all shadow-[0_8px_20px_-4px_rgba(0,27,63,0.4)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <><Loader2 size={16} className="animate-spin" /> Analysing Your Profile...</>
            ) : (
              <><Sparkles size={16} /> Get My Recommendations</>
            )}
          </button>
        </section>

        {/* ── Analysis Results ─────────────────────────────────────────────── */}
        <AnimatePresence>
          {(loading || error || analysis) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {/* Error */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex gap-4">
                  <AlertCircle size={20} className="text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-black text-sm text-red-700 mb-1">Analysis Error</p>
                    <p className="text-xs text-red-500 leading-relaxed">{error}</p>
                  </div>
                </div>
              )}

              {/* Loading */}
              {loading && (
                <div className="bg-[#00193c] text-white rounded-2xl p-16 flex flex-col items-center justify-center gap-6 text-center">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-white/10 border-t-[#58cc02] rounded-full animate-spin" />
                    <Brain size={20} className="absolute inset-0 m-auto text-white/30" />
                  </div>
                  <div>
                    <p className="text-sm font-black uppercase tracking-[0.3em] text-white">Consulting AI Advisor</p>
                    <p className="text-[10px] text-white/40 mt-1 animate-pulse">
                      Analysing your financial profile against 200+ products…
                    </p>
                  </div>
                </div>
              )}

              {/* Results */}
              {!loading && !error && analysis && (
                <div className="space-y-8">

                  {/* AI Summary Panel */}
                  <div className="bg-[#00193c] text-white rounded-2xl overflow-hidden shadow-2xl">
                    <div className="px-8 pt-8 pb-6 border-b border-white/10">
                      <div className="flex items-center gap-3">
                        <Sparkles size={18} className="text-[#58cc02]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">
                          AI Financial Intelligence
                        </span>
                      </div>
                      <h2 className="text-2xl font-black font-headline tracking-tight mt-2">
                        Personalised Financial Analysis
                      </h2>
                    </div>
                    <div className="p-8 space-y-6">
                      {/* Financial score */}
                      {analysis.financial_score && (
                        <div className="flex items-center gap-6">
                          <div className="relative w-20 h-20 shrink-0">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                              <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
                              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#58cc02" strokeWidth="3"
                                strokeDasharray={`${analysis.financial_score} 100`} strokeLinecap="round" />
                            </svg>
                            <span className="absolute inset-0 flex items-center justify-center text-white font-black text-sm">
                              {analysis.financial_score}
                            </span>
                          </div>
                          <div>
                            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40 mb-1">Financial Health Score</p>
                            <p className="text-white font-bold text-sm leading-relaxed">{analysis.score_summary}</p>
                          </div>
                        </div>
                      )}

                      {/* AI insights */}
                      {analysis.insights?.length > 0 && (
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40 mb-3">Key Insights</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {analysis.insights.map((ins, i) => (
                              <motion.div key={i}
                                initial={{ opacity: 0, x: 16 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.06 }}
                                className="flex gap-3 p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-all"
                              >
                                <ChevronRight size={14} className="text-[#58cc02] shrink-0 mt-0.5" />
                                <p className="text-white/75 text-xs leading-relaxed">
                                  {ins.replace(/\*\*/g, '').replace(/^[-•*]\s*/, '')}
                                </p>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ── Saving Opportunities Section ── */}
                  {analysis.saving_opportunities?.length > 0 && (
                    <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
                      <div className="px-8 py-6 border-b border-border bg-surface-container-lowest">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-xl font-black text-primary font-headline tracking-tight">
                              Specific Saving Opportunities
                            </h3>
                            <p className="text-xs text-on-surface-variant mt-1">
                              Calculated from your income & spending categories
                            </p>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-on-surface-variant">Total Annual Potential</span>
                            <span className="font-headline font-black text-2xl tracking-tighter text-[#3b6934]">
                              ₹{analysis.saving_opportunities.reduce((s, o) => s + o.annual_saving, 0).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="divide-y divide-border">
                        {analysis.saving_opportunities.map((opp, i) => {
                          const c = OPP_COLOR[opp.color] || OPP_COLOR.blue;
                          return (
                            <motion.div key={i}
                              initial={{ opacity: 0, x: -12 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.07 }}
                              className={`p-6 hover:${c.bg} transition-all group`}
                            >
                              <div className="flex items-start gap-5">
                                {/* Coloured icon */}
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${c.icon} group-hover:scale-105 transition-transform`}>
                                  {OPP_ICON_MAP[opp.icon] || <BadgePercent size={18} />}
                                </div>

                                <div className="flex-1 min-w-0">
                                  <div className="flex flex-wrap items-center gap-3 mb-1">
                                    <h4 className="font-black text-primary tracking-tight text-sm">{opp.title}</h4>
                                    <span className={`text-[9px] font-black uppercase tracking-[0.1em] px-2 py-0.5 rounded-full border ${c.border} ${c.tag} ${c.bg}`}>
                                      {opp.category}
                                    </span>
                                    <span className={`text-[9px] font-black uppercase tracking-[0.1em] px-2 py-0.5 rounded-full border border-border text-on-surface-variant ${
                                      opp.difficulty === 'Easy' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-yellow-50 border-yellow-200 text-yellow-700'
                                    }`}>
                                      {opp.difficulty}
                                    </span>
                                  </div>

                                  <p className="text-xs text-on-surface-variant leading-relaxed mb-3">{opp.description}</p>

                                  {/* Savings numbers */}
                                  <div className="flex items-center gap-6 mb-3">
                                    <div>
                                      <p className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">Monthly saving</p>
                                      <p className={`text-lg font-black font-headline ${c.tag}`}>₹{opp.monthly_saving.toLocaleString()}</p>
                                    </div>
                                    <div className="h-8 w-px bg-border" />
                                    <div>
                                      <p className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">Annual saving</p>
                                      <p className="text-lg font-black font-headline text-[#3b6934]">₹{opp.annual_saving.toLocaleString()}</p>
                                    </div>
                                  </div>

                                  {/* Action pill */}
                                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${c.border} ${c.bg} text-[10px] font-black uppercase tracking-[0.12em] ${c.tag}`}>
                                    <ChevronRight size={11} />
                                    {opp.action}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Product Recommendations */}
                  <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
                    <div className="px-8 py-6 border-b border-border bg-surface-container-lowest flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <h3 className="text-xl font-black text-primary font-headline tracking-tight">
                          Recommended Products
                        </h3>
                        <p className="text-xs text-on-surface-variant mt-1">
                          {analysis.recommendations?.length || 0} products matched to your profile
                        </p>
                      </div>
                      {/* Filter tabs */}
                      <div className="flex flex-wrap gap-2">
                        {productTypes.map(t => (
                          <button key={t}
                            onClick={() => setActiveTab(t)}
                            className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.1em] border transition-all ${
                              activeTab === t
                                ? 'bg-primary text-white border-primary'
                                : 'border-border text-on-surface-variant hover:border-primary hover:text-primary'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="divide-y divide-border">
                      <AnimatePresence mode="popLayout">
                        {filteredRecs.map((rec, i) => (
                          <motion.div key={`${rec.name}-${i}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ delay: i * 0.05 }}
                            className="p-6 hover:bg-surface-container-low transition-all group"
                          >
                            <div className="flex items-start gap-5">
                              {/* Icon */}
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${TAG_COLORS[rec.type] || 'bg-primary/5 text-primary border-primary/10'} group-hover:scale-105 transition-transform`}>
                                {PRODUCT_ICONS[rec.type] || <CreditCard size={20} />}
                              </div>

                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-3 mb-1">
                                  <h4 className="font-black text-primary tracking-tight">{rec.name}</h4>
                                  <span className={`text-[9px] font-black uppercase tracking-[0.15em] px-2.5 py-1 rounded-full border ${TAG_COLORS[rec.type] || ''}`}>
                                    {rec.type}
                                  </span>
                                  {rec.is_best_match && (
                                    <span className="text-[9px] font-black uppercase tracking-[0.1em] px-2.5 py-1 rounded-full bg-[#58cc02]/10 text-[#58cc02] border border-[#58cc02]/20 flex items-center gap-1">
                                      <Star size={9} /> Best Match
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-on-surface-variant leading-relaxed mb-3">{rec.description}</p>

                                {/* Benefits row */}
                                {rec.benefits?.length > 0 && (
                                  <div className="flex flex-wrap gap-2 mb-3">
                                    {rec.benefits.map((b, bi) => (
                                      <span key={bi} className="flex items-center gap-1 text-[10px] font-bold text-secondary bg-secondary/5 px-2.5 py-1 rounded-full border border-secondary/10">
                                        <CheckCircle2 size={9} />{b}
                                      </span>
                                    ))}
                                  </div>
                                )}

                                <div className="flex flex-wrap items-center gap-6 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                                  {rec.annual_fee && (
                                    <span className="flex items-center gap-1">
                                      <Receipt size={11}/> Annual Fee: {rec.annual_fee}
                                    </span>
                                  )}
                                  {rec.cashback && (
                                    <span className="flex items-center gap-1 text-[#3b6934]">
                                      <BadgePercent size={11}/> {rec.cashback} Cashback
                                    </span>
                                  )}
                                  {rec.match_score && (
                                    <span className="flex items-center gap-1 text-[#7c6fff]">
                                      <Target size={11}/> {rec.match_score}% Match
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Arrow */}
                              <ArrowRight size={18} className="text-border group-hover:text-secondary transition-colors shrink-0 mt-1" />
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>

                      {filteredRecs.length === 0 && (
                        <div className="py-16 text-center">
                          <CreditCard size={36} className="mx-auto text-border mb-4" />
                          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-on-surface-variant/50">
                            No products in this category.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Re-analyse button */}
                  <button
                    onClick={runAnalysis}
                    className="w-full py-4 bg-white border border-border rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant hover:bg-surface-container hover:text-primary transition-all flex items-center justify-center gap-2"
                  >
                    <RefreshCw size={13} /> Re-Analyse with New Data
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Info Footer ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { icon: <ShieldCheck size={20}/>, title: 'Privacy First', desc: 'Your data never leaves your device. All analysis is local.' },
            { icon: <TrendingUp size={20}/>, title: 'AI-Powered', desc: 'Llama-3 analyses 200+ financial products for your profile.' },
            { icon: <PiggyBank size={20}/>, title: 'Maximise Savings', desc: 'Get matched to the highest cashback and reward cards.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="bg-white border border-border rounded-2xl p-6 shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary shrink-0">
                {icon}
              </div>
              <div>
                <h4 className="font-headline font-black text-primary tracking-tight text-sm">{title}</h4>
                <p className="text-[11px] text-on-surface-variant font-medium mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </PageTransition>
  );
}
