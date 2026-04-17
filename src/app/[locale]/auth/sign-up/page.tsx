import { AuthView } from "@neondatabase/auth/react";
import { Navbar } from "@/components/navbar";

export default function SignUpPage() {
  return (
    <main className="min-h-screen text-slate-900">
      <Navbar />
      <div className="pt-40 flex items-center justify-center px-4 text-slate-900">
        <div className="w-full max-w-md bg-white p-8 rounded-[2.5rem] shadow-2xl border border-sky-100">
          <AuthView view="SIGN_UP" />
        </div>
      </div>
    </main>
  );
}
