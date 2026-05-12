import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { syncUser } from "@/lib/sync-user";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const tutor = await syncUser();
  if (!tutor || tutor.role !== 'TUTOR') {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: studentId } = await params;

  const student = await prisma.studentProfile.findUnique({
    where: { id: studentId },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          image: true
        }
      }
    }
  });

  if (!student) return NextResponse.json({ error: "Student not found" }, { status: 404 });

  return NextResponse.json(student);
}
