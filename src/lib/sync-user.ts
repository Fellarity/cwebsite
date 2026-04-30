import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "./prisma";

/**
 * Syncs the currently authenticated Clerk user to the primary Prisma database.
 * Returns the Prisma user record, or null if not authenticated.
 */
export async function syncUser() {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const primaryEmail = user.emailAddresses.find(
    (email) => email.id === user.primaryEmailAddressId
  )?.emailAddress;

  if (!primaryEmail) return null;

  // Upsert the user into our public schema 'user' table
  // using the ID and Email provided by Clerk
  const dbUser = await prisma.user.upsert({
    where: { id: user.id },
    update: {
      email: primaryEmail,
      name: user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : primaryEmail.split('@')[0],
      image: user.imageUrl,
    },
    create: {
      id: user.id,
      email: primaryEmail,
      name: user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : primaryEmail.split('@')[0],
      image: user.imageUrl,
      emailVerified: true,
      role: "STUDENT",
    },
  });

  return dbUser;
}
