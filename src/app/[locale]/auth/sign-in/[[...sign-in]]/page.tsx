"use client";

import { SignIn } from "@clerk/nextjs";
import { Navbar } from "@/components/navbar";

export default function SignInPage() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      <Navbar />

      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-15%] left-[-15%] w-[50%] h-[50%] bg-sky-200/50 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-[-15%] right-[-15%] w-[50%] h-[50%] bg-indigo-200/40 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-[40%] right-[10%] w-[25%] h-[25%] bg-amber-100/20 rounded-full blur-[100px]" />
      </div>

      <div className="pt-28 pb-20 flex items-center justify-center px-4 relative">
        <SignIn
          appearance={{
            elements: {
              rootBox: "w-full max-w-md",
              card: "w-full rounded-[2rem] shadow-2xl shadow-sky-200/40 border border-sky-100/60 bg-white/85 backdrop-blur-2xl p-2",
              cardBox: "shadow-none",
              header: "pb-2",
              headerTitle: "text-2xl font-black text-slate-900 tracking-tight",
              headerSubtitle: "text-slate-400 font-bold text-[11px] uppercase tracking-[0.15em]",
              socialButtonsBlockButton: "w-full border-2 border-sky-100 hover:border-sky-300 bg-white hover:bg-sky-50/50 rounded-2xl py-3 font-bold text-sm text-slate-700 shadow-sm hover:shadow-md transition-all",
              socialButtonsBlockButtonText: "font-semibold text-slate-700",
              dividerLine: "bg-sky-100",
              dividerText: "text-slate-400 text-[11px] font-bold uppercase tracking-widest",
              formFieldLabel: "text-slate-700 font-black uppercase tracking-[0.1em] text-[10px] mb-1",
              formFieldInput: "bg-slate-50/50 border-sky-100 rounded-2xl px-4 py-3 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 placeholder:text-slate-300 text-sm font-medium transition-all w-full",
              formButtonPrimary: "w-full bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-black uppercase tracking-[0.2em] text-xs py-3.5 rounded-2xl shadow-xl shadow-sky-200 hover:shadow-2xl hover:shadow-sky-300 transition-all border-none",
              footerActionLink: "text-sky-600 font-bold hover:text-indigo-600 transition-colors",
              footerActionText: "text-slate-400 text-xs font-medium",
              identityPreviewText: "text-slate-700 font-semibold",
              identityPreviewEditButton: "text-sky-600 font-bold hover:text-indigo-600",
              formResendCodeLink: "text-sky-600 font-bold hover:text-indigo-600 text-[11px]",
              otpCodeFieldInput: "border-sky-200 rounded-xl focus:border-sky-500 focus:ring-2 focus:ring-sky-100 font-bold text-xl text-slate-900",
              alert: "rounded-2xl",
              alertText: "text-sm font-medium",
            },
            layout: {
              socialButtonsPlacement: "top",
              showOptionalFields: false,
            },
          }}
        />
      </div>
    </main>
  );
}
