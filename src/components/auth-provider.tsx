"use client";

import { NeonAuthUIProvider } from "@neondatabase/auth/react";
import { authClient } from "@/lib/auth-client";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <NeonAuthUIProvider
      authClient={authClient as any}
      defaultTheme="light"
      emailOTP
      social={{
        providers: ["google"],
      }}
    >
      {children}
    </NeonAuthUIProvider>
  );
}
