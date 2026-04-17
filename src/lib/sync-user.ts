import { auth } from "./auth";
import { prisma } from "./prisma";

/**
 * Gets the currently authenticated Neon Auth user from the database.
 * Returns the Prisma user record, or null if not authenticated.
 */
export async function syncUser() {
  const { data: session } = await auth.getSession();

  if (!session?.user) {
    return null;
  }

  // Neon Auth stores users in the database automatically.
  // We can fetch the full user record from our primary user table.
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  return user;
}
