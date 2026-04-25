import { redirect } from "next/navigation";
import { Video, Calendar, Users, Briefcase, ArrowRight } from "lucide-react";
import { Link } from "@/navigation";
import { Navbar } from "@/components/navbar";
import { getTranslations } from 'next-intl/server';
import { syncUser } from "@/lib/sync-user";

export const dynamic = "force-dynamic";

export default async function TutorDashboard({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  const [user, t] = await Promise.all([
    syncUser(),
    getTranslations('TutorDashboard')
  ]);
  
  // RBAC Enforcement: Strict check for TUTOR role
  if (!user || user.role !== 'TUTOR') {
    redirect('/');
  }

  const stats = [
    { title: t('sessionsToday'), value: "0", icon: Video, color: "text-sky-500", bg: "bg-sky-50" },
    { title: t('activeStudents'), value: "0", icon: Users, color: "text-indigo-500", bg: "bg-indigo-50" },
    { title: t('totalHours'), value: "0h", icon: Calendar, color: "text-emerald-500", bg: "bg-emerald-50" },
  ];

  return (
    <main className="min-h-screen pb-20">
      <Navbar />
      
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-sky-200/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-200/30 rounded-full blur-[120px]" />
      </div>

      <section className="pt-40 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-sky-100 text-sky-700 text-[10px] font-black uppercase tracking-widest mb-4 shadow-sm backdrop-blur-sm">
                <Briefcase className="h-3.5 w-3.5 text-amber-500" />
                <span>{t('portalTag')}</span>
              </div>
              <h1 className="text-5xl font-black text-slate-900 tracking-tight">
                {t('welcome')}, <span className="text-sky-600">{user?.name || 'Tutor'}!</span>
              </h1>
              <p className="text-slate-500 font-bold mt-2 uppercase text-xs tracking-widest">{t('subtitle')}</p>
            </div>
            <Link href="/tutor/availability" className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition-all shadow-xl shadow-slate-100 uppercase tracking-widest">
              {t('manageButton')}
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white border border-sky-100 p-8 rounded-[2.5rem] shadow-xl shadow-sky-100/20 flex items-center gap-6 transition-all hover:-translate-y-1">
                <div className={`h-16 w-16 rounded-2xl ${stat.bg} flex items-center justify-center ${stat.color} shadow-lg shadow-sky-100/10`}>
                  <stat.icon className="h-8 w-8" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{stat.title}</p>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{stat.value}</h3>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-10">
              <div className="bg-white border border-sky-100 rounded-[3rem] shadow-xl shadow-sky-100/20 p-10">
                <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-4 uppercase tracking-tight">
                  <div className="p-3 bg-sky-500 rounded-xl shadow-lg shadow-sky-100">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  {t('scheduleTitle')}
                </h2>
                <div className="bg-sky-50/50 rounded-[2rem] p-12 text-center border-2 border-dashed border-sky-100">
                  <p className="text-slate-500 font-medium text-lg">{t('noSessions')}</p>
                </div>
              </div>
            </div>

            <div className="space-y-10">
              <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl shadow-sky-200 border-4 border-slate-800">
                <h2 className="text-xl font-black mb-8 flex items-center gap-4 uppercase tracking-widest text-sky-400">
                  {t('quickActions')}
                </h2>
                <div className="space-y-3">
                  {[t('action1'), t('action2'), t('action3')].map((action, i) => (
                    <button key={i} className="w-full text-left p-6 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-between group">
                      {action}
                      <ArrowRight className="h-4 w-4 text-sky-400 group-hover:translate-x-1 transition-transform" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
