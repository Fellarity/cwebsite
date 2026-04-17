import { AuthView } from "@neondatabase/auth/react";
import { Navbar } from "@/components/navbar";

export default function SignUpPage() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      <Navbar />
      
      {/* Background Blobs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-sky-200/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-200/30 rounded-full blur-[120px]" />
      </div>

      <div className="pt-48 pb-20 flex items-center justify-center px-4 relative">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-xl p-10 rounded-[3rem] shadow-2xl border border-sky-100/50 neon-auth-container">
          <div className="text-center mb-10">
             <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2 uppercase">Create Account</h2>
             <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em]">Start your AI learning journey</p>
          </div>
          <AuthView view="SIGN_UP" />
        </div>
      </div>
    </main>
  );
}
