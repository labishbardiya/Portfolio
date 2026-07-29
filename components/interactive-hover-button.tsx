import Link from "next/link";
import { ArrowRight } from "lucide-react";

type InteractiveHoverButtonProps = {
  href: string;
  text: string;
  className?: string;
};

// Adapted from the interaction pattern supplied by Labish, with Link semantics for site navigation.
export function InteractiveHoverButton({ href, text, className = "" }: InteractiveHoverButtonProps) {
  return (
    <Link href={href} className={`interactive-hover-button ${className}`}>
      <span className="button-label">{text}</span>
      <span className="button-hover-label" aria-hidden="true">
        {text}
        <ArrowRight size={16} strokeWidth={2.5} />
      </span>
      <span className="button-orb" aria-hidden="true" />
    </Link>
  );
}
