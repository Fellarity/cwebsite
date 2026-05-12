"use client";

import { useState } from "react";
import { User, Shield, Zap, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "@/navigation";

export const UserManager = ({ initialUsers }: { initialUsers: any[] }) => {
  const [users, setUsers] = useState(initialUsers);
  const [processing, setProcessing] = useState<string | null>(null);
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
    <div className="overflow-x-auto rounded-3xl border border-brand-border bg-brand-surface-soft/30 p-2 mt-10">
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
                <button 
                  onClick={() => handleUpdate(user.id, user.role, user.studentProfile?.totalCredits || 0)}
                  disabled={processing === user.id}
                  className="p-3 bg-slate-900 text-white rounded-xl hover:bg-brand-primary transition-all disabled:opacity-50"
                >
                  {processing === user.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
