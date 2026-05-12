import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { syncUser } from "@/lib/sync-user";
import { logEvent } from "@/lib/logger";

export async function GET() {
  const user = await syncUser();
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const plans = await prisma.plan.findMany({
    orderBy: { price: 'asc' }
  });

  return NextResponse.json(plans);
}

export async function POST(request: Request) {
  const user = await syncUser();
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title, sessionCount, duration, price, active } = await request.json();

    const plan = await prisma.plan.create({
      data: {
        title,
        sessionCount: parseInt(sessionCount),
        duration: parseInt(duration),
        price: parseFloat(price),
        active
      }
    });

    await logEvent({
      event: "PLAN_CREATED",
      message: `Admin created new plan: ${title} ($${price})`,
      userId: user.id,
      metadata: { planId: plan.id }
    });

    return NextResponse.json({ success: true, planId: plan.id });
  } catch (error) {
    console.error("Plan Creation Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const user = await syncUser();
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, title, sessionCount, duration, price, active } = await request.json();

    await prisma.plan.update({
      where: { id },
      data: {
        title,
        sessionCount: parseInt(sessionCount),
        duration: parseInt(duration),
        price: parseFloat(price),
        active
      }
    });

    await logEvent({
      event: "PLAN_UPDATED",
      message: `Admin updated plan: ${title}`,
      userId: user.id,
      metadata: { planId: id, active }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Plan Update Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
