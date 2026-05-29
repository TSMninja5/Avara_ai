"use client";

import type { OnboardingBusinessInfo } from "@/hooks/use-onboarding";

const PERSONALITIES = [
  {
    value: "professional",
    label: "Professional",
    desc: "Formal and business-appropriate",
  },
  {
    value: "friendly",
    label: "Friendly",
    desc: "Warm and conversational",
  },
  {
    value: "casual",
    label: "Casual",
    desc: "Relaxed and approachable",
  },
];

export function StepGreeting({
  data,
  ownerPhone,
  onChange,
  onPhoneChange,
}: {
  data: OnboardingBusinessInfo;
  ownerPhone: string;
  onChange: (updates: Partial<OnboardingBusinessInfo>) => void;
  onPhoneChange: (phone: string) => void;
}) {
  const defaultGreeting = `Hello! Thank you for calling ${data.name || "our business"}. How can I help you today?`;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Greeting & Notifications
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Customize how your AI receptionist greets callers and where to send
          notifications.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Custom Greeting
          </label>
          <textarea
            value={data.greetingMessage}
            onChange={(e) => onChange({ greetingMessage: e.target.value })}
            rows={3}
            placeholder={defaultGreeting}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
          <p className="mt-1 text-xs text-gray-400">
            Leave blank to use the default greeting.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            AI Personality
          </label>
          <div className="grid gap-3 sm:grid-cols-3">
            {PERSONALITIES.map((p) => (
              <button
                key={p.value}
                onClick={() => onChange({ aiPersonality: p.value })}
                className={`rounded-lg border p-3 text-left transition-colors ${
                  data.aiPersonality === p.value
                    ? "border-amber-500 bg-amber-50 ring-1 ring-amber-500"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <span className="block text-sm font-medium">{p.label}</span>
                <span className="block text-xs text-gray-500">{p.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Your Phone Number (for SMS notifications)
          </label>
          <input
            type="tel"
            value={ownerPhone}
            onChange={(e) => onPhoneChange(e.target.value)}
            placeholder="+1 (555) 123-4567"
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
          <p className="mt-1 text-xs text-gray-400">
            We&apos;ll text you a summary after every call.
          </p>
        </div>
      </div>
    </div>
  );
}
