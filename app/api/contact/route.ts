import { NextResponse } from "next/server";
import { Resend } from "resend";

// Resend's shared onboarding@resend.dev sender can only deliver to the address
// the account is registered under, so everything goes to one inbox for now.
// Once a domain is verified, set CONTACT_TO to the full founder list.
const to = process.env.CONTACT_TO?.split(",")
  .map((s) => s.trim())
  .filter(Boolean) ?? ["jack.krebsbach@colorado.edu"];
const from = process.env.CONTACT_FROM ?? "BCS Contact Form <onboarding@resend.dev>";

export async function POST(req: Request) {
  const { name, email, company, message } = await req.json();

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json(
      { error: "Name, email, and message are required." },
      { status: 400 }
    );
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: email,
    subject: `New inquiry — ${name}${company?.trim() ? ` · ${company.trim()}` : ""}`,
    text: `Name: ${name}
Email: ${email}
Company: ${company?.trim() || "—"}

${message}`,
  });

  if (error) {
    console.error("[contact] resend:", error);
    return NextResponse.json(
      { error: "Could not send right now. Please email us directly." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
