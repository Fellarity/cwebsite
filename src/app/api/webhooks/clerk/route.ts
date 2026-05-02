import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type ClerkEmailAddress = {
  id: string;
  email_address: string;
};

type ClerkUserEventData = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email_addresses: ClerkEmailAddress[];
  primary_email_address_id: string;
  image_url: string | null;
};

type ClerkWebhookEvent = {
  type: string;
  data: ClerkUserEventData;
};

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("CLERK_WEBHOOK_SECRET is not set");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  // Get the Svix headers for verification
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json(
      { error: "Missing svix headers" },
      { status: 400 }
    );
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Verify the webhook signature
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: ClerkWebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as ClerkWebhookEvent;
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  const { type, data } = evt;

  const primaryEmail = data.email_addresses?.find(
    (email) => email.id === data.primary_email_address_id
  )?.email_address;

  switch (type) {
    case "user.created":
    case "user.updated": {
      if (!primaryEmail) {
        console.error("No primary email found for user:", data.id);
        return NextResponse.json({ received: true });
      }

      const name = data.first_name
        ? `${data.first_name} ${data.last_name || ""}`.trim()
        : primaryEmail.split("@")[0];

      await prisma.user.upsert({
        where: { id: data.id },
        update: {
          email: primaryEmail,
          name,
          image: data.image_url,
        },
        create: {
          id: data.id,
          email: primaryEmail,
          name,
          image: data.image_url,
          emailVerified: true,
          role: "STUDENT",
        },
      });

      console.log(`User ${type}: ${data.id} (${primaryEmail})`);
      break;
    }

    case "user.deleted": {
      try {
        await prisma.user.delete({
          where: { id: data.id },
        });
        console.log(`User deleted: ${data.id}`);
      } catch {
        // User may not exist in our DB — that's fine
        console.log(`User ${data.id} not found in DB, skipping delete`);
      }
      break;
    }

    default:
      console.log(`Unhandled webhook event: ${type}`);
  }

  return NextResponse.json({ received: true });
}
