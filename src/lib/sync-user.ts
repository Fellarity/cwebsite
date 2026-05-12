import { currentUser, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "./prisma";
import { logEvent } from "./logger";

/**
 * Syncs the currently authenticated Clerk user to the primary Prisma database.
 * Handles migration from Neon Auth by matching on email if the Clerk ID doesn't exist yet.
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

  const name = user.firstName
    ? `${user.firstName} ${user.lastName || ''}`.trim()
    : primaryEmail.split('@')[0];

  // First, try to find user by Clerk ID
  let dbUser = await prisma.user.findUnique({ where: { id: user.id } });

  if (dbUser) {
    // User already synced with Clerk ID — just update fields
    dbUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        email: primaryEmail,
        name,
        image: user.imageUrl,
      },
    });
  } else {
    // Check if a user with this email exists (legacy Neon Auth user)
    const existingByEmail = await prisma.user.findUnique({ where: { email: primaryEmail } });

    if (existingByEmail) {
      // Migrate: update the old user's ID to the new Clerk ID
      dbUser = await prisma.user.update({
        where: { email: primaryEmail },
        data: {
          id: user.id,
          name,
          image: user.imageUrl,
        },
      });
    } else {
      // Brand new user — create
      dbUser = await prisma.user.create({
        data: {
          id: user.id,
          email: primaryEmail,
          name,
          image: user.imageUrl,
          emailVerified: true,
          role: "STUDENT",
        },
      });

      // LOG: User Registration
      await logEvent({
        event: "USER_REGISTERED",
        message: `New user signed up: ${name} (${primaryEmail})`,
        userId: user.id,
        metadata: { source: "clerk_sync" }
      });
    }
  }

  // Sync role to Clerk publicMetadata for client-side RBAC UI checks
  const client = await clerkClient();
  if (user.publicMetadata.role !== dbUser.role) {
    await client.users.updateUser(user.id, {
      publicMetadata: {
        role: dbUser.role
      }
    });
  }

  return dbUser;
}
