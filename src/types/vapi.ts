export interface VapiAssistantConfig {
  name: string;
  model: {
    provider: string;
    model: string;
    messages: Array<{ role: string; content: string }>;
    temperature?: number;
  };
  transcriber: {
    provider: string;
    model: string;
    language: string;
  };
  voice: {
    provider: string;
    voiceId: string;
    stability?: number;
    similarityBoost?: number;
  };
  firstMessage: string;
  endCallMessage?: string;
  serverUrl: string;
  serverUrlSecret?: string;
  analysisPlan?: {
    summaryPrompt?: string;
    successEvaluationPrompt?: string;
  };
}

export interface VapiPhoneNumberConfig {
  provider: string;
  assistantId: string;
  name?: string;
  serverUrl: string;
  serverUrlSecret?: string;
}

export interface VapiAssistantResponse {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface VapiPhoneNumberResponse {
  id: string;
  number: string;
  provider: string;
  createdAt: string;
}

export interface VapiWebhookMessage {
  message: {
    type: string;
    call?: VapiCallPayload;
    artifact?: VapiArtifact;
    analysis?: VapiAnalysis;
    [key: string]: unknown;
  };
}

export interface VapiCallPayload {
  id: string;
  orgId: string;
  type: string;
  status: string;
  phoneNumberId?: string;
  phoneNumber?: {
    id: string;
    number: string;
  };
  customer?: {
    number?: string;
    name?: string;
  };
  startedAt?: string;
  endedAt?: string;
  endedReason?: string;
  cost?: number;
}

export interface VapiArtifact {
  messages?: VapiTranscriptMessage[];
  recordingUrl?: string;
  stereoRecordingUrl?: string;
}

export interface VapiTranscriptMessage {
  role: string;
  message: string;
  time: number;
  endTime?: number;
  secondsFromStart?: number;
}

export interface VapiAnalysis {
  summary?: string;
  successEvaluation?: string;
  structuredData?: Record<string, unknown>;
}
