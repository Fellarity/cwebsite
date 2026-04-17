import { createAuthClient } from "@neondatabase/auth";
import { BetterAuthReactAdapter } from "@neondatabase/auth/react";

export const authClient = createAuthClient(
    process.env.NEXT_PUBLIC_APP_URL ? `${process.env.NEXT_PUBLIC_APP_URL}/api/auth` : "http://localhost:3000/api/auth",
    {
        adapter: BetterAuthReactAdapter()
    }
);
