"use client";

import { useState } from "react";
import { Check, Loader2, Calendar } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "@/navigation";
import { TimeSlot } from "@/lib/scheduling";

export const SlotPicker = ({ 
  slots, 
  tutorId,
  bookTitle,
  weeklySlotsText
}: { 
  slots: TimeSlot[], 
  tutorId: string,
  bookTitle: string,
  weeklySlotsText: string
}) => {
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleBooking = async () => {
    if (!selectedSlot) {
      toast.error("Please select a time slot first.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tutorId,
          startTime: selectedSlot.start,
          endTime: selectedSlot.end,
        }),
      });

      if (res.ok) {
        toast.success("Session booked successfully!");
        router.push("/dashboard");
      } else {
        const error = await res.json();
        if (res.status === 401) {
            toast.error("Please sign in to book a session.");
        } else {
            throw new Error(error.error || "Failed to create booking");
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="sticky top-32 p-10 rounded-[3.5rem] bg-slate-900 text-white shadow-2xl shadow-sky-200 border-4 border-slate-800">
      <h3 className="text-3xl font-black mb-8 tracking-tight uppercase">{bookTitle}</h3>
      
      <div className="space-y-6 mb-12">
        <div className="p-6 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-between group">
          <div className="flex items-center gap-4">
            <Calendar className="h-6 w-6 text-sky-400" />
            <span className="font-black text-xs uppercase tracking-widest">{weeklySlotsText}</span>
          </div>
        </div>
        
        <div className="max-h-[300px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
          {slots.length > 0 ? slots.map((slot, idx) => (
            <button 
              key={idx} 
              onClick={() => setSelectedSlot(slot)}
              className={`w-full flex items-center justify-between text-[10px] py-4 px-6 border rounded-2xl font-black uppercase tracking-widest transition-all group ${
                selectedSlot === slot 
                ? 'bg-sky-500 border-sky-500 text-white' 
                : 'border-white/5 text-slate-500 hover:bg-white/5'
              }`}
            >
              <span className={selectedSlot === slot ? 'text-white' : 'text-slate-500'}>
                {slot.label.split('(')[1].replace(')', '')}
              </span>
              <span className={selectedSlot === slot ? 'text-white font-black' : 'text-sky-400'}>
                {slot.label.split('(')[0]}
              </span>
            </button>
          )) : (
            <p className="text-slate-500 text-center py-10 font-bold text-xs uppercase">No slots available this week</p>
          )}
        </div>
      </div>

      <button 
        onClick={handleBooking}
        disabled={isSubmitting || !selectedSlot}
        className={`w-full py-5 bg-gradient-to-r from-sky-500 to-indigo-600 text-white rounded-2xl font-black text-lg transition-all shadow-xl shadow-sky-500/20 active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isSubmitting ? <Loader2 className="h-6 w-6 animate-spin" /> : (
          <>
            Confirm Booking
            <Check className="h-5 w-5" />
          </>
        )}
      </button>
      
      <p className="text-center mt-8 text-[10px] font-black text-slate-500 uppercase tracking-widest leading-loose max-w-[200px] mx-auto opacity-60">
        Secure booking &bull; 100% Satisfaction Guaranteed &bull;
      </p>
    </div>
  );
};
