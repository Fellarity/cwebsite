import { redirect } from "next/navigation";
import { ShieldAlert, Users, TrendingUp, DollarSign, Wallet } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { syncUser } from "@/lib/sync-user";
import { prisma } from "@/lib/prisma";
import { TutorManager } from "@/components/admin/tutor-manager";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const user = await syncUser();
  
  // RBAC Enforcement
  if (!user || user.role !== 'ADMIN') {
    redirect('/');
  }

  // Fetch Real Stats
  const [totalUsers, activeTutors, pendingApps, revenueData, pendingTutors, recentOrders] = await Promise.all([
    prisma.user.count(),
    prisma.tutorProfile.count({ where: { verificationStatus: 'APPROVED' } }),
    prisma.tutorProfile.count({ where: { verificationStatus: 'PENDING' } }),
    prisma.order.aggregate({ _sum: { amount: true }, where: { status: 'PAID' } }),
    prisma.user.findMany({
      where: { role: 'TUTOR', tutorProfile: { verificationStatus: 'PENDING' } },
      include: { tutorProfile: true }
    }),
    prisma.order.findMany({
      where: { status: 'PAID' },
      include: { user: true, plan: true },
      orderBy: { createdAt: 'desc' },
      take: 5
    })
  ]);

  const stats = [
    { label: "Total Users", val: totalUsers.toString(), border: "border-l-rose-500", icon: Users },
    { label: "Active Tutors", val: activeTutors.toString(), border: "border-l-sky-500", icon: ShieldAlert },
    { label: "Pending Apps", val: pendingApps.toString(), border: "border-l-amber-500", icon: TrendingUp },
    { label: "Total Revenue", val: `$${revenueData._sum.amount || 0}`, border: "border-l-indigo-500", icon: DollarSign }
  ];

  return (
    <div className="min-h-screen bg-brand-surface-soft pb-20">
      <Navbar />
      
      <main className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-100 text-rose-700 text-[10px] font-black uppercase tracking-[0.2em] mb-4 shadow-sm">
            <ShieldAlert className="h-3.5 w-3.5" />
            System Administrator
          </div>
          <h1 className="text-5xl font-black text-brand-text-heading tracking-tight">Oversight Dashboard</h1>
          <p className="text-brand-text-muted font-bold mt-2 uppercase text-xs tracking-widest">Real-time platform analytics and management</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => (
            <div key={i} className={`bg-white p-8 rounded-[2rem] shadow-xl shadow-brand-soft border border-brand-border border-l-8 ${stat.border}`}>
              <p className="text-[10px] font-black text-brand-text-muted uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black text-brand-text-heading tracking-tighter">{stat.val}</h3>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
           {/* Tutor Applications */}
           <div className="bg-white rounded-[3rem] shadow-2xl shadow-brand-soft border border-brand-border p-10">
              <h2 className="text-2xl font-black text-brand-text-heading mb-8 flex items-center gap-4 uppercase tracking-tight">
                <div className="p-3 bg-brand-primary rounded-xl shadow-lg shadow-brand-soft">
                  <Users className="h-5 w-5 text-white" />
                </div>
                Tutor Applications
              </h2>
              <TutorManager initialTutors={pendingTutors} />
           </div>

           {/* Recent Revenue */}
           <div className="bg-white rounded-[3rem] shadow-2xl shadow-brand-soft border border-brand-border p-10">
              <h2 className="text-2xl font-black text-brand-text-heading mb-8 flex items-center gap-4 uppercase tracking-tight">
                <div className="p-3 bg-indigo-600 rounded-xl shadow-lg shadow-brand-soft">
                  <Wallet className="h-5 w-5 text-white" />
                </div>
                Recent Revenue
              </h2>
              <div className="space-y-4">
                 {recentOrders.length === 0 ? (
                   <p className="text-center text-brand-text-muted font-bold py-12 italic">No successful transactions yet.</p>
                 ) : recentOrders.map((order) => (
                   <div key={order.id} className="p-6 rounded-3xl bg-brand-surface-soft/50 border border-brand-border flex items-center justify-between">
                      <div>
                         <p className="font-black text-slate-900 uppercase text-xs tracking-wide">{order.user.name}</p>
                         <p className="text-[10px] font-bold text-slate-500 uppercase">{order.plan.title}</p>
                      </div>
                      <div className="text-right">
                         <p className="font-black text-indigo-600 text-lg tracking-tighter">${order.amount}</p>
                         <p className="text-[9px] font-bold text-slate-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}
