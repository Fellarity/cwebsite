"use client";

import { Link } from "@/navigation";
import { ArrowRight } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export const HomeHeroButtons = ({ 
  getStartedText, 
  dashboardText, 
  exploreTutorsText 
}: { 
  getStartedText: string, 
  dashboardText: string, 
  exploreTutorsText: string 
}) => {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 opacity-0 animate-pulse">
        <div className="w-full sm:w-64 h-16 bg-slate-200 rounded-2xl" />
        <div className="w-full sm:w-64 h-16 bg-slate-200 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
      {!session ? (
        <Link href="/auth/sign-up">
          <button className="w-full sm:w-auto px-10 py-5 bg-slate-900 text-white rounded-2xl font-black text-xl hover:bg-slate-800 transition-all shadow-2xl shadow-slate-200 hover:-translate-y-1 flex items-center justify-center gap-3 group">
            {getStartedText}
            <ArrowRight className="h-6 w-6 text-sky-400 group-hover:translate-x-1 transition-transform" />
          </button>
        </Link>
      ) : (
        <Link 
          href="/dashboard" 
          className="w-full sm:w-auto px-10 py-5 bg-slate-900 text-white rounded-2xl font-black text-xl hover:bg-slate-800 transition-all shadow-2xl shadow-slate-200 hover:-translate-y-1 flex items-center justify-center gap-3 group"
        >
          {dashboardText}
          <ArrowRight className="h-6 w-6 text-sky-400 group-hover:translate-x-1 transition-transform" />
        </Link>
      )}
      <Link 
        href="/tutors" 
        className="w-full sm:w-auto px-10 py-5 bg-white text-slate-900 border-2 border-slate-100 rounded-2xl font-black text-xl hover:bg-sky-50/50 hover:border-sky-100 transition-all flex items-center justify-center gap-2"
      >
        {exploreTutorsText}
      </Link>
    </div>
  );
};
