import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getOrCreateUser } from "@/lib/auth";
import { getCurrentUsage } from "@/lib/usage";
import { Phone, Clock, TrendingUp, Voicemail } from "lucide-react";
import { formatDuration, getRelativeTime, formatPhoneNumber } from "@/lib/utils";
import Link from "next/link";

export default async function DashboardPage() {
  const baseUser = await getOrCreateUser();
  if (!baseUser.onboardingDone) redirect("/onboarding");

  const user = await db.user.findUnique({
    where: { id: baseUser.id },
    include: {
      businesses: { select: { id: true, name: true } },
      subscription: true,
    },
  });

  if (!user) redirect("/sign-in");

  const businessIds = user.businesses.map((b) => b.id);

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(startOfDay);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [callsToday, callsWeek, callsMonth, recentCalls] = await Promise.all([
    db.call.count({
      where: {
        businessId: { in: businessIds },
        startedAt: { gte: startOfDay },
        status: "COMPLETED",
      },
    }),
    db.call.count({
      where: {
        businessId: { in: businessIds },
        startedAt: { gte: startOfWeek },
        status: "COMPLETED",
      },
    }),
    db.call.count({
      where: {
        businessId: { in: businessIds },
        startedAt: { gte: startOfMonth },
        status: "COMPLETED",
      },
    }),
    db.call.findMany({
      where: { businessId: { in: businessIds } },
      include: {
        business: { select: { name: true } },
        phoneNumber: { select: { number: true } },
      },
      orderBy: { startedAt: "desc" },
      take: 5,
    }),
  ]);

  const usage = user.subscription
    ? await getCurrentUsage(user.subscription.id)
    : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">
          Welcome back{user.firstName ? `, ${user.firstName}` : ""}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Calls Today"
          value={callsToday}
          icon={<Phone className="h-5 w-5" />}
        />
        <StatCard
          label="Calls This Week"
          value={callsWeek}
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <StatCard
          label="Calls This Month"
          value={callsMonth}
          icon={<Voicemail className="h-5 w-5" />}
        />
        <StatCard
          label="Minutes Used"
          value={
            usage
              ? `${Math.round(usage.minutesUsed)} / ${usage.maxMinutes}`
              : "0 / 200"
          }
          icon={<Clock className="h-5 w-5" />}
          progress={usage ? usage.percentUsed : 0}
        />
      </div>

      <div className="rounded-xl border bg-white shadow-sm">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Calls</h2>
          <Link
            href="/calls"
            className="text-sm font-medium text-amber-600 hover:text-amber-700"
          >
            View all
          </Link>
        </div>

        {recentCalls.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-500">
            No calls yet. Test your AI by calling your phone number!
          </div>
        ) : (
          <div className="divide-y">
            {recentCalls.map((call) => (
              <Link
                key={call.id}
                href={`/calls/${call.id}`}
                className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {call.callerNumber
                      ? formatPhoneNumber(call.callerNumber)
                      : "Unknown Caller"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {call.summary || "No summary available"}
                  </p>
                </div>
                <div className="ml-4 text-right shrink-0">
                  <p className="text-xs text-gray-500">
                    {getRelativeTime(call.startedAt)}
                  </p>
                  {call.durationSeconds && (
                    <p className="text-xs text-gray-400">
                      {formatDuration(call.durationSeconds)}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  progress,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  progress?: number;
}) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500">{label}</span>
        <span className="text-amber-500">{icon}</span>
      </div>
      <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
      {progress !== undefined && (
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-amber-500 transition-all"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      )}
    </div>
  );
}
