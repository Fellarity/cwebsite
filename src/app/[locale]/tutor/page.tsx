import { redirect } from "next/navigation";
import { Video, Calendar, Users, Briefcase, ArrowRight, Star } from "lucide-react";
import { Link } from "@/navigation";
import { Navbar } from "@/components/navbar";
import { getTranslations } from 'next-intl/server';
import { syncUser } from "@/lib/sync-user";
import { prisma } from "@/lib/prisma";
import { StudentContextModal } from "@/components/admin/student-context-modal";
import { SessionNotesModal } from "@/components/admin/session-notes-modal";

export const dynamic = "force-dynamic";

export default async function TutorDashboard({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  const user = await syncUser();
  const t = await getTranslations('TutorDashboard');
  
  // RBAC Enforcement: Strict check for TUTOR role
  if (!user || user.role !== 'TUTOR') {
    redirect('/');
  }

  // Fetch real tutor profile, bookings and reviews
  const tutorProfile = await prisma.tutorProfile.findUnique({
    where: { userId: user.id },
    include: {
      reviews: true,
      bookings: {
        include: {
          student: {
            include: {
              user: true
            }
          }
        },
        orderBy: {
          startTime: 'asc'
        }
      }
    }
  });

  if (!tutorProfile) {
    redirect('/');
  }

  // Calculate Real Stats
  const sessionsToday = tutorProfile.bookings.filter(b => {
    const today = new Date();
    return b.startTime.toDateString() === today.toDateString();
  }).length;
  const totalHours = tutorProfile.bookings.filter(b => b.status === 'COMPLETED').length * 1;
  const avgRating = tutorProfile.reviews.length > 0 
    ? (tutorProfile.reviews.reduce((acc, r) => acc + r.rating, 0) / tutorProfile.reviews.length).toFixed(1)
    : "N/A";

  const stats = [
    { title: t('sessionsToday'), value: sessionsToday.toString(), icon: Video, color: "text-sky-500", bg: "bg-sky-50" },
    { title: "Average Rating", value: avgRating, icon: Star, color: "text-amber-500", bg: "bg-amber-50" },
    { title: t('totalHours'), value: `${totalHours}h`, icon: Calendar, color: "text-emerald-500", bg: "bg-emerald-50" },
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
                <div className="bg-sky-50/50 rounded-[2rem] p-4 text-center border-2 border-dashed border-sky-100 min-h-[300px] flex items-center justify-center">
                  {tutorProfile.bookings.length > 0 ? (
                    <div className="w-full text-left space-y-3">
                       {tutorProfile.bookings.map((booking) => (
                         <div key={booking.id} className="bg-white p-6 rounded-3xl border border-sky-50 shadow-sm flex items-center justify-between flex-wrap gap-4">
                            <div>
                               <div className="flex items-center gap-3 mb-1">
                                  <p className="font-black text-slate-900 uppercase text-[10px] tracking-[0.2em]">{booking.student.user.name}</p>
                                  <StudentContextModal studentId={booking.studentId} studentName={booking.student.user.name} />
                               </div>
                               <p className="text-sm font-bold text-slate-500">{booking.startTime.toLocaleString()}</p>
                               {booking.status !== 'CONFIRMED' && booking.status !== 'PENDING' && (
                                 <span className={`inline-block mt-2 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                                   booking.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                                 }`}>
                                   {booking.status}
                                 </span>
                               )}
                            </div>
                            
                            <div className="flex items-center gap-3">
                               {(booking.status === 'CONFIRMED' || booking.status === 'PENDING') && (
                                 <>
                                   <a 
                                     href={booking.meetLink || '#'} 
                                     target="_blank" 
                                     rel="noopener noreferrer"
                                     className={`px-6 py-2 bg-brand-primary text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-brand-primary-hover transition-all ${!booking.meetLink ? 'opacity-50 pointer-events-none' : ''}`}
                                   >
                                     Start Call
                                   </a>
                                   <SessionNotesModal bookingId={booking.id} studentName={booking.student.user.name} />
                                 </>
                               )}
                            </div>
                         </div>
                       ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 font-medium text-lg">{t('noSessions')}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-10">
              <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl shadow-sky-200 border-4 border-slate-800">
                <h2 className="text-xl font-black mb-8 flex items-center gap-4 uppercase tracking-widest text-sky-400">
                  {t('quickActions')}
                </h2>
                <div className="space-y-3">
                  {[
                    { label: t('action1'), href: "/tutor/settings" },
                    { label: t('action2'), href: "/tutor/earnings" },
                    { label: t('action3'), href: "/tutor/resources" },
                  ].map((action, i) => (
                    <Link 
                      key={i} 
                      href={action.href}
                      className="w-full text-left p-6 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-between group"
                    >
                      {action.label}
                      <ArrowRight className="h-4 w-4 text-sky-400 group-hover:translate-x-1 transition-transform" />
                    </Link>
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
