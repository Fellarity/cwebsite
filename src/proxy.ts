import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import createMiddleware from 'next-intl/middleware';
import { locales, localePrefix } from './navigation';
import { NextResponse } from "next/server";

const intlMiddleware = createMiddleware({
  locales,
  localePrefix,
  defaultLocale: 'en'
});

const isProtectedRoute = createRouteMatcher([
  "/(en|nl)/(dashboard|admin)(.*)",
  "/(en|nl)/tutor",
  "/(en|nl)/tutor/(.*)"
]);

export default clerkMiddleware(async (auth, request) => {
    const pathname = request.nextUrl.pathname;
    
    // Handle API routes first
    if (pathname.startsWith("/api")) {
        return NextResponse.next();
    }
    
    // Protect routes
    if (isProtectedRoute(request)) {
        await auth.protect();
    }

    // Handle Internationalized Routing
    return intlMiddleware(request);
});

export const config = {
  matcher: [
    '/((?!_next|_vercel|.*\\..*).*)',
  ],
};
