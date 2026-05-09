import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { syncUser } from "@/lib/sync-user";

export async function GET() {
  const user = await syncUser();
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const successfulOrders = await prisma.order.findMany({
    where: { status: 'PAID' },
    include: {
      user: true,
      plan: true
    },
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json(successfulOrders);
}
