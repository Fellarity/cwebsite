import { redirect } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { syncUser } from "@/lib/sync-user";
import { Inbox } from "./inbox";
import { Mail } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function MessageHubPage() {
  const user = await syncUser();
  
  if (!user) {
    redirect('/');
  }

  return (
    <main className="min-h-screen bg-brand-surface-soft pb-20">
      <Navbar />
      
      <div className="pt-40 max-w-4xl mx-auto px-4">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-sky-100 text-sky-700 text-[10px] font-black uppercase tracking-widest shadow-sm mb-4">
             <Mail className="h-3.5 w-3.5 text-brand-primary" />
             <span>Secure Messaging</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Message Hub</h1>
          <p className="text-slate-500 font-bold mt-2 uppercase text-xs tracking-widest italic">Direct communication with your expert mentors.</p>
        </div>

        <Inbox />
      </div>
    </main>
  );
}
