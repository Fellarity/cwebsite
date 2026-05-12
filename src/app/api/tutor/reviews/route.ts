import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { syncUser } from "@/lib/sync-user";
import { logEvent } from "@/lib/logger";

export async function POST(request: Request) {
  const user = await syncUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { bookingId, rating, comment } = await request.json();

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { student: true, tutor: true }
    });

    if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    if (booking.student.userId !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const review = await prisma.review.create({
      data: {
        bookingId,
        studentId: booking.studentId,
        tutorId: booking.tutorId,
        rating: parseInt(rating),
        comment
      }
    });

    await logEvent({
      event: "REVIEW_SUBMITTED",
      message: `Student ${user.name} rated tutor: ${rating} Stars`,
      userId: user.id,
      metadata: { tutorId: booking.tutorId, reviewId: review.id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Review Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
