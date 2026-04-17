import { createAuthClient } from "@neondatabase/auth";
import { BetterAuthReactAdapter } from "@neondatabase/auth/react";

export const authClient = createAuthClient(
    process.env.NEXT_PUBLIC_NEON_AUTH_BASE_URL || "https://ep-square-salad-angz6kci.neonauth.c-6.us-east-1.aws.neon.tech/neondb/auth",
    {
        adapter: BetterAuthReactAdapter()
    }
);
