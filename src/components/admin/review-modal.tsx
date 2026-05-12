"use client";

import { useState } from "react";
import { Star, X, Loader2, MessageSquare, Send } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "@/navigation";

export const ReviewModal = ({ bookingId, tutorName }: { bookingId: string, tutorName: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const router = useRouter();

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/tutor/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, rating, comment }),
      });

      if (res.ok) {
        toast.success("Thank you for your feedback!");
        setIsOpen(false);
        router.refresh();
      } else {
        throw new Error("Failed to save review");
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
        className="px-6 py-2 bg-emerald-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all"
      >
        Leave Feedback
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-10 bg-slate-900/60 backdrop-blur-xl animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl border border-sky-100 flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="p-10 border-b border-sky-50 flex items-center justify-between">
                 <div>
                    <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Rate Mentor</h3>
                    <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em]">Session with {tutorName}</p>
                 </div>
                 <button onClick={() => setIsOpen(false)} className="p-4 bg-slate-50 rounded-2xl hover:bg-rose-50 hover:text-rose-500 transition-all">
                    <X className="h-6 w-6" />
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto p-10 space-y-10">
                 <div className="flex flex-col items-center gap-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">How was your session?</p>
                    <div className="flex gap-2">
                       {[1, 2, 3, 4, 5].map((s) => (
                         <button 
                           key={s} 
                           onClick={() => setRating(s)}
                           className="p-2 transition-all hover:scale-110 active:scale-90"
                         >
                            <Star className={`h-10 w-10 ${s <= rating ? 'text-amber-500 fill-amber-500' : 'text-slate-200'}`} />
                         </button>
                       ))}
                    </div>
                 </div>

                 <div className="space-y-4">
                    <label className="block text-[10px] font-black text-slate-400 ml-2 uppercase flex items-center gap-2">
                       <MessageSquare className="h-4 w-4" /> Share your experience
                    </label>
                    <textarea 
                      className="w-full p-6 bg-slate-50 border-none rounded-3xl focus:ring-4 focus:ring-sky-100 outline-none transition-all min-h-[120px] text-sm font-medium"
                      placeholder="Was the mentor helpful? Did you reach your goal?"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
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
                       Submit Review
                       <Send className="h-5 w-5" />
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
