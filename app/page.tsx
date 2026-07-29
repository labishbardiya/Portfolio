import { DesktopRails } from "@/components/desktop-rail";
import { InteractiveHoverButton } from "@/components/interactive-hover-button";
import { SocialLinks } from "@/components/social-links";
import { Timeline } from "@/components/timeline";
import { Typewriter } from "@/components/typewriter";
import { awards, experience, typewriterPhrases } from "@/data/home";

export default function HomePage() {
  return (
    <main className="world-shell">
      <div className="world-terrain" aria-hidden="true" />
      <DesktopRails />
      <section className="portfolio-window" aria-label="Labish's portfolio dashboard">
        <div className="window-chrome">
          <div className="window-brand"><span>LB</span> labishbardiya.dev</div>
          <div className="window-controls" aria-hidden="true"><i /><i /><i /></div>
        </div>
        <div className="window-content">
          <section className="hero">
            <div className="hero-copy">
              <p className="hero-kicker"><span /> Builder mode: on</p>
              <SocialLinks />
              <h1>Hi, I&apos;m Labish.</h1>
              <Typewriter phrases={typewriterPhrases} />
              <InteractiveHoverButton href="/projects" text="See projects" />
            </div>
            <aside className="status-card" aria-label="Current focus">
              <div className="status-card-title"><span>now.exe</span><span>● live</span></div>
              <div className="status-grid">
                <p><b>01</b><span>Building products that leave the lab.</span></p>
                <p><b>02</b><span>Researching agents that work together.</span></p>
                <p><b>03</b><span>Learning loudly, making carefully.</span></p>
              </div>
              <p className="status-caption">open tabs / code · care · curiosity</p>
            </aside>
          </section>

          <section className="portfolio-dashboard" aria-label="Experience and awards">
            <div className="dashboard-tabs">
              <span className="active">Build log</span>
              <span>Proof of work</span>
              <span>Good things happened</span>
            </div>
            <div className="dashboard-body">
              <Timeline title="Experience" items={experience} />
              <Timeline title="Awards" items={awards} />
            </div>
          </section>
        </div>
        <footer className="window-footer">
          <p>Want to collaborate? Check out my <a href="https://github.com/labishbardiya" target="_blank" rel="noreferrer">GitHub</a>.</p>
          <p>Jaipur, India · 2026</p>
        </footer>
      </section>
    </main>
  );
}
