"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function StudioLogin({ initialError }: { initialError?: string }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(initialError ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function requestMagicLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    const supabase = createClient();
    const origin = window.location.origin;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // Studio is invite-only. A typo or stranger's address must never create
        // a new Auth user merely by requesting a magic link.
        shouldCreateUser: false,
        emailRedirectTo: `${origin}/auth/callback?next=/studio`,
      },
    });

    setIsSubmitting(false);
    setMessage(error ? error.message : "Magic link sent. Open it in this browser to enter Studio.");
  }

  return (
    <main className="studio-shell studio-login-shell">
      <section className="studio-login-card">
        <p className="studio-kicker">Labish Bardiya / private Studio</p>
        <h1>Run the portfolio.</h1>
        <p>Sign in with your approved email. This is separate from the public website.</p>
        <form onSubmit={requestMagicLink} className="studio-login-form">
          <label htmlFor="studio-email">Email address</label>
          <input
            id="studio-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
          />
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Sending…" : "Send magic link"}
          </button>
        </form>
        {message && <p className="studio-notice" aria-live="polite">{message}</p>}
      </section>
    </main>
  );
}
