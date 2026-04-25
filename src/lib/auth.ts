import { createNeonAuth } from "@neondatabase/auth/next/server";

export const auth = createNeonAuth({
  // Dynamically resolve baseUrl for Vercel preview/production environments
  baseUrl: process.env.VERCEL_PROJECT_PRODUCTION_URL 
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` 
    : process.env.VERCEL_BRANCH_URL 
    ? `https://${process.env.VERCEL_BRANCH_URL}` 
    : process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : process.env.NEON_AUTH_BASE_URL || "http://localhost:3000",
  cookies: {
    // Providing a default secret for the build-time static analysis phase
    secret: process.env.NEON_AUTH_COOKIE_SECRET || "build-time-placeholder-secret-32-chars-long",
  },
});
