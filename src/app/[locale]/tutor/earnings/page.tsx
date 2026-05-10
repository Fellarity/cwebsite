import { redirect } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { syncUser } from "@/lib/sync-user";
import { prisma } from "@/lib/prisma";
import { Wallet, TrendingUp } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function TutorEarningsPage() {
  const user = await syncUser();
  
  if (!user || user.role !== 'TUTOR') {
    redirect('/');
  }

  const profile = await prisma.tutorProfile.findUnique({
    where: { userId: user.id }
  });

  if (!profile) redirect('/');

  // Fetch real revenue for this tutor (Bookings that are completed or confirmed)
  // For now, we'll simplify and show all successful orders where this tutor is the target
  const bookings = await prisma.booking.findMany({
    where: { tutorId: profile.id },
    include: {
      student: {
        include: {
          user: true
        }
      }
    },
    orderBy: { startTime: 'desc' }
  });

  const totalEarnings = bookings.length * (profile.hourlyRate || 0);

  return (
    <main className="min-h-screen bg-brand-surface-soft pb-20">
      <Navbar />
      
      <div className="pt-40 max-w-4xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Earnings & Revenue</h1>
            <p className="text-slate-500 font-bold mt-2 uppercase text-xs tracking-widest italic">Financial oversight of your coaching sessions.</p>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-sky-100/40 border border-sky-50 text-right">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Balance</p>
             <h3 className="text-4xl font-black text-brand-primary tracking-tighter">${totalEarnings}</h3>
          </div>
        </div>

        <div className="bg-white rounded-[3rem] shadow-2xl border border-sky-100 p-10">
           <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-4 uppercase tracking-tight">
              <div className="p-3 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-100">
                <Wallet className="h-5 w-5 text-white" />
              </div>
              Transaction History
           </h2>

           <div className="space-y-4">
              {bookings.length === 0 ? (
                <p className="text-center text-slate-400 font-bold py-12 italic border-2 border-dashed border-slate-50 rounded-[2rem]">No transactions recorded yet.</p>
              ) : bookings.map((booking) => (
                <div key={booking.id} className="p-6 rounded-3xl bg-slate-50/50 border border-slate-100 flex items-center justify-between hover:bg-white transition-all group">
                   <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-indigo-600">
                         <TrendingUp className="h-5 w-5" />
                      </div>
                      <div>
                         <p className="font-black text-slate-900 uppercase text-xs tracking-wide">{booking.student.user.name}</p>
                         <p className="text-[10px] font-bold text-slate-400 uppercase">1 Hour Session</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="font-black text-slate-900 text-lg tracking-tighter">${profile.hourlyRate}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase">{booking.startTime.toLocaleDateString()}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </main>
  );
}
