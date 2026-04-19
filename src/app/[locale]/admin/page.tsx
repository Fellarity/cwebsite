import { redirect } from "next/navigation";
import { ShieldAlert, Users } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { syncUser } from "@/lib/sync-user";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const user = await syncUser();
  
  // RBAC Enforcement: Strict check for ADMIN role
  if (!user || user.role !== 'ADMIN') {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-brand-surface-soft">
      <Navbar />
      
      <main className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-100 text-rose-700 text-[10px] font-black uppercase tracking-[0.2em] mb-4 shadow-sm">
            <ShieldAlert className="h-3.5 w-3.5" />
            System Administrator
          </div>
          <h1 className="text-5xl font-black text-brand-text-heading tracking-tight">Oversight Dashboard</h1>
          <p className="text-brand-text-muted font-bold mt-2 uppercase text-xs tracking-widest">Platform analytics and tutor management</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: "Total Users", val: "128", border: "border-l-rose-500" },
            { label: "Active Tutors", val: "14", border: "border-l-sky-500" },
            { label: "Pending Apps", val: "3", border: "border-l-amber-500" },
            { label: "Monthly MRR", val: "$4,200", border: "border-l-indigo-500" }
          ].map((stat, i) => (
            <div key={i} className={`bg-white p-8 rounded-[2rem] shadow-xl shadow-brand-soft border border-brand-border border-l-8 ${stat.border}`}>
              <p className="text-[10px] font-black text-brand-text-muted uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black text-brand-text-heading tracking-tighter">{stat.val}</h3>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-[3rem] shadow-2xl shadow-brand-soft border border-brand-border p-10">
          <h2 className="text-2xl font-black text-brand-text-heading mb-8 flex items-center gap-4 uppercase tracking-tight">
            <div className="p-3 bg-brand-primary rounded-xl shadow-lg shadow-brand-soft">
              <Users className="h-5 w-5 text-white" />
            </div>
            Tutor Applications
          </h2>
          <div className="overflow-x-auto rounded-3xl border border-brand-border bg-brand-surface-soft/30 p-2">
            <table className="min-w-full divide-y divide-brand-border">
              <thead>
                <tr>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-brand-text-muted uppercase tracking-widest">Candidate</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-brand-text-muted uppercase tracking-widest">Expertise</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-brand-text-muted uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-brand-text-muted font-bold text-sm italic">
                    No pending applications requiring review.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
