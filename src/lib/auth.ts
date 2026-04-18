import { createNeonAuth } from "@neondatabase/auth/next/server";

export const auth = createNeonAuth({
  baseUrl: process.env.NEON_AUTH_BASE_URL || "https://placeholder.neonauth.tech",
  cookies: {
    // Provide a fallback for build-time static analysis
    // The actual secret MUST be provided in the Vercel dashboard for production
    secret: process.env.NEON_AUTH_COOKIE_SECRET || "build-time-placeholder-secret-32-chars-long",
  },
});
