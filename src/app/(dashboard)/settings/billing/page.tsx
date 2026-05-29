import { db } from "@/lib/db";
import { getOrCreateUser } from "@/lib/auth";
import { getCurrentUsage } from "@/lib/usage";
import { PLANS } from "@/lib/constants";
import { CreditCard, TrendingUp, AlertCircle } from "lucide-react";
import type { PlanTier } from "@/generated/prisma/client";

export default async function BillingPage() {
  const baseUser = await getOrCreateUser();

  const user = await db.user.findUnique({
    where: { id: baseUser.id },
    include: { subscription: true },
  });
  if (!user) return null;

  const subscription = user.subscription;
  const plan = subscription
    ? PLANS[subscription.plan as PlanTier]
    : PLANS.STARTER;
  const usage = subscription
    ? await getCurrentUsage(subscription.id)
    : null;

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Billing</h1>
        <p className="text-sm text-gray-500">
          Manage your plan and view usage.
        </p>
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-amber-500" />
              <h2 className="text-lg font-semibold text-gray-900">
                {plan.name} Plan
              </h2>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              ${plan.price}/month &middot; {plan.maxPhoneNumbers} phone{" "}
              {plan.maxPhoneNumbers === 1 ? "number" : "numbers"} &middot;{" "}
              {plan.maxMinutes} minutes
            </p>
          </div>
          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
            {subscription?.status || "Active"}
          </span>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-amber-500" />
          <h2 className="text-lg font-semibold text-gray-900">
            Usage This Period
          </h2>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Minutes Used</span>
              <span className="font-medium">
                {Math.round(usage?.minutesUsed ?? 0)} /{" "}
                {usage?.maxMinutes ?? plan.maxMinutes} min
              </span>
            </div>
            <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className={`h-full rounded-full transition-all ${
                  (usage?.percentUsed ?? 0) > 90
                    ? "bg-red-500"
                    : (usage?.percentUsed ?? 0) > 75
                      ? "bg-yellow-500"
                      : "bg-amber-500"
                }`}
                style={{
                  width: `${Math.min(usage?.percentUsed ?? 0, 100)}%`,
                }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Total Calls</span>
            <span className="font-medium">{usage?.callCount ?? 0}</span>
          </div>

          {(usage?.overageMinutes ?? 0) > 0 && (
            <div className="flex items-start gap-2 rounded-lg bg-yellow-50 p-3">
              <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-yellow-800">
                  Overage: {Math.round(usage?.overageMinutes ?? 0)} minutes
                </p>
                <p className="text-yellow-700">
                  Additional charge: $
                  {(usage?.overageCost ?? 0).toFixed(2)} at $
                  {plan.overageRate}/min
                </p>
              </div>
            </div>
          )}
        </div>

        {subscription && (
          <p className="mt-4 text-xs text-gray-400">
            Current period:{" "}
            {subscription.currentPeriodStart.toLocaleDateString()} &ndash;{" "}
            {subscription.currentPeriodEnd.toLocaleDateString()}
          </p>
        )}
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Upgrade Plan
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {(Object.entries(PLANS) as [PlanTier, (typeof PLANS)[PlanTier]][]).map(
            ([tier, tierPlan]) => (
              <div
                key={tier}
                className={`rounded-lg border p-4 ${
                  subscription?.plan === tier
                    ? "border-amber-500 bg-amber-50"
                    : "border-gray-200"
                }`}
              >
                <h3 className="font-semibold">{tierPlan.name}</h3>
                <p className="text-2xl font-bold mt-1">
                  ${tierPlan.price}
                  <span className="text-sm font-normal text-gray-500">
                    /mo
                  </span>
                </p>
                <ul className="mt-3 space-y-1 text-xs text-gray-600">
                  <li>
                    {tierPlan.maxPhoneNumbers} phone number
                    {tierPlan.maxPhoneNumbers > 1 ? "s" : ""}
                  </li>
                  <li>{tierPlan.maxMinutes} min/month</li>
                </ul>
                {subscription?.plan === tier ? (
                  <p className="mt-3 text-xs font-medium text-amber-600">
                    Current plan
                  </p>
                ) : (
                  <button
                    disabled
                    className="mt-3 w-full rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-500 cursor-not-allowed"
                  >
                    Coming soon
                  </button>
                )}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
