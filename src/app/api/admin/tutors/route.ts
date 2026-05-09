import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { syncUser } from "@/lib/sync-user";

export async function GET() {
  const user = await syncUser();
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const pendingTutors = await prisma.user.findMany({
    where: {
      role: 'TUTOR',
      tutorProfile: {
        verificationStatus: 'PENDING'
      }
    },
    include: {
      tutorProfile: true
    }
  });

  return NextResponse.json(pendingTutors);
}

export async function POST(request: Request) {
  const user = await syncUser();
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { userId, action } = await request.json(); // action: 'APPROVE' | 'REJECT'

    if (action === 'APPROVE') {
      await prisma.tutorProfile.update({
        where: { userId },
        data: { verificationStatus: 'APPROVED' }
      });
    } else {
      // For rejection, we could either delete profile or mark as REJECTED
      await prisma.tutorProfile.update({
        where: { userId },
        data: { verificationStatus: 'REJECTED' }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin Tutor Action Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
