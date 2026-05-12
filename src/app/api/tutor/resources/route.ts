import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { syncUser } from "@/lib/sync-user";

export async function GET() {
  const user = await syncUser();
  if (!user || user.role !== 'TUTOR') {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await prisma.tutorProfile.findUnique({
    where: { userId: user.id },
    include: { resources: true }
  });

  return NextResponse.json(profile?.resources || []);
}

export async function POST(request: Request) {
  const user = await syncUser();
  if (!user || user.role !== 'TUTOR') {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title, url, description } = await request.json();
    const profile = await prisma.tutorProfile.findUnique({
      where: { userId: user.id }
    });

    if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

    const resource = await prisma.tutorResource.create({
      data: {
        tutorId: profile.id,
        title,
        url,
        description
      }
    });

    return NextResponse.json(resource);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create resource" }, { status: 500 });
  }
}
