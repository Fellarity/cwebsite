"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Mail, Loader2, Clock, User } from "lucide-react";
import Image from "next/image";

export const Inbox = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch("/api/messages");
        const data = await res.json();
        setMessages(data);
      } catch (error) {
        console.error("Failed to load inbox");
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="h-10 w-10 text-brand-primary animate-spin" />
        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Accessing secure inbox...</p>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="py-20 text-center bg-white/50 rounded-[3rem] border-2 border-dashed border-slate-200">
         <p className="text-slate-400 font-bold uppercase tracking-widest text-sm italic">Your inbox is empty.</p>
         <p className="text-[10px] font-bold text-slate-300 uppercase mt-2">Announcements from your mentors will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {messages.map((msg) => (
        <div key={msg.id} className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-sky-50 flex gap-6 hover:border-brand-primary transition-all group">
           <div className="relative h-14 w-14 rounded-2xl overflow-hidden bg-sky-50 shrink-0 border border-slate-100">
              {msg.sender.image ? (
                <Image src={msg.sender.image} alt={msg.sender.name} fill className="object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-brand-primary font-black uppercase text-xl">
                   {msg.sender.name[0]}
                </div>
              )}
           </div>
           
           <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                 <h4 className="font-black text-slate-900 uppercase text-xs tracking-tight">{msg.sender.name}</h4>
                 <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400">
                    <Clock className="h-3 w-3" />
                    {new Date(msg.createdAt).toLocaleString()}
                 </div>
              </div>
              <p className="text-sm font-medium text-slate-600 leading-relaxed">{msg.content}</p>
           </div>
        </div>
      ))}
    </div>
  );
};
