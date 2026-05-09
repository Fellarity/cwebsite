import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { syncUser } from "@/lib/sync-user";

export async function POST(request: Request) {
  const user = await syncUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { bio, expertise, hourlyRate, languages } = await request.json();

    // 1. Update user role to TUTOR (Pending approval)
    // Note: We might want to keep them as STUDENT until approved, 
    // but the schema uses verificationStatus for this.
    await prisma.user.update({
      where: { id: user.id },
      data: { role: 'TUTOR' }
    });

    // 2. Upsert Tutor Profile
    const profile = await prisma.tutorProfile.upsert({
      where: { userId: user.id },
      update: {
        bio,
        expertise,
        hourlyRate,
        languages,
        verificationStatus: "PENDING",
      },
      create: {
        userId: user.id,
        bio,
        expertise,
        hourlyRate,
        languages,
        verificationStatus: "PENDING",
      },
    });

    return NextResponse.json({ success: true, profileId: profile.id });
  } catch (error) {
    console.error("Tutor Application Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
