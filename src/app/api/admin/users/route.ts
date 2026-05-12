import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { syncUser } from "@/lib/sync-user";
import { clerkClient } from "@clerk/nextjs/server";

export async function GET() {
  const user = await syncUser();
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const allUsers = await prisma.user.findMany({
    include: {
      studentProfile: true,
      tutorProfile: true,
    },
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json(allUsers);
}

export async function PATCH(request: Request) {
  const user = await syncUser();
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { userId, role, totalCredits } = await request.json();

    // 1. Update Prisma User
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { 
        role,
        studentProfile: {
          upsert: {
            create: { totalCredits: totalCredits || 0 },
            update: { totalCredits: totalCredits || 0 }
          }
        }
      }
    });

    // 2. Sync to Clerk Metadata
    const client = await clerkClient();
    await client.users.updateUser(userId, {
      publicMetadata: {
        role: role
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin User Update Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
