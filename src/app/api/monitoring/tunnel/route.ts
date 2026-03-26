import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const envelope = await req.text();

    const glitchtipUrl = process.env.GLITCHTIP_ENVELOPE_ENDPOINT || "http://localhost:8000";

    const response = await fetch(glitchtipUrl, {
      method: "POST",
      body: envelope,
      headers: {
        "Content-Type": "application/x-sentry-envelope",
        Accept: "*/*",
      },
    });

    return NextResponse.json({ sent: response.ok });
  } catch (e) {
    console.error("GlitchTip tunnel error:", e);
    return NextResponse.json({ error: "Tunnel failed" }, { status: 500 });
  }
}
