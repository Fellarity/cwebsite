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
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
            <div className="p-2 bg-brand-primary rounded-xl shadow-lg shadow-brand-soft">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-brand-text-heading uppercase">
              AI Coaching <span className="text-brand-primary">Hub</span>
            </span>
          </Link>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10 text-[11px] font-black text-brand-text-muted uppercase tracking-[0.2em]">
            <Link href="/tutors" className="hover:text-brand-primary transition-colors">{t('findTutors')}</Link>
            <Link href="/programs" className="hover:text-brand-primary transition-colors">{t('programs')}</Link>
            <Link href="/pricing" className="hover:text-brand-primary transition-colors">{t('pricing')}</Link>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <LanguageSwitcher />
            {!isPending ? (
              <>
                {!session ? (
                  <div className="flex items-center gap-4">
                    <Link href="/auth/sign-in" className="text-xs font-bold text-brand-text-heading hover:text-brand-primary transition-colors uppercase tracking-widest">
                      {t('signIn')}
                    </Link>
                    <Link 
                      href="/auth/sign-up" 
                      className="bg-brand-primary hover:bg-brand-primary-hover text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-brand-soft transition-all active:scale-95"
                    >
                      {t('getStarted')}
                    </Link>
                  </div>
                ) : (
                  <div className="relative">
                    <button 
                      onClick={toggleUserMenu}
                      className="p-1 bg-brand-surface-soft border border-brand-border rounded-full hover:shadow-md transition-all active:scale-95"
                    >
                      <User className="h-5 w-5 text-brand-primary" />
                    </button>
                    
                    {isUserMenuOpen ? (
                      <div className="absolute right-0 mt-3 w-56 bg-white border border-brand-border rounded-3xl shadow-2xl p-2 py-3 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="px-4 py-2 border-b border-brand-surface-soft mb-2">
                           <p className="text-[9px] font-black text-brand-text-muted uppercase tracking-widest mb-0.5">Signed in as</p>
                           <p className="text-xs font-bold text-brand-text-heading truncate">{session.user.email}</p>
                        </div>
                        <Link 
                          href="/dashboard" 
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-brand-surface-soft text-[10px] font-black uppercase tracking-widest text-brand-text-body transition-colors"
                        >
                          <LayoutDashboard className="h-4 w-4 text-brand-primary" />
                          {t('dashboard')}
                        </Link>
                        <button 
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-rose-50 text-[10px] font-black uppercase tracking-widest text-rose-600 transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign Out
                        </button>
                      </div>
                    ) : null}
                  </div>
                )}
              </>
            ) : null}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <LanguageSwitcher />
            <button 
              onClick={toggleMobileMenu}
              className="p-2 text-brand-text-body hover:text-brand-primary transition-colors"
            >
              {isMobileMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen ? (
        <div className="md:hidden bg-white border-b border-brand-border shadow-2xl animate-in slide-in-from-top duration-300">
          <div className="px-4 pt-6 pb-10 space-y-6">
            <Link href="/tutors" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm font-black text-brand-text-heading uppercase tracking-widest border-b border-brand-surface-soft pb-4">{t('findTutors')}</Link>
            <Link href="/programs" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm font-black text-brand-text-heading uppercase tracking-widest border-b border-brand-surface-soft pb-4">{t('programs')}</Link>
            <Link href="/pricing" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm font-black text-brand-text-heading uppercase tracking-widest border-b border-brand-surface-soft pb-4">{t('pricing')}</Link>
            
            <div className="pt-4">
              {!session ? (
                <div className="flex flex-col gap-4">
                  <Link href="/auth/sign-in" onClick={() => setIsMobileMenuOpen(false)} className="w-full py-4 text-center text-xs font-black text-brand-text-heading uppercase tracking-widest border-2 border-brand-border rounded-2xl">{t('signIn')}</Link>
                  <Link href="/auth/sign-up" onClick={() => setIsMobileMenuOpen(false)} className="w-full py-5 bg-brand-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-brand-soft">{t('getStarted')}</Link>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between p-5 bg-brand-surface-soft rounded-2xl border border-brand-border font-black text-[10px] text-brand-primary uppercase tracking-widest">
                    {t('dashboard')}
                    <LayoutDashboard className="h-5 w-5" />
                  </Link>
                  <button onClick={handleSignOut} className="w-full py-4 bg-rose-50 text-rose-600 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-rose-100">Sign Out</button>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </nav>
  );
};
