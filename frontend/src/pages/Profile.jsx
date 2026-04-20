import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, TrendingUp, ArrowRight, CheckCircle, User, ShieldCheck } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import PageTransition from '../components/PageTransition';
import { motion } from 'framer-motion';

export default function Profile() {
  const navigate = useNavigate();
  const { user, fetchUser } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({
    monthly_income: 60000,
    savings_ratio: 0.25,
    is_student: false,
    gender: "Other"
  });

  useEffect(() => {
    const load = async () => {
      await fetchUser();
    };
    load();
  }, []);

  useEffect(() => {
    if (user) {
      setFormData({
        monthly_income: user.monthly_income,
        savings_ratio: user.savings_ratio,
        is_student: user.is_student || false,
        gender: user.gender || "Other"
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => {
          setSaved(false);
          navigate('/');
        }, 1500);
      }
    } catch (err) {
      alert("Error saving profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="max-w-[750px] mx-auto space-y-10 pb-20">
        <header className="border-b border-border pb-8">
           <div className="flex items-center gap-4 mb-3">
              <div className="w-11 h-11 bg-primary/5 rounded-2xl flex items-center justify-center">
                 <User size={22} className="text-primary" />
              </div>
              <h1 className="text-4xl font-black text-primary font-headline tracking-tighter">My Profile</h1>
           </div>
           <p className="text-on-surface-variant font-medium">Set up your financial profile to get personalized recommendations.</p>
        </header>

        <motion.form 
          className="bg-white border border-border rounded-2xl p-10 shadow-sm" 
          onSubmit={handleSubmit}
          layout
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
             {/* Personal Info */}
             <div className="space-y-8">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant border-b border-border pb-3 mb-4">Personal Info</h3>
                <div className="flex flex-col gap-2">
                   <label className="text-[10px] font-black text-primary uppercase tracking-widest pl-1">Gender</label>
                   <select name="gender" className="w-full p-4 bg-surface-container-low border border-border rounded-xl text-sm font-bold text-primary outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/5 transition-all" value={formData.gender} onChange={handleChange}>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                   </select>
                </div>
                <div className="flex items-center gap-4 p-4 bg-surface-container-low border border-border rounded-xl group hover:border-secondary transition-all">
                   <input type="checkbox" id="is_student" name="is_student" checked={formData.is_student} onChange={handleChange} className="w-5 h-5 accent-secondary"/>
                   <label htmlFor="is_student" className="text-sm font-bold text-primary cursor-pointer group-hover:text-secondary transition-colors">I am a Student</label>
                </div>
             </div>

             {/* Financial Info */}
             <div className="space-y-8">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant border-b border-border pb-3 mb-4">Financial Info</h3>
                <div className="flex flex-col gap-2">
                   <div className="flex justify-between items-center px-1">
                      <label className="text-[10px] font-black text-primary uppercase tracking-widest">Monthly Income (₹)</label>
                      <Wallet size={16} className="text-on-surface-variant" />
                   </div>
                   <input type="number" name="monthly_income" className="w-full p-4 bg-surface-container-low border border-border rounded-xl text-sm font-black text-primary outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/5 transition-all" value={formData.monthly_income} onChange={handleChange} required min="1000"/>
                </div>
                <div className="flex flex-col gap-2">
                   <div className="flex justify-between items-center px-1">
                      <label className="text-[10px] font-black text-primary uppercase tracking-widest">Savings Ratio</label>
                      <TrendingUp size={16} className="text-on-surface-variant" />
                   </div>
                   <input type="number" step="0.01" name="savings_ratio" className="w-full p-4 bg-surface-container-low border border-border rounded-xl text-sm font-black text-primary outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/5 transition-all" value={formData.savings_ratio} onChange={handleChange} required min="0" max="1"/>
                   <div className="flex justify-between text-[9px] font-bold text-on-surface-variant/60 tracking-widest mt-1 px-1">
                      <span>0% (None)</span>
                      <span>100% (All)</span>
                   </div>
                </div>
             </div>
          </div>

          <div className="mt-12 pt-8 border-t border-border flex items-center justify-between gap-6">
             <div className="flex items-center gap-3 text-secondary">
                <ShieldCheck size={20} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Data stays local</span>
             </div>
             <button type="submit" className="min-w-[220px] bg-primary text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#001f4d] transition-all shadow-xl flex justify-center items-center gap-3 disabled:opacity-50 active:scale-95" disabled={loading || saved}>
               {loading ? (
                 <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
               ) : saved ? (
                 <><CheckCircle size={18}/> Saved!</>
               ) : (
                 <>Save Profile <ArrowRight size={18}/></>
               )}
             </button>
          </div>
        </motion.form>
      </div>
    </PageTransition>
  );
}
