import { Navbar } from "@/components/navbar";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Link } from "@/navigation";
import Image from "next/image";
import { getTranslations } from 'next-intl/server';
import { 
  Calendar, 
  Clock, 
  Globe, 
  Star, 
  BookOpen,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  BadgeCheck
} from "lucide-react";

export default async function TutorProfilePage({
  params
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id } = await params;
  const t = await getTranslations('TutorProfile');
  const tGen = await getTranslations('Tutors');

  const tutor = await prisma.user.findUnique({
    where: { id },
    include: {
      tutorProfile: {
        include: {
          availability: true
        }
      }
    }
  });

  if (!tutor || tutor.role !== 'TUTOR') {
    notFound();
  }

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  return (
    <main className="min-h-screen pb-20">
      <Navbar />
      
      {/* Background Blobs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-sky-200/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-200/30 rounded-full blur-[120px]" />
      </div>

      {/* Hero Header */}
      <section className="pt-40 pb-20 border-b border-sky-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/tutors" className="inline-flex items-center gap-2 text-sky-600 font-black text-xs uppercase tracking-widest mb-12 hover:gap-3 transition-all group">
            <ArrowLeft className="h-4 w-4" />
            {t('back')}
          </Link>
          
          <div className="flex flex-col md:flex-row gap-16 items-start">
            <div className="relative h-72 w-72 rounded-[3.5rem] overflow-hidden bg-white shadow-2xl shadow-sky-200 border-8 border-white shrink-0">
              {tutor.image ? (
                <Image src={tutor.image} alt={tutor.name} fill className="object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-sky-100 font-black text-8xl uppercase select-none bg-sky-50">
                  {tutor.name.split(' ').map(n => n[0]).join('')}
                </div>
              )}
            </div>
            
            <div className="flex-1 pt-4">
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <span className="px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                  {t('verifiedBadge')}
                </span>
                <div className="flex items-center gap-1.5 text-amber-500 font-black text-sm uppercase tracking-tighter">
                  <Star className="h-5 w-5 fill-amber-500" />
                  4.9 (120+ {t('reviews')})
                </div>
              </div>
              
              <h1 className="text-6xl lg:text-7xl font-black text-slate-900 tracking-tight mb-8">
                {tutor.name}
              </h1>
              
              <p className="text-xl text-slate-600 font-medium max-w-2xl leading-relaxed mb-10">
                {tutor.tutorProfile?.bio}
              </p>
              
              <div className="flex flex-wrap gap-8 items-center">
                <div className="flex items-center gap-2.5 text-slate-500 font-black text-xs uppercase tracking-widest">
                  <Globe className="h-5 w-5 text-sky-500" />
                  {tutor.tutorProfile?.languages.join(", ")}
                </div>
                <div className="flex items-center gap-2.5 text-slate-500 font-black text-xs uppercase tracking-widest">
                  <Clock className="h-5 w-5 text-indigo-500" />
                  {t('availableThisWeek')}
                </div>
                <div className="text-3xl font-black text-slate-900">
                  ${tutor.tutorProfile?.hourlyRate}<span className="text-sm text-slate-400 font-black uppercase ml-1">/{tGen('perHour')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-20">
          
          {/* Left Column: Details */}
          <div className="lg:col-span-2 space-y-20">
            <div>
              <h2 className="text-3xl font-black text-slate-900 mb-10 flex items-center gap-4 uppercase tracking-tight">
                <div className="p-3 bg-sky-500 rounded-2xl shadow-lg shadow-sky-100">
                   <BookOpen className="h-6 w-6 text-white" />
                </div>
                {t('expertiseTitle')}
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {tutor.tutorProfile?.expertise.map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-6 rounded-3xl bg-white border border-sky-50 group hover:border-sky-200 hover:shadow-xl hover:shadow-sky-100/40 transition-all">
                    <CheckCircle2 className="h-6 w-6 text-emerald-500 shrink-0" />
                    <span className="font-black text-slate-700 uppercase tracking-widest text-[10px]">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-black text-slate-900 mb-10 flex items-center gap-4 uppercase tracking-tight">
                <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-100">
                  <BadgeCheck className="h-6 w-6 text-white" />
                </div>
                {t('styleTitle')}
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed font-medium bg-white/50 p-8 rounded-[2.5rem] border border-sky-50 italic">
                "{t('styleDesc')}"
              </p>
            </div>
          </div>

          {/* Right Column: Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 p-10 rounded-[3.5rem] bg-slate-900 text-white shadow-2xl shadow-sky-200 border-4 border-slate-800">
              <h3 className="text-3xl font-black mb-8 tracking-tight uppercase">{t('bookTitle')}</h3>
              
              <div className="space-y-6 mb-12">
                <div className="p-6 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-between group cursor-pointer hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-4">
                    <Calendar className="h-6 w-6 text-sky-400" />
                    <span className="font-black text-xs uppercase tracking-widest">{t('weeklySlots')}</span>
                  </div>
                  <span className="text-sky-400 font-black text-[10px] uppercase tracking-tighter group-hover:translate-x-1 transition-transform">{t('viewAll')}</span>
                </div>
                
                <div className="space-y-3">
                  {tutor.tutorProfile?.availability.map((slot) => (
                    <div key={slot.id} className="flex items-center justify-between text-xs py-3 border-b border-white/5 font-black uppercase tracking-widest">
                      <span className="text-slate-500">{days[slot.dayOfWeek]}</span>
                      <span className="text-sky-400">{slot.startTime} - {slot.endTime}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button className="w-full py-5 bg-gradient-to-r from-sky-500 to-indigo-600 text-white rounded-2xl font-black text-lg transition-all shadow-xl shadow-sky-500/20 active:scale-95 flex items-center justify-center gap-3 group">
                {t('selectPlan')}
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <p className="text-center mt-8 text-[10px] font-black text-slate-500 uppercase tracking-widest leading-loose max-w-[200px] mx-auto opacity-60">
                {t('guarantee')}
              </p>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
