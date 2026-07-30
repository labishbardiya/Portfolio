"use client";

import { FormEvent, useState } from "react";
import { Send } from "lucide-react";

type FormStatus = "idle" | "sending" | "sent" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");

    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form));

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json() as { message?: string };

      if (!response.ok) throw new Error(result.message ?? "Something went wrong.");

      form.reset();
      setStatus("sent");
      setMessage("Message received. I’ll get back to you soon.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <form className="contact-form" onSubmit={submit}>
      <div className="contact-form-grid">
        <label>
          Your name
          <input name="name" required minLength={2} maxLength={80} autoComplete="name" />
        </label>
        <label>
          Email
          <input name="email" type="email" required maxLength={254} autoComplete="email" />
        </label>
      </div>
      <label>
        What&apos;s on your mind?
        <textarea name="message" required minLength={10} maxLength={1200} rows={6} />
      </label>
      <label className="contact-honeypot" aria-hidden="true">
        Website
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <div className="contact-submit-row">
        <button type="submit" disabled={status === "sending"}>
          <Send size={15} aria-hidden="true" /> {status === "sending" ? "Sending…" : "Send message"}
        </button>
        <p className={`contact-message contact-message-${status}`} aria-live="polite">{message}</p>
      </div>
    </form>
  );
}
