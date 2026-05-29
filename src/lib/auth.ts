import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "./db";
import { redirect } from "next/navigation";

export async function getOrCreateUser() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  let user = await db.user.findUnique({ where: { clerkId } });

  if (!user) {
    const clerkUser = await currentUser();
    if (!clerkUser) redirect("/sign-in");

    user = await db.user.create({
      data: {
        clerkId,
        email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
        firstName: clerkUser.firstName ?? null,
        lastName: clerkUser.lastName ?? null,
        phone: clerkUser.phoneNumbers?.[0]?.phoneNumber ?? null,
      },
    });
  }

  return user;
}
