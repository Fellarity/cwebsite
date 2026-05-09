"use client";

import { useState } from "react";
import { Check, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "@/navigation";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const TutorManager = ({ initialTutors }: { initialTutors: any[] }) => {
  const [tutors, setTutors] = useState(initialTutors);
  const [processing, setProcessing] = useState<string | null>(null);
  const router = useRouter();

  const handleAction = async (userId: string, action: 'APPROVE' | 'REJECT') => {
    setProcessing(userId);
    try {
      const res = await fetch("/api/admin/tutors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, action }),
      });

      if (res.ok) {
        toast.success(`Tutor ${action === 'APPROVE' ? 'Approved' : 'Rejected'} Successfully`);
        setTutors(tutors.filter(t => t.id !== userId));
        router.refresh();
      } else {
        throw new Error("Action failed");
      }
    } catch {
      toast.error("Failed to process request");
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="overflow-x-auto rounded-3xl border border-brand-border bg-brand-surface-soft/30 p-2">
      <table className="min-w-full divide-y divide-brand-border">
        <thead>
          <tr>
            <th className="px-6 py-4 text-left text-[10px] font-black text-brand-text-muted uppercase tracking-widest">Candidate</th>
            <th className="px-6 py-4 text-left text-[10px] font-black text-brand-text-muted uppercase tracking-widest">Expertise</th>
            <th className="px-6 py-4 text-left text-[10px] font-black text-brand-text-muted uppercase tracking-widest">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-brand-border">
          {tutors.length === 0 ? (
            <tr>
              <td colSpan={3} className="px-6 py-12 text-center text-brand-text-muted font-bold text-sm italic">
                No pending applications requiring review.
              </td>
            </tr>
          ) : tutors.map((tutor) => (
            <tr key={tutor.id} className="bg-white/50 hover:bg-white transition-colors">
              <td className="px-6 py-4">
                <div className="font-black text-slate-900 uppercase text-xs tracking-wide">{tutor.name}</div>
                <div className="text-[10px] font-bold text-slate-500">{tutor.email}</div>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-wrap gap-1">
                  {tutor.tutorProfile?.expertise.map((exp: string, i: number) => (
                    <span key={i} className="px-2 py-0.5 bg-sky-50 text-sky-600 rounded-md text-[9px] font-black uppercase">{exp}</span>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleAction(tutor.id, 'APPROVE')}
                    disabled={!!processing}
                    className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-500 hover:text-white transition-all disabled:opacity-50"
                  >
                    {processing === tutor.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                  </button>
                  <button 
                    onClick={() => handleAction(tutor.id, 'REJECT')}
                    disabled={!!processing}
                    className="p-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-500 hover:text-white transition-all disabled:opacity-50"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
