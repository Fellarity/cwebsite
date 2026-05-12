"use client";

import { useState } from "react";
import { User, Target, BarChart, Clock, X, Loader2, Brain } from "lucide-react";
import { toast } from "sonner";

export const StudentContextModal = ({ studentId, studentName }: { studentId: string, studentName: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchStudent = async () => {
    setIsOpen(true);
    setLoading(true);
    try {
      const res = await fetch(`/api/tutor/students/${studentId}`);
      const data = await res.json();
      setStudent(data);
    } catch {
      toast.error("Failed to load student context");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={fetchStudent}
        className="text-[10px] font-black text-brand-primary uppercase tracking-widest hover:underline"
      >
        View Profile
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-10 bg-slate-900/60 backdrop-blur-xl animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl border border-sky-100 flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="p-10 border-b border-sky-50 flex items-center justify-between">
                 <div>
                    <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight">{studentName}</h3>
                    <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em]">Learner Persona & Goals</p>
                 </div>
                 <button onClick={() => setIsOpen(false)} className="p-4 bg-slate-50 rounded-2xl hover:bg-rose-50 hover:text-rose-500 transition-all">
                    <X className="h-6 w-6" />
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto p-10 custom-scrollbar min-h-[300px]">
                 {loading ? (
                   <div className="flex flex-col items-center justify-center py-20 gap-4">
                      <Loader2 className="h-10 w-10 text-brand-primary animate-spin" />
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Retrieving context...</p>
                   </div>
                 ) : student && (
                   <div className="space-y-10">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="p-6 bg-sky-50/50 rounded-3xl border border-sky-100">
                            <div className="flex items-center gap-3 text-sky-600 mb-4">
                               <Target className="h-5 w-5" />
                               <span className="text-[10px] font-black uppercase tracking-widest">Primary Goal</span>
                            </div>
                            <p className="text-lg font-black text-slate-800 uppercase tracking-tight">{student.learningGoal}</p>
                         </div>
                         <div className="p-6 bg-indigo-50/50 rounded-3xl border border-indigo-100">
                            <div className="flex items-center gap-3 text-indigo-600 mb-4">
                               <BarChart className="h-5 w-5" />
                               <span className="text-[10px] font-black uppercase tracking-widest">Skill Level</span>
                            </div>
                            <p className="text-lg font-black text-slate-800 uppercase tracking-tight">{student.currentLevel}</p>
                         </div>
                      </div>

                      <div>
                         <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                            <Brain className="h-4 w-4" /> Full Onboarding Context
                         </h4>
                         <div className="grid gap-4">
                            {student.onboardingAnswers && Object.entries(student.onboardingAnswers).map(([key, value]: [string, any]) => (
                               <div key={key} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{key}</span>
                                  <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">{value}</span>
                               </div>
                            ))}
                         </div>
                      </div>
                   </div>
                 )}
              </div>
              
              <div className="p-10 bg-slate-50 border-t border-slate-100">
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center italic">
                   This data is private and only shared with assigned mentors.
                 </p>
              </div>
           </div>
        </div>
      )}
    </>
  );
};
