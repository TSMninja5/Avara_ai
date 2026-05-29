"use client";

import { useState, useEffect, useCallback } from "react";
import { BUSINESS_TYPES } from "@/lib/constants";
import { Loader2, Save, Plus, Trash2 } from "lucide-react";

interface BusinessData {
  id: string;
  name: string;
  type: string;
  address: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  timezone: string;
  website: string | null;
  greetingMessage: string | null;
  aiPersonality: string | null;
  businessHours: Array<{
    dayOfWeek: string;
    openTime: string;
    closeTime: string;
    isClosed: boolean;
  }>;
  services: Array<{
    name: string;
    description: string | null;
    priceRange: string | null;
    duration: string | null;
  }>;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

const DAY_LABELS: Record<string, string> = {
  MONDAY: "Monday",
  TUESDAY: "Tuesday",
  WEDNESDAY: "Wednesday",
  THURSDAY: "Thursday",
  FRIDAY: "Friday",
  SATURDAY: "Saturday",
  SUNDAY: "Sunday",
};

export default function SettingsPage() {
  const [business, setBusiness] = useState<BusinessData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const fetchBusiness = useCallback(async () => {
    const res = await fetch("/api/business");
    const data = await res.json();
    if (data.businesses?.[0]) {
      setBusiness(data.businesses[0]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchBusiness();
  }, [fetchBusiness]);

  async function handleSave() {
    if (!business) return;
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/business", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId: business.id,
          business: {
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
          hours: business.businessHours,
          services: business.services,
          faqs: business.faqs,
        }),
      });

      if (res.ok) {
        setMessage("Settings saved. AI receptionist updated.");
      } else {
        setMessage("Failed to save. Please try again.");
      }
    } catch {
      setMessage("An error occurred.");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!business) {
    return (
      <div className="text-center py-12 text-gray-500">
        No business found. Please complete onboarding.
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500">
            Changes are synced to your AI receptionist automatically.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-50 transition-colors"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save Changes
        </button>
      </div>

      {message && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-700">
          {message}
        </div>
      )}

      <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Business Information
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Business Name
            </label>
            <input
              type="text"
              value={business.name}
              onChange={(e) =>
                setBusiness({ ...business, name: e.target.value })
              }
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Business Type
            </label>
            <select
              value={business.type}
              onChange={(e) =>
                setBusiness({ ...business, type: e.target.value })
              }
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              {BUSINESS_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              City
            </label>
            <input
              type="text"
              value={business.city || ""}
              onChange={(e) =>
                setBusiness({ ...business, city: e.target.value })
              }
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Business Hours</h2>
        <div className="space-y-2">
          {business.businessHours.map((h, i) => (
            <div
              key={h.dayOfWeek}
              className="flex items-center gap-4 rounded-lg border p-3"
            >
              <span className="w-24 text-sm font-medium">
                {DAY_LABELS[h.dayOfWeek]}
              </span>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={!h.isClosed}
                  onChange={(e) => {
                    const hours = [...business.businessHours];
                    hours[i] = { ...hours[i], isClosed: !e.target.checked };
                    setBusiness({ ...business, businessHours: hours });
                  }}
                  className="h-4 w-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                />
                Open
              </label>
              {!h.isClosed && (
                <>
                  <input
                    type="time"
                    value={h.openTime}
                    onChange={(e) => {
                      const hours = [...business.businessHours];
                      hours[i] = { ...hours[i], openTime: e.target.value };
                      setBusiness({ ...business, businessHours: hours });
                    }}
                    className="rounded border px-2 py-1 text-sm"
                  />
                  <span className="text-sm text-gray-400">to</span>
                  <input
                    type="time"
                    value={h.closeTime}
                    onChange={(e) => {
                      const hours = [...business.businessHours];
                      hours[i] = { ...hours[i], closeTime: e.target.value };
                      setBusiness({ ...business, businessHours: hours });
                    }}
                    className="rounded border px-2 py-1 text-sm"
                  />
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Services</h2>
          <button
            onClick={() =>
              setBusiness({
                ...business,
                services: [
                  ...business.services,
                  { name: "", description: null, priceRange: null, duration: null },
                ],
              })
            }
            className="flex items-center gap-1 text-sm text-amber-600 hover:text-amber-700"
          >
            <Plus className="h-4 w-4" /> Add
          </button>
        </div>
        {business.services.map((s, i) => (
          <div key={i} className="flex gap-3 items-start">
            <div className="flex-1 grid gap-2 sm:grid-cols-3">
              <input
                type="text"
                value={s.name}
                onChange={(e) => {
                  const services = [...business.services];
                  services[i] = { ...services[i], name: e.target.value };
                  setBusiness({ ...business, services });
                }}
                placeholder="Service name"
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <input
                type="text"
                value={s.priceRange || ""}
                onChange={(e) => {
                  const services = [...business.services];
                  services[i] = { ...services[i], priceRange: e.target.value };
                  setBusiness({ ...business, services });
                }}
                placeholder="Price range"
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <input
                type="text"
                value={s.duration || ""}
                onChange={(e) => {
                  const services = [...business.services];
                  services[i] = { ...services[i], duration: e.target.value };
                  setBusiness({ ...business, services });
                }}
                placeholder="Duration"
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
            <button
              onClick={() => {
                const services = business.services.filter((_, j) => j !== i);
                setBusiness({ ...business, services });
              }}
              className="mt-2 text-gray-400 hover:text-red-500"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">FAQs</h2>
          <button
            onClick={() =>
              setBusiness({
                ...business,
                faqs: [...business.faqs, { question: "", answer: "" }],
              })
            }
            className="flex items-center gap-1 text-sm text-amber-600 hover:text-amber-700"
          >
            <Plus className="h-4 w-4" /> Add
          </button>
        </div>
        {business.faqs.map((f, i) => (
          <div key={i} className="flex gap-3 items-start">
            <div className="flex-1 space-y-2">
              <input
                type="text"
                value={f.question}
                onChange={(e) => {
                  const faqs = [...business.faqs];
                  faqs[i] = { ...faqs[i], question: e.target.value };
                  setBusiness({ ...business, faqs });
                }}
                placeholder="Question"
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <textarea
                value={f.answer}
                onChange={(e) => {
                  const faqs = [...business.faqs];
                  faqs[i] = { ...faqs[i], answer: e.target.value };
                  setBusiness({ ...business, faqs });
                }}
                rows={2}
                placeholder="Answer"
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
            <button
              onClick={() => {
                const faqs = business.faqs.filter((_, j) => j !== i);
                setBusiness({ ...business, faqs });
              }}
              className="mt-2 text-gray-400 hover:text-red-500"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">AI Settings</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Custom Greeting
          </label>
          <textarea
            value={business.greetingMessage || ""}
            onChange={(e) =>
              setBusiness({ ...business, greetingMessage: e.target.value })
            }
            rows={3}
            placeholder={`Hello! Thank you for calling ${business.name}. How can I help you today?`}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>
      </div>
    </div>
  );
}
