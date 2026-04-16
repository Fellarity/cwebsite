import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import createMiddleware from 'next-intl/middleware';
import { locales, localePrefix } from './navigation';

const intlMiddleware = createMiddleware({
  locales,
  localePrefix,
  defaultLocale: 'en'
});

const isProtectedRoute = createRouteMatcher([
  "/(en|nl)/dashboard(.*)",
  "/(en|nl)/tutor(.*)",
  "/(en|nl)/admin(.*)"
]);

export default clerkMiddleware(async (auth, request) => {
    // 1. Skip middleware for public API routes or assets if needed
    if (request.nextUrl.pathname.startsWith('/api/webhooks')) {
        return;
    }

    // 2. Protect specific routes
    if (isProtectedRoute(request)) {
        await auth.protect();
    }

    // 3. Handle Internationalized Routing
    return intlMiddleware(request);
});

export const config = {
  matcher: [
    // Optimized matcher: Skip all internal paths and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
