import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const maxLengths = { name: 80, email: 254, message: 1200 } as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readText(value: unknown, limit: number) {
  return typeof value === "string" ? value.trim().slice(0, limit) : "";
}

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  if (!isRecord(body)) return NextResponse.json({ message: "Invalid message." }, { status: 400 });

  // Honeypot field: quietly accept obvious bot submissions without sending mail.
  if (readText(body.website, 200)) return NextResponse.json({ ok: true });

  const name = readText(body.name, maxLengths.name);
  const email = readText(body.email, maxLengths.email);
  const message = readText(body.message, maxLengths.message);
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (name.length < 2 || message.length < 10 || !validEmail) {
    return NextResponse.json({ message: "Please add your name, a valid email, and a short message." }, { status: 400 });
  }

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, CONTACT_FROM, CONTACT_TO } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD || !CONTACT_FROM || !CONTACT_TO) {
    return NextResponse.json({ message: "Email delivery is being configured. Please use LinkedIn or X for now." }, { status: 503 });
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
  });

  try {
    await transporter.sendMail({
      from: CONTACT_FROM,
      to: CONTACT_TO,
      replyTo: `${name} <${email}>`,
      subject: `Portfolio message from ${name}`,
      text: `From: ${name}\nEmail: ${email}\n\n${message}`,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ message: "Message couldn’t be delivered just now. Please try again shortly." }, { status: 502 });
  }
}
