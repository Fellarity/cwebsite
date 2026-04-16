import { currentUser } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Syncs the currently authenticated Clerk user to the Prisma database.
 * Call this in any server component where you need the DB user.
 * Returns the Prisma user record, or null if not authenticated.
 */
export async function syncUser() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return null;
  }

  const email = clerkUser.emailAddresses[0]?.emailAddress;
  if (!email) return null;

  const name = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || "No Name";

  const user = await prisma.user.upsert({
    where: { id: clerkUser.id },
    update: {
      email,
      name,
      image: clerkUser.imageUrl,
      emailVerified: true,
    },
    create: {
      id: clerkUser.id,
      email,
      name,
      image: clerkUser.imageUrl,
      emailVerified: true,
      role: "STUDENT",
    },
  });

  return user;
}
