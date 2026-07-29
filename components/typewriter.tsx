"use client";

import { useEffect, useState } from "react";

type TypewriterProps = {
  phrases: readonly string[];
};

const TYPING_DELAY = 48;
const DELETING_DELAY = 26;
const HOLD_DELAY = 1450;

export function Typewriter({ phrases }: TypewriterProps) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [visibleText, setVisibleText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const phrase = phrases[phraseIndex];
    const complete = visibleText === phrase;
    const empty = visibleText.length === 0;
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
  }, [deleting, phraseIndex, phrases, visibleText]);

  return (
    <p className="typewriter" aria-label={phrases[phraseIndex]}>
      {visibleText}
      <span className="typewriter-caret" aria-hidden="true" />
    </p>
  );
}
