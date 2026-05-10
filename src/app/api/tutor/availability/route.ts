import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { syncUser } from "@/lib/sync-user";

export async function POST(request: Request) {
  const user = await syncUser();
  if (!user || user.role !== 'TUTOR') {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { availability } = await request.json(); // Array of { dayOfWeek, startTime, endTime }

    // 1. Get Tutor Profile
    const profile = await prisma.tutorProfile.findUnique({
      where: { userId: user.id }
    });

    if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

    // 2. Transaction: Delete old availability and insert new
    await prisma.$transaction([
      prisma.tutorAvailability.deleteMany({ where: { tutorId: profile.id } }),
      prisma.tutorAvailability.createMany({
        data: availability.map((a: any) => ({
          tutorId: profile.id,
          dayOfWeek: parseInt(a.dayOfWeek),
          startTime: a.startTime,
          endTime: a.endTime
        }))
      })
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Availability Save Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
