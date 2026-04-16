import { redirect } from "next/navigation";
import { BookOpen, Calendar, Clock, CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "@/navigation";
import { Navbar } from "@/components/navbar";
import { syncUser } from "@/lib/sync-user";
import { getTranslations } from 'next-intl/server';

export default async function StudentDashboard({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const user = await syncUser();
  const t = await getTranslations('Dashboard');
  
  if (!user) {
    redirect('/');
  }

  const stats = [
    { title: t('upcoming'), value: "0", icon: Calendar, color: "text-sky-500", bg: "bg-sky-50" },
    { title: t('completed'), value: "0", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50" },
    { title: t('hours'), value: "0h", icon: Clock, color: "text-indigo-500", bg: "bg-indigo-50" },
  ];

  return (
    <main className="min-h-screen pb-20">
      <Navbar />
      
      {/* Background Blobs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-sky-200/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-200/30 rounded-full blur-[120px]" />
      </div>

      <section className="pt-40 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h1 className="text-5xl font-black text-slate-900 tracking-tight">
              {t('welcome')}, <span className="text-sky-600">{user.name || 'Student'}!</span>
            </h1>
            <p className="text-slate-500 font-bold mt-2 uppercase text-xs tracking-widest">{t('subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white border border-sky-100 p-8 rounded-[2.5rem] shadow-xl shadow-sky-100/20 flex items-center gap-6">
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
                  {t('nextSession')}
                </h2>
                <div className="bg-sky-50/50 rounded-[2rem] p-12 text-center border-2 border-dashed border-sky-100">
                  <p className="text-slate-500 font-medium text-lg mb-8">{t('noSessions')}</p>
                  <Link 
                    href="/tutors" 
                    className="inline-flex items-center justify-center px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition-all shadow-xl shadow-slate-100 group"
                  >
                    {t('bookButton')}
                    <ArrowRight className="h-4 w-4 ml-2 text-sky-400 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="space-y-10">
              <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl shadow-sky-200 border-4 border-slate-800">
                <h2 className="text-xl font-black mb-8 flex items-center gap-4 uppercase tracking-widest">
                  <BookOpen className="h-5 w-5 text-sky-400" />
                  {t('currentPlan')}
                </h2>
                <div className="bg-white/5 rounded-[2rem] p-8 border border-white/10 mb-8">
                   <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] mb-2">{t('activePlan')}</p>
                   <h3 className="text-2xl font-black text-sky-400 uppercase tracking-tighter">{t('noPlan')}</h3>
                </div>
                <Link 
                  href="/pricing" 
                  className="w-full py-4 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                >
                  {t('upgrade')}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
