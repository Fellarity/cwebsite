"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, CheckCircle2, Sparkles } from "lucide-react";
import { useRouter } from "@/navigation";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export default function OnboardingPage() {
  const t = useTranslations('Onboarding');
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const steps = [
    {
      id: "goal",
      title: t('goalTitle'),
      subtitle: t('goalSubtitle'),
      options: ["Generative AI", "Machine Learning", "Data Engineering", "AI Strategy"]
    },
    {
      id: "level",
      title: t('levelTitle'),
      subtitle: t('levelSubtitle'),
      options: ["Complete Beginner", "Intermediate", "Advanced / Professional"]
    },
    {
      id: "pace",
      title: t('paceTitle'),
      subtitle: t('paceSubtitle'),
      options: ["Casual (1-2 hours)", "Steady (3-5 hours)", "Intensive (5+ hours)"]
    },
    {
      id: "language",
      title: t('langTitle'),
      subtitle: t('langSubtitle'),
      options: ["English", "Dutch"]
    }
  ];

  const handleSelect = (option: string) => {
    setAnswers({ ...answers, [steps[currentStep].id]: option });
    if (currentStep < steps.length - 1) {
      setTimeout(() => setCurrentStep(currentStep + 1), 300);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/users/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
      });

      if (res.ok) {
        toast.success(t('success'));
        router.push("/dashboard");
      } else {
        throw new Error("Failed to save onboarding data");
      }
    } catch (error) {
      console.error(error);
      toast.error(t('error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <main className="min-h-screen bg-brand-surface-soft">
      <Navbar />
      
      <div className="pt-40 pb-20 max-w-3xl mx-auto px-4">
        {/* Progress Bar */}
        <div className="mb-12 h-1.5 w-full bg-sky-100 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-brand-primary"
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white border border-brand-border p-12 rounded-[3.5rem] shadow-2xl shadow-brand-soft"
          >
            <div className="flex items-center gap-3 mb-8 text-brand-primary">
               <Sparkles className="h-5 w-5" />
               <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                 {t('step')} {currentStep + 1} {t('of')} {steps.length}
               </span>
            </div>

            <h2 className="text-4xl font-black text-brand-text-heading mb-3 tracking-tight">
              {steps[currentStep].title}
            </h2>
            <p className="text-lg text-brand-text-body font-medium mb-12">
              {steps[currentStep].subtitle}
            </p>

            <div className="grid gap-4">
              {steps[currentStep].options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleSelect(option)}
                  className={`w-full p-6 text-left rounded-3xl border-2 transition-all flex items-center justify-between group ${
                    answers[steps[currentStep].id] === option 
                    ? 'border-brand-primary bg-sky-50/50' 
                    : 'border-brand-surface-soft hover:border-brand-soft bg-white'
                  }`}
                >
                  <span className="font-black text-slate-700 uppercase tracking-widest text-xs">{option}</span>
                  {answers[steps[currentStep].id] === option ? (
                    <CheckCircle2 className="h-6 w-6 text-brand-primary" />
                  ) : (
                    <ArrowRight className="h-5 w-5 text-slate-300 group-hover:translate-x-1 transition-transform" />
                  )}
                </button>
              ))}
            </div>

            <div className="mt-16 flex items-center justify-between pt-8 border-t border-brand-surface-soft">
              <button
                disabled={currentStep === 0}
                onClick={() => setCurrentStep(currentStep - 1)}
                className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-brand-text-heading disabled:opacity-0 transition-all"
              >
                <ArrowLeft className="h-4 w-4" />
                {t('back')}
              </button>
              
              {currentStep === steps.length - 1 && answers[steps[currentStep].id] && (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-10 py-4 bg-brand-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-brand-primary-hover shadow-xl shadow-brand-soft transition-all active:scale-95 disabled:opacity-70"
                >
                  {isSubmitting ? t('finalizing') : t('complete')}
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
