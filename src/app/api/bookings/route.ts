import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { syncUser } from "@/lib/sync-user";
import { createGoogleMeeting } from "@/lib/google-calendar";

export async function POST(request: Request) {
  const user = await syncUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { tutorId, startTime, endTime } = await request.json();
    const start = new Date(startTime);
    const end = new Date(endTime);

    // 1. Fetch Student Details (including email)
    const student = await prisma.user.findUnique({
      where: { id: user.id },
      include: { studentProfile: true }
    });

    if (!student?.studentProfile) {
      return NextResponse.json({ error: "Student profile not found" }, { status: 400 });
    }

    // 2. Fetch Tutor Details (including email)
    const tutor = await prisma.user.findUnique({
      where: { id: tutorId },
      include: { tutorProfile: true }
    });

    if (!tutor?.tutorProfile) {
      return NextResponse.json({ error: "Tutor not found" }, { status: 404 });
    }

    // 3. Automation: Create Google Meeting
    const meetingData = await createGoogleMeeting({
      studentEmail: student.email,
      tutorEmail: tutor.email,
      startTime: start,
      endTime: end,
      summary: `AI Tutoring Session: ${student.name} & ${tutor.name}`,
      description: "1-to-1 Live AI Coaching Session hosted on Google Meet."
    });

    // 4. Create Booking in Database
    const booking = await prisma.booking.create({
      data: {
        studentId: student.studentProfile.id,
        tutorId: tutor.tutorProfile.id,
        startTime: start,
        endTime: end,
        status: "CONFIRMED",
        meetLink: meetingData?.meetLink || "https://meet.google.com/pending",
        calendarEventId: meetingData?.eventId
      }
    });

    return NextResponse.json({ 
      success: true, 
      bookingId: booking.id,
      meetLink: booking.meetLink 
    });
  } catch (error) {
    console.error("Booking Creation Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
