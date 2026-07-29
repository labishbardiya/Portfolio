import { SocialLinks } from "@/components/social-links";
import { Timeline } from "@/components/timeline";
import { Typewriter } from "@/components/typewriter";
import { awards, draftTypewriterPhrases, experience } from "@/data/home";

export default function HomePage() {
  return (
    <main>
      <section className="hero page-shell">
        <SocialLinks />
        <h1>Hi, I&apos;m Labish.</h1>
        <Typewriter phrases={draftTypewriterPhrases} />
      </section>

      <section className="timeline-grid page-shell" aria-label="Experience and awards">
        <Timeline title="Experience" items={experience} />
        <Timeline title="Awards" items={awards} />
      </section>

      <footer className="site-footer page-shell">
        <p>
          Want to collaborate? Check out my{" "}
          <a href="https://github.com/labishbardiya" target="_blank" rel="noreferrer">
            GitHub
          </a>
          .
        </p>
      </footer>
    </main>
  );
}
