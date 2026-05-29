import type {
  VapiAssistantConfig,
  VapiAssistantResponse,
  VapiPhoneNumberResponse,
} from "@/types/vapi";

const VAPI_BASE_URL = "https://api.vapi.ai";

function getHeaders() {
  return {
    Authorization: `Bearer ${process.env.VAPI_API_KEY}`,
    "Content-Type": "application/json",
  };
}

async function vapiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${VAPI_BASE_URL}${path}`, {
    ...options,
    headers: { ...getHeaders(), ...options.headers },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Vapi API error (${res.status}): ${body}`);
  }

  return res.json();
}

export async function createAssistant(
  config: VapiAssistantConfig
): Promise<VapiAssistantResponse> {
  return vapiRequest<VapiAssistantResponse>("/assistant", {
    method: "POST",
    body: JSON.stringify(config),
  });
}

export async function updateAssistant(
  assistantId: string,
  updates: Partial<VapiAssistantConfig>
): Promise<VapiAssistantResponse> {
  return vapiRequest<VapiAssistantResponse>(`/assistant/${assistantId}`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  });
}

export async function deleteAssistant(
  assistantId: string
): Promise<void> {
  await vapiRequest(`/assistant/${assistantId}`, { method: "DELETE" });
}

export async function createPhoneNumber(config: {
  provider?: string;
  assistantId: string;
  name?: string;
  serverUrl?: string;
  serverUrlSecret?: string;
}): Promise<VapiPhoneNumberResponse> {
  return vapiRequest<VapiPhoneNumberResponse>("/phone-number", {
    method: "POST",
    body: JSON.stringify({
      provider: config.provider || "vapi",
      assistantId: config.assistantId,
      name: config.name,
      serverUrl: config.serverUrl,
      serverUrlSecret: config.serverUrlSecret,
    }),
  });
}

export async function deletePhoneNumber(
  phoneId: string
): Promise<void> {
  await vapiRequest(`/phone-number/${phoneId}`, { method: "DELETE" });
}

export async function listPhoneNumbers(): Promise<VapiPhoneNumberResponse[]> {
  return vapiRequest<VapiPhoneNumberResponse[]>("/phone-number");
}

export function buildAssistantConfig(business: {
  name: string;
  type: string;
  greetingMessage?: string | null;
  aiPersonality?: string | null;
  systemPrompt: string;
}): VapiAssistantConfig {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return {
    name: `${business.name} - Aria`,
    model: {
      provider: "google",
      model: "gemini-2.0-pro",
      messages: [{ role: "system", content: business.systemPrompt }],
      temperature: 0.7,
    },
    transcriber: {
      provider: "google",
      model: "latest_long",
      language: "en-US",
    },
    voice: {
      provider: "11labs",
      voiceId: "21m00Tcm4TlvDq8ikWAM",
      stability: 0.5,
      similarityBoost: 0.75,
    },
    firstMessage:
      business.greetingMessage ||
      `Hello! Thank you for calling ${business.name}. How can I help you today?`,
    endCallMessage: "Thank you for calling. Have a great day!",
    serverUrl: `${appUrl}/api/webhooks/vapi`,
    serverUrlSecret: process.env.VAPI_WEBHOOK_SECRET,
    analysisPlan: {
      summaryPrompt:
        "Summarize this phone call in 2-3 sentences. Include what the caller needed, what information was provided, and any follow-up actions required.",
      successEvaluationPrompt:
        "Evaluate whether the AI successfully helped the caller. Rate as: successful, partially_successful, or unsuccessful.",
    },
  };
}
