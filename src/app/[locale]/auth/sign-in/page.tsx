import { AuthView } from "@neondatabase/auth/react";
import { Navbar } from "@/components/navbar";

export default function SignInPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-40 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white p-8 rounded-[2.5rem] shadow-2xl border border-sky-100">
          <AuthView view="sign-in" />
        </div>
      </div>
    </main>
  );
}
