import { redirect } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { syncUser } from "@/lib/sync-user";
import { prisma } from "@/lib/prisma";
import { LearningSettingsForm } from "./settings-form";

export const dynamic = "force-dynamic";

export default async function LearningSettingsPage() {
  const user = await syncUser();
  
  if (!user) {
    redirect('/');
  }

  const profile = await prisma.studentProfile.findUnique({
    where: { userId: user.id }
  });

  if (!profile) redirect('/onboarding');

  return (
    <main className="min-h-screen bg-brand-surface-soft pb-20">
      <Navbar />
      
      <div className="pt-40 max-w-4xl mx-auto px-4">
        <div className="mb-12">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Learning Settings</h1>
          <p className="text-slate-500 font-bold mt-2 uppercase text-xs tracking-widest italic">Fine-tune your curriculum and global preferences.</p>
        </div>

        <LearningSettingsForm initialData={{
          learningGoal: profile.learningGoal || "",
          currentLevel: profile.currentLevel || "Beginner",
          timezone: user.timezone || "UTC",
          selectedTrack: profile.selectedTrack || ""
        }} />
      </div>
    </main>
  );
}
