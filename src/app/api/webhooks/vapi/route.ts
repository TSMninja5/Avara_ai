import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendCallNotification } from "@/lib/twilio";
import { incrementUsage } from "@/lib/usage";
import type { VapiWebhookMessage } from "@/types/vapi";

export async function POST(req: Request) {
  const secret = req.headers.get("x-vapi-secret");
  if (secret !== process.env.VAPI_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body: VapiWebhookMessage = await req.json();
  const { type } = body.message;

  try {
    switch (type) {
      case "end-of-call-report":
        await handleEndOfCallReport(body);
        break;
      case "status-update":
        await handleStatusUpdate(body);
        break;
    }
  } catch (error) {
    console.error(`Vapi webhook error (${type}):`, error);
  }

  return NextResponse.json({ ok: true });
}

async function handleEndOfCallReport(body: VapiWebhookMessage) {
  const call = body.message.call;
  const artifact = body.message.artifact;
  const analysis = body.message.analysis;

  if (!call?.id) return;

  const phoneNumberId = call.phoneNumberId || call.phoneNumber?.id;
  if (!phoneNumberId) return;

  const phoneRecord = await db.phoneNumber.findUnique({
    where: { vapiPhoneId: phoneNumberId },
    include: {
      business: {
        include: {
          user: { include: { subscription: true } },
        },
      },
    },
  });

  if (!phoneRecord) {
    console.error("Phone number not found for vapiPhoneId:", phoneNumberId);
    return;
  }

  const { business } = phoneRecord;
  const { user } = business;

  const startedAt = call.startedAt ? new Date(call.startedAt) : new Date();
  const endedAt = call.endedAt ? new Date(call.endedAt) : new Date();
  const durationSeconds = Math.round(
    (endedAt.getTime() - startedAt.getTime()) / 1000
  );

  const callRecord = await db.call.upsert({
    where: { vapiCallId: call.id },
    create: {
      businessId: business.id,
      phoneNumberId: phoneRecord.id,
      vapiCallId: call.id,
      callerNumber: call.customer?.number ?? null,
      callerName: call.customer?.name ?? null,
      status: "COMPLETED",
      startedAt,
      endedAt,
      durationSeconds,
      summary: analysis?.summary ?? null,
      sentiment: analysis?.successEvaluation ?? null,
      endedReason: call.endedReason ?? null,
      recordingUrl: artifact?.recordingUrl ?? null,
      stereoRecordingUrl: artifact?.stereoRecordingUrl ?? null,
    },
    update: {
      status: "COMPLETED",
      endedAt,
      durationSeconds,
      summary: analysis?.summary ?? null,
      sentiment: analysis?.successEvaluation ?? null,
      endedReason: call.endedReason ?? null,
      recordingUrl: artifact?.recordingUrl ?? null,
      stereoRecordingUrl: artifact?.stereoRecordingUrl ?? null,
    },
  });

  if (artifact?.messages && artifact.messages.length > 0) {
    const fullText = artifact.messages
      .map((m) => `${m.role}: ${m.message}`)
      .join("\n");

    const messagesJson = JSON.parse(JSON.stringify(artifact.messages));

    await db.transcript.upsert({
      where: { callId: callRecord.id },
      create: {
        callId: callRecord.id,
        messages: messagesJson,
        fullText,
      },
      update: {
        messages: messagesJson,
        fullText,
      },
    });
  }

  if (user.subscription) {
    const durationMinutes = durationSeconds / 60;
    await incrementUsage(user.subscription.id, durationMinutes);
  }

  if (user.phone && analysis?.summary) {
    const smsSid = await sendCallNotification({
      ownerPhone: user.phone,
      businessName: business.name,
      callerNumber: call.customer?.number ?? "Unknown",
      summary: analysis.summary,
      callId: callRecord.id,
    });

    await db.call.update({
      where: { id: callRecord.id },
      data: {
        smsSentAt: smsSid ? new Date() : null,
        smsStatus: smsSid ? "sent" : "failed",
      },
    });
  }
}

async function handleStatusUpdate(body: VapiWebhookMessage) {
  const call = body.message.call;
  if (!call?.id) return;

  const status = call.status;
  if (status === "in-progress") {
    const phoneNumberId = call.phoneNumberId || call.phoneNumber?.id;
    if (!phoneNumberId) return;

    const phoneRecord = await db.phoneNumber.findUnique({
      where: { vapiPhoneId: phoneNumberId },
    });
    if (!phoneRecord) return;

    await db.call.upsert({
      where: { vapiCallId: call.id },
      create: {
        businessId: phoneRecord.businessId,
        phoneNumberId: phoneRecord.id,
        vapiCallId: call.id,
        callerNumber: call.customer?.number ?? null,
        callerName: call.customer?.name ?? null,
        status: "IN_PROGRESS",
        startedAt: call.startedAt ? new Date(call.startedAt) : new Date(),
      },
      update: {
        status: "IN_PROGRESS",
      },
    });
  }
}
