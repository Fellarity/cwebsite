import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from 'sonner';
import { ClerkProvider } from "@clerk/nextjs";
import Script from "next/script";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "AI Coaching Hub",
  description: "Live 1-to-1 AI Tutoring",
};

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: '#1D4ED8',
          colorText: '#334155',
          colorBackground: 'rgba(255, 255, 255, 0.8)',
          borderRadius: '1.5rem',
        },
        elements: {
          card: 'backdrop-blur-xl border border-brand-border shadow-[0_4px_20px_rgba(15,23,42,0.06)]',
          formButtonPrimary: 'font-bold uppercase tracking-widest text-[10px] transition-all',
          socialButtonsBlockButton: 'justify-center border-brand-border hover:bg-brand-surface-highlight',
        }
      }}
    >
      <html lang={locale} className="light" suppressHydrationWarning>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased text-slate-900`}>
          <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
            <Toaster position="top-center" richColors />
          </NextIntlClientProvider>
          <Script src="https://checkout.razorpay.com/v1/checkout.js" />
        </body>
      </html>
    </ClerkProvider>
  );
}
