"use client";

import { AuthView } from "@neondatabase/auth/react";
import { Navbar } from "@/components/navbar";
import { Brain, Sparkles } from "lucide-react";

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

      <div className="pt-36 pb-20 flex items-center justify-center px-4 relative">
        <div className="w-full max-w-md">
          {/* Floating badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-sky-100 text-sky-700 text-[10px] font-black uppercase tracking-[0.2em] shadow-sm backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span>Welcome Back</span>
            </div>
          </div>

          {/* Main card */}
          <div className="bg-white/80 backdrop-blur-2xl p-10 md:p-12 rounded-[2.5rem] shadow-2xl shadow-sky-200/30 border border-sky-100/60 neon-auth-container relative overflow-hidden">
            {/* Decorative gradient bar at top */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-sky-400 via-indigo-500 to-sky-400" />
            
            {/* Logo & heading */}
            <div className="text-center mb-10 pt-2">
              <div className="mx-auto mb-5 h-14 w-14 bg-gradient-to-br from-sky-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-sky-200">
                <Brain className="h-7 w-7 text-white" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
                Sign In
              </h2>
              <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">
                Access your AI Mentor Portal
              </p>
            </div>

            <AuthView 
              view="SIGN_IN" 
              socialLayout="vertical"
              classNames={{ 
                base: "border-none shadow-none bg-transparent !p-0",
                header: "hidden",
                content: "!p-0",
                footer: "!p-0 mt-6",
                form: {
                  primaryButton: "w-full bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-black uppercase tracking-[0.2em] text-xs py-4 rounded-2xl shadow-xl shadow-sky-200 hover:shadow-2xl hover:shadow-sky-300 transition-all border-none",
                  input: "bg-slate-50/50 border-sky-100/60 rounded-2xl px-5 py-4 focus:border-sky-500 focus:ring-4 focus:ring-sky-100 placeholder:text-slate-300 text-sm font-medium transition-all",
                  label: "text-slate-700 font-black uppercase tracking-[0.1em] text-[10px] mb-1.5 ml-1",
                  forgotPasswordLink: "text-sky-600 font-bold hover:text-indigo-600 text-[10px] uppercase tracking-wider",
                  providerButton: "w-full border-2 border-sky-100/80 hover:border-sky-300 bg-white hover:bg-sky-50/50 rounded-2xl py-4 font-bold text-sm text-slate-700 shadow-sm hover:shadow-md transition-all",
                }
              }} 
            />
          </div>

          {/* Bottom trust badge */}
          <div className="text-center mt-8">
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.15em]">
              🔒 Secured with end-to-end encryption
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
