import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { syncUser } from "@/lib/sync-user";

export async function POST(request: Request) {
  const user = await syncUser();
  if (!user || user.role !== 'TUTOR') {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { bio, expertise, hourlyRate } = await request.json();

    await prisma.tutorProfile.update({
      where: { userId: user.id },
      data: {
        bio,
        expertise,
        hourlyRate: parseFloat(hourlyRate),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Settings Update Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
