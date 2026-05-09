export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { BookOpen, Calendar, Clock, CheckCircle2, ArrowRight, Star, Video } from "lucide-react";
import { Link } from "@/navigation";
import { Navbar } from "@/components/navbar";
import { prisma } from "@/lib/prisma";
import { syncUser } from "@/lib/sync-user";
import { getTranslations } from 'next-intl/server';
import { getRecommendedTutors } from "@/lib/matchmaker";
import Image from "next/image";

export default async function StudentDashboard({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  const [user, t] = await Promise.all([
    syncUser(),
    getTranslations('Dashboard')
  ]);
  
  if (!user) {
    redirect('/');
  }

  // Check if onboarding is completed
  const studentProfile = await prisma.studentProfile.findUnique({
    where: { userId: user.id },
    include: {
      bookings: true
    }
  });

  if (!studentProfile || !studentProfile.learningGoal) {
    redirect('/onboarding');
  }

  // Fetch recommended tutors based on onboarding data
  const recommendedTutors = await getRecommendedTutors(user.id);

  // Calculate Real Stats
  const upcomingSessions = studentProfile.bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'PENDING').length;
  const completedSessions = studentProfile.bookings.filter(b => b.status === 'COMPLETED').length;
  const totalHours = completedSessions * 1; // Assuming 1 hour per session for now

  const stats = [
    { title: t('upcoming'), value: upcomingSessions.toString(), icon: Calendar, color: "text-sky-500", bg: "bg-sky-50" },
    { title: t('completed'), value: completedSessions.toString(), icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50" },
    { title: t('hours'), value: `${totalHours}h`, icon: Clock, color: "text-indigo-500", bg: "bg-indigo-50" },
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
              {/* Next Session */}
              <div className="bg-white border border-sky-100 rounded-[3rem] shadow-xl shadow-sky-100/20 p-10">
                <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-4 uppercase tracking-tight">
                  <div className="p-3 bg-brand-primary rounded-xl shadow-lg shadow-brand-soft">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  {t('nextSession')}
                </h2>
                <div className="bg-sky-50/50 rounded-[2rem] p-12 text-center border-2 border-dashed border-sky-100">
                  {upcomingSessions > 0 ? (
                    <div className="text-left">
                       <p className="text-slate-900 font-black uppercase tracking-widest text-xs mb-4">Your next live 1-to-1 session is scheduled.</p>
                       <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm flex items-center justify-between">
                          <div className="flex items-center gap-4">
                             <div className="h-12 w-12 bg-sky-500 rounded-xl flex items-center justify-center text-white">
                                <Video className="h-6 w-6" />
                             </div>
                             <div>
                                <p className="font-black text-slate-900 uppercase text-[10px] tracking-widest">Google Meet</p>
                                <p className="text-sky-600 font-bold text-xs uppercase">Link will be active 5m before start</p>
                             </div>
                          </div>
                          <button className="px-6 py-2 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest">Join Room</button>
                       </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-slate-500 font-medium text-lg mb-8">{t('noSessions')}</p>
                      <Link 
                        href="/tutors" 
                        className="inline-flex items-center justify-center px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition-all shadow-xl shadow-slate-100 group"
                      >
                        {t('bookButton')}
                        <ArrowRight className="h-4 w-4 ml-2 text-sky-400 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </>
                  )}
                </div>
              </div>

              {/* Top Matches */}
              <div>
                 <div className="flex items-center justify-between mb-8 px-4">
                    <div>
                       <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">{t('matchesTitle')}</h2>
                       <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest">{t('matchesSubtitle')}</p>
                    </div>
                    <Link href="/tutors" className="text-xs font-black text-brand-primary uppercase tracking-widest hover:underline">See All</Link>
                 </div>
                 
                 <div className="grid sm:grid-cols-2 gap-6">
                    {recommendedTutors.map((tutor) => (
                      <div key={tutor.id} className="bg-white border border-sky-50 p-6 rounded-[2.5rem] shadow-lg shadow-sky-100/20 hover:shadow-xl transition-all group">
                         <div className="flex items-center gap-4 mb-6">
                            <div className="relative h-16 w-16 rounded-2xl overflow-hidden bg-sky-50 shrink-0">
                               {tutor.image ? (
                                 <Image src={tutor.image} alt={tutor.name} fill className="object-cover" />
                               ) : (
                                 <div className="flex items-center justify-center h-full text-sky-200 font-black text-xl uppercase">{tutor.name[0]}</div>
                               )}
                            </div>
                            <div>
                               <h4 className="font-black text-slate-900 leading-tight">{tutor.name}</h4>
                               <div className="flex items-center gap-1 text-amber-500 text-[10px] font-bold mt-1">
                                  <Star className="h-3 w-3 fill-amber-500" />
                                  4.9
                               </div>
                            </div>
                         </div>
                         <p className="text-slate-500 text-xs font-medium line-clamp-2 mb-6 leading-relaxed">
                            {tutor.tutorProfile?.bio}
                         </p>
                         <Link 
                           href={`/tutors/${tutor.id}`}
                           className="w-full py-3 bg-brand-surface-soft text-brand-primary rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-brand-primary hover:text-white transition-all flex items-center justify-center gap-2"
                         >
                           {t('viewProfile')}
                           <ArrowRight className="h-3.5 w-3.5" />
                         </Link>
                      </div>
                    ))}
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
                  className="w-full py-4 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-soft"
                >
                  {t('upgrade')}
                  <ArrowRight className="h-4 w-4 text-sky-400" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
