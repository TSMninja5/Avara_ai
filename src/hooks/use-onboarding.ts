"use client";

import { useState } from "react";
import { DEFAULT_BUSINESS_HOURS, FAQ_TEMPLATES } from "@/lib/constants";

export interface OnboardingBusinessInfo {
  name: string;
  type: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  timezone: string;
  website: string;
  greetingMessage: string;
  aiPersonality: string;
}

export interface OnboardingHours {
  dayOfWeek: string;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
}

export interface OnboardingService {
  name: string;
  description: string;
  priceRange: string;
  duration: string;
}

export interface OnboardingFAQ {
  question: string;
  answer: string;
}

export interface OnboardingState {
  business: OnboardingBusinessInfo;
  hours: OnboardingHours[];
  services: OnboardingService[];
  faqs: OnboardingFAQ[];
  ownerPhone: string;
}

const initialState: OnboardingState = {
  business: {
    name: "",
    type: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    website: "",
    greetingMessage: "",
    aiPersonality: "professional",
  },
  hours: DEFAULT_BUSINESS_HOURS.map((h) => ({ ...h })),
  services: [{ name: "", description: "", priceRange: "", duration: "" }],
  faqs: [],
  ownerPhone: "",
};

export function useOnboarding() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    phoneNumber: string;
    businessId: string;
  } | null>(null);

  const totalSteps = 6;

  function updateBusiness(updates: Partial<OnboardingBusinessInfo>) {
    setData((prev) => ({
      ...prev,
      business: { ...prev.business, ...updates },
    }));

    if (updates.type && prev_faqs_empty()) {
      const templates =
        FAQ_TEMPLATES[updates.type] || FAQ_TEMPLATES.default;
      setData((prev) => ({
        ...prev,
        faqs: templates.map((f) => ({ ...f })),
      }));
    }
  }

  function prev_faqs_empty() {
    return (
      data.faqs.length === 0 ||
      data.faqs.every((f) => !f.question && !f.answer)
    );
  }

  function updateHours(index: number, updates: Partial<OnboardingHours>) {
    setData((prev) => ({
      ...prev,
      hours: prev.hours.map((h, i) =>
        i === index ? { ...h, ...updates } : h
      ),
    }));
  }

  function addService() {
    setData((prev) => ({
      ...prev,
      services: [
        ...prev.services,
        { name: "", description: "", priceRange: "", duration: "" },
      ],
    }));
  }

  function updateService(index: number, updates: Partial<OnboardingService>) {
    setData((prev) => ({
      ...prev,
      services: prev.services.map((s, i) =>
        i === index ? { ...s, ...updates } : s
      ),
    }));
  }

  function removeService(index: number) {
    setData((prev) => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index),
    }));
  }

  function addFAQ() {
    setData((prev) => ({
      ...prev,
      faqs: [...prev.faqs, { question: "", answer: "" }],
    }));
  }

  function updateFAQ(index: number, updates: Partial<OnboardingFAQ>) {
    setData((prev) => ({
      ...prev,
      faqs: prev.faqs.map((f, i) =>
        i === index ? { ...f, ...updates } : f
      ),
    }));
  }

  function removeFAQ(index: number) {
    setData((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index),
    }));
  }

  function next() {
    if (step < totalSteps - 1) setStep((s) => s + 1);
  }

  function back() {
    if (step > 0) setStep((s) => s - 1);
  }

  async function submit() {
    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        business: data.business,
        hours: data.hours,
        services: data.services.filter((s) => s.name.trim()),
        faqs: data.faqs.filter((f) => f.question.trim() && f.answer.trim()),
        ownerPhone: data.ownerPhone || undefined,
      };

      const res = await fetch("/api/onboarding/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Something went wrong");
      }

      const result = await res.json();
      setResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    step,
    totalSteps,
    data,
    isSubmitting,
    error,
    result,
    updateBusiness,
    updateHours,
    addService,
    updateService,
    removeService,
    addFAQ,
    updateFAQ,
    removeFAQ,
    setData,
    next,
    back,
    submit,
  };
}
