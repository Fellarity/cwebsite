"use client";

import { Link } from "@/navigation";
import { Brain, Menu, X, User, LogOut, LayoutDashboard } from "lucide-react";
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from "./language-switcher";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export const Navbar = () => {
  const t = useTranslations('Navbar');
  const { data: session, isPending } = authClient.useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);

  const handleSignOut = async () => {
    await authClient.signOut();
    window.location.href = "/";
  };

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
            {!isPending && (
              <>
                {!session ? (
                  <div className="flex items-center gap-4">
                    <a href="/api/auth/login" className="text-sm font-bold text-slate-700 hover:text-sky-600 transition-colors">
                      {t('signIn')}
                    </a>
                    <a 
                      href="/api/auth/register" 
                      className="bg-gradient-to-r from-sky-500 to-indigo-600 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:shadow-lg hover:shadow-sky-200 transition-all active:scale-95"
                    >
                      {t('getStarted')}
                    </a>
                  </div>
                ) : (
                  <div className="relative">
                    <button 
                      onClick={toggleUserMenu}
                      className="p-0.5 bg-gradient-to-tr from-sky-400 to-indigo-500 rounded-full hover:shadow-md transition-all active:scale-95"
                    >
                      <div className="bg-white rounded-full p-1">
                        <User className="h-5 w-5 text-sky-600" />
                      </div>
                    </button>
                    
                    {isUserMenuOpen && (
                      <div className="absolute right-0 mt-3 w-56 bg-white border border-sky-100 rounded-3xl shadow-2xl shadow-sky-200/50 p-2 py-3 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="px-4 py-2 border-b border-sky-50 mb-2">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Signed in as</p>
                           <p className="text-sm font-bold text-slate-900 truncate">{session.user.email}</p>
                        </div>
                        <Link 
                          href="/dashboard" 
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-sky-50 text-sm font-bold text-slate-700 transition-colors"
                        >
                          <LayoutDashboard className="h-4 w-4 text-sky-500" />
                          {t('dashboard')}
                        </Link>
                        <button 
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-rose-50 text-sm font-bold text-rose-600 transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign Out
                        </button>
                      </div>
                    )}
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
            <Link href="/tutors" onClick={() => setIsMobileMenuOpen(false)} className="block text-lg font-black text-slate-900 uppercase tracking-widest border-b border-sky-50 pb-4">{t('findTutors')}</Link>
            <Link href="/programs" onClick={() => setIsMobileMenuOpen(false)} className="block text-lg font-black text-slate-900 uppercase tracking-widest border-b border-sky-50 pb-4">{t('programs')}</Link>
            <Link href="/pricing" onClick={() => setIsMobileMenuOpen(false)} className="block text-lg font-black text-slate-900 uppercase tracking-widest border-b border-sky-50 pb-4">{t('pricing')}</Link>
            
            <div className="pt-4">
              {!session ? (
                <div className="flex flex-col gap-4">
                  <a href="/api/auth/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full py-4 text-center font-black text-slate-900 uppercase tracking-widest border-2 border-slate-100 rounded-2xl">{t('signIn')}</a>
                  <a href="/api/auth/register" onClick={() => setIsMobileMenuOpen(false)} className="w-full py-5 bg-gradient-to-r from-sky-500 to-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-sky-200">{t('getStarted')}</a>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between p-5 bg-sky-50 rounded-2xl border border-sky-100 font-black text-sky-700 uppercase tracking-widest">
                    {t('dashboard')}
                    <LayoutDashboard className="h-5 w-5" />
                  </Link>
                  <button onClick={handleSignOut} className="w-full py-4 bg-rose-50 text-rose-600 rounded-2xl font-black uppercase tracking-widest border border-rose-100">Sign Out</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
