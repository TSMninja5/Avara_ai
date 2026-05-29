"use client";

import type { OnboardingHours } from "@/hooks/use-onboarding";

const DAY_LABELS: Record<string, string> = {
  MONDAY: "Monday",
  TUESDAY: "Tuesday",
  WEDNESDAY: "Wednesday",
  THURSDAY: "Thursday",
  FRIDAY: "Friday",
  SATURDAY: "Saturday",
  SUNDAY: "Sunday",
};

export function StepHours({
  hours,
  onUpdate,
}: {
  hours: OnboardingHours[];
  onUpdate: (index: number, updates: Partial<OnboardingHours>) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Business Hours</h2>
        <p className="mt-1 text-sm text-gray-500">
          Set your hours of operation. The AI will tell callers when you&apos;re
          open.
        </p>
      </div>

      <div className="space-y-3">
        {hours.map((h, i) => (
          <div
            key={h.dayOfWeek}
            className="flex items-center gap-4 rounded-lg border bg-white p-3"
          >
            <span className="w-28 text-sm font-medium text-gray-700">
              {DAY_LABELS[h.dayOfWeek]}
            </span>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={!h.isClosed}
                onChange={(e) => onUpdate(i, { isClosed: !e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
              />
              Open
            </label>

            {!h.isClosed && (
              <>
                <input
                  type="time"
                  value={h.openTime}
                  onChange={(e) => onUpdate(i, { openTime: e.target.value })}
                  className="rounded-lg border border-gray-300 px-2 py-1 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
                <span className="text-sm text-gray-400">to</span>
                <input
                  type="time"
                  value={h.closeTime}
                  onChange={(e) => onUpdate(i, { closeTime: e.target.value })}
                  className="rounded-lg border border-gray-300 px-2 py-1 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </>
            )}

            {h.isClosed && (
              <span className="text-sm text-gray-400">Closed</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
