import { redirect } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { syncUser } from "@/lib/sync-user";
import { prisma } from "@/lib/prisma";
import { AvailabilityManager } from "./availability-manager";

export const dynamic = "force-dynamic";

export default async function TutorAvailabilityPage() {
  const user = await syncUser();
  
  if (!user || user.role !== 'TUTOR') {
    redirect('/');
  }

  const profile = await prisma.tutorProfile.findUnique({
    where: { userId: user.id },
    include: { availability: true }
  });

  if (!profile) redirect('/');

  return (
    <main className="min-h-screen bg-brand-surface-soft pb-20">
      <Navbar />
      
      <div className="pt-40 max-w-4xl mx-auto px-4">
        <div className="mb-12">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Manage Your Availability</h1>
          <p className="text-slate-500 font-bold mt-2 uppercase text-xs tracking-widest italic">Set your recurring weekly slots in UTC. These will be automatically converted to student timezones.</p>
        </div>

        <AvailabilityManager initialAvailability={profile.availability} />
      </div>
    </main>
  );
}
