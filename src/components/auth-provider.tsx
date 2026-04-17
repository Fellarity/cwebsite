"use client";

import { NeonAuthUIProvider } from "@neondatabase/auth/react";
import { authClient } from "@/lib/auth-client";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <NeonAuthUIProvider 
      authClient={authClient} 
      defaultTheme="light"
      theme={{
        colors: {
          primary: "#0ea5e9", // Sky Blue
          secondary: "#6366f1", // Indigo
          background: "#ffffff",
          foreground: "#0f172a",
        },
        radius: "1.5rem",
      }}
    >
      {children}
    </NeonAuthUIProvider>
  );
}
