import { db } from "@/lib/db";
import { getOrCreateUser } from "@/lib/auth";
import { formatPhoneNumber } from "@/lib/utils";
import { Hash, CheckCircle2 } from "lucide-react";

export default async function PhoneNumbersPage() {
  const baseUser = await getOrCreateUser();

  const user = await db.user.findUnique({
    where: { id: baseUser.id },
    include: {
      businesses: {
        include: {
          phoneNumbers: true,
        },
      },
    },
  });
  if (!user) return null;

  const allNumbers = user.businesses.flatMap((b) =>
    b.phoneNumbers.map((p) => ({ ...p, businessName: b.name }))
  );

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Phone Numbers</h1>
        <p className="text-sm text-gray-500">
          Manage your AI receptionist phone numbers.
        </p>
      </div>

      {allNumbers.length === 0 ? (
        <div className="rounded-xl border bg-white p-12 text-center shadow-sm">
          <Hash className="mx-auto h-12 w-12 text-gray-300" />
          <p className="mt-4 text-sm font-medium text-gray-900">
            No phone numbers yet
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Complete onboarding to get your first number.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {allNumbers.map((phone) => (
            <div
              key={phone.id}
              className="flex items-center justify-between rounded-xl border bg-white p-5 shadow-sm"
            >
              <div>
                <p className="text-lg font-mono font-bold text-gray-900">
                  {formatPhoneNumber(phone.number)}
                </p>
                <p className="text-sm text-gray-500">
                  {phone.friendlyName || "Main Line"} &middot;{" "}
                  {phone.businessName}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {phone.isActive ? (
                  <span className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                    <CheckCircle2 className="h-3 w-3" />
                    Active
                  </span>
                ) : (
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500">
                    Inactive
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
        <p className="text-sm text-gray-500">
          Need to forward your existing business number to Aria?
        </p>
        <p className="mt-1 text-xs text-gray-400">
          On most carriers, dial *72 followed by your Aria number to
          activate call forwarding. Dial *73 to deactivate.
        </p>
      </div>
    </div>
  );
}
