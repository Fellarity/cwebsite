import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { syncUser } from "@/lib/sync-user";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await syncUser();
  if (!admin || admin.role !== 'ADMIN') {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: userId } = await params;

  const [bookings, orders, studentProfile] = await Promise.all([
    prisma.booking.findMany({
      where: { student: { userId } },
      include: { tutor: { include: { user: true } } },
      orderBy: { startTime: 'desc' }
    }),
    prisma.order.findMany({
      where: { userId },
      include: { plan: true },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.studentProfile.findUnique({
      where: { userId }
    })
  ]);

  return NextResponse.json({
    bookings,
    orders,
    profile: studentProfile
  });
}
