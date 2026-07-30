"use client";

import { useEffect, useState } from "react";

type TypewriterProps = {
  phrases: readonly string[];
};

// Separate timings keep the motion readable while giving the completed phrase a moment to land.
const TYPING_DELAY = 90;
const DELETING_DELAY = 26;
const HOLD_DELAY = 1450;

export function Typewriter({ phrases }: TypewriterProps) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [visibleText, setVisibleText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);

    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const phrase = phrases[phraseIndex];
    const complete = visibleText === phrase;
    const empty = visibleText.length === 0;
    // Pause only after a phrase has fully appeared; otherwise type or erase one character at a time.
    const delay = complete && !deleting ? HOLD_DELAY : deleting ? DELETING_DELAY : TYPING_DELAY;

    const timeout = window.setTimeout(() => {
      if (complete && !deleting) {
        setDeleting(true);
      } else if (empty && deleting) {
        setDeleting(false);
        setPhraseIndex((current) => (current + 1) % phrases.length);
      } else {
        setVisibleText((current) =>
          deleting ? current.slice(0, -1) : phrase.slice(0, current.length + 1),
        );
      }
    }, delay);

    return () => window.clearTimeout(timeout);
  }, [deleting, phraseIndex, phrases, prefersReducedMotion, visibleText]);

  const displayedText = prefersReducedMotion ? (phrases[0] ?? "") : visibleText;
  const accessibleText = prefersReducedMotion ? (phrases[0] ?? "") : phrases[phraseIndex];

  return (
    <p className="typewriter" aria-label={accessibleText}>
      {displayedText}
      <span className="typewriter-caret" aria-hidden="true" />
    </p>
  );
}
