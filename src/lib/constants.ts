export const PLANS = {
  STARTER: {
    name: "Starter",
    price: 49,
    maxPhoneNumbers: 1,
    maxMinutes: 200,
    overageRate: 0.15,
  },
  GROWTH: {
    name: "Growth",
    price: 99,
    maxPhoneNumbers: 3,
    maxMinutes: 500,
    overageRate: 0.15,
  },
  AGENCY: {
    name: "Agency",
    price: 199,
    maxPhoneNumbers: 10,
    maxMinutes: 2000,
    overageRate: 0.15,
  },
} as const;

export const BUSINESS_TYPES = [
  "Plumber",
  "Electrician",
  "HVAC",
  "Dentist",
  "Lawyer",
  "Real Estate Agent",
  "General Contractor",
  "Auto Mechanic",
  "Veterinarian",
  "Chiropractor",
  "Salon / Barber",
  "Landscaping",
  "Pest Control",
  "Cleaning Service",
  "Other",
] as const;

export const DEFAULT_BUSINESS_HOURS = [
  { dayOfWeek: "MONDAY" as const, openTime: "09:00", closeTime: "17:00", isClosed: false },
  { dayOfWeek: "TUESDAY" as const, openTime: "09:00", closeTime: "17:00", isClosed: false },
  { dayOfWeek: "WEDNESDAY" as const, openTime: "09:00", closeTime: "17:00", isClosed: false },
  { dayOfWeek: "THURSDAY" as const, openTime: "09:00", closeTime: "17:00", isClosed: false },
  { dayOfWeek: "FRIDAY" as const, openTime: "09:00", closeTime: "17:00", isClosed: false },
  { dayOfWeek: "SATURDAY" as const, openTime: "10:00", closeTime: "14:00", isClosed: true },
  { dayOfWeek: "SUNDAY" as const, openTime: "10:00", closeTime: "14:00", isClosed: true },
];

export const FAQ_TEMPLATES: Record<string, Array<{ question: string; answer: string }>> = {
  Plumber: [
    { question: "Do you offer emergency services?", answer: "Yes, we offer 24/7 emergency plumbing services." },
    { question: "Do you provide free estimates?", answer: "Yes, we provide free estimates for all plumbing work." },
    { question: "What areas do you serve?", answer: "We serve the greater metro area. Please call for details." },
  ],
  Dentist: [
    { question: "Do you accept insurance?", answer: "Yes, we accept most major dental insurance plans." },
    { question: "Do you offer emergency dental care?", answer: "Yes, we offer same-day emergency appointments when available." },
    { question: "What are your payment options?", answer: "We accept cash, credit cards, and offer payment plans." },
  ],
  Lawyer: [
    { question: "Do you offer free consultations?", answer: "Yes, we offer a free initial consultation." },
    { question: "What areas of law do you practice?", answer: "Please ask about our specific practice areas." },
    { question: "How are your fees structured?", answer: "Our fee structure depends on the type of case. We discuss fees during the initial consultation." },
  ],
  default: [
    { question: "What are your hours of operation?", answer: "Please refer to our business hours for availability." },
    { question: "Do you offer free estimates?", answer: "Please call to discuss pricing and estimates." },
    { question: "What areas do you serve?", answer: "Please call for information about our service area." },
  ],
};
