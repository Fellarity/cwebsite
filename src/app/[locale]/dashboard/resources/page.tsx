import { redirect } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { syncUser } from "@/lib/sync-user";
import { ResourceGrid } from "./resource-grid";

export const dynamic = "force-dynamic";

export default async function KnowledgeLibraryPage() {
  const user = await syncUser();
  
  if (!user) {
    redirect('/');
  }

  return (
    <main className="min-h-screen bg-brand-surface-soft pb-20">
      <Navbar />
      
      <div className="pt-40 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Knowledge Library</h1>
          <p className="text-slate-500 font-bold mt-2 uppercase text-xs tracking-widest italic">Aggregated AI resources curated by your assigned mentors.</p>
        </div>

        <ResourceGrid />
      </div>
    </main>
  );
}
