import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { syncUser } from "@/lib/sync-user";
import { logEvent } from "@/lib/logger";

export async function PATCH(request: Request) {
  const user = await syncUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { learningGoal, currentLevel, timezone, selectedTrack } = await request.json();

    // Update User and Profile
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { timezone }
      }),
      prisma.studentProfile.update({
        where: { userId: user.id },
        data: {
          learningGoal,
          currentLevel,
          selectedTrack
        }
      })
    ]);

    await logEvent({
      event: "PROFILE_UPDATED",
      message: `Student ${user.name} updated their learning settings.`,
      userId: user.id,
      metadata: { learningGoal, currentLevel, timezone, selectedTrack }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Profile Update Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
