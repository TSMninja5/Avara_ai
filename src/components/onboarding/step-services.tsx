"use client";

import { Plus, Trash2 } from "lucide-react";
import type { OnboardingService } from "@/hooks/use-onboarding";

export function StepServices({
  services,
  onUpdate,
  onAdd,
  onRemove,
}: {
  services: OnboardingService[];
  onUpdate: (index: number, updates: Partial<OnboardingService>) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Services & Pricing</h2>
        <p className="mt-1 text-sm text-gray-500">
          List the services you offer. The AI will share this with callers.
        </p>
      </div>

      <div className="space-y-4">
        {services.map((service, i) => (
          <div key={i} className="rounded-lg border bg-white p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1 grid gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Service Name *
                  </label>
                  <input
                    type="text"
                    value={service.name}
                    onChange={(e) => onUpdate(i, { name: e.target.value })}
                    placeholder="e.g., Drain Cleaning"
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Price Range
                  </label>
                  <input
                    type="text"
                    value={service.priceRange}
                    onChange={(e) => onUpdate(i, { priceRange: e.target.value })}
                    placeholder="e.g., $75-$150"
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={service.duration}
                    onChange={(e) => onUpdate(i, { duration: e.target.value })}
                    placeholder="e.g., 1-2 hours"
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <input
                    type="text"
                    value={service.description}
                    onChange={(e) =>
                      onUpdate(i, { description: e.target.value })
                    }
                    placeholder="Brief description of this service"
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>
              {services.length > 1 && (
                <button
                  onClick={() => onRemove(i)}
                  className="ml-3 mt-6 text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onAdd}
        className="flex items-center gap-2 rounded-lg border border-dashed border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:border-amber-500 hover:text-amber-600"
      >
        <Plus className="h-4 w-4" />
        Add another service
      </button>
    </div>
  );
}
