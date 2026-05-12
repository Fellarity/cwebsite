"use client";

import { useState } from "react";
import { Check, X, Loader2, FileText, ClipboardList, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "@/navigation";

export const SessionNotesModal = ({ bookingId, studentName }: { bookingId: string, studentName: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [notes, setNotes] = useState("");
  const [actionItems, setActionItems] = useState("");
  const [status, setStatus] = useState<"COMPLETED" | "CANCELLED">("COMPLETED");
  const router = useRouter();

  const handleSave = async () => {
    if (!notes) {
      toast.error("Please provide a session summary.");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch(`/api/tutor/bookings/${bookingId}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          sessionNotes: notes,
          actionItems: actionItems.split("\n").filter(i => i.trim() !== "")
        }),
      });

      if (res.ok) {
        toast.success(`Session marked as ${status.toLowerCase()}`);
        setIsOpen(false);
        router.refresh();
      } else {
        throw new Error("Failed to save session notes");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="px-6 py-2 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all"
      >
        Close Session
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-10 bg-slate-900/60 backdrop-blur-xl animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-3xl rounded-[3rem] shadow-2xl border border-sky-100 flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="p-10 border-b border-sky-50 flex items-center justify-between">
                 <div>
                    <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Session Summary</h3>
                    <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em]">Deliverable for {studentName}</p>
                 </div>
                 <button onClick={() => setIsOpen(false)} className="p-4 bg-slate-50 rounded-2xl hover:bg-rose-50 hover:text-rose-500 transition-all">
                    <X className="h-6 w-6" />
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto p-10 custom-scrollbar space-y-10">
                 <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setStatus("COMPLETED")}
                      className={`flex-1 p-5 rounded-2xl border-2 font-black text-[10px] uppercase tracking-widest transition-all ${
                        status === "COMPLETED" ? "bg-emerald-50 border-emerald-500 text-emerald-600" : "bg-white border-slate-100 text-slate-400"
                      }`}
                    >
                      Session Completed
                    </button>
                    <button 
                      onClick={() => setStatus("CANCELLED")}
                      className={`flex-1 p-5 rounded-2xl border-2 font-black text-[10px] uppercase tracking-widest transition-all ${
                        status === "CANCELLED" ? "bg-rose-50 border-rose-500 text-rose-600" : "bg-white border-slate-100 text-slate-400"
                      }`}
                    >
                      No Show / Cancelled
                    </button>
                 </div>

                 <div className="space-y-4">
                    <label className="block text-[10px] font-black uppercase text-slate-400 ml-2 flex items-center gap-2">
                       <FileText className="h-4 w-4" /> Session Notes (Summary)
                    </label>
                    <textarea 
                      required
                      className="w-full p-6 bg-slate-50 border-none rounded-3xl focus:ring-4 focus:ring-sky-100 outline-none transition-all min-h-[150px] text-sm font-medium"
                      placeholder="What was covered during this session?"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                 </div>

                 <div className="space-y-4">
                    <label className="block text-[10px] font-black uppercase text-slate-400 ml-2 flex items-center gap-2">
                       <ClipboardList className="h-4 w-4" /> Action Items (One per line)
                    </label>
                    <textarea 
                      className="w-full p-6 bg-slate-50 border-none rounded-3xl focus:ring-4 focus:ring-sky-100 outline-none transition-all min-h-[120px] text-sm font-medium"
                      placeholder="Tasks for the student to complete before the next session..."
                      value={actionItems}
                      onChange={(e) => setActionItems(e.target.value)}
                    />
                 </div>
              </div>
              
              <div className="p-10 bg-slate-50 border-t border-slate-100">
                 <button 
                   onClick={handleSave}
                   disabled={isSaving}
                   className="w-full py-5 bg-brand-primary text-white rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-brand-primary-hover shadow-xl transition-all flex items-center justify-center gap-3 disabled:opacity-70"
                 >
                   {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                     <>
                       Save & Finalize Session
                       <Check className="h-5 w-5" />
                     </>
                   )}
                 </button>
              </div>
           </div>
        </div>
      )}
    </>
  );
};
