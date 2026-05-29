"use client";

import { useRouter } from "next/navigation";
import { useOnboarding } from "@/hooks/use-onboarding";
import { StepBusinessInfo } from "@/components/onboarding/step-business-info";
import { StepHours } from "@/components/onboarding/step-hours";
import { StepServices } from "@/components/onboarding/step-services";
import { StepFAQs } from "@/components/onboarding/step-faqs";
import { StepGreeting } from "@/components/onboarding/step-greeting";
import { StepReview } from "@/components/onboarding/step-review";
import { cn } from "@/lib/utils";
import { Loader2, CheckCircle2, Phone } from "lucide-react";

const STEP_LABELS = [
  "Business Info",
  "Hours",
  "Services",
  "FAQs",
  "Greeting",
  "Review",
];

export default function OnboardingPage() {
  const router = useRouter();
  const {
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
  } = useOnboarding();

  if (result) {
    return (
      <div className="w-full max-w-lg text-center">
        <div className="rounded-xl border bg-white p-8 shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">
            Your AI Receptionist is Live!
          </h2>
          <div className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-gray-50 p-4">
            <Phone className="h-5 w-5 text-amber-500" />
            <span className="text-lg font-mono font-bold text-gray-900">
              {result.phoneNumber}
            </span>
          </div>
          <p className="mt-4 text-sm text-gray-600">
            Call this number to test your AI receptionist. Set up call forwarding
            from your business line to start handling customer calls.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="mt-6 w-full rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-600 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const canProceed = () => {
    switch (step) {
      case 0:
        return data.business.name.trim() && data.business.type;
      case 1:
        return true;
      case 2:
        return data.services.some((s) => s.name.trim());
      default:
        return true;
    }
  };

  return (
    <div className="w-full max-w-2xl">
      <div className="mb-8 flex items-center justify-center gap-2">
        {STEP_LABELS.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium",
                i < step
                  ? "bg-amber-500 text-white"
                  : i === step
                    ? "border-2 border-amber-500 text-amber-600"
                    : "border border-gray-300 text-gray-400"
              )}
            >
              {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
            </div>
            <span
              className={cn(
                "hidden text-xs sm:block",
                i === step ? "font-medium text-gray-900" : "text-gray-400"
              )}
            >
              {label}
            </span>
            {i < totalSteps - 1 && (
              <div
                className={cn(
                  "h-px w-6",
                  i < step ? "bg-amber-500" : "bg-gray-200"
                )}
              />
            )}
          </div>
        ))}
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        {step === 0 && (
          <StepBusinessInfo data={data.business} onChange={updateBusiness} />
        )}
        {step === 1 && <StepHours hours={data.hours} onUpdate={updateHours} />}
        {step === 2 && (
          <StepServices
            services={data.services}
            onUpdate={updateService}
            onAdd={addService}
            onRemove={removeService}
          />
        )}
        {step === 3 && (
          <StepFAQs
            faqs={data.faqs}
            onUpdate={updateFAQ}
            onAdd={addFAQ}
            onRemove={removeFAQ}
          />
        )}
        {step === 4 && (
          <StepGreeting
            data={data.business}
            ownerPhone={data.ownerPhone}
            onChange={updateBusiness}
            onPhoneChange={(phone) =>
              setData((prev) => ({ ...prev, ownerPhone: phone }))
            }
          />
        )}
        {step === 5 && <StepReview data={data} />}

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={back}
            disabled={step === 0}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              step === 0
                ? "invisible"
                : "text-gray-600 hover:bg-gray-100"
            )}
          >
            Back
          </button>

          {step < totalSteps - 1 ? (
            <button
              onClick={next}
              disabled={!canProceed()}
              className="rounded-lg bg-amber-500 px-6 py-2 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={submit}
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-lg bg-amber-500 px-6 py-2 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-50 transition-colors"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSubmitting ? "Setting up..." : "Launch My AI Receptionist"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
