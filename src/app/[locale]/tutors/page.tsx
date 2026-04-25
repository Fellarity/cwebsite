import { Navbar } from "@/components/navbar";
import { prisma } from "@/lib/prisma";
import { getTranslations } from 'next-intl/server';
import { Star, MessageSquare, ShieldCheck, Search, Filter, ArrowRight } from "lucide-react";
import Image from "next/image";
import { Link } from "@/navigation";

export default async function TutorsPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  const [t, tutors] = await Promise.all([
    getTranslations('Tutors'),
    prisma.user.findMany({
      where: { role: 'TUTOR' },
      include: {
        tutorProfile: true
      }
    })
  ]);

  return (
    <main className="min-h-screen pb-20">
      <Navbar />
      
      {/* Background Blobs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-sky-200/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-200/30 rounded-full blur-[120px]" />
      </div>

      {/* Search & Filter Header */}
      <section className="pt-40 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-5xl font-black text-slate-900 tracking-tight">{t('title')}</h1>
              <p className="text-slate-500 font-bold mt-2 uppercase text-xs tracking-widest">{t('subtitle')}</p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input 
                  type="text" 
                  placeholder={t('searchPlaceholder')}
                  className="pl-12 pr-6 py-4 bg-white/80 backdrop-blur-md border border-sky-100 rounded-2xl focus:ring-4 focus:ring-sky-100 transition-all outline-none text-sm font-bold w-full md:w-64 shadow-sm"
                />
              </div>
              <button className="p-4 bg-white/80 backdrop-blur-md border border-sky-100 rounded-2xl hover:bg-sky-50 transition-colors shadow-sm">
                <Filter className="h-5 w-5 text-slate-600" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Tutors Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tutors.map((tutor) => (
              <div key={tutor.id} className="group bg-white border border-sky-100 rounded-[3rem] p-3 hover:shadow-2xl hover:shadow-sky-200/50 transition-all hover:-translate-y-2 flex flex-col shadow-xl shadow-sky-100/20">
                <div className="relative h-64 w-full rounded-[2.5rem] overflow-hidden bg-sky-50">
                  {tutor.image ? (
                    <Image 
                      src={tutor.image} 
                      alt={tutor.name} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-sky-200 uppercase font-black text-6xl select-none">
                      {tutor.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  )}
                  <div className="absolute top-4 right-4 px-4 py-2 bg-white/90 backdrop-blur-md rounded-full text-xs font-black text-sky-700 shadow-sm border border-sky-50">
                    ${tutor.tutorProfile?.hourlyRate}/{t('perHour')}
                  </div>
                </div>

                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                      <ShieldCheck className="h-3 w-3" />
                      {t('verified')}
                    </div>
                    <div className="flex items-center gap-1 text-amber-500 font-black text-xs uppercase tracking-tighter">
                      <Star className="h-4 w-4 fill-amber-500" />
                      4.9 (120+ {t('sessions')})
                    </div>
                  </div>

                  <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">{tutor.name}</h3>
                  <p className="text-slate-500 text-sm font-medium line-clamp-2 mb-8 leading-relaxed">
                    {tutor.tutorProfile?.bio || "Expert AI Mentor dedicated to your personalized learning journey."}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-10">
                    {tutor.tutorProfile?.expertise.map((exp, i) => (
                      <span key={i} className="px-4 py-1.5 bg-sky-50 text-sky-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-sky-100/50">
                        {exp}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto flex items-center gap-3">
                    <Link 
                      href={`/tutors/${tutor.id}`}
                      className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-200"
                    >
                      {t('viewProfile')}
                      <ArrowRight className="h-4 w-4 text-sky-400" />
                    </Link>
                    <button className="p-4 border-2 border-slate-50 rounded-2xl hover:bg-sky-50 transition-all shadow-sm">
                      <MessageSquare className="h-5 w-5 text-slate-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
