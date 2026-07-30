import { InteractiveHoverButton } from "@/components/interactive-hover-button";
import { SocialLinks } from "@/components/social-links";
import { Timeline } from "@/components/timeline";
import { Typewriter } from "@/components/typewriter";
import type { HomeContent } from "@/data/home";

/**
 * The homepage is intentionally direct: each navigation item has a real URL
 * instead of being a screen inside a simulated desktop window.
 */
export function PortfolioHome({ home }: { home: HomeContent }) {
  return (
    <main className="portfolio-home">
      <div className="portfolio-home-inner">
        <section className="hero">
          <div className="hero-copy">
            <SocialLinks links={home.socialLinks} />
            <h1>Hi, I&apos;m Labish.</h1>
            <Typewriter phrases={home.typewriterPhrases} />
            <InteractiveHoverButton href="/projects" text="See projects" />
          </div>
        </section>

        <section className="portfolio-timeline" aria-label="Experience and awards">
          <div className="timeline-grid"><Timeline title="Experience" items={home.experience} /><Timeline title="Awards" items={home.awards} /></div>
        </section>
      </div>
      <footer className="site-footer"><p>Want to collaborate? Check out my <a href="https://github.com/labishbardiya" target="_blank" rel="noreferrer">GitHub</a>.</p><p>Jaipur, India · 2026</p></footer>
    </main>
  );
}
