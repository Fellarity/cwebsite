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
  loginUrl: '/api/auth/login',
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
