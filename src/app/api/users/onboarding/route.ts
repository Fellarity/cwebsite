import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { syncUser } from "@/lib/sync-user";

export async function POST(request: Request) {
  const user = await syncUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const answers = await request.json();

    // Update or Create Student Profile with onboarding data
    await prisma.studentProfile.upsert({
      where: { userId: user.id },
      update: {
        learningGoal: answers.goal,
        currentLevel: answers.level,
        onboardingAnswers: answers,
      },
      create: {
        userId: user.id,
        learningGoal: answers.goal,
        currentLevel: answers.level,
        onboardingAnswers: answers,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Onboarding Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
