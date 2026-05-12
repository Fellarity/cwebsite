"use client";

import { useState } from "react";
import { Plus, Trash2, Loader2, Link as LinkIcon, FileText, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "@/navigation";

export const ResourceManager = ({ initialResources }: { initialResources: any[] }) => {
  const [resources, setResources] = useState(initialResources);
  const [isAdding, setIsAdding] = useState(false);
  const [newRes, setNewRes] = useState({ title: "", url: "", description: "" });
  const [processing, setProcessing] = useState<string | null>(null);
  const router = useRouter();

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing("new");
    try {
      const res = await fetch("/api/tutor/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRes),
      });
      const data = await res.json();
      if (res.ok) {
        setResources([data, ...resources]);
        setNewRes({ title: "", url: "", description: "" });
        setIsAdding(false);
        toast.success("Resource added");
      } else {
        throw new Error();
      }
    } catch {
      toast.error("Failed to add resource");
    } finally {
      setProcessing(null);
    }
  };

  const handleDelete = async (id: string) => {
    setProcessing(id);
    try {
      const res = await fetch(`/api/tutor/resources/${id}`, { method: "DELETE" });
      if (res.ok) {
        setResources(resources.filter(r => r.id !== id));
        toast.success("Resource removed");
      }
    } catch {
      toast.error("Failed to delete");
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">Managed Resources ({resources.length})</h3>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="px-6 py-2 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2"
        >
          {isAdding ? "Cancel" : <><Plus className="h-4 w-4" /> Add Link</>}
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-sky-100 animate-in zoom-in-95 duration-200">
           <form onSubmit={handleAdd} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-[9px] font-black uppercase text-slate-400 mb-2 ml-2">Title</label>
                    <input 
                      required
                      type="text" 
                      className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-sky-100 transition-all"
                      placeholder="LangChain Documentation"
                      value={newRes.title}
                      onChange={(e) => setNewRes({...newRes, title: e.target.value})}
                    />
                 </div>
                 <div>
                    <label className="block text-[9px] font-black uppercase text-slate-400 mb-2 ml-2">URL</label>
                    <input 
                      required
                      type="url" 
                      className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-sky-100 transition-all"
                      placeholder="https://..."
                      value={newRes.url}
                      onChange={(e) => setNewRes({...newRes, url: e.target.value})}
                    />
                 </div>
              </div>
              <div>
                 <label className="block text-[9px] font-black uppercase text-slate-400 mb-2 ml-2">Notes (Optional)</label>
                 <input 
                   type="text" 
                   className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-sky-100 transition-all"
                   placeholder="Basic overview of vector chains..."
                   value={newRes.description}
                   onChange={(e) => setNewRes({...newRes, description: e.target.value})}
                 />
              </div>
              <button 
                type="submit"
                disabled={processing === "new"}
                className="w-full py-4 bg-brand-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-brand-primary-hover shadow-lg transition-all flex items-center justify-center gap-2"
              >
                {processing === "new" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Resource"}
              </button>
           </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {resources.map((res) => (
          <div key={res.id} className="p-6 bg-white rounded-[2rem] border border-sky-50 shadow-lg shadow-sky-100/10 flex items-center justify-between group hover:border-sky-200 transition-all">
             <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-sky-50 rounded-2xl flex items-center justify-center text-sky-500">
                   <LinkIcon className="h-5 w-5" />
                </div>
                <div>
                   <h4 className="font-black text-slate-900 uppercase text-xs tracking-tight">{res.title}</h4>
                   <p className="text-[10px] font-bold text-slate-400 truncate max-w-[200px]">{res.description || res.url}</p>
                </div>
             </div>
             
             <div className="flex items-center gap-2">
                <a 
                  href={res.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 bg-slate-50 text-slate-400 hover:bg-sky-50 hover:text-sky-600 rounded-xl transition-all"
                >
                   <ExternalLink className="h-4 w-4" />
                </a>
                <button 
                  onClick={() => handleDelete(res.id)}
                  disabled={processing === res.id}
                  className="p-3 bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-500 rounded-xl transition-all"
                >
                   {processing === res.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                </button>
             </div>
          </div>
        ))}
        {resources.length === 0 && !isAdding && (
          <div className="md:col-span-2 py-20 text-center bg-white/50 rounded-[3rem] border-2 border-dashed border-slate-100">
             <p className="text-slate-300 font-bold uppercase tracking-widest text-sm italic">Empty Repository</p>
          </div>
        )}
      </div>
    </div>
  );
};
