import { Navbar } from "@/components/navbar";
import { Sparkles, ShieldCheck, Zap, GraduationCap, ChevronDown, Quote, ArrowRight, Brain } from "lucide-react";
import { getTranslations } from 'next-intl/server';
import { HomeHeroButtons } from "@/components/home-hero-buttons";
import { syncUser } from "@/lib/sync-user";
import { Link } from "@/navigation";

export const dynamic = "force-dynamic";

export default async function Home({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  const [t, tNav, tFAQ, tTest] = await Promise.all([
    getTranslations('Index'),
    getTranslations('Navbar'),
    getTranslations('FAQ'),
    getTranslations('Testimonials'),
    syncUser()
  ]);

  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Background Blobs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-soft/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-200/30 rounded-full blur-[120px]" />
      </div>

      {/* Hero Section */}
      <section className="pt-32 md:pt-40 pb-20 md:pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-brand-border text-brand-primary text-[10px] md:text-xs font-black mb-8 md:mb-10 shadow-sm uppercase tracking-[0.2em] backdrop-blur-sm">
              <GraduationCap className="h-4 w-4 text-brand-primary" />
              <span>{t('heroBadge')}</span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-brand-text-heading mb-8 md:mb-10 leading-[1.1] md:leading-[1.05]">
              {t('title1')}<span className="text-brand-primary">.</span> <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-primary via-indigo-600 to-brand-primary animate-gradient-x">
                {t('title2')}
              </span>
            </h1>
            
            <p className="text-lg md:text-xl lg:text-2xl text-brand-text-body mb-10 md:mb-12 max-w-3xl mx-auto leading-relaxed font-medium px-4">
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
      <section className="py-24 bg-brand-surface-soft border-y border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                color: "bg-brand-primary",
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
              <div key={i} className="p-10 rounded-[2.5rem] bg-white border border-brand-border shadow-xl shadow-brand-soft hover:shadow-2xl transition-all hover:-translate-y-2">
                <div className={`h-16 w-16 rounded-2xl ${feature.color} text-white flex items-center justify-center mb-8 shadow-lg`}>
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-black mb-4 text-brand-text-heading tracking-tight uppercase">{feature.title}</h3>
                <p className="text-brand-text-body leading-relaxed font-medium">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-primary mb-12">{tTest('title')}</h2>
          <div className="grid md:grid-cols-2 gap-8 text-left">
             {[
               { q: tTest('quote1'), a: tTest('author1') },
               { q: tTest('quote2'), a: tTest('author2') }
             ].map((item, i) => (
               <div key={i} className="bg-brand-surface-highlight p-12 rounded-[3rem] border border-brand-border relative">
                  <Quote className="h-10 w-10 text-brand-soft absolute top-8 right-10" />
                  <p className="text-2xl font-bold text-brand-text-heading italic mb-8 leading-relaxed">"{item.q}"</p>
                  <p className="text-xs font-black uppercase tracking-widest text-brand-primary">— {item.a}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-32 bg-white/40 backdrop-blur-sm border-t border-brand-border px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-20">
             <h2 className="text-4xl font-black text-brand-text-heading mb-4 tracking-tight uppercase">{tFAQ('title')}</h2>
             <p className="text-brand-text-body font-medium">{tFAQ('subtitle')}</p>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((num) => (
              <div key={num} className="bg-white border border-brand-border p-8 rounded-3xl hover:border-brand-primary transition-colors cursor-pointer group">
                <div className="flex items-center justify-between">
                   <h4 className="font-black text-brand-text-heading uppercase tracking-wide text-sm">{tFAQ(`q${num}` as any)}</h4>
                   <ChevronDown className="h-5 w-5 text-brand-border group-hover:text-brand-primary transition-all" />
                </div>
                <p className="mt-4 text-brand-text-body font-medium text-sm leading-relaxed hidden group-hover:block animate-in fade-in slide-in-from-top-2 duration-300">
                  {tFAQ(`a${num}` as any)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modern Scholarship Footer */}
      <footer className="bg-brand-text-heading text-white pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-2">
              <div className="flex items-center gap-2.5 mb-8">
                <div className="p-1.5 bg-brand-primary rounded-lg shadow-lg shadow-brand-primary/20">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-black tracking-widest uppercase">
                  AI Coaching <span className="text-brand-primary">Hub</span>
                </span>
              </div>
              <p className="text-slate-400 max-w-sm font-medium leading-relaxed">
                Empowering the next generation of engineers, founders, and innovators through elite 1-to-1 AI mentorship.
              </p>
            </div>
            <div>
              <h5 className="font-black uppercase tracking-widest text-[10px] mb-8 text-brand-primary">Navigation</h5>
              <ul className="space-y-4 text-sm font-bold text-slate-400 uppercase tracking-widest">
                <li><Link href="/tutors" className="hover:text-white transition-colors">Find Tutors</Link></li>
                <li><Link href="/programs" className="hover:text-white transition-colors">Programs</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-black uppercase tracking-widest text-[10px] mb-8 text-brand-primary">Legal</h5>
              <ul className="space-y-4 text-sm font-bold text-slate-400 uppercase tracking-widest">
                <li><Link href="#" className="hover:text-white transition-colors">Privacy</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Terms</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-12 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-loose">
              &copy; 2026 AI Coaching Hub &bull; All Rights Reserved
            </p>
            <div className="flex items-center gap-4">
               <button className="px-6 py-2 bg-slate-800 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-brand-primary transition-all">
                  Join Discord
               </button>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
