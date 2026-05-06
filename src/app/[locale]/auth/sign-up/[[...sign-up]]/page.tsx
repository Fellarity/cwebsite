"use client";

import { SignUp } from "@clerk/nextjs";
import { Navbar } from "@/components/navbar";

export default function SignUpPage() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      <Navbar />

      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-15%] right-[-10%] w-[50%] h-[50%] bg-indigo-200/50 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-[-15%] left-[-15%] w-[50%] h-[50%] bg-sky-200/40 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-[30%] left-[5%] w-[20%] h-[20%] bg-amber-100/25 rounded-full blur-[80px]" />
      </div>

      <div className="pt-28 pb-20 flex items-center justify-center px-4 relative">
        <SignUp
          appearance={{
            elements: {
              rootBox: "w-full max-w-md",
              cardBox: "shadow-none bg-transparent border-none",
              card: "w-full rounded-3xl shadow-[0_8px_40px_rgba(15,23,42,0.10)] border border-slate-200/80 bg-white p-6",
              headerTitle: "text-2xl font-extrabold text-slate-900 tracking-tight",
              headerSubtitle: "text-slate-500 text-sm font-medium mt-1",
              socialButtonsBlockButton: "w-full border border-slate-200 hover:border-indigo-300 bg-white hover:bg-indigo-50/60 rounded-xl py-3 font-semibold text-sm text-slate-700 shadow-sm hover:shadow-md transition-all duration-200",
              socialButtonsBlockButtonText: "font-semibold text-slate-700",
              dividerLine: "bg-slate-200",
              dividerText: "text-slate-400 text-xs font-semibold uppercase tracking-wider",
              formFieldLabel: "text-slate-600 font-semibold text-xs mb-1.5",
              formFieldInput: "bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 placeholder:text-slate-400 text-sm font-medium transition-all w-full",
              formButtonPrimary: "w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold text-sm py-3 rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-200 border-none",
              footer: "bg-white rounded-b-3xl pt-4",
              footerAction: "bg-white",
              footerActionLink: "text-indigo-600 font-semibold hover:text-blue-600 transition-colors",
              footerActionText: "text-slate-500 text-sm",
              footerPages: "bg-white",
              footerPagesLink: "text-slate-400 text-xs",
              identityPreviewText: "text-slate-700 font-semibold",
              identityPreviewEditButton: "text-indigo-600 font-semibold hover:text-blue-600",
              formResendCodeLink: "text-indigo-600 font-semibold hover:text-blue-600 text-xs",
              otpCodeFieldInput: "border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 font-bold text-xl text-slate-900",
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
