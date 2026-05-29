import { db } from "./db";
import { PLANS } from "./constants";
import type { PlanTier } from "@/generated/prisma/client";

export async function getCurrentUsage(subscriptionId: string) {
  const subscription = await db.subscription.findUnique({
    where: { id: subscriptionId },
    include: {
      usageRecords: {
        where: {
          periodStart: { lte: new Date() },
          periodEnd: { gte: new Date() },
        },
        take: 1,
      },
    },
  });

  if (!subscription) return null;

  const usage = subscription.usageRecords[0];
  const plan = PLANS[subscription.plan];

  return {
    minutesUsed: usage?.minutesUsed ?? 0,
    callCount: usage?.callCount ?? 0,
    maxMinutes: plan.maxMinutes,
    overageMinutes: usage?.overageMinutes ?? 0,
    overageCost: usage?.overageCost ?? 0,
    percentUsed: usage ? (usage.minutesUsed / plan.maxMinutes) * 100 : 0,
  };
}

export async function incrementUsage(
  subscriptionId: string,
  callDurationMinutes: number
) {
  const subscription = await db.subscription.findUnique({
    where: { id: subscriptionId },
  });

  if (!subscription) return;

  const plan = PLANS[subscription.plan as PlanTier];

  const usage = await db.usageRecord.upsert({
    where: {
      subscriptionId_periodStart: {
        subscriptionId,
        periodStart: subscription.currentPeriodStart,
      },
    },
    create: {
      subscriptionId,
      periodStart: subscription.currentPeriodStart,
      periodEnd: subscription.currentPeriodEnd,
      minutesUsed: callDurationMinutes,
      callCount: 1,
    },
    update: {
      minutesUsed: { increment: callDurationMinutes },
      callCount: { increment: 1 },
    },
  });

  if (usage.minutesUsed > plan.maxMinutes) {
    const overageMinutes = usage.minutesUsed - plan.maxMinutes;
    await db.usageRecord.update({
      where: { id: usage.id },
      data: {
        overageMinutes,
        overageCost: overageMinutes * plan.overageRate,
      },
    });
  }

  return usage;
}

export function getBillingPeriod() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  return { start, end };
}
