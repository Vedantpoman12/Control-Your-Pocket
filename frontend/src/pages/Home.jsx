import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingCart, Sparkles, Tag, Brain } from 'lucide-react';

export default function Home() {
  return (
    <div className="max-w-[1200px] mx-auto py-20 px-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="text-center max-w-[800px] mx-auto mb-24">
        <div className="inline-block text-[0.7rem] font-bold uppercase tracking-[0.16em] px-4 py-1.5 rounded-full bg-bg-3 border border-border text-accent-2 mb-8">
          Smart Shopping & Finance Intelligence
        </div>
        <h1 className="text-6xl font-black leading-[1.1] tracking-tight mb-6">
          Control Your Pocket with <br />
          <span className="bg-gradient-to-r from-accent to-accent-2 bg-clip-text text-transparent">Product Intelligence.</span>
        </h1>
        <p className="text-xl text-text-muted mb-12 max-w-[600px] mx-auto">
          Input your daily shopping cart or monthly products. We'll analyze your spending and recommend 
          smarter alternatives to maximize your savings.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/cart" className="px-8 py-4 bg-accent hover:bg-accent-2 text-white font-bold text-lg rounded-xl flex items-center gap-2 transition-all shadow-xl">
            Build My Smart Cart <ArrowRight size={18} />
          </Link>
          <Link to="/profile" className="px-8 py-4 border-2 border-border hover:bg-white/5 text-text font-bold text-lg rounded-xl transition-all">
            Setup Profile
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-bg-2 border border-border rounded-3xl p-10 hover:-translate-y-2 transition-all duration-300">
          <div className="w-16 h-16 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mb-6">
            <ShoppingCart size={28} />
          </div>
          <h3 className="text-xl font-bold mb-3">Monthly Cart Tracking</h3>
          <p className="text-text-muted leading-relaxed">Put your daily shopping items or monthly groceries. We track the price and quantity to understand your consumption patterns.</p>
        </div>

        <div className="bg-bg-2 border border-border rounded-3xl p-10 hover:-translate-y-2 transition-all duration-300">
          <div className="w-16 h-16 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mb-6">
            <Tag size={28} />
          </div>
          <h3 className="text-xl font-bold mb-3">Optimization Engine</h3>
          <p className="text-text-muted leading-relaxed">Our AI scans for cheaper, bulk, or refill-based alternatives for the products you use most, saving you thousands every month.</p>
        </div>

        <div className="bg-bg-2 border border-border rounded-3xl p-10 hover:-translate-y-2 transition-all duration-300">
          <div className="w-16 h-16 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mb-6">
            <Brain size={28} />
          </div>
          <h3 className="text-xl font-bold mb-3">Consumption Insights</h3>
          <p className="text-text-muted leading-relaxed">Get personalized advice on how changing small shopping habits can bridge the gap in your monthly savings goals.</p>
        </div>

        <div className="bg-bg-2 border border-border rounded-3xl p-10 hover:-translate-y-2 transition-all duration-300">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-6">
            <Sparkles size={28} />
          </div>
          <h3 className="text-xl font-bold mb-3">Privacy-First AI</h3>
          <p className="text-text-muted leading-relaxed">Your shopping data stays yours. Our local intelligence runs directly on your machine to give you secure, private financial advice.</p>
        </div>
      </div>
    </div>
  );
}
