import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { razorpay } from "@/lib/razorpay";

export async function POST(request: Request) {
  const { data: session } = await auth.getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { planId } = await request.json();

    // 1. Fetch Plan
    const plan = await prisma.plan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    // 2. Create Razorpay Order
    // Amount is in paisa (100 paisa = 1 INR/USD depending on config)
    const amount = Math.round(plan.price * 100);
    const options = {
      amount,
      currency: "USD", // Adjust to INR if preferred for Indian market
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    // 3. Store Pending Order in DB
    await prisma.order.create({
      data: {
        userId: session.user.id,
        planId: plan.id,
        razorpayOrderId: order.id,
        amount: plan.price,
        status: "PENDING",
      },
    });

    return NextResponse.json({
      id: order.id,
      currency: order.currency,
      amount: order.amount,
    });
  } catch (error) {
    console.error("Razorpay Order Creation Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
