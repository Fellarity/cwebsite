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
              cardBox: "shadow-none bg-transparent border-none",
              card: "w-full rounded-3xl shadow-[0_8px_40px_rgba(15,23,42,0.10)] border border-slate-200/80 bg-white p-6",
              headerTitle: "text-2xl font-extrabold text-slate-900 tracking-tight",
              headerSubtitle: "text-slate-500 text-sm font-medium mt-1",
              socialButtonsBlockButton: "w-full border border-slate-200 hover:border-blue-300 bg-white hover:bg-blue-50/60 rounded-xl py-3 font-semibold text-sm text-slate-700 shadow-sm hover:shadow-md transition-all duration-200",
              socialButtonsBlockButtonText: "font-semibold text-slate-700",
              dividerLine: "bg-slate-200",
              dividerText: "text-slate-400 text-xs font-semibold uppercase tracking-wider",
              formFieldLabel: "text-slate-600 font-semibold text-xs mb-1.5",
              formFieldInput: "bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 placeholder:text-slate-400 text-sm font-medium transition-all w-full",
              formButtonPrimary: "w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm py-3 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-200 border-none",
              footer: "bg-white rounded-b-3xl pt-4",
              footerAction: "bg-white",
              footerActionLink: "text-blue-600 font-semibold hover:text-indigo-600 transition-colors",
              footerActionText: "text-slate-500 text-sm",
              footerPages: "bg-white",
              footerPagesLink: "text-slate-400 text-xs",
              identityPreviewText: "text-slate-700 font-semibold",
              identityPreviewEditButton: "text-blue-600 font-semibold hover:text-indigo-600",
              formResendCodeLink: "text-blue-600 font-semibold hover:text-indigo-600 text-xs",
              otpCodeFieldInput: "border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 font-bold text-xl text-slate-900",
              alert: "rounded-xl",
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
