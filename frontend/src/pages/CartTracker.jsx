import React, { useState, useEffect } from 'react';
import {
  ShoppingCart, Plus, Trash2, Sparkles, Brain,
  Package, BarChart3, ShieldCheck, TrendingDown,
  Loader2, AlertCircle, CheckCircle2, ChevronRight
} from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import PageTransition from '../components/PageTransition';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartTracker() {
  const { cart, fetchCart, addItem, removeItem, analyzeCart, fetchUser, user } = useCartStore();
  const [newItem, setNewItem] = useState({ name: '', price: '', quantity: 1, category: 'General' });
  const [analysis, setAnalysis] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCart();
    fetchUser();
  }, []);

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItem.name || !newItem.price) return;
    await addItem(newItem);
    setNewItem({ name: '', price: '', quantity: 1, category: 'General' });
    setAnalysis(null);
  };

  const handleRemove = async (id) => {
    await removeItem(id);
    setAnalysis(null);
  };

  const runAnalysis = async () => {
    if (!cart.length) return;
    setAnalysisLoading(true);
    setError('');
    setAnalysis(null);
    try {
      const [aiRes, recRes] = await Promise.all([
        analyzeCart(),
        fetch('http://localhost:5000/api/recommend', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            monthly_income: user?.monthly_income,
            savings_ratio: user?.savings_ratio,
            is_student: user?.is_student,
            gender: user?.gender,
          }),
        }).then((r) => r.json()),
      ]);

      if (aiRes?.error) {
        setError(aiRes.error);
      } else {
        setAnalysis({
          aiLines: (aiRes?.analysis || '').split('\n').filter((l) => l.trim()),
          advice: recRes?.shopping_summary?.advice || '',
          recs: recRes?.product_recommendations || [],
        });
      }
    } catch {
      setError('Could not connect to the analysis engine. Make sure Ollama is running.');
    } finally {
      setAnalysisLoading(false);
    }
  };

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <PageTransition>
      <div className="space-y-10">

        {/* ── Page Header ── */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-border pb-10 gap-6">
          <div>
            <span className="text-secondary font-black text-[10px] uppercase tracking-[0.3em] mb-2 block">
              Consumption Optimizer
            </span>
            <h1 className="text-5xl font-black text-primary font-headline tracking-tighter leading-none">
              Cart Analysis
            </h1>
            <p className="text-on-surface-variant font-medium mt-3 italic">
              Add items, then click Analyse to get AI-powered savings recommendations.
            </p>
          </div>
          <div className="flex items-center gap-4 bg-white px-8 py-5 rounded-2xl border border-border shadow-sm group hover:border-secondary transition-colors duration-500">
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">Cart Total</span>
              <span className="font-headline font-black text-primary text-2xl tracking-tighter">
                ₹{total.toLocaleString()}
              </span>
            </div>
            <div className="h-10 w-px bg-border mx-2" />
            <ShieldCheck className="text-secondary" size={24} />
          </div>
        </header>

        {/* ── Main Column ── */}
        <div className="flex flex-col gap-10">

          {/* Add Item Form */}
          <section className="bg-white border border-border rounded-2xl p-8 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
            <h3 className="text-sm font-black text-primary font-headline mb-6 uppercase tracking-[0.2em] flex items-center gap-3">
              <Plus size={16} className="text-secondary" />
              Add Item
            </h3>
            <form onSubmit={handleAddItem} className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-5">
                <label className="text-[9px] font-black uppercase text-on-surface-variant tracking-widest mb-2 block ml-1">
                  Item Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Amul Butter"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="w-full bg-surface-container-low border border-border rounded-xl px-4 py-3.5 text-sm font-bold text-primary outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/5 transition-all"
                />
              </div>
              <div className="md:col-span-3">
                <label className="text-[9px] font-black uppercase text-on-surface-variant tracking-widest mb-2 block ml-1">
                  Price (₹)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={newItem.price}
                  onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                  className="w-full bg-surface-container-low border border-border rounded-xl px-4 py-3.5 text-sm font-bold text-primary outline-none focus:border-secondary transition-all"
                />
              </div>
              <div className="md:col-span-1">
                <label className="text-[9px] font-black uppercase text-on-surface-variant tracking-widest mb-2 block ml-1 text-center">
                  Qty
                </label>
                <input
                  type="number"
                  min="1"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                  className="w-full bg-surface-container-low border border-border rounded-xl px-2 py-3.5 text-sm font-black text-primary outline-none focus:border-secondary transition-all text-center"
                />
              </div>
              <div className="md:col-span-3 flex items-end">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-primary text-white rounded-xl flex items-center justify-center hover:bg-[#001f4d] transition-all font-black text-[10px] uppercase tracking-[0.2em] shadow-lg active:scale-95"
                >
                  Add Item
                </button>
              </div>
            </form>
          </section>

          {/* Cart Table */}
          <section className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="px-8 py-6 border-b border-border bg-surface-container-lowest flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-primary/5 rounded-full flex items-center justify-center">
                  <ShoppingCart size={16} className="text-primary" />
                </div>
                <h3 className="text-base font-black text-primary font-headline uppercase tracking-tight">Your Cart</h3>
              </div>
              <span className="text-[10px] font-black uppercase text-secondary bg-secondary/10 px-4 py-1.5 rounded-full border border-secondary/20">
                {cart.length} Items
              </span>
            </div>

            <div className="max-h-[420px] overflow-y-auto divide-y divide-border">
              <AnimatePresence>
                {cart.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex items-center gap-5 px-8 py-5 hover:bg-surface-container-low transition-all group"
                  >
                    <div className="w-11 h-11 bg-surface-container rounded-xl flex items-center justify-center text-primary/20 group-hover:bg-primary group-hover:text-white transition-all duration-300 border border-border shrink-0">
                      <Package size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-primary tracking-tight truncate">{item.name}</p>
                      <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                        ₹{item.price} × {item.quantity}
                      </p>
                    </div>
                    <span className="font-black text-primary font-headline text-lg tracking-tight">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </span>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="w-9 h-9 border border-border rounded-xl text-on-surface-variant hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all flex items-center justify-center shrink-0"
                    >
                      <Trash2 size={15} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>

              {cart.length === 0 && (
                <div className="py-24 text-center">
                  <ShoppingCart size={40} className="mx-auto text-border mb-4" />
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-on-surface-variant/50">
                    No items yet. Add something above.
                  </p>
                </div>
              )}
            </div>

            {/* Analyse button */}
            {cart.length > 0 && (
              <div className="p-6 bg-surface-container-low border-t border-border flex justify-end">
                <button
                  onClick={runAnalysis}
                  disabled={analysisLoading}
                  className="flex items-center gap-3 bg-[#3b6934] text-white px-10 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-[#2d5027] transition-all shadow-[0_8px_20px_-4px_rgba(59,105,52,0.35)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: '#3b6934' }}
                >
                  {analysisLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Analysing...
                    </>
                  ) : (
                    <>
                      <Brain size={16} />
                      Analyse Cart
                    </>
                  )}
                </button>
              </div>
            )}
          </section>

          {/* ── Analysis Results (visible only after clicking Analyse) ── */}
          {(analysisLoading || error || analysis) && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-[#00193c] text-white rounded-2xl overflow-hidden shadow-2xl"
            >
              {/* Panel header */}
              <div className="px-8 pt-8 pb-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <Sparkles size={18} className="text-[#58cc02]" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">
                    AI Intelligence Layer
                  </span>
                </div>
                <h2 className="text-2xl font-black font-headline tracking-tight mt-2">
                  Analysis &amp; Recommendations
                </h2>
              </div>

              {/* Panel body */}
              <div className="p-8 flex flex-col gap-8">

                {/* Error */}
                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 flex gap-4">
                    <AlertCircle size={20} className="text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-black text-sm text-red-300 mb-1">Analysis Failed</p>
                      <p className="text-xs text-red-400/80 leading-relaxed">{error}</p>
                      <p className="text-[10px] text-red-400/60 mt-3 font-bold uppercase tracking-widest">
                        Make sure Ollama is running:{' '}
                        <span className="font-mono">ollama serve</span>
                      </p>
                    </div>
                  </div>
                )}

                {/* Loading */}
                {analysisLoading && (
                  <div className="flex flex-col items-center justify-center gap-6 text-center py-16">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-white/10 border-t-[#58cc02] rounded-full animate-spin" />
                      <Brain size={20} className="absolute inset-0 m-auto text-white/30" />
                    </div>
                    <div>
                      <p className="text-sm font-black uppercase tracking-[0.3em] text-white">
                        Consulting AI Engine
                      </p>
                      <p className="text-[10px] text-white/40 mt-1 animate-pulse">
                        Llama-3 is processing your cart...
                      </p>
                    </div>
                  </div>
                )}

                {/* Results */}
                {!analysisLoading && !error && analysis && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-8"
                  >
                    {/* Financial summary */}
                    {analysis.advice && (
                      <div className="bg-white/5 border-l-4 border-[#58cc02] rounded-r-2xl p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <CheckCircle2 size={14} className="text-[#58cc02]" />
                          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#58cc02]">
                            Financial Summary
                          </span>
                        </div>
                        <p className="text-white/90 text-sm leading-relaxed font-medium italic">
                          &ldquo;{analysis.advice}&rdquo;
                        </p>
                      </div>
                    )}

                    {/* Detailed AI analysis */}
                    {analysis.aiLines.length > 0 && (
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40 mb-4">
                          Detailed Analysis
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {analysis.aiLines.map((line, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: 16 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.06 }}
                              className="flex gap-3 p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all"
                            >
                              <ChevronRight size={14} className="text-[#58cc02] shrink-0 mt-0.5" />
                              <p className="text-white/75 text-xs leading-relaxed">
                                {line.replace(/\*\*/g, '').replace(/^[-•*]\s*/, '')}
                              </p>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Savings recommendations */}
                    {analysis.recs.length > 0 && (
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40 mb-4">
                          Savings Opportunities
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {analysis.recs.map((rec, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, scale: 0.97 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.3 + i * 0.1 }}
                              className="p-5 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 hover:border-[#58cc02]/30 transition-all"
                            >
                              <div className="flex items-start justify-between gap-2 mb-3">
                                <h4 className="font-black text-sm text-white tracking-tight leading-snug">
                                  {rec.title}
                                </h4>
                                <span className="text-[#58cc02] font-black text-[10px] uppercase tracking-widest bg-[#58cc02]/10 px-2 py-1 rounded-lg shrink-0 border border-[#58cc02]/20 whitespace-nowrap">
                                  {rec.impact}
                                </span>
                              </div>
                              <div className="flex items-start gap-2">
                                <TrendingDown size={11} className="text-white/30 shrink-0 mt-0.5" />
                                <p className="text-white/40 text-[11px] leading-relaxed italic">{rec.reason}</p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Re-analyse */}
                    <button
                      onClick={runAnalysis}
                      className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-white/60 hover:bg-white/10 hover:text-white transition-all"
                    >
                      Re-Analyse
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.section>
          )}

          {/* Ollama hint */}
          <div className="bg-white border border-border rounded-2xl p-6 shadow-sm flex items-center gap-5">
            <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center shrink-0">
              <Brain size={22} className="text-secondary" />
            </div>
            <div>
              <h4 className="font-headline font-black text-primary tracking-tight text-sm">Llama-3 AI Engine</h4>
              <p className="text-[11px] text-on-surface-variant font-medium mt-0.5">
                Powered by Ollama running locally. Ensure{' '}
                <span className="font-mono font-bold">ollama serve</span> is active.
              </p>
            </div>
          </div>

        </div>
      </div>
    </PageTransition>
  );
}
