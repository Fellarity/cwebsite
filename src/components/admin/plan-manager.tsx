"use client";

import { useState } from "react";
import { Plus, Check, X, Loader2, DollarSign, BookOpen, Clock, Power } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "@/navigation";

export const PlanManager = ({ initialPlans }: { initialPlans: any[] }) => {
  const [plans, setPlans] = useState(initialPlans);
  const [isAdding, setIsAdding] = useState(false);
  const [processing, setProcessing] = useState<string | null>(null);
  const router = useRouter();

  const [newPlan, setNewPlan] = useState({
    title: "",
    sessionCount: 5,
    duration: 60,
    price: 250,
    active: true
  });

  const handleCreate = async () => {
    setProcessing("new");
    try {
      const res = await fetch("/api/admin/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPlan),
      });

      if (res.ok) {
        toast.success("New plan created successfully");
        setIsAdding(false);
        router.refresh();
      } else {
        throw new Error("Creation failed");
      }
    } catch {
      toast.error("Failed to create plan");
    } finally {
      setProcessing(null);
    }
  };

  const handleToggle = async (plan: any) => {
    setProcessing(plan.id);
    try {
      const res = await fetch("/api/admin/plans", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...plan, active: !plan.active }),
      });

      if (res.ok) {
        toast.success(`Plan ${!plan.active ? 'Activated' : 'Deactivated'}`);
        router.refresh();
      } else {
        throw new Error("Update failed");
      }
    } catch {
      toast.error("Failed to update status");
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="bg-white rounded-[3rem] shadow-2xl shadow-brand-soft border border-brand-border p-10 mt-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-black text-brand-text-heading flex items-center gap-4 uppercase tracking-tight">
          <div className="p-3 bg-brand-primary rounded-xl shadow-lg shadow-brand-soft">
            <DollarSign className="h-5 w-5 text-white" />
          </div>
          Pricing & Subscriptions
        </h2>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2"
        >
          {isAdding ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {isAdding ? "Cancel" : "Add Bundle"}
        </button>
      </div>

      {isAdding && (
        <div className="mb-10 p-8 bg-brand-surface-soft/50 rounded-[2rem] border border-brand-border animate-in zoom-in-95 duration-200">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div>
                 <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 ml-2">Plan Title</label>
                 <input 
                    type="text" 
                    placeholder="Mastery Path" 
                    className="w-full p-4 bg-white border-none rounded-xl text-sm font-bold shadow-sm"
                    value={newPlan.title}
                    onChange={(e) => setNewPlan({...newPlan, title: e.target.value})}
                 />
              </div>
              <div>
                 <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 ml-2">Sessions</label>
                 <input 
                    type="number" 
                    className="w-full p-4 bg-white border-none rounded-xl text-sm font-bold shadow-sm"
                    value={newPlan.sessionCount}
                    onChange={(e) => setNewPlan({...newPlan, sessionCount: parseInt(e.target.value)})}
                 />
              </div>
              <div>
                 <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 ml-2">Price ($)</label>
                 <input 
                    type="number" 
                    className="w-full p-4 bg-white border-none rounded-xl text-sm font-bold shadow-sm"
                    value={newPlan.price}
                    onChange={(e) => setNewPlan({...newPlan, price: parseFloat(e.target.value)})}
                 />
              </div>
              <div className="flex items-end">
                 <button 
                    onClick={handleCreate}
                    disabled={processing === "new" || !newPlan.title}
                    className="w-full py-4 bg-brand-primary text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-brand-primary-hover shadow-lg transition-all flex items-center justify-center gap-2"
                 >
                    {processing === "new" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Plan"}
                 </button>
              </div>
           </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans.map((plan) => (
          <div key={plan.id} className={`p-8 rounded-[2.5rem] border flex items-center justify-between transition-all ${
            plan.active ? 'bg-white border-sky-100 shadow-xl shadow-sky-100/20' : 'bg-brand-surface-soft/50 border-brand-border opacity-60'
          }`}>
             <div>
                <div className="flex items-center gap-2 mb-2">
                   <h3 className="font-black text-slate-900 uppercase text-sm tracking-tight">{plan.title}</h3>
                   {!plan.active && <span className="px-2 py-0.5 bg-slate-200 text-slate-500 rounded-md text-[8px] font-black uppercase">Inactive</span>}
                </div>
                <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                   <div className="flex items-center gap-1.5"><BookOpen className="h-3 w-3" /> {plan.sessionCount} Sessions</div>
                   <div className="flex items-center gap-1.5"><DollarSign className="h-3 w-3" /> ${plan.price}</div>
                </div>
             </div>
             
             <button 
               onClick={() => handleToggle(plan)}
               disabled={processing === plan.id}
               className={`p-4 rounded-2xl transition-all ${
                 plan.active ? 'bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white'
               }`}
             >
                {processing === plan.id ? <Loader2 className="h-5 w-5 animate-spin" /> : <Power className="h-5 w-5" />}
             </button>
          </div>
        ))}
      </div>
    </div>
  );
};
