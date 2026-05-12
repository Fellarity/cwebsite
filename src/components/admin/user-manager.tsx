"use client";

import { useState } from "react";
import { User, Shield, Zap, Save, Loader2, History, CreditCard, Calendar, X } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "@/navigation";

export const UserManager = ({ initialUsers }: { initialUsers: any[] }) => {
  const [users, setUsers] = useState(initialUsers);
  const [processing, setProcessing] = useState<string | null>(null);
  const [historyUser, setHistoryUser] = useState<any | null>(null);
  const [userHistory, setUserHistory] = useState<{ bookings: any[], orders: any[] } | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const router = useRouter();

  const handleUpdate = async (userId: string, currentRole: string, currentCredits: number) => {
    setProcessing(userId);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          userId, 
          role: currentRole, 
          totalCredits: currentCredits 
        }),
      });

      if (res.ok) {
        toast.success("User updated successfully");
        router.refresh();
      } else {
        throw new Error("Update failed");
      }
    } catch {
      toast.error("Failed to update user");
    } finally {
      setProcessing(null);
    }
  };

  const fetchHistory = async (user: any) => {
    setHistoryUser(user);
    setLoadingHistory(true);
    try {
      const res = await fetch(`/api/admin/users/${user.id}/history`);
      const data = await res.json();
      setUserHistory(data);
    } catch {
      toast.error("Failed to fetch user history");
    } finally {
      setLoadingHistory(false);
    }
  };

  const updateLocalUser = (userId: string, field: string, value: any) => {
    setUsers(users.map(u => {
      if (u.id === userId) {
        if (field === 'totalCredits') {
          return { ...u, studentProfile: { ...u.studentProfile, totalCredits: value } };
        }
        return { ...u, [field]: value };
      }
      return u;
    }));
  };

  return (
    <div className="mt-10 relative">
      <div className="overflow-x-auto rounded-3xl border border-brand-border bg-brand-surface-soft/30 p-2">
        <table className="min-w-full divide-y divide-brand-border">
          <thead>
            <tr>
              <th className="px-6 py-4 text-left text-[10px] font-black text-brand-text-muted uppercase tracking-widest">User</th>
              <th className="px-6 py-4 text-left text-[10px] font-black text-brand-text-muted uppercase tracking-widest">Role</th>
              <th className="px-6 py-4 text-left text-[10px] font-black text-brand-text-muted uppercase tracking-widest">Credits</th>
              <th className="px-6 py-4 text-left text-[10px] font-black text-brand-text-muted uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border">
            {users.map((user) => (
              <tr key={user.id} className="bg-white/50 hover:bg-white transition-colors">
                <td className="px-6 py-4">
                  <div className="font-black text-slate-900 uppercase text-xs tracking-wide">{user.name}</div>
                  <div className="text-[10px] font-bold text-slate-400">{user.email}</div>
                </td>
                <td className="px-6 py-4">
                  <select 
                    value={user.role}
                    onChange={(e) => updateLocalUser(user.id, 'role', e.target.value)}
                    className="bg-brand-surface-soft border-none rounded-xl text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-brand-primary outline-none p-2"
                  >
                    <option value="STUDENT">Student</option>
                    <option value="TUTOR">Tutor</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Zap className="h-3 w-3 text-amber-500" />
                    <input 
                      type="number" 
                      value={user.studentProfile?.totalCredits || 0}
                      onChange={(e) => updateLocalUser(user.id, 'totalCredits', parseInt(e.target.value))}
                      className="w-16 bg-brand-surface-soft border-none rounded-xl text-[10px] font-black p-2 outline-none"
                    />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleUpdate(user.id, user.role, user.studentProfile?.totalCredits || 0)}
                      disabled={processing === user.id}
                      className="p-3 bg-slate-900 text-white rounded-xl hover:bg-brand-primary transition-all disabled:opacity-50"
                    >
                      {processing === user.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    </button>
                    <button 
                      onClick={() => fetchHistory(user)}
                      className="p-3 bg-sky-50 text-sky-600 rounded-xl hover:bg-sky-600 hover:text-white transition-all"
                    >
                      <History className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* History Modal / Overlay */}
      {historyUser && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-10 bg-slate-900/60 backdrop-blur-xl animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-4xl max-h-[80vh] rounded-[3rem] shadow-2xl border border-sky-100 flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="p-10 border-b border-sky-50 flex items-center justify-between">
                 <div>
                    <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight">{historyUser.name}</h3>
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">{historyUser.email}</p>
                 </div>
                 <button onClick={() => setHistoryUser(null)} className="p-4 bg-slate-50 rounded-2xl hover:bg-rose-50 hover:text-rose-500 transition-all">
                    <X className="h-6 w-6" />
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                 {loadingHistory ? (
                   <div className="flex flex-col items-center justify-center py-20 gap-4">
                      <Loader2 className="h-10 w-10 text-brand-primary animate-spin" />
                      <p className="text-[10px] font-black uppercase text-slate-400">Reconstructing timeline...</p>
                   </div>
                 ) : (
                   <div className="grid md:grid-cols-2 gap-10">
                      {/* Bookings */}
                      <div>
                         <h4 className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">
                            <Calendar className="h-4 w-4" /> Coaching History
                         </h4>
                         <div className="space-y-4">
                            {userHistory?.bookings.length === 0 ? <p className="text-sm italic text-slate-300">No bookings yet.</p> : userHistory?.bookings.map((b: any) => (
                              <div key={b.id} className="p-5 bg-sky-50/50 rounded-2xl border border-sky-100">
                                 <p className="font-black text-slate-900 uppercase text-[10px] mb-1">Mentor: {b.tutor.user.name}</p>
                                 <p className="text-xs font-bold text-sky-600">{new Date(b.startTime).toLocaleString()}</p>
                              </div>
                            ))}
                         </div>
                      </div>

                      {/* Orders */}
                      <div>
                         <h4 className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">
                            <CreditCard className="h-4 w-4" /> Transactions
                         </h4>
                         <div className="space-y-4">
                            {userHistory?.orders.length === 0 ? <p className="text-sm italic text-slate-300">No payments yet.</p> : userHistory?.orders.map((o: any) => (
                              <div key={o.id} className="p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100 flex justify-between items-center">
                                 <div>
                                    <p className="font-black text-slate-900 uppercase text-[10px] mb-1">{o.plan.title}</p>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase">{new Date(o.createdAt).toLocaleDateString()}</p>
                                 </div>
                                 <p className="font-black text-emerald-600 text-lg tracking-tighter">${o.amount}</p>
                              </div>
                            ))}
                         </div>
                      </div>
                   </div>
                 )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
