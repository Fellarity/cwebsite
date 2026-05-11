import { Navbar } from "@/components/navbar";
import { getTranslations } from 'next-intl/server';
import { BookOpen, Zap, GraduationCap, Video, Briefcase, Code, CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "@/navigation";

export default async function ProgramsPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  const t = await getTranslations('Programs');
  
  const tracks = [
    {
      id: "productivity",
      icon: Zap,
      title: t('track1Title'),
      desc: t('track1Desc'),
      features: ["Workflow Automation", "Note-Taking AI", "Advanced Chatbot Mastery"]
    },
    {
      id: "students",
      icon: GraduationCap,
      title: t('track2Title'),
      desc: t('track2Desc'),
      features: ["Academic Research AI", "Document Analysis", "Smart Study Systems"]
    },
    {
      id: "content",
      icon: Video,
      title: t('track3Title'),
      desc: t('track3Desc'),
      features: ["Generative Art", "AI Video Production", "Social Media Strategy"]
    },
    {
      id: "professionals",
      icon: Briefcase,
      title: t('track4Title'),
      desc: t('track4Desc'),
      features: ["Spreadsheet Intelligence", "Career Acceleration", "Executive Presence AI"]
    },
    {
      id: "development",
      icon: Code,
      title: t('track5Title'),
      desc: t('track5Desc'),
      features: ["AI Software Engineering", "MLOps & Data Science", "No-Code App Building"]
    }
  ];

  return (
    <main className="min-h-screen pb-20">
      <Navbar />
      
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-soft/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-200/30 rounded-full blur-[120px]" />
      </div>

      <section className="pt-32 md:pt-40 pb-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-brand-border text-brand-primary text-[10px] font-black mb-8 shadow-sm uppercase tracking-[0.2em]">
            <BookOpen className="h-4 w-4" />
            {t('curriculumBadge')}
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight mb-8 leading-tight">
            {t('titleMain')} <span className="text-brand-primary">{t('titleHighlight')}</span>.
          </h1>
          <p className="text-lg md:text-xl text-slate-600 font-medium leading-relaxed">
            {t('subtitleMain')}
          </p>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tracks.map((track, i) => (
            <div key={i} className="bg-white border border-sky-100 p-10 rounded-[3rem] shadow-xl shadow-sky-100/20 hover:shadow-2xl transition-all hover:-translate-y-2 group">
              <div className="h-16 w-16 bg-brand-surface-soft text-brand-primary rounded-2xl flex items-center justify-center mb-8 group-hover:bg-brand-primary group-hover:text-white transition-colors">
                <track.icon className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4 uppercase tracking-tight">{track.title}</h3>
              <p className="text-slate-500 font-medium mb-8 leading-relaxed text-sm">{track.desc}</p>
              
              <ul className="space-y-4 mb-12">
                {track.features.map((feat, j) => (
                  <li key={j} className="flex items-center gap-3 text-[10px] font-black text-slate-700 uppercase tracking-widest">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    {feat}
                  </li>
                ))}
              </ul>

              <Link href="/pricing" className="inline-flex items-center gap-2 text-brand-primary font-black text-xs uppercase tracking-[0.2em] group-hover:gap-3 transition-all">
                {t('viewCurriculum')}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-32 max-w-4xl mx-auto px-4 py-16 bg-slate-900 rounded-[4rem] text-center shadow-2xl border-4 border-slate-800">
         <h2 className="text-3xl font-black text-white mb-6 uppercase tracking-tight">{t('customTitle')}</h2>
         <p className="text-slate-400 font-medium text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
           {t('customDesc')}
         </p>
         <Link href="/tutors" className="px-10 py-5 bg-white text-slate-900 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-brand-primary hover:text-white transition-all shadow-xl inline-block">
           {t('findMentor')}
         </Link>
      </section>
    </main>
  );
}
