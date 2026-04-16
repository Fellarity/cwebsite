"use client";

import { useClerk } from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";

export function NavbarSignIn({ text }: { text: string }) {
  const { openSignIn } = useClerk();
  return (
    <button onClick={() => openSignIn()} className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
      {text}
    </button>
  );
}

export function NavbarSignUp({ text }: { text: string }) {
  const { openSignUp } = useClerk();
  return (
    <button onClick={() => openSignUp()} className="bg-amber-500 text-slate-950 px-4 py-2 rounded-full text-sm font-bold hover:bg-amber-400 transition-colors shadow-sm">
      {text}
    </button>
  );
}

export function HeroSignUp({ text }: { text: string }) {
  const { openSignUp } = useClerk();
  return (
    <button 
      onClick={() => openSignUp({ fallbackRedirectUrl: "/dashboard" })} 
      className="w-full sm:w-auto px-8 py-4 bg-amber-500 text-slate-950 rounded-full font-bold text-lg hover:bg-amber-400 transition-all shadow-lg hover:shadow-amber-500/30 flex items-center justify-center gap-2"
    >
      {text}
      <ArrowRight className="h-5 w-5" />
    </button>
  );
}
