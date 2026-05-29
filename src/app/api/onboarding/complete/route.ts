import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import {
  createAssistant,
  createPhoneNumber,
  buildAssistantConfig,
  deleteAssistant,
} from "@/lib/vapi";
import { buildSystemPrompt } from "@/lib/prompt-builder";
import { getBillingPeriod } from "@/lib/usage";
import { PLANS } from "@/lib/constants";
import type { DayOfWeek } from "@/generated/prisma/client";

interface OnboardingData {
  business: {
    name: string;
    type: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    timezone?: string;
    website?: string;
    greetingMessage?: string;
    aiPersonality?: string;
  };
  hours: Array<{
    dayOfWeek: string;
    openTime: string;
    closeTime: string;
    isClosed: boolean;
  }>;
  services: Array<{
    name: string;
    description?: string;
    priceRange?: string;
    duration?: string;
  }>;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  ownerPhone?: string;
}

export async function POST(req: Request) {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let user = await db.user.findUnique({ where: { clerkId } });
  if (!user) {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
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

  const data: OnboardingData = await req.json();

  let vapiAssistantId: string | null = null;

  try {
    const business = await db.business.create({
      data: {
        userId: user.id,
        name: data.business.name,
        type: data.business.type,
        address: data.business.address,
        city: data.business.city,
        state: data.business.state,
        zipCode: data.business.zipCode,
        timezone: data.business.timezone || "America/New_York",
        website: data.business.website,
        greetingMessage: data.business.greetingMessage,
        aiPersonality: data.business.aiPersonality || "professional",
        businessHours: {
          create: data.hours.map((h) => ({
            dayOfWeek: h.dayOfWeek as DayOfWeek,
            openTime: h.openTime,
            closeTime: h.closeTime,
            isClosed: h.isClosed,
          })),
        },
        services: {
          create: data.services.map((s) => ({
            name: s.name,
            description: s.description,
            priceRange: s.priceRange,
            duration: s.duration,
          })),
        },
        faqs: {
          create: data.faqs.map((f, i) => ({
            question: f.question,
            answer: f.answer,
            sortOrder: i,
          })),
        },
      },
      include: {
        businessHours: true,
        services: true,
        faqs: true,
      },
    });

    const systemPrompt = buildSystemPrompt(business);
    const assistantConfig = buildAssistantConfig({
      ...business,
      systemPrompt,
    });

    const assistant = await createAssistant(assistantConfig);
    vapiAssistantId = assistant.id;

    await db.business.update({
      where: { id: business.id },
      data: { vapiAssistantId: assistant.id },
    });

    const phoneNumber = await createPhoneNumber({
      assistantId: assistant.id,
      name: `${business.name} - Main Line`,
      serverUrl: assistantConfig.serverUrl,
      serverUrlSecret: assistantConfig.serverUrlSecret,
    });

    await db.phoneNumber.create({
      data: {
        businessId: business.id,
        number: phoneNumber.number,
        vapiPhoneId: phoneNumber.id,
        friendlyName: "Main Line",
      },
    });

    const { start, end } = getBillingPeriod();
    const plan = PLANS.STARTER;

    await db.subscription.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        plan: "STARTER",
        status: "ACTIVE",
        maxPhoneNumbers: plan.maxPhoneNumbers,
        maxMinutes: plan.maxMinutes,
        overageRate: plan.overageRate,
        currentPeriodStart: start,
        currentPeriodEnd: end,
        usageRecords: {
          create: {
            periodStart: start,
            periodEnd: end,
          },
        },
      },
      update: {},
    });

    if (data.ownerPhone) {
      await db.user.update({
        where: { id: user.id },
        data: { phone: data.ownerPhone },
      });
    }

    await db.user.update({
      where: { id: user.id },
      data: { onboardingDone: true },
    });

    return NextResponse.json({
      success: true,
      phoneNumber: phoneNumber.number,
      businessId: business.id,
    });
  } catch (error) {
    if (vapiAssistantId) {
      await deleteAssistant(vapiAssistantId).catch(() => {});
    }

    console.error("Onboarding error:", error);
    return NextResponse.json(
      { error: "Failed to complete onboarding. Please try again." },
      { status: 500 }
    );
  }
}
