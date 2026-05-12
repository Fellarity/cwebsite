"use client";

import { useState, useEffect } from "react";
import { Trophy, Star, Clock, BarChart3, Loader2 } from "lucide-react";

export const TutorPerformance = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerf = async () => {
      try {
        const res = await fetch("/api/admin/tutors/performance");
        const json = await res.json();
        setData(json);
      } catch {
        console.error("Failed to fetch performance");
      } finally {
        setLoading(false);
      }
    };
    fetchPerf();
  }, []);

  return (
    <div className="bg-white rounded-[3rem] shadow-2xl shadow-brand-soft border border-brand-border p-10 mt-12">
      <h2 className="text-2xl font-black text-brand-text-heading mb-8 flex items-center gap-4 uppercase tracking-tight">
        <div className="p-3 bg-brand-primary rounded-xl shadow-lg shadow-brand-soft">
          <Trophy className="h-5 w-5 text-white" />
        </div>
        Top Mentor Performance
      </h2>

      <div className="grid gap-4">
        {loading ? (
          <div className="flex items-center justify-center py-20">
             <Loader2 className="h-8 w-8 text-brand-primary animate-spin" />
          </div>
        ) : data.length === 0 ? (
          <p className="text-center py-10 font-bold text-slate-400 italic">No mentor data available.</p>
        ) : data.map((tutor, i) => (
          <div key={tutor.id} className="p-6 rounded-3xl bg-brand-surface-soft/50 border border-brand-border flex items-center justify-between hover:bg-white transition-all group">
             <div className="flex items-center gap-6">
                <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center font-black text-brand-primary shadow-sm border border-brand-border">
                   #{i + 1}
                </div>
                <div>
                   <p className="font-black text-slate-900 uppercase text-xs tracking-wide">{tutor.name}</p>
                   <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-1 text-[9px] font-black text-slate-400 uppercase">
                         <Clock className="h-3 w-3" /> {tutor.totalHours}h Taught
                      </div>
                      <div className="flex items-center gap-1 text-[9px] font-black text-slate-400 uppercase">
                         <Star className="h-3 w-3" /> {tutor.totalBookings} Students
                      </div>
                   </div>
                </div>
             </div>
             
             <div className="text-right">
                <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Completion Rate</p>
                <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden flex">
                   <div 
                     className="h-full bg-emerald-500 transition-all duration-1000" 
                     style={{ width: `${tutor.completionRate}%` }}
                   />
                </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};
