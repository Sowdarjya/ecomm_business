import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  // Skip execution during build time
  if (
    process.env.NODE_ENV === "production" &&
    process.env.VERCEL_ENV === undefined
  ) {
    return new Response("Build time skip", { status: 200 });
  }

  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("WEBHOOK_SECRET is not defined");
    return new Response("Webhook secret not configured", {
      status: 500,
    });
  }

  let headerPayload;
  try {
    headerPayload = await headers();
  } catch (error) {
    console.error("Error getting headers:", error);
    return new Response("Error processing headers", { status: 400 });
  }

  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occurred -- no svix headers", {
      status: 400,
    });
  }

  let payload;
  try {
    payload = await req.json();
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return new Response("Invalid JSON payload", { status: 400 });
  }

  const body = JSON.stringify(payload);
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occurred during verification", {
      status: 400,
    });
  }

  const eventType = evt.type;

  if (eventType === "user.created") {
    try {
      // Additional safety check for database connection
      if (!prisma) {
        throw new Error("Database connection not available");
      }

      await prisma.user.create({
        data: {
          clerkId: evt.data.id,
          email: evt.data.email_addresses[0]?.email_address || "",
          fullName: `${evt.data.first_name || ""} ${
            evt.data.last_name || ""
          }`.trim(),
          avatarUrl: evt.data.image_url,
        },
      });

      return new Response("User has been created!", { status: 200 });
    } catch (err) {
      console.error("Error creating user:", err);
      return new Response("Failed to create the user!", { status: 500 });
    }
  }

  if (eventType === "user.updated") {
    try {
      // Additional safety check for database connection
      if (!prisma) {
        throw new Error("Database connection not available");
      }

      await prisma.user.update({
        where: {
          clerkId: evt.data.id, // Use clerkId instead of id
        },
        data: {
          fullName: `${evt.data.first_name || ""} ${
            evt.data.last_name || ""
          }`.trim(),
          avatarUrl: evt.data.image_url,
          email: evt.data.email_addresses[0]?.email_address || undefined,
        },
      });

      return new Response("User has been updated!", { status: 200 });
    } catch (err) {
      console.error("Error updating user:", err);
      return new Response("Failed to update the user!", { status: 500 });
    }
  }

  return new Response("Webhook received", { status: 200 });
}
