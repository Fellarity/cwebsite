"use client";

import { useState } from "react";
import { Link } from "@/navigation";
import { Brain, Menu, X } from "lucide-react";
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from "./language-switcher";
import { SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/nextjs";

export const Navbar = () => {
  const t = useTranslations('Navbar');
  const { isSignedIn, isLoaded } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/60 backdrop-blur-lg border-b border-sky-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
            <div className="p-2 bg-sky-500 rounded-xl shadow-lg shadow-sky-200 flex-shrink-0">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900 truncate">
              AI Coaching <span className="text-sky-600">Hub</span>
            </span>
          </Link>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10 text-sm font-semibold text-slate-600">
            <Link href="/tutors" className="hover:text-sky-600 transition-colors uppercase tracking-wider">{t('findTutors')}</Link>
            <Link href="/programs" className="hover:text-sky-600 transition-colors uppercase tracking-wider">{t('programs')}</Link>
            <Link href="/pricing" className="hover:text-sky-600 transition-colors uppercase tracking-wider">{t('pricing')}</Link>
          </div>

          <div className="hidden md:flex items-center gap-6">
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

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <LanguageSwitcher />
            <button 
              onClick={toggleMobileMenu}
              className="p-2 text-slate-600 hover:text-sky-600 transition-colors"
            >
              {isMobileMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-b border-sky-100 shadow-2xl animate-in slide-in-from-top duration-300">
          <div className="px-4 pt-6 pb-10 space-y-6">
            <Link 
              href="/tutors" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-lg font-black text-slate-900 uppercase tracking-widest border-b border-sky-50 pb-4"
            >
              {t('findTutors')}
            </Link>
            <Link 
              href="/programs" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-lg font-black text-slate-900 uppercase tracking-widest border-b border-sky-50 pb-4"
            >
              {t('programs')}
            </Link>
            <Link 
              href="/pricing" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-lg font-black text-slate-900 uppercase tracking-widest border-b border-sky-50 pb-4"
            >
              {t('pricing')}
            </Link>
            
            <div className="pt-4 flex flex-col gap-4">
              {!isSignedIn ? (
                <>
                  <SignInButton mode="modal">
                    <button className="w-full py-4 text-center font-black text-slate-900 uppercase tracking-widest border-2 border-slate-100 rounded-2xl">
                      {t('signIn')}
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="w-full py-5 bg-gradient-to-r from-sky-500 to-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-sky-200">
                      {t('getStarted')}
                    </button>
                  </SignUpButton>
                </>
              ) : (
                <div className="flex items-center justify-between p-4 bg-sky-50 rounded-2xl border border-sky-100">
                  <Link 
                    href="/dashboard" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="font-black text-sky-700 uppercase tracking-widest"
                  >
                    {t('dashboard')}
                  </Link>
                  <UserButton />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
