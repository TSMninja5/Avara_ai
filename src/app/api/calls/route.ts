import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await db.user.findUnique({
    where: { clerkId },
    include: { businesses: { select: { id: true } } },
  });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "20");
  const skip = (page - 1) * limit;

  const businessIds = user.businesses.map((b) => b.id);

  const [calls, total] = await Promise.all([
    db.call.findMany({
      where: { businessId: { in: businessIds } },
      include: {
        phoneNumber: { select: { number: true, friendlyName: true } },
        business: { select: { name: true } },
      },
      orderBy: { startedAt: "desc" },
      skip,
      take: limit,
    }),
    db.call.count({ where: { businessId: { in: businessIds } } }),
  ]);

  return NextResponse.json({
    calls,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}
