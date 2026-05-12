import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { syncUser } from "@/lib/sync-user";

export async function GET() {
  const user = await syncUser();
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    where: { status: 'PAID' },
    include: {
      user: true,
      plan: true
    },
    orderBy: { createdAt: 'desc' }
  });

  // Generate CSV
  const header = "Order ID,User Name,Email,Plan,Amount,Date\n";
  const rows = orders.map(o => {
    return `${o.id},${o.user.name},${o.user.email},${o.plan.title},${o.amount},${o.createdAt.toISOString()}`;
  }).join("\n");

  const csv = header + rows;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename=revenue_report_${new Date().toISOString().split('T')[0]}.csv`,
    },
  });
}
