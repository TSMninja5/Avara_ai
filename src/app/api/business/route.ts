import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { updateAssistant } from "@/lib/vapi";
import { buildSystemPrompt } from "@/lib/prompt-builder";
import type { DayOfWeek } from "@/generated/prisma/client";

export async function GET() {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await db.user.findUnique({
    where: { clerkId },
    include: {
      businesses: {
        include: {
          businessHours: true,
          services: true,
          faqs: { orderBy: { sortOrder: "asc" } },
          phoneNumbers: true,
        },
      },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ businesses: user.businesses });
}

export async function PUT(req: Request) {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await db.user.findUnique({ where: { clerkId } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const data = await req.json();
  const { businessId, business, hours, services, faqs } = data;

  const existing = await db.business.findFirst({
    where: { id: businessId, userId: user.id },
  });
  if (!existing) {
    return NextResponse.json({ error: "Business not found" }, { status: 404 });
  }

  const updated = await db.$transaction(async (tx) => {
    const biz = await tx.business.update({
      where: { id: businessId },
      data: {
        name: business.name,
        type: business.type,
        address: business.address,
        city: business.city,
        state: business.state,
        zipCode: business.zipCode,
        timezone: business.timezone,
        website: business.website,
        greetingMessage: business.greetingMessage,
        aiPersonality: business.aiPersonality,
      },
    });

    if (hours) {
      await tx.businessHours.deleteMany({ where: { businessId } });
      await tx.businessHours.createMany({
        data: hours.map(
          (h: {
            dayOfWeek: string;
            openTime: string;
            closeTime: string;
            isClosed: boolean;
          }) => ({
            businessId,
            dayOfWeek: h.dayOfWeek as DayOfWeek,
            openTime: h.openTime,
            closeTime: h.closeTime,
            isClosed: h.isClosed,
          })
        ),
      });
    }

    if (services) {
      await tx.service.deleteMany({ where: { businessId } });
      await tx.service.createMany({
        data: services.map(
          (s: {
            name: string;
            description?: string;
            priceRange?: string;
            duration?: string;
          }) => ({
            businessId,
            name: s.name,
            description: s.description,
            priceRange: s.priceRange,
            duration: s.duration,
          })
        ),
      });
    }

    if (faqs) {
      await tx.fAQ.deleteMany({ where: { businessId } });
      await tx.fAQ.createMany({
        data: faqs.map(
          (f: { question: string; answer: string }, i: number) => ({
            businessId,
            question: f.question,
            answer: f.answer,
            sortOrder: i,
          })
        ),
      });
    }

    return tx.business.findUnique({
      where: { id: businessId },
      include: { businessHours: true, services: true, faqs: true },
    });
  });

  if (updated?.vapiAssistantId) {
    try {
      const systemPrompt = buildSystemPrompt(updated);
      await updateAssistant(updated.vapiAssistantId, {
        model: {
          provider: "google",
          model: "gemini-2.0-pro",
          messages: [{ role: "system", content: systemPrompt }],
        },
        firstMessage:
          updated.greetingMessage ||
          `Hello! Thank you for calling ${updated.name}. How can I help you today?`,
      } as Parameters<typeof updateAssistant>[1]);
    } catch (error) {
      console.error("Failed to update Vapi assistant:", error);
    }
  }

  return NextResponse.json({ business: updated });
}
