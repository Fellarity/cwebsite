import { auth } from "./auth";
import { prisma } from "./prisma";

import { headers } from "next/headers";

/**
 * Syncs the currently authenticated Neon Auth user to the primary Prisma database.
 * Returns the Prisma user record, or null if not authenticated.
 */
export async function syncUser() {
  let session;
  try {
    const result = await auth.getSession({
      fetchOptions: {
        headers: await headers(),
      }
    });
    session = result.data;
  } catch {
    // auth.getSession() can throw "Cookies can only be modified in a Server Action or Route Handler"
    // when NeonAuth attempts session token rotation inside a Server Component.
    // Gracefully return null — the user simply won't be synced on this render.
    return null;
  }

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
