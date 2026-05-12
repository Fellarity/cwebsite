"use client";

import { useState, useEffect } from "react";
import { Activity, Clock, AlertCircle, Info, ShieldAlert } from "lucide-react";

export const AuditTrail = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch("/api/admin/logs");
        const data = await res.json();
        setLogs(data);
      } catch (error) {
        console.error("Failed to fetch logs");
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "CRITICAL": return <ShieldAlert className="h-4 w-4 text-rose-600" />;
      case "ERROR": return <AlertCircle className="h-4 w-4 text-rose-500" />;
      case "WARN": return <AlertCircle className="h-4 w-4 text-amber-500" />;
      default: return <Info className="h-4 w-4 text-sky-500" />;
    }
  };

  return (
    <div className="bg-white rounded-[3rem] shadow-2xl shadow-brand-soft border border-brand-border p-10 mt-12">
      <h2 className="text-2xl font-black text-brand-text-heading mb-8 flex items-center gap-4 uppercase tracking-tight">
        <div className="p-3 bg-slate-900 rounded-xl shadow-lg shadow-brand-soft">
          <Activity className="h-5 w-5 text-white" />
        </div>
        Operational Audit Trail
      </h2>

      <div className="space-y-4">
        {loading ? (
           <p className="text-center py-10 font-bold text-slate-400 italic">Synchronizing logs...</p>
        ) : logs.length === 0 ? (
           <p className="text-center py-10 font-bold text-slate-400 italic">No operational events recorded yet.</p>
        ) : logs.map((log) => (
          <div key={log.id} className="p-5 rounded-2xl bg-brand-surface-soft/50 border border-brand-border flex items-start gap-4 hover:bg-white transition-all group">
             <div className="mt-1">{getLevelIcon(log.level)}</div>
             <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{log.event}</span>
                   <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400">
                      <Clock className="h-3 w-3" />
                      {new Date(log.createdAt).toLocaleString()}
                   </div>
                </div>
                <p className="text-sm font-medium text-slate-700">{log.message}</p>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};
