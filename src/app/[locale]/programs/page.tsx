import { Navbar } from "@/components/navbar";
import { getTranslations } from 'next-intl/server';
import { Code2, BrainCircuit, Database, LineChart, ArrowRight } from "lucide-react";

export default async function ProgramsPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  const t = await getTranslations('Programs');

  const programs = [
    {
      title: t('path1Title'),
      icon: <BrainCircuit className="h-8 w-8 text-sky-600" />,
      color: "bg-sky-50",
      description: t('path1Desc')
    },
    {
      title: t('path2Title'),
      icon: <Code2 className="h-8 w-8 text-indigo-600" />,
      color: "bg-indigo-50",
      description: t('path2Desc')
    },
    {
      title: t('path3Title'),
      icon: <Database className="h-8 w-8 text-emerald-600" />,
      color: "bg-emerald-50",
      description: t('path3Desc')
    },
    {
      title: t('path4Title'),
      icon: <LineChart className="h-8 w-8 text-amber-600" />,
      color: "bg-amber-50",
      description: t('path4Desc')
    }
  ];

  return (
    <main className="min-h-screen pb-20">
      <Navbar />
      
      {/* Background Blobs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-sky-200/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-200/30 rounded-full blur-[120px]" />
      </div>

      <section className="pt-32 md:pt-40 pb-12 md:pb-16 px-4 sm:px-6 lg:px-8 text-center text-slate-900">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight mb-6 md:mb-8 leading-tight">
            {t('title').split(' ')[0]} <span className="text-sky-500">{t('title').split(' ')[1]}</span>
          </h1>
          <p className="text-sm md:text-xl text-slate-600 font-medium leading-relaxed uppercase tracking-[0.1em] md:tracking-[0.2em] font-black opacity-60 px-4">
            {t('subtitle')}
          </p>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10">
          {programs.map((program, idx) => (
            <div key={idx} className="bg-white border border-sky-100 p-10 rounded-[3rem] shadow-xl shadow-sky-100/20 hover:shadow-2xl hover:shadow-sky-100/40 transition-all hover:-translate-y-2 group cursor-pointer">
              <div className={`h-20 w-20 rounded-[1.5rem] ${program.color} flex items-center justify-center mb-8 shadow-lg shadow-sky-100/10`}>
                {program.icon}
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight uppercase">{program.title}</h3>
              <p className="text-slate-600 text-lg font-medium leading-relaxed mb-10 opacity-80">{program.description}</p>
              
              <div className="flex items-center gap-3 font-black text-xs uppercase tracking-widest text-sky-600 group-hover:gap-5 transition-all">
                <span>{t('viewCurriculum')}</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
