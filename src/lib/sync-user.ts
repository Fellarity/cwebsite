import { auth } from "./auth";
import { prisma } from "./prisma";

import { headers } from "next/headers";

/**
 * Syncs the currently authenticated Neon Auth user to the primary Prisma database.
 * Returns the Prisma user record, or null if not authenticated.
 */
export async function syncUser() {
  const { data: session } = await auth.getSession({
    fetchOptions: {
      headers: await headers(),
    }
  });

  if (!session?.user) {
    return null;
  }

  // Upsert the user into our public schema 'user' table
  // using the ID and Email provided by Neon Auth
  const user = await prisma.user.upsert({
    where: { id: session.user.id },
    update: {
      email: session.user.email,
      name: session.user.name || session.user.email.split('@')[0],
      image: session.user.image,
      emailVerified: session.user.emailVerified,
    },
    create: {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name || session.user.email.split('@')[0],
      image: session.user.image,
      emailVerified: session.user.emailVerified,
      role: "STUDENT",
    },
  });

  return user;
}
