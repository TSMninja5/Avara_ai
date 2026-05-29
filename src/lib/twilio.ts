import twilio from "twilio";

function getClient() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (!accountSid || !authToken) {
    throw new Error("Twilio credentials not configured");
  }

  return twilio(accountSid, authToken);
}

export async function sendCallNotification(params: {
  ownerPhone: string;
  businessName: string;
  callerNumber: string;
  summary: string;
  callId: string;
}): Promise<string | null> {
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;
  if (!fromNumber) {
    console.error("TWILIO_PHONE_NUMBER not configured");
    return null;
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const body = [
    `📞 ${params.businessName} Call Summary`,
    `From: ${params.callerNumber}`,
    `Summary: ${params.summary}`,
    `View details: ${appUrl}/calls/${params.callId}`,
  ].join("\n");

  try {
    const client = getClient();
    const message = await client.messages.create({
      body,
      from: fromNumber,
      to: params.ownerPhone,
    });
    return message.sid;
  } catch (error) {
    console.error("Failed to send SMS notification:", error);
    return null;
  }
}
