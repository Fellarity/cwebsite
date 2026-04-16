"use client";

import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import { Languages } from 'lucide-react';

export const LanguageSwitcher = () => {
  const locale = useLocale();
  const pathname = usePathname();

  const toggleLanguage = () => {
    const nextLocale = locale === 'en' ? 'nl' : 'en';
    
    // Manual path replacement for reliability in Next.js 16
    let newPath = pathname;
    if (pathname.startsWith(`/${locale}/`)) {
      newPath = pathname.replace(`/${locale}/`, `/${nextLocale}/`);
    } else if (pathname === `/${locale}`) {
      newPath = `/${nextLocale}`;
    } else {
      newPath = `/${nextLocale}${pathname}`;
    }
    
    window.location.assign(newPath);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors shadow-sm active:scale-95"
      aria-label="Toggle language"
    >
      <Languages className="h-4 w-4" />
      <span className="font-bold text-blue-600">{locale.toUpperCase()}</span>
      <span className="text-gray-300">|</span>
      <span>{locale === 'en' ? 'NL' : 'EN'}</span>
    </button>
  );
};
