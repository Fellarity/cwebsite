import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { syncUser } from "@/lib/sync-user";
import { logEvent } from "@/lib/logger";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const tutor = await syncUser();
  if (!tutor || tutor.role !== 'TUTOR') {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: bookingId } = await params;

  try {
    const { status, sessionNotes, actionItems } = await request.json();

    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status,
        sessionNotes,
        actionItems: actionItems || []
      },
      include: {
        student: { include: { user: true } }
      }
    });

    await logEvent({
      event: "BOOKING_STATUS_UPDATED",
      message: `Session marked as ${status}: ${booking.student.user.name}`,
      userId: tutor.id,
      metadata: { bookingId, status }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Booking Update Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
