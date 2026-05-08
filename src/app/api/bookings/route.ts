import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { syncUser } from "@/lib/sync-user";

export async function POST(request: Request) {
  const user = await syncUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { tutorId, startTime, endTime } = await request.json();

    // 1. Ensure student profile exists
    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId: user.id }
    });

    if (!studentProfile) {
      return NextResponse.json({ error: "Student profile not found" }, { status: 400 });
    }

    // 2. Fetch Tutor Profile
    const tutorProfile = await prisma.tutorProfile.findUnique({
      where: { userId: tutorId }
    });

    if (!tutorProfile) {
      return NextResponse.json({ error: "Tutor not found" }, { status: 404 });
    }

    // 3. Create Booking
    const booking = await prisma.booking.create({
      data: {
        studentId: studentProfile.id,
        tutorId: tutorProfile.id,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        status: "CONFIRMED", // For now, confirm directly
        meetLink: "https://meet.google.com/mock-link" // Placeholder for Google Meet integration
      }
    });

    return NextResponse.json({ success: true, bookingId: booking.id });
  } catch (error) {
    console.error("Booking Creation Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
