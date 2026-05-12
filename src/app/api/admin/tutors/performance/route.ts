import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { syncUser } from "@/lib/sync-user";

export async function GET() {
  const user = await syncUser();
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const performance = await prisma.tutorProfile.findMany({
    include: {
      user: true,
      bookings: true,
    }
  });

  const stats = performance.map(profile => {
    const totalBookings = profile.bookings.length;
    const completed = profile.bookings.filter(b => b.status === 'COMPLETED').length;
    const totalHours = completed * 1;

    return {
      id: profile.id,
      name: profile.user.name,
      totalBookings,
      completed,
      totalHours,
      completionRate: totalBookings > 0 ? (completed / totalBookings) * 100 : 0
    };
  }).sort((a, b) => b.totalHours - a.totalHours);

  return NextResponse.json(stats);
}
