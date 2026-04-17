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

    // 2. Handle Internationalized Routing First
    // This ensures that headers and locale state are set before auth checks
    const response = intlMiddleware(request);

    // 3. Protect routes
    const isProtectedRoute = 
      pathname.includes('/dashboard') || 
      pathname.includes('/tutor/') || 
      pathname.includes('/admin');

    if (isProtectedRoute) {
        // Run auth middleware and return its response if it's a redirect
        const authResponse = await authMiddleware(request);
        if (authResponse && (authResponse.status === 302 || authResponse.status === 307)) {
            return authResponse;
        }
    }

    return response;
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
