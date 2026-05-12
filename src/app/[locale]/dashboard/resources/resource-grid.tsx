"use client";

import { useState, useEffect } from "react";
import { Link as LinkIcon, ExternalLink, Loader2, User } from "lucide-react";

export const ResourceGrid = () => {
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await fetch("/api/users/resources");
        const data = await res.json();
        setResources(data);
      } catch (error) {
        console.error("Failed to load resources");
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="h-10 w-10 text-brand-primary animate-spin" />
        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Opening vault...</p>
      </div>
    );
  }

  if (resources.length === 0) {
    return (
      <div className="py-20 text-center bg-white/50 rounded-[3rem] border-2 border-dashed border-slate-200">
         <p className="text-slate-400 font-bold uppercase tracking-widest text-sm italic">No shared resources yet.</p>
         <p className="text-[10px] font-bold text-slate-300 uppercase mt-2">Resources shared by your mentors will appear here.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {resources.map((res) => (
        <div key={res.id} className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-sky-50 flex flex-col hover:border-brand-primary transition-all group">
           <div className="h-14 w-14 bg-sky-50 rounded-2xl flex items-center justify-center text-brand-primary mb-6 group-hover:bg-brand-primary group-hover:text-white transition-colors">
              <LinkIcon className="h-6 w-6" />
           </div>
           
           <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-2 line-clamp-1">{res.title}</h3>
           <p className="text-xs text-slate-500 font-medium mb-8 flex-1 leading-relaxed">{res.description || "Expert asset curated for your learning journey."}</p>
           
           <div className="flex items-center justify-between pt-6 border-t border-slate-50">
              <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                 <User className="h-3.5 w-3.5" />
                 {res.tutor.user.name}
              </div>
              <a 
                href={res.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 bg-brand-surface-soft text-brand-primary rounded-xl hover:bg-brand-primary hover:text-white transition-all"
              >
                 <ExternalLink className="h-4 w-4" />
              </a>
           </div>
        </div>
      ))}
    </div>
  );
};
