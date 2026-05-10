"use client";

import { useState } from "react";
import { Plus, Trash2, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "@/navigation";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const AvailabilityManager = ({ initialAvailability }: { initialAvailability: any[] }) => {
  const [slots, setSlots] = useState(initialAvailability);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const addSlot = () => {
    setSlots([...slots, { dayOfWeek: 1, startTime: "09:00", endTime: "10:00" }]);
  };

  const removeSlot = (index: number) => {
    setSlots(slots.filter((_, i) => i !== index));
  };

  const updateSlot = (index: number, field: string, value: any) => {
    const newSlots = [...slots];
    newSlots[index] = { ...newSlots[index], [field]: value };
    setSlots(newSlots);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/tutor/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ availability: slots }),
      });

      if (res.ok) {
        toast.success("Availability updated successfully!");
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
    <div className="space-y-6">
      <div className="grid gap-4">
        {slots.map((slot, index) => (
          <div key={index} className="bg-white p-6 rounded-[2rem] border border-sky-100 shadow-xl shadow-sky-100/20 flex flex-wrap items-center gap-6 group animate-in fade-in slide-in-from-top-2">
            <div className="flex-1 min-w-[150px]">
              <label className="block text-[9px] font-black uppercase text-slate-400 mb-2 ml-2">Day</label>
              <select 
                value={slot.dayOfWeek}
                onChange={(e) => updateSlot(index, 'dayOfWeek', parseInt(e.target.value))}
                className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-4 focus:ring-sky-100 outline-none transition-all"
              >
                {DAYS.map((day, d) => (
                  <option key={d} value={d}>{day}</option>
                ))}
              </select>
            </div>
            
            <div className="flex-1 min-w-[120px]">
              <label className="block text-[9px] font-black uppercase text-slate-400 mb-2 ml-2">Start Time</label>
              <input 
                type="time" 
                value={slot.startTime}
                onChange={(e) => updateSlot(index, 'startTime', e.target.value)}
                className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-4 focus:ring-sky-100 outline-none transition-all"
              />
            </div>

            <div className="flex-1 min-w-[120px]">
              <label className="block text-[9px] font-black uppercase text-slate-400 mb-2 ml-2">End Time</label>
              <input 
                type="time" 
                value={slot.endTime}
                onChange={(e) => updateSlot(index, 'endTime', e.target.value)}
                className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-4 focus:ring-sky-100 outline-none transition-all"
              />
            </div>

            <button 
              onClick={() => removeSlot(index)}
              className="p-4 text-rose-300 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-8">
        <button 
          onClick={addSlot}
          className="flex-1 py-5 border-2 border-dashed border-sky-200 rounded-[2rem] text-sky-500 font-black text-xs uppercase tracking-widest hover:bg-sky-50 transition-all flex items-center justify-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Weekly Slot
        </button>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex-1 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : (
            <>
              <Save className="h-4 w-4 text-sky-400" />
              Save Availability
            </>
          )}
        </button>
      </div>
    </div>
  );
};
