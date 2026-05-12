import { redirect } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { syncUser } from "@/lib/sync-user";
import { prisma } from "@/lib/prisma";
import { ResourceManager } from "./resource-manager";

export const dynamic = "force-dynamic";

export default async function TutorResourcesPage() {
  const user = await syncUser();
  
  if (!user || user.role !== 'TUTOR') {
    redirect('/');
  }

  const profile = await prisma.tutorProfile.findUnique({
    where: { userId: user.id },
    include: { resources: true }
  });

  if (!profile) redirect('/');

  return (
    <main className="min-h-screen bg-brand-surface-soft pb-20">
      <Navbar />
      
      <div className="pt-40 max-w-4xl mx-auto px-4">
        <div className="mb-12 text-center md:text-left">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Resource Repository</h1>
          <p className="text-slate-500 font-bold mt-2 uppercase text-xs tracking-widest italic">Store links and documents to share during your coaching sessions.</p>
        </div>

        <ResourceManager initialResources={profile.resources} />
      </div>
    </main>
  );
}
