import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingCart, Sparkles, ShieldCheck, Brain, TrendingUp, IndianRupee } from 'lucide-react';

export default function Home() {
  return (
    <div className="max-w-[1200px] mx-auto py-20 px-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="text-center max-w-[800px] mx-auto mb-24">
        <div className="inline-block text-[0.7rem] font-bold uppercase tracking-[0.16em] px-4 py-1.5 rounded-full bg-bg-3 border border-border text-accent-2 mb-8">
          Sovereign Financial Intelligence
        </div>
        <h1 className="text-6xl font-black leading-[1.1] tracking-tight mb-6">
          Master Your Money with <br />
          <span className="bg-gradient-to-r from-accent to-accent-2 bg-clip-text text-transparent">Portfolio Intelligence.</span>
        </h1>
        <p className="text-xl text-text-muted mb-12 max-w-[600px] mx-auto">
          From daily expenses to long-term wealth. Our AI analyzes your risk profile and spending 
          to recommend the perfect Mutual Funds, Insurance, and Credit products.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/" className="px-8 py-4 bg-accent hover:bg-accent-2 text-white font-bold text-lg rounded-xl flex items-center gap-2 transition-all shadow-xl">
            Analyze My Portfolio <ArrowRight size={18} />
          </Link>
          <Link to="/profile" className="px-8 py-4 border-2 border-border hover:bg-white/5 text-text font-bold text-lg rounded-xl transition-all">
            Setup Investor Profile
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-bg-2 border border-border rounded-3xl p-10 hover:-translate-y-2 transition-all duration-300">
          <div className="w-16 h-16 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mb-6">
            <TrendingUp size={28} />
          </div>
          <h3 className="text-xl font-bold mb-3">Wealth Growth</h3>
          <p className="text-text-muted leading-relaxed">AI-selected Index Funds and Mutual Funds tailored to your risk appetite and income bracket for optimized compounding.</p>
        </div>

        <div className="bg-bg-2 border border-border rounded-3xl p-10 hover:-translate-y-2 transition-all duration-300">
          <div className="w-16 h-16 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mb-6">
            <IndianRupee size={28} />
          </div>
          <h3 className="text-xl font-bold mb-3">Credit Optimization</h3>
          <p className="text-text-muted leading-relaxed">Max out your rewards. Get matched to credit cards and loans with the best interest rates based on your specific score.</p>
        </div>

        <div className="bg-bg-2 border border-border rounded-3xl p-10 hover:-translate-y-2 transition-all duration-300">
          <div className="w-16 h-16 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mb-6">
            <ShieldCheck size={28} />
          </div>
          <h3 className="text-xl font-bold mb-3">Health & Protection</h3>
          <p className="text-text-muted leading-relaxed">Smart insurance recommendations that ensure you and your family are protected without overpaying on premiums.</p>
        </div>

        <div className="bg-bg-2 border border-border rounded-3xl p-10 hover:-translate-y-2 transition-all duration-300">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-6">
            <Sparkles size={28} />
          </div>
          <h3 className="text-xl font-bold mb-3">Predictive Insights</h3>
          <p className="text-text-muted leading-relaxed">Llama-3 powered intelligence that predicts your financial path and suggests concrete steps to bridge your savings gap.</p>
        </div>
      </div>
    </div>
  );
}
