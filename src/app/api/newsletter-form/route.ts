import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, honeypot, formDuration } = await req.json();

  // Honeypot anti-bot
  if (honeypot && typeof honeypot === "string" && honeypot.trim().length > 0) {
    return NextResponse.json({ message: "Form submitted successfully!" }, { status: 200 });
  }

  // Tempo mínimo de preenchimento
  if (typeof formDuration === "number" && formDuration < 2000) {
    return NextResponse.json({ message: "Form submitted successfully!" }, { status: 200 });
  }

  // Validação básica
  if (!email) {
    return NextResponse.json({ error: "Email é obrigatório." }, { status: 400 });
  }

  try {
    const rdResponse = await fetch(`https://api.rd.services/platform/conversions?api_key=${process.env.RD_API_ACCESS_TOKEN}`, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event_type: "CONVERSION",
        event_family: "CDP",
        payload: {
          conversion_identifier: "newsletter",
          email: email,
        },
      }),
    });

    if (!rdResponse.ok) {
      throw new Error("Failed to send data to RD Station.");
    }

    return NextResponse.json({ message: "Form submitted successfully!" }, { status: 200 });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ error: "Error sending data to RD Station." }, { status: 500 });
  }
}
