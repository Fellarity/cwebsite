"use client";

import { useState } from "react";
import { Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "@/navigation";

export const SettingsForm = ({ initialData }: { initialData: any }) => {
  const [formData, setFormData] = useState(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch("/api/tutor/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          expertise: formData.expertise.split(",").map((i: string) => i.trim()),
        }),
      });

      if (res.ok) {
        toast.success("Profile updated successfully!");
        router.refresh();
      } else {
        throw new Error("Failed to save");
      }
    } catch {
      toast.error("Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-sky-100">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-2">Professional Bio</label>
          <textarea 
            required
            className="w-full p-6 bg-slate-50 border-none rounded-3xl focus:ring-4 focus:ring-sky-100 outline-none transition-all min-h-[150px] text-sm font-medium"
            value={formData.bio}
            onChange={(e) => setFormData({...formData, bio: e.target.value})}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-8">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-2">Expertise</label>
            <input 
              type="text"
              required
              className="w-full p-5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-sky-100 outline-none transition-all text-sm font-medium"
              value={formData.expertise}
              onChange={(e) => setFormData({...formData, expertise: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-2">Hourly Rate ($)</label>
            <input 
              type="number"
              required
              className="w-full p-5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-sky-100 outline-none transition-all text-sm font-medium"
              value={formData.hourlyRate}
              onChange={(e) => setFormData({...formData, hourlyRate: e.target.value})}
            />
          </div>
        </div>

        <button 
          type="submit"
          disabled={isSaving}
          className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-70"
        >
          {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : (
            <>
              <Save className="h-5 w-5 text-sky-400" />
              Save Changes
            </>
          )}
        </button>
      </form>
    </div>
  );
};
