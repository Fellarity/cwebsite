export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { BookOpen, Calendar, Clock, CheckCircle2, ArrowRight, Star, Video, Zap, MessageSquare, FileText, ClipboardList, Settings, CreditCard, GraduationCap, Mail } from "lucide-react";
import { Link } from "@/navigation";
import { Navbar } from "@/components/navbar";
import { prisma } from "@/lib/prisma";
import { syncUser } from "@/lib/sync-user";
import { getTranslations } from 'next-intl/server';
import { getRecommendedTutors } from "@/lib/matchmaker";
import Image from "next/image";
import { ReviewModal } from "@/components/admin/review-modal";

const TRACKS = [
  { id: "productivity", label: "AI Productivity Mastery" },
  { id: "students", label: "AI for Students" },
  { id: "content", label: "AI Content Creation" },
  { id: "professionals", label: "AI for Professionals" },
  { id: "development", label: "AI Development and Data" },
];

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

  // Fetch student profile, all bookings, and orders
  const studentProfile = await prisma.studentProfile.findUnique({
    where: { userId: user.id },
    include: {
      bookings: {
        include: {
          tutor: { include: { user: true } },
          review: true
        },
        orderBy: { startTime: 'desc' }
      }
    }
  });

  if (!studentProfile || !studentProfile.learningGoal) {
    redirect('/onboarding');
  }

  const [recommendedTutors, orders] = await Promise.all([
    getRecommendedTutors(user.id),
    prisma.order.findMany({
      where: { userId: user.id, status: 'PAID' },
      include: { plan: true },
      orderBy: { createdAt: 'desc' }
    })
  ]);

  // Filter Bookings
  const upcomingSessionsList = studentProfile.bookings
    .filter(b => b.status === 'CONFIRMED' || b.status === 'PENDING')
    .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

  const pastSessionsList = studentProfile.bookings
    .filter(b => b.status === 'COMPLETED' || b.status === 'CANCELLED')
    .slice(0, 5); 

  const stats = [
    { title: t('credits'), value: studentProfile.totalCredits.toString(), icon: Zap, color: "text-amber-500", bg: "bg-amber-50" },
    { title: t('upcoming'), value: upcomingSessionsList.length.toString(), icon: Calendar, color: "text-sky-500", bg: "bg-sky-50" },
    { title: t('completed'), value: studentProfile.bookings.filter(b => b.status === 'COMPLETED').length.toString(), icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50" },
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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
               <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">{t('subtitle')}</p>
               <Link href="/dashboard/settings" className="inline-flex items-center gap-2 text-[10px] font-black text-brand-primary uppercase tracking-widest hover:underline">
                  <Settings className="h-3.5 w-3.5" />
                  Refine Learning Goals
               </Link>
            </div>
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
              {/* Upcoming Sessions */}
              <div className="bg-white border border-sky-100 rounded-[3rem] shadow-xl shadow-sky-100/20 p-10">
                <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-4 uppercase tracking-tight">
                  <div className="p-3 bg-brand-primary rounded-xl shadow-lg shadow-brand-soft">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  {upcomingSessionsList.length > 1 ? t('upcoming') : t('nextSession')}
                </h2>
                <div className="bg-sky-50/50 rounded-[2rem] p-12 text-center border-2 border-dashed border-sky-100">
                  {upcomingSessionsList.length > 0 ? (
                    <div className="text-left space-y-6">
                       {upcomingSessionsList.map((session) => (
                         <div key={session.id} className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm flex items-center justify-between flex-wrap gap-4">
                            <div className="flex items-center gap-4">
                               <div className="h-12 w-12 bg-sky-500 rounded-xl flex items-center justify-center text-white">
                                  <Video className="h-6 w-6" />
                               </div>
                               <div>
                                  <p className="font-black text-slate-900 uppercase text-[10px] tracking-widest">Mentor: {session.tutor.user.name}</p>
                                  <p className="text-sky-600 font-bold text-xs uppercase">{session.startTime.toLocaleString()}</p>
                               </div>
                            </div>
                            <a 
                              href={session.meetLink || '#'} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className={`px-8 py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all ${!session.meetLink ? 'opacity-50 pointer-events-none' : ''}`}
                            >
                              Join Room
                            </a>
                         </div>
                       ))}
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

              {/* Past Sessions & Reviews */}
              {pastSessionsList.length > 0 && (
                <div className="bg-white border border-sky-100 rounded-[3rem] shadow-xl shadow-sky-100/20 p-10">
                   <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-4 uppercase tracking-tight">
                      <div className="p-3 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-100">
                        <CheckCircle2 className="h-5 w-5 text-white" />
                      </div>
                      Session History
                   </h2>
                   <div className="space-y-4">
                      {pastSessionsList.map((session) => (
                        <div key={session.id} className="p-6 rounded-3xl bg-slate-50 border border-slate-100 space-y-4">
                           <div className="flex items-center justify-between flex-wrap gap-4">
                              <div>
                                 <p className="font-black text-slate-900 uppercase text-[10px] mb-1">{session.tutor.user.name}</p>
                                 <p className="text-[10px] font-bold text-slate-400">{new Date(session.startTime).toLocaleDateString()}</p>
                              </div>
                              <div className="flex items-center gap-3">
                                 {session.status === 'COMPLETED' && !session.review && (
                                   <ReviewModal bookingId={session.id} tutorName={session.tutor.user.name} />
                                 )}
                                 {session.review && (
                                   <div className="flex items-center gap-1 text-amber-500">
                                      {[...Array(session.review.rating)].map((_, i) => <Star key={i} className="h-3 w-3 fill-amber-500" />)}
                                   </div>
                                 )}
                                 <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                                   session.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                                 }`}>
                                   {session.status}
                                 </span>
                              </div>
                           </div>
                           
                           {session.sessionNotes && (
                             <div className="pt-4 border-t border-slate-200">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                   <FileText className="h-3 w-3" /> Session Summary
                                </p>
                                <p className="text-xs text-slate-600 leading-relaxed italic">&ldquo;{session.sessionNotes}&rdquo;</p>
                             </div>
                           )}

                           {session.actionItems && (session.actionItems as string[]).length > 0 && (
                             <div className="pt-4">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                   <ClipboardList className="h-3 w-3" /> Next Steps
                                </p>
                                <div className="grid gap-2">
                                   {(session.actionItems as string[]).map((item, idx) => (
                                     <div key={idx} className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                                        <div className="h-1 w-1 bg-brand-primary rounded-full" />
                                        {item}
                                     </div>
                                   ))}
                                </div>
                             </div>
                           )}
                        </div>
                      ))}
                   </div>
                </div>
              )}

              {/* Billing & Receipts */}
              <div className="bg-white border border-sky-100 rounded-[3rem] shadow-xl shadow-sky-100/20 p-10">
                 <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-4 uppercase tracking-tight">
                    <div className="p-3 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-100">
                      <CreditCard className="h-5 w-5 text-white" />
                    </div>
                    Billing & Receipts
                 </h2>
                 <div className="space-y-4">
                    {orders.length === 0 ? (
                      <p className="text-sm italic text-slate-400 py-10 text-center border-2 border-dashed border-slate-50 rounded-[2rem]">No transactions yet.</p>
                    ) : orders.map((order) => (
                      <div key={order.id} className="p-6 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-between flex-wrap gap-4">
                         <div>
                            <p className="font-black text-slate-900 uppercase text-[10px] mb-1">{order.plan.title}</p>
                            <p className="text-[10px] font-bold text-slate-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                         </div>
                         <div className="flex items-center gap-4">
                            <p className="font-black text-slate-900 text-sm">${order.amount}</p>
                            <a 
                              href={`/api/payments/receipts/${order.id}`}
                              download
                              className="p-3 bg-white text-brand-primary rounded-xl border border-sky-100 hover:bg-brand-primary hover:text-white transition-all shadow-sm"
                            >
                               <FileText className="h-4 w-4" />
                            </a>
                         </div>
                      </div>
                    ))}
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
              {/* Knowledge Vault Shortcut */}
              <div className="bg-white border border-sky-100 p-8 rounded-[3rem] shadow-xl shadow-sky-100/20">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-brand-primary" /> Knowledge Vault
                 </p>
                 <div className="grid gap-3">
                    <Link 
                      href="/dashboard/resources"
                      className="flex items-center justify-between p-6 bg-brand-surface-soft rounded-3xl border border-sky-50 hover:border-brand-primary transition-all group"
                    >
                       <span className="font-black text-slate-900 uppercase text-[10px]">Resource Library</span>
                       <ArrowRight className="h-4 w-4 text-brand-primary group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link 
                      href="/dashboard/messages"
                      className="flex items-center justify-between p-6 bg-brand-surface-soft rounded-3xl border border-sky-50 hover:border-brand-primary transition-all group"
                    >
                       <span className="font-black text-slate-900 uppercase text-[10px]">Message Hub</span>
                       <Mail className="h-4 w-4 text-brand-primary group-hover:translate-x-1 transition-transform" />
                    </Link>
                 </div>
              </div>

              {/* Active Track */}
              {studentProfile.selectedTrack && (
                <div className="bg-white border border-sky-100 p-8 rounded-[3rem] shadow-xl shadow-sky-100/20">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-brand-primary" /> Active Learning Path
                   </p>
                   <div className="p-6 bg-brand-surface-soft rounded-3xl border border-sky-50">
                      <h4 className="font-black text-slate-900 uppercase text-xs mb-2 leading-tight">
                         {TRACKS.find(t => t.id === studentProfile.selectedTrack)?.label}
                      </h4>
                      <div className="w-full h-1.5 bg-sky-100 rounded-full mt-4 overflow-hidden">
                         <div className="w-1/3 h-full bg-brand-primary rounded-full" />
                      </div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase mt-3 tracking-widest">33% Complete</p>
                   </div>
                </div>
              )}

              <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl shadow-sky-200 border-4 border-slate-800">
                <h2 className="text-xl font-black mb-8 flex items-center gap-4 uppercase tracking-widest">
                  <div className="p-3 bg-brand-primary/20 rounded-xl">
                    <Zap className="h-5 w-5 text-sky-400" />
                  </div>
                  {t('currentPlan')}
                </h2>
                <div className="bg-white/5 rounded-[2rem] p-8 border border-white/10 mb-8">
                   <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] mb-2">{t('activePlan')}</p>
                   <h3 className="text-2xl font-black text-sky-400 uppercase tracking-tighter">
                     {studentProfile.totalCredits > 0 ? `${studentProfile.totalCredits} ${t('credits')}` : t('noPlan')}
                   </h3>
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
