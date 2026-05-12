import { redirect } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { syncUser } from "@/lib/sync-user";
import { prisma } from "@/lib/prisma";
import { SettingsForm } from "./settings-form";

export const dynamic = "force-dynamic";

export default async function TutorSettingsPage() {
  const user = await syncUser();
  
  if (!user || user.role !== 'TUTOR') {
    redirect('/');
  }

  const profile = await prisma.tutorProfile.findUnique({
    where: { userId: user.id }
  });

  if (!profile) redirect('/');

  return (
    <main className="min-h-screen bg-brand-surface-soft pb-20">
      <Navbar />
      
      <div className="pt-40 max-w-2xl mx-auto px-4">
        <div className="mb-12">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Profile Settings</h1>
          <p className="text-slate-500 font-bold mt-2 uppercase text-xs tracking-widest italic">Update your professional details and coaching rates.</p>
        </div>

        <SettingsForm initialData={{
          bio: profile.bio || "",
          profileImage: profile.profileImage || "",
          expertise: profile.expertise.join(", "),
          hourlyRate: profile.hourlyRate?.toString() || ""
        }} />
      </div>
    </main>
  );
}
