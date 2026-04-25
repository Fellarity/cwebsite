import { createNeonAuth } from "@neondatabase/auth/next/server";

export const auth = createNeonAuth({
  // Use your actual URL as the fallback to prevent "placeholder" resolution errors during build
  baseUrl: process.env.NEON_AUTH_BASE_URL || "https://ep-square-salad-angz6kci.neonauth.c-6.us-east-1.aws.neon.tech/neondb/auth",
  cookies: {
    // Providing a default secret for the build-time static analysis phase
    secret: process.env.NEON_AUTH_COOKIE_SECRET || "build-time-placeholder-secret-32-chars-long",
  },
  trustedOrigins: [
    "http://localhost:3000",
    ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
    ...(process.env.VERCEL_BRANCH_URL ? [`https://${process.env.VERCEL_BRANCH_URL}`] : []),
    ...(process.env.VERCEL_PROJECT_PRODUCTION_URL ? [`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`] : []),
  ]
});
