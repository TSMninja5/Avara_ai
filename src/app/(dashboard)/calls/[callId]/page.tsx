import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getOrCreateUser } from "@/lib/auth";
import { formatPhoneNumber, formatDuration } from "@/lib/utils";
import Link from "next/link";
import { ArrowLeft, Phone, Clock, MessageSquare } from "lucide-react";

interface TranscriptMessage {
  role: string;
  message: string;
  time?: number;
  secondsFromStart?: number;
}

export default async function CallDetailPage({
  params,
}: {
  params: Promise<{ callId: string }>;
}) {
  const baseUser = await getOrCreateUser();

  const { callId } = await params;

  const user = await db.user.findUnique({
    where: { id: baseUser.id },
    include: { businesses: { select: { id: true } } },
  });
  if (!user) return null;

  const call = await db.call.findUnique({
    where: { id: callId },
    include: {
      business: { select: { name: true } },
      phoneNumber: { select: { number: true, friendlyName: true } },
      transcript: true,
    },
  });

  if (!call || !user.businesses.some((b) => b.id === call.businessId)) {
    notFound();
  }

  const messages: TranscriptMessage[] = call.transcript?.messages
    ? (call.transcript.messages as unknown as TranscriptMessage[])
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/calls"
          className="rounded-lg border p-2 hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Call Details</h1>
          <p className="text-sm text-gray-500">
            {call.startedAt.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Phone className="h-4 w-4" />
            Caller
          </div>
          <p className="mt-1 text-lg font-semibold text-gray-900">
            {call.callerNumber
              ? formatPhoneNumber(call.callerNumber)
              : "Unknown"}
          </p>
          {call.callerName && (
            <p className="text-sm text-gray-500">{call.callerName}</p>
          )}
        </div>

        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            Duration
          </div>
          <p className="mt-1 text-lg font-semibold text-gray-900">
            {call.durationSeconds
              ? formatDuration(call.durationSeconds)
              : "—"}
          </p>
          <p className="text-sm text-gray-500">
            {call.status.replace("_", " ").toLowerCase()}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <MessageSquare className="h-4 w-4" />
            Outcome
          </div>
          <p className="mt-1 text-lg font-semibold text-gray-900 capitalize">
            {call.sentiment?.replace("_", " ") || "—"}
          </p>
          {call.endedReason && (
            <p className="text-sm text-gray-500">{call.endedReason}</p>
          )}
        </div>
      </div>

      {call.summary && (
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Summary</h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            {call.summary}
          </p>
        </div>
      )}

      {call.recordingUrl && (
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Recording</h2>
          <audio
            controls
            src={call.recordingUrl}
            className="mt-3 w-full"
          />
        </div>
      )}

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Transcript</h2>

        {messages.length === 0 ? (
          <p className="mt-4 text-sm text-gray-500">
            No transcript available for this call.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.role === "assistant" ? "justify-start" : "justify-end"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                    msg.role === "assistant"
                      ? "bg-gray-100 text-gray-900"
                      : "bg-amber-500 text-white"
                  }`}
                >
                  <p className="text-xs font-medium opacity-70 mb-0.5">
                    {msg.role === "assistant" ? "AI" : "Caller"}
                  </p>
                  <p className="text-sm">{msg.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
