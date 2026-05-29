import { Webhook } from "svix";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import type { WebhookEvent } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    return new Response("Webhook secret not configured", { status: 500 });
  }

  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  if (evt.type === "user.created") {
    const { id, email_addresses, first_name, last_name, phone_numbers } =
      evt.data;

    await db.user.create({
      data: {
        clerkId: id,
        email: email_addresses[0]?.email_address ?? "",
        firstName: first_name ?? null,
        lastName: last_name ?? null,
        phone: phone_numbers?.[0]?.phone_number ?? null,
      },
    });
  }

  if (evt.type === "user.updated") {
    const { id, email_addresses, first_name, last_name, phone_numbers } =
      evt.data;

    await db.user.update({
      where: { clerkId: id },
      data: {
        email: email_addresses[0]?.email_address ?? undefined,
        firstName: first_name ?? undefined,
        lastName: last_name ?? undefined,
        phone: phone_numbers?.[0]?.phone_number ?? undefined,
      },
    });
  }

  if (evt.type === "user.deleted") {
    const { id } = evt.data;
    if (id) {
      await db.user.delete({ where: { clerkId: id } }).catch(() => {});
    }
  }

  return new Response("OK", { status: 200 });
}
