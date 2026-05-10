"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { motion } from "framer-motion";
import { ArrowRight, Loader2, Sparkles, CheckCircle2 } from "lucide-react";
import { useRouter } from "@/navigation";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export default function TutorApplyPage() {
  const t = useTranslations('TutorApply');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    bio: "",
    expertise: "",
    hourlyRate: "",
    languages: "English, Dutch"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/tutor/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          expertise: formData.expertise.split(",").map(i => i.trim()),
          languages: formData.languages.split(",").map(i => i.trim()),
          hourlyRate: parseFloat(formData.hourlyRate)
        }),
      });

      if (res.ok) {
        setIsSuccess(true);
        toast.success(t('toastSuccess'));
      } else {
        throw new Error("Failed to submit application");
      }
    } catch {
      toast.error(t('toastError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <main className="min-h-screen bg-brand-surface-soft flex items-center justify-center px-4">
        <Navbar />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white p-12 rounded-[3rem] shadow-2xl border border-sky-100 text-center"
        >
          <div className="h-20 w-20 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-4 uppercase">{t('successTitle')}</h2>
          <p className="text-slate-500 font-medium leading-relaxed mb-10">
            {t('successDesc')}
          </p>
          <button 
            onClick={() => router.push("/")}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all"
          >
            {t('backHome')}
          </button>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-brand-surface-soft pb-20">
      <Navbar />
      
      <div className="pt-40 max-w-4xl mx-auto px-4">
        <div className="grid lg:grid-cols-5 gap-16">
          
          <div className="lg:col-span-2 space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-sky-100 text-sky-700 text-[10px] font-black uppercase tracking-widest shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span>{t('badge')}</span>
            </div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-[1.1]">
              {t('title').split('AI Expertise')[0]}<span className="text-brand-primary">AI Expertise</span>{t('title').split('AI Expertise')[1]}
            </h1>
            <p className="text-slate-600 font-medium text-lg leading-relaxed">
              {t('subtitle')}
            </p>
            <ul className="space-y-4">
              {[t('benefit1'), t('benefit2'), t('benefit3'), t('benefit4')].map((feat, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-500 font-bold text-sm uppercase tracking-wide">
                  <CheckCircle2 className="h-5 w-5 text-brand-primary" />
                  {feat}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-sky-100">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-2">{t('labelBio')}</label>
                  <textarea 
                    required
                    className="w-full p-6 bg-slate-50 border border-sky-50 rounded-3xl focus:ring-4 focus:ring-sky-100 outline-none transition-all min-h-[120px] text-sm font-medium"
                    placeholder={t('placeholderBio')}
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-2">{t('labelExpertise')}</label>
                    <input 
                      type="text"
                      required
                      className="w-full p-5 bg-slate-50 border border-sky-50 rounded-2xl focus:ring-4 focus:ring-sky-100 outline-none transition-all text-sm font-medium"
                      placeholder={t('placeholderExpertise')}
                      value={formData.expertise}
                      onChange={(e) => setFormData({...formData, expertise: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-2">{t('labelRate')}</label>
                    <input 
                      type="number"
                      required
                      className="w-full p-5 bg-slate-50 border border-sky-50 rounded-2xl focus:ring-4 focus:ring-sky-100 outline-none transition-all text-sm font-medium"
                      placeholder="65"
                      value={formData.hourlyRate}
                      onChange={(e) => setFormData({...formData, hourlyRate: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-2">{t('labelLanguages')}</label>
                  <input 
                    type="text"
                    required
                    className="w-full p-5 bg-slate-50 border border-sky-50 rounded-2xl focus:ring-4 focus:ring-sky-100 outline-none transition-all text-sm font-medium"
                    value={formData.languages}
                    onChange={(e) => setFormData({...formData, languages: e.target.value})}
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-5 bg-brand-primary text-white rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-brand-primary-hover shadow-xl shadow-brand-soft transition-all flex items-center justify-center gap-3 disabled:opacity-70"
                >
                  {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                    <>
                      {t('submit')}
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
