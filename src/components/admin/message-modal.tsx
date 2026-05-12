"use client";

import { useState } from "react";
import { MessageSquare, X, Loader2, Send } from "lucide-react";
import { toast } from "sonner";

export const MessageModal = ({ receiverId, studentName }: { receiverId: string, studentName: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [content, setContent] = useState("");

  const handleSend = async () => {
    if (!content.trim()) return;
    setIsSending(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverId, content }),
      });

      if (res.ok) {
        toast.success("Message sent to " + studentName);
        setIsOpen(false);
        setContent("");
      } else {
        throw new Error();
      }
    } catch {
      toast.error("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="p-4 border-2 border-slate-50 rounded-2xl hover:bg-sky-50 transition-all text-slate-400 hover:text-brand-primary"
      >
        <MessageSquare className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-10 bg-slate-900/60 backdrop-blur-xl animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl border border-sky-100 flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="p-10 border-b border-sky-50 flex items-center justify-between">
                 <div>
                    <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Direct Message</h3>
                    <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em]">To: {studentName}</p>
                 </div>
                 <button onClick={() => setIsOpen(false)} className="p-4 bg-slate-50 rounded-2xl hover:bg-rose-50 hover:text-rose-500 transition-all">
                    <X className="h-6 w-6" />
                 </button>
              </div>

              <div className="flex-1 p-10 space-y-6">
                 <textarea 
                   required
                   className="w-full p-6 bg-slate-50 border-none rounded-3xl focus:ring-4 focus:ring-sky-100 outline-none transition-all min-h-[150px] text-sm font-medium"
                   placeholder="Type your message here..."
                   value={content}
                   onChange={(e) => setContent(e.target.value)}
                 />
              </div>
              
              <div className="p-10 bg-slate-50 border-t border-slate-100">
                 <button 
                   onClick={handleSend}
                   disabled={isSending || !content.trim()}
                   className="w-full py-5 bg-brand-primary text-white rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-brand-primary-hover shadow-xl transition-all flex items-center justify-center gap-3 disabled:opacity-70"
                 >
                   {isSending ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                     <>
                       Send Message
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
