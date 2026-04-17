import { auth } from "./lib/auth";
import createMiddleware from 'next-intl/middleware';
import { locales, localePrefix } from './navigation';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware({
  locales,
  localePrefix,
  defaultLocale: 'en'
});

const authMiddleware = auth.middleware({
  loginUrl: '/auth/sign-in',
});

export default async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    
    // 1. Skip ALL API routes from internationalization
    if (pathname.startsWith("/api")) {
        return NextResponse.next();
    }

    // 2. Protect routes
    const isProtectedRoute = 
      pathname.includes('/dashboard') || 
      pathname.includes('/tutor/') || 
      pathname.includes('/admin');

    if (isProtectedRoute) {
        // Neon Auth middleware will handle session check and redirect to /auth/sign-in
        // intlMiddleware will then rewrite /auth/sign-in to /en/auth/sign-in or /nl/auth/sign-in
        return authMiddleware(request);
    }

    // 3. Handle Internationalized Routing
    return intlMiddleware(request);
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
