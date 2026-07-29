import Image from "next/image";
import { InteractiveHoverButton } from "@/components/interactive-hover-button";

export default function AboutPage() {
  return (
    <main className="about-page page-shell">
      <div className="about-copy">
        <p className="eyebrow">About</p>
        <h1>The person behind the tabs.</h1>
        <p>I&apos;m Labish — a computer science student, founder, and curious builder from Jaipur. Most of my attention lives somewhere between AI research and making technology useful enough to escape a slide deck.</p>
        <p>Right now, I&apos;m building health-tech ideas, thinking about agents that work together, and learning what it takes to turn an ambitious prototype into something people can trust. I like generous internet corners, good questions, and projects with a little heart.</p>
        <InteractiveHoverButton href="/contact" text="Say hello" />
      </div>
      <figure className="about-photo">
        <Image src="/profile0.png" alt="Labish Bardiya" width={1600} height={1600} priority />
        <figcaption>outside, between ideas</figcaption>
      </figure>
    </main>
  );
}
