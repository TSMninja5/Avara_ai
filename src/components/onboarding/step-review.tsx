"use client";

import { formatTime24to12 } from "@/lib/utils";
import type { OnboardingState } from "@/hooks/use-onboarding";

const DAY_LABELS: Record<string, string> = {
  MONDAY: "Mon",
  TUESDAY: "Tue",
  WEDNESDAY: "Wed",
  THURSDAY: "Thu",
  FRIDAY: "Fri",
  SATURDAY: "Sat",
  SUNDAY: "Sun",
};

export function StepReview({ data }: { data: OnboardingState }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Review & Launch</h2>
        <p className="mt-1 text-sm text-gray-500">
          Review your setup before launching your AI receptionist.
        </p>
      </div>

      <div className="space-y-4">
        <div className="rounded-lg border bg-white p-4">
          <h3 className="text-sm font-semibold text-gray-900">Business Info</h3>
          <div className="mt-2 grid gap-1 text-sm text-gray-600">
            <p>
              <span className="font-medium">Name:</span> {data.business.name}
            </p>
            <p>
              <span className="font-medium">Type:</span> {data.business.type}
            </p>
            {data.business.city && (
              <p>
                <span className="font-medium">Location:</span>{" "}
                {[data.business.city, data.business.state]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            )}
          </div>
        </div>

        <div className="rounded-lg border bg-white p-4">
          <h3 className="text-sm font-semibold text-gray-900">Hours</h3>
          <div className="mt-2 grid gap-1 text-sm text-gray-600">
            {data.hours.map((h) => (
              <p key={h.dayOfWeek}>
                <span className="inline-block w-10 font-medium">
                  {DAY_LABELS[h.dayOfWeek]}
                </span>
                {h.isClosed
                  ? "Closed"
                  : `${formatTime24to12(h.openTime)} - ${formatTime24to12(h.closeTime)}`}
              </p>
            ))}
          </div>
        </div>

        <div className="rounded-lg border bg-white p-4">
          <h3 className="text-sm font-semibold text-gray-900">
            Services ({data.services.filter((s) => s.name).length})
          </h3>
          <div className="mt-2 space-y-1 text-sm text-gray-600">
            {data.services
              .filter((s) => s.name)
              .map((s, i) => (
                <p key={i}>
                  {s.name}
                  {s.priceRange && ` — ${s.priceRange}`}
                </p>
              ))}
          </div>
        </div>

        <div className="rounded-lg border bg-white p-4">
          <h3 className="text-sm font-semibold text-gray-900">
            FAQs ({data.faqs.filter((f) => f.question).length})
          </h3>
          <div className="mt-2 space-y-2 text-sm text-gray-600">
            {data.faqs
              .filter((f) => f.question)
              .map((f, i) => (
                <div key={i}>
                  <p className="font-medium">{f.question}</p>
                  <p className="text-gray-500">{f.answer}</p>
                </div>
              ))}
          </div>
        </div>

        <div className="rounded-lg border bg-white p-4">
          <h3 className="text-sm font-semibold text-gray-900">AI Settings</h3>
          <div className="mt-2 grid gap-1 text-sm text-gray-600">
            <p>
              <span className="font-medium">Personality:</span>{" "}
              {data.business.aiPersonality || "Professional"}
            </p>
            {data.ownerPhone && (
              <p>
                <span className="font-medium">SMS notifications:</span>{" "}
                {data.ownerPhone}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
