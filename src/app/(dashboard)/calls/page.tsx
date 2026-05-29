import { db } from "@/lib/db";
import { getOrCreateUser } from "@/lib/auth";
import Link from "next/link";
import { formatPhoneNumber, formatDuration, getRelativeTime } from "@/lib/utils";
import { Phone, ArrowRight } from "lucide-react";

export default async function CallsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const baseUser = await getOrCreateUser();

  const user = await db.user.findUnique({
    where: { id: baseUser.id },
    include: { businesses: { select: { id: true } } },
  });
  if (!user) return null;

  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const limit = 20;
  const skip = (page - 1) * limit;
  const businessIds = user.businesses.map((b) => b.id);

  const [calls, total] = await Promise.all([
    db.call.findMany({
      where: { businessId: { in: businessIds } },
      include: {
        business: { select: { name: true } },
        phoneNumber: { select: { number: true, friendlyName: true } },
      },
      orderBy: { startedAt: "desc" },
      skip,
      take: limit,
    }),
    db.call.count({ where: { businessId: { in: businessIds } } }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Call History</h1>
        <p className="text-sm text-gray-500">{total} total calls</p>
      </div>

      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        {calls.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <Phone className="h-12 w-12 text-gray-300" />
            <p className="mt-4 text-sm font-medium text-gray-900">
              No calls yet
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Calls will appear here once customers start calling your number.
            </p>
          </div>
        ) : (
          <>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Caller
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Summary
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {calls.map((call) => (
                  <tr key={call.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">
                        {call.callerNumber
                          ? formatPhoneNumber(call.callerNumber)
                          : "Unknown"}
                      </p>
                      {call.callerName && (
                        <p className="text-xs text-gray-500">
                          {call.callerName}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="max-w-xs truncate text-sm text-gray-600">
                        {call.summary || "—"}
                      </p>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {call.durationSeconds
                        ? formatDuration(call.durationSeconds)
                        : "—"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {getRelativeTime(call.startedAt)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          call.status === "COMPLETED"
                            ? "bg-green-100 text-green-700"
                            : call.status === "IN_PROGRESS"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {call.status.replace("_", " ").toLowerCase()}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <Link
                        href={`/calls/${call.id}`}
                        className="text-amber-600 hover:text-amber-700"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t px-6 py-3">
                <p className="text-sm text-gray-500">
                  Page {page} of {totalPages}
                </p>
                <div className="flex gap-2">
                  {page > 1 && (
                    <Link
                      href={`/calls?page=${page - 1}`}
                      className="rounded-lg border px-3 py-1 text-sm hover:bg-gray-50"
                    >
                      Previous
                    </Link>
                  )}
                  {page < totalPages && (
                    <Link
                      href={`/calls?page=${page + 1}`}
                      className="rounded-lg border px-3 py-1 text-sm hover:bg-gray-50"
                    >
                      Next
                    </Link>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
