import { NextResponse } from "next/server";
import { Resend } from "resend";
import * as welcome from "./welcome";

const to = process.env.CONTACT_TO?.split(",")
  .map((s) => s.trim())
  .filter(Boolean) ?? ["jack@bocompsol.com"];
const from = process.env.CONTACT_FROM ?? "Boulder Computational Solutions <hello@mail.bocompsol.com>";

export async function POST(req: Request) {
  const { name, email, company, message } = await req.json();

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json(
      { error: "Name, email, and message are required." },
      { status: 400 }
    );
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const { error } = await resend.batch.send([
    {
      from,
      to,
      replyTo: email,
      subject: `New inquiry — ${name}${company?.trim() ? ` · ${company.trim()}` : ""}`,
      text: `Name: ${name}
Email: ${email}
Company: ${company?.trim() || "—"}

${message}`,
    },
    {
      from,
      to: email,
      replyTo: to,
      subject: welcome.subject,
      html: welcome.html,
      text: welcome.text,
    },
  ]);

  if (error) {
    console.error("[contact] resend:", error);
    return NextResponse.json(
      { error: "Could not send right now. Please email us directly." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
