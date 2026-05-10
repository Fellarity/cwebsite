"use client";

import { Link } from "@/navigation";
import { Brain, Menu, X, LayoutDashboard, ShieldCheck, Briefcase } from "lucide-react";
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from "./language-switcher";
import { useState } from "react";
import { UserButton, useAuth, useUser } from "@clerk/nextjs";

export const Navbar = () => {
  const t = useTranslations('Navbar');
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const role = user?.publicMetadata?.role as string | undefined;

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
            {role !== 'TUTOR' && role !== 'ADMIN' && (
              <Link href="/tutor/apply" className="px-4 py-1.5 border border-brand-soft rounded-full text-brand-primary hover:bg-brand-primary hover:text-white transition-all lowercase italic tracking-tight">{t('becomeTutor')}</Link>
            )}
          </div>

          <div className="hidden md:flex items-center gap-6">
            <LanguageSwitcher />
            {isLoaded ? (
              <>
                {!isSignedIn ? (
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
                  <div className="relative flex items-center">
                    <UserButton
                      appearance={{
                        elements: {
                          userButtonAvatarBox: "w-9 h-9 border border-brand-border rounded-full hover:shadow-md transition-all active:scale-95",
                          userButtonPopoverCard: "bg-white border border-slate-200 shadow-xl backdrop-blur-none",
                          userButtonPopoverActions: "bg-white backdrop-blur-none",
                          userButtonPopoverActionButton: "bg-white hover:bg-slate-50",
                          userButtonPopoverFooter: "bg-white backdrop-blur-none",
                          userPreviewMainIdentifier: "text-slate-900 font-bold",
                          userPreviewSecondaryIdentifier: "text-slate-500",
                          userButtonPopoverActionButtonText: "text-slate-700 font-medium"
                        }
                      }}
                    >
                      <UserButton.MenuItems>
                        <UserButton.Link
                          label={t('dashboard')}
                          href="/dashboard"
                          labelIcon={<LayoutDashboard className="h-4 w-4" />}
                        />
                        {role === 'ADMIN' && (
                          <UserButton.Link
                            label="Admin Console"
                            href="/admin"
                            labelIcon={<ShieldCheck className="h-4 w-4 text-rose-500" />}
                          />
                        )}
                        {role === 'TUTOR' && (
                          <UserButton.Link
                            label="Tutor Portal"
                            href="/tutor"
                            labelIcon={<Briefcase className="h-4 w-4 text-sky-500" />}
                          />
                        )}
                      </UserButton.MenuItems>
                    </UserButton>
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
            {role !== 'TUTOR' && role !== 'ADMIN' && (
              <Link href="/tutor/apply" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm font-black text-brand-primary uppercase tracking-widest border-b border-brand-surface-soft pb-4 italic">{t('becomeTutor')}</Link>
            )}
            
            <div className="pt-4">
              {!isSignedIn ? (
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
                  {role === 'ADMIN' && (
                    <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between p-5 bg-rose-50 rounded-2xl border border-rose-100 font-black text-[10px] text-rose-600 uppercase tracking-widest">
                      Admin Console
                      <ShieldCheck className="h-5 w-5" />
                    </Link>
                  )}
                  {role === 'TUTOR' && (
                    <Link href="/tutor" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between p-5 bg-sky-50 rounded-2xl border border-sky-100 font-black text-[10px] text-sky-600 uppercase tracking-widest">
                      Tutor Portal
                      <Briefcase className="h-5 w-5" />
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </nav>
  );
};
