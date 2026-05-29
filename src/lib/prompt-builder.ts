import { formatTime24to12 } from "./utils";

interface BusinessData {
  name: string;
  type: string;
  city?: string | null;
  state?: string | null;
  address?: string | null;
  aiPersonality?: string | null;
  businessHours: Array<{
    dayOfWeek: string;
    openTime: string;
    closeTime: string;
    isClosed: boolean;
  }>;
  services: Array<{
    name: string;
    description?: string | null;
    priceRange?: string | null;
    duration?: string | null;
  }>;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

const DAY_ORDER = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

export function buildSystemPrompt(business: BusinessData): string {
  const personality = business.aiPersonality || "professional";
  const location = [business.city, business.state].filter(Boolean).join(", ");

  const sections: string[] = [];

  sections.push(
    `## Identity
You are a helpful, ${personality} phone receptionist for ${business.name}, a ${business.type.toLowerCase()} business${location ? ` located in ${location}` : ""}.`
  );

  if (business.businessHours.length > 0) {
    const sorted = [...business.businessHours].sort(
      (a, b) => DAY_ORDER.indexOf(a.dayOfWeek) - DAY_ORDER.indexOf(b.dayOfWeek)
    );

    const hoursLines = sorted.map((h) => {
      const day = h.dayOfWeek.charAt(0) + h.dayOfWeek.slice(1).toLowerCase();
      if (h.isClosed) return `- ${day}: Closed`;
      return `- ${day}: ${formatTime24to12(h.openTime)} - ${formatTime24to12(h.closeTime)}`;
    });

    sections.push(`## Business Hours\n${hoursLines.join("\n")}`);
  }

  if (business.services.length > 0) {
    const serviceLines = business.services.map((s) => {
      let line = `- ${s.name}`;
      if (s.priceRange) line += ` (${s.priceRange})`;
      if (s.duration) line += ` — typically ${s.duration}`;
      if (s.description) line += `\n  ${s.description}`;
      return line;
    });

    sections.push(`## Services Offered\n${serviceLines.join("\n")}`);
  }

  if (business.faqs.length > 0) {
    const faqLines = business.faqs.map(
      (f) => `Q: ${f.question}\nA: ${f.answer}`
    );
    sections.push(`## Frequently Asked Questions\n${faqLines.join("\n\n")}`);
  }

  sections.push(`## Instructions
- Answer questions about business hours, services, and pricing using the information above.
- If asked about something not covered above, politely say you'll have someone from ${business.name} follow up.
- If the caller wants to schedule an appointment, take their name, phone number, preferred date/time, and what service they need. Let them know someone will confirm the appointment.
- If the caller has an emergency, express urgency and let them know you're flagging it for immediate attention.
- Be concise. This is a phone call, not a chat. Keep responses under 2-3 sentences.
- Never make up information. If you don't know something, say so.
- If the caller is abusive, calmly end the call.
- Always be warm and represent ${business.name} professionally.`);

  return sections.join("\n\n");
}
