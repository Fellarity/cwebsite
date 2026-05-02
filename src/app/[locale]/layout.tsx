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
          colorPrimary: '#0ea5e9',
          colorText: '#334155',
          colorBackground: 'transparent',
          borderRadius: '1rem',
          fontFamily: 'var(--font-geist-sans), system-ui, sans-serif',
        },
        elements: {
          card: 'shadow-none bg-transparent border-none',
          cardBox: 'shadow-none',
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
