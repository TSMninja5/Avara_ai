"use client";

import { Plus, Trash2 } from "lucide-react";
import type { OnboardingFAQ } from "@/hooks/use-onboarding";

export function StepFAQs({
  faqs,
  onUpdate,
  onAdd,
  onRemove,
}: {
  faqs: OnboardingFAQ[];
  onUpdate: (index: number, updates: Partial<OnboardingFAQ>) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Frequently Asked Questions
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Add common questions callers ask. The AI will use these to answer
          automatically.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <div key={i} className="rounded-lg border bg-white p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Question
                  </label>
                  <input
                    type="text"
                    value={faq.question}
                    onChange={(e) => onUpdate(i, { question: e.target.value })}
                    placeholder="e.g., Do you offer emergency services?"
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Answer
                  </label>
                  <textarea
                    value={faq.answer}
                    onChange={(e) => onUpdate(i, { answer: e.target.value })}
                    rows={2}
                    placeholder="e.g., Yes, we offer 24/7 emergency services."
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>
              <button
                onClick={() => onRemove(i)}
                className="ml-3 mt-6 text-gray-400 hover:text-red-500"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}

        {faqs.length === 0 && (
          <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
            No FAQs added yet. Click below to add one.
          </div>
        )}
      </div>

      <button
        onClick={onAdd}
        className="flex items-center gap-2 rounded-lg border border-dashed border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:border-amber-500 hover:text-amber-600"
      >
        <Plus className="h-4 w-4" />
        Add a question
      </button>
    </div>
  );
}
