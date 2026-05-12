"use client";

import { useState } from "react";
import { Save, Loader2, Target, BarChart, Globe, Zap, GraduationCap, Video, Briefcase, Code } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "@/navigation";

const TRACKS = [
  { id: "productivity", label: "AI Productivity Mastery", icon: Zap },
  { id: "students", label: "AI for Students", icon: GraduationCap },
  { id: "content", label: "AI Content Creation", icon: Video },
  { id: "professionals", label: "AI for Professionals", icon: Briefcase },
  { id: "development", label: "AI Development and Data", icon: Code },
];

export const LearningSettingsForm = ({ initialData }: { initialData: any }) => {
  const [formData, setFormData] = useState(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch("/api/users/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success("Learning settings updated!");
        router.refresh();
      } else {
        throw new Error();
      }
    } catch {
      toast.error("Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-sky-100">
      <form onSubmit={handleSubmit} className="space-y-10">
        <div>
           <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 ml-2">Choose Your Master Track</label>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {TRACKS.map((track) => (
                <button
                  key={track.id}
                  type="button"
                  onClick={() => setFormData({...formData, selectedTrack: track.id})}
                  className={`p-6 rounded-3xl border-2 text-left transition-all flex items-center gap-4 ${
                    formData.selectedTrack === track.id 
                    ? "bg-brand-primary border-brand-primary text-white shadow-xl shadow-brand-soft" 
                    : "bg-slate-50 border-slate-50 text-slate-500 hover:border-sky-100"
                  }`}
                >
                   <track.icon className={`h-6 w-6 ${formData.selectedTrack === track.id ? "text-white" : "text-brand-primary"}`} />
                   <span className="text-[10px] font-black uppercase tracking-widest leading-tight">{track.label}</span>
                </button>
              ))}
           </div>
        </div>

        <div>
           <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 ml-2 flex items-center gap-2">
              <Target className="h-4 w-4" /> Primary Learning Goal
           </label>
           <textarea 
             required
             className="w-full p-6 bg-slate-50 border-none rounded-3xl focus:ring-4 focus:ring-sky-100 outline-none transition-all min-h-[120px] text-sm font-medium"
             value={formData.learningGoal}
             onChange={(e) => setFormData({...formData, learningGoal: e.target.value})}
           />
        </div>

        <div className="grid sm:grid-cols-2 gap-8">
           <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 ml-2 flex items-center gap-2">
                 <BarChart className="h-4 w-4" /> Current Level
              </label>
              <select 
                className="w-full p-5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-sky-100 outline-none transition-all text-sm font-bold appearance-none"
                value={formData.currentLevel}
                onChange={(e) => setFormData({...formData, currentLevel: e.target.value})}
              >
                 <option value="Beginner">Beginner</option>
                 <option value="Intermediate">Intermediate</option>
                 <option value="Advanced">Advanced / Professional</option>
              </select>
           </div>
           <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 ml-2 flex items-center gap-2">
                 <Globe className="h-4 w-4" /> Your Timezone
              </label>
              <select 
                className="w-full p-5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-sky-100 outline-none transition-all text-sm font-bold appearance-none"
                value={formData.timezone}
                onChange={(e) => setFormData({...formData, timezone: e.target.value})}
              >
                 <option value="UTC">UTC (Universal)</option>
                 <option value="Europe/Amsterdam">Amsterdam (CET/CEST)</option>
                 <option value="America/New_York">New York (EST/EDT)</option>
                 <option value="Asia/Kolkata">India (IST)</option>
              </select>
           </div>
        </div>

        <button 
          type="submit"
          disabled={isSaving}
          className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-70"
        >
          {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : (
            <>
              Update Curriculum
              <Save className="h-5 w-5 text-sky-400" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};
