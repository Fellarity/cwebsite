import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { syncUser } from "@/lib/sync-user";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await syncUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: orderId } = await params;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { user: true, plan: true }
  });

  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  if (order.userId !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  // Simple Text Receipt for now
  const receipt = `
    AI COACHING HUB - OFFICIAL RECEIPT
    ----------------------------------
    Receipt ID: ${order.id}
    Date: ${order.createdAt.toLocaleDateString()}
    
    BILL TO:
    Name: ${order.user.name}
    Email: ${order.user.email}
    
    ITEM:
    ${order.plan.title} (${order.plan.sessionCount} Sessions)
    
    TOTAL AMOUNT: $${order.amount}
    STATUS: PAID
    
    Thank you for building the future with us.
    ----------------------------------
  `;

  return new NextResponse(receipt, {
    headers: {
      "Content-Type": "text/plain",
      "Content-Disposition": `attachment; filename=receipt_${order.id}.txt`,
    },
  });
}
