import { Navbar } from "@/components/navbar";
import { Sparkles, ShieldCheck, Zap, GraduationCap } from "lucide-react";
import { getTranslations } from 'next-intl/server';
import { HomeHeroButtons } from "@/components/home-hero-buttons";

export default async function Home({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  const t = await getTranslations('Index');
  const tNav = await getTranslations('Navbar');

  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Background Blobs for that Modern Feel */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-sky-200/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-200/30 rounded-full blur-[120px]" />
      </div>

      {/* Hero Section */}
      <section className="pt-32 md:pt-40 pb-20 md:pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-sky-100 text-sky-700 text-[10px] md:text-xs font-bold mb-8 md:mb-10 shadow-sm uppercase tracking-widest backdrop-blur-sm">
              <GraduationCap className="h-4 w-4 text-amber-500" />
              <span>{t('heroBadge')}</span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-slate-900 mb-8 md:mb-10 leading-[1.1] md:leading-[1.05]">
              {t('title1')}<span className="text-sky-500">.</span> <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-600 animate-gradient-x">
                {t('title2')}
              </span>
            </h1>
            
            <p className="text-lg md:text-xl lg:text-2xl text-slate-600 mb-10 md:mb-12 max-w-3xl mx-auto leading-relaxed font-medium px-4">
              {t('subtitle')}
            </p>
            
            <HomeHeroButtons 
              getStartedText={tNav('getStarted')} 
              dashboardText={tNav('dashboard')} 
              exploreTutorsText={t('exploreTutors')} 
            />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white/40 backdrop-blur-sm border-y border-sky-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                color: "bg-sky-500",
                title: t('feature1Title'),
                desc: t('feature1Desc')
              },
              {
                icon: Sparkles,
                color: "bg-indigo-600",
                title: t('feature2Title'),
                desc: t('feature2Desc')
              },
              {
                icon: ShieldCheck,
                color: "bg-emerald-500",
                title: t('feature3Title'),
                desc: t('feature3Desc')
              }
            ].map((feature, i) => (
              <div key={i} className="p-10 rounded-3xl bg-white border border-sky-50 shadow-xl shadow-sky-100/20 hover:shadow-2xl hover:shadow-sky-100/40 transition-all hover:-translate-y-2">
                <div className={`h-16 w-16 rounded-2xl ${feature.color} text-white flex items-center justify-center mb-8 shadow-lg`}>
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-black mb-4 text-slate-900 tracking-tight">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed font-medium">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-12 text-center text-slate-400 text-sm font-bold uppercase tracking-widest">
        &copy; 2026 AI Coaching Hub &bull; Built for Excellence
      </footer>
    </main>
  );
}
