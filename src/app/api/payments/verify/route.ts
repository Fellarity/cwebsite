import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature 
    } = await request.json();

    // 1. Verify Signature
    const secret = process.env.RAZORPAY_KEY_SECRET!;
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // 2. Update Order in DB
    const order = await prisma.order.update({
      where: { razorpayOrderId: razorpay_order_id },
      data: {
        status: "PAID",
        razorpayPaymentId: razorpay_payment_id,
      },
    });

    // 3. TODO: Activate Student Profile/Credits
    // For now, we'll just confirm the payment

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (error) {
    console.error("Razorpay Verification Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
