import { createNeonAuth } from "@neondatabase/auth/next/server";

export const auth = createNeonAuth({
  baseUrl: process.env.NEON_AUTH_BASE_URL || "https://ep-square-salad-angz6kci.neonauth.c-6.us-east-1.aws.neon.tech/neondb/auth",
  cookies: {
    secret: process.env.NEON_AUTH_COOKIE_SECRET || "build-time-placeholder-secret-32-chars-long",
  },
});
