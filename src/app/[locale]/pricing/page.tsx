import { Navbar } from "@/components/navbar";
import { prisma } from "@/lib/prisma";
import { getTranslations } from 'next-intl/server';
import { Check, Zap, Sparkles, Trophy, ArrowRight } from "lucide-react";

export default async function PricingPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  const t = await getTranslations('Pricing');
  
  const plans = await prisma.plan.findMany({
    where: { active: true },
    orderBy: { price: 'asc' }
  });

  const icons = [Zap, Sparkles, Trophy];

  return (
    <main className="min-h-screen pb-20">
      <Navbar />
      
      {/* Background Blobs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-sky-200/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-200/30 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <section className="pt-40 pb-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-6xl md:text-7xl font-black text-slate-900 tracking-tight mb-8">
            {t('title').split('.')[0]}<span className="text-sky-500">.</span>
          </h1>
          <p className="text-xl text-slate-600 font-medium leading-relaxed">
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* Pricing Grid */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">
          {plans.map((plan, i) => {
            const Icon = icons[i] || Zap;
            const isPopular = i === 1;

            return (
              <div 
                key={plan.id} 
                className={`relative flex flex-col p-12 rounded-[3.5rem] transition-all border-4 ${
                  isPopular 
                  ? 'bg-slate-900 text-white border-slate-800 shadow-2xl shadow-sky-200 scale-105 z-10' 
                  : 'bg-white border-white text-slate-900 shadow-xl shadow-sky-100/20'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-8 py-2.5 bg-gradient-to-r from-sky-400 to-indigo-500 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg text-white whitespace-nowrap">
                    {t('mostPopular')}
                  </div>
                )}

                <div className="mb-10">
                  <div className={`h-16 w-16 rounded-[1.25rem] flex items-center justify-center mb-8 shadow-lg ${
                    isPopular ? 'bg-sky-500' : 'bg-sky-50'
                  }`}>
                    <Icon className={`h-8 w-8 ${isPopular ? 'text-white' : 'text-sky-600'}`} />
                  </div>
                  <h3 className="text-2xl font-black mb-3 uppercase tracking-tighter">{plan.title}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-6xl font-black tracking-tighter">${plan.price}</span>
                    <span className={`font-black uppercase text-[10px] tracking-widest ${isPopular ? 'text-slate-400' : 'text-slate-400'}`}>/{t('program')}</span>
                  </div>
                </div>

                <div className="flex-1 space-y-6 mb-12">
                  {[
                    `${plan.sessionCount} ${t('sessions')}`,
                    `${plan.duration} ${t('minutes')}`,
                    t('personalized'),
                    t('messaging'),
                    t('reports')
                  ].map((benefit, j) => (
                    <div key={j} className="flex items-center gap-4 font-black uppercase text-[10px] tracking-widest">
                      <div className={`p-1 rounded-full ${isPopular ? 'bg-sky-500/20' : 'bg-emerald-50'}`}>
                        <Check className={`h-3.5 w-3.5 ${isPopular ? 'text-sky-400' : 'text-emerald-500'}`} />
                      </div>
                      <span className={isPopular ? 'text-slate-300' : 'text-slate-600'}>{benefit}</span>
                    </div>
                  ))}
                </div>

                <button className={`w-full py-5 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 active:scale-95 group ${
                  isPopular 
                  ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-xl shadow-sky-500/20' 
                  : 'bg-slate-900 hover:bg-slate-800 text-white shadow-2xl shadow-slate-100'
                }`}>
                  {t('choose')} {plan.title.split(' ')[0]}
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Guarantee Section */}
      <section className="mt-40 max-w-4xl mx-auto px-4 text-center pb-20">
        <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/50 border border-sky-100 text-sky-600 text-[10px] font-black uppercase tracking-[0.2em] mb-8 shadow-sm">
          {t('guaranteeTitle')}
        </div>
        <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto italic">
          "{t('guaranteeDesc')}"
        </p>
      </section>
    </main>
  );
}
