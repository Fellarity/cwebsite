import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { syncUser } from "@/lib/sync-user";

export async function GET() {
  const user = await syncUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // 1. Get all tutors the student has booked
  const bookings = await prisma.booking.findMany({
    where: { student: { userId: user.id } },
    select: { tutorId: true }
  });

  const tutorIds = Array.from(new Set(bookings.map(b => b.tutorId)));

  // 2. Get all resources from those tutors
  const resources = await prisma.tutorResource.findMany({
    where: { tutorId: { in: tutorIds } },
    include: {
      tutor: {
        include: { user: { select: { name: true } } }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json(resources);
}
