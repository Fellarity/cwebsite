import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { syncUser } from "@/lib/sync-user";

export async function GET() {
  const user = await syncUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const messages = await prisma.message.findMany({
    where: { receiverId: user.id },
    include: {
      sender: { select: { name: true, image: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json(messages);
}

export async function POST(request: Request) {
  const user = await syncUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { receiverId, content } = await request.json();

    const message = await prisma.message.create({
      data: {
        senderId: user.id,
        receiverId,
        content
      }
    });

    return NextResponse.json(message);
  } catch (error) {
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
