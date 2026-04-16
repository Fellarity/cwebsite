"use client";

import { Link } from "@/navigation";
import { Brain } from "lucide-react";
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from "./language-switcher";
import { SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/nextjs";

export const Navbar = () => {
  const t = useTranslations('Navbar');
  const { isSignedIn, isLoaded } = useAuth();

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/60 backdrop-blur-lg border-b border-sky-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
            <div className="p-2 bg-sky-500 rounded-xl shadow-lg shadow-sky-200">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">
              AI Coaching <span className="text-sky-600">Hub</span>
            </span>
          </Link>
          
          <div className="hidden md:flex items-center gap-10 text-sm font-semibold text-slate-600">
            <Link href="/tutors" className="hover:text-sky-600 transition-colors uppercase tracking-wider">{t('findTutors')}</Link>
            <Link href="/programs" className="hover:text-sky-600 transition-colors uppercase tracking-wider">{t('programs')}</Link>
            <Link href="/pricing" className="hover:text-sky-600 transition-colors uppercase tracking-wider">{t('pricing')}</Link>
          </div>

          <div className="flex items-center gap-6">
            <LanguageSwitcher />
            {isLoaded && (
              <>
                {!isSignedIn ? (
                  <div className="flex items-center gap-4">
                    <SignInButton mode="modal"><button className="text-sm font-bold text-slate-700 hover:text-sky-600 transition-colors">
                        {t('signIn')}
                      </button></SignInButton>
                    <SignUpButton mode="modal"><button className="bg-gradient-to-r from-sky-500 to-indigo-600 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:shadow-lg hover:shadow-sky-200 transition-all active:scale-95">
                        {t('getStarted')}
                      </button></SignUpButton>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="text-sm font-bold text-slate-700 hover:text-sky-600 transition-colors">
                      {t('dashboard')}
                    </Link>
                    <div className="p-0.5 bg-gradient-to-tr from-sky-400 to-indigo-500 rounded-full">
                      <UserButton />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
