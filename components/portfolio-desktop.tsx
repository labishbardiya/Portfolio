"use client";

import Image from "next/image";
import { Maximize2, Minus, Square, X } from "lucide-react";
import { useEffect, useState } from "react";
import { DesktopRails, type DesktopPage } from "@/components/desktop-rail";
import { LiquidMetalButton } from "@/components/liquid-metal-button";
import { ProjectsGrid } from "@/components/projects-grid";
import { ResumeViewer } from "@/components/resume-viewer";
import { ContactForm } from "@/components/contact-form";
import { SocialLinks } from "@/components/social-links";
import { Timeline } from "@/components/timeline";
import { Typewriter } from "@/components/typewriter";
import { awards, experience, typewriterPhrases } from "@/data/home";
import type { Project } from "@/data/projects";

type WindowState = "open" | "minimized" | "closed";

const pageTitles: Record<DesktopPage, string> = {
  home: "labishbardiya.dev",
  projects: "projects / labishbardiya.dev",
  writing: "writing / labishbardiya.dev",
  about: "about / labishbardiya.dev",
  resume: "resume / labishbardiya.dev",
  contact: "contact / labishbardiya.dev",
};

function HomePanel({ onOpen }: { onOpen: (page: DesktopPage) => void }) {
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="hero-kicker"><span /> Builder mode: on</p>
          <SocialLinks />
          <h1>Hi, I&apos;m Labish.</h1>
          <Typewriter phrases={typewriterPhrases} />
          <LiquidMetalButton label="Open projects" onClick={() => onOpen("projects")} />
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
        <div className="dashboard-tabs"><span className="active">Build log</span><span>Proof of work</span><span>Good things happened</span></div>
        <div className="dashboard-body"><Timeline title="Experience" items={experience} /><Timeline title="Awards" items={awards} /></div>
      </section>
    </>
  );
}

function PagePanel({ page, onOpen, projects }: { page: DesktopPage; onOpen: (page: DesktopPage) => void; projects: Project[] }) {
  if (page === "home") return <HomePanel onOpen={onOpen} />;
  if (page === "projects") return <section className="desktop-page"><p className="eyebrow">Projects</p><h1>Things I&apos;ve been making.</h1><p>Some of my cool projects. You can see me talk about them on <a href="https://x.com/labishbardiya" target="_blank" rel="noreferrer">X</a>.</p><ProjectsGrid projects={projects} /></section>;
  if (page === "writing") return <section className="desktop-page"><p className="eyebrow">Writing</p><h1>Notes from the workbench.</h1><p>Essays, ideas, and things I&apos;m still figuring out. The publishing workspace will live here in the next content pass.</p></section>;
  if (page === "about") return <section className="desktop-about"><div><p className="eyebrow">About</p><h1>The person behind the tabs.</h1><p>I&apos;m Labish — a computer science student, founder, and curious builder from Jaipur. Most of my attention lives somewhere between AI research and making technology useful enough to escape a slide deck.</p><p>Right now, I&apos;m building health-tech ideas, thinking about agents that work together, and learning what it takes to turn an ambitious prototype into something people can trust.</p><LiquidMetalButton label="Open contact" onClick={() => onOpen("contact")} /></div><Image src="/profile0.png" alt="Labish Bardiya" width={1600} height={1600} /></section>;
  if (page === "resume") return <section className="desktop-page resume-page"><p className="eyebrow">Resume</p><h1>A more traditional version of me.</h1><ResumeViewer /></section>;
  return <section className="desktop-page contact-page"><p className="eyebrow">Contact</p><h1>Let&apos;s make something useful.</h1><p>Have an idea, a useful problem, or a project that needs a curious builder? Say hi.</p><ContactForm /></section>;
}

export function PortfolioDesktop({ projects }: { projects: Project[] }) {
  const [page, setPage] = useState<DesktopPage>("home");
  const [windowState, setWindowState] = useState<WindowState>("open");
  const [maximized, setMaximized] = useState(false);

  const openPage = (nextPage: DesktopPage) => {
    setPage(nextPage);
    setWindowState("open");
  };

  useEffect(() => {
    const navigate = (event: Event) => openPage((event as CustomEvent<{ page: DesktopPage }>).detail.page);
    window.addEventListener("portfolio:navigate", navigate);
    return () => window.removeEventListener("portfolio:navigate", navigate);
  }, []);

  return (
    <main className="world-shell">
      <div className="world-terrain" aria-hidden="true" />
      <DesktopRails onOpen={openPage} />

      {windowState === "closed" && <div className="desktop-launcher"><p>Portfolio desktop is closed.</p><LiquidMetalButton label="Open window" onClick={() => setWindowState("open")} /></div>}
      {windowState === "minimized" && <div className="minimized-window"><LiquidMetalButton label={`${pageTitles[page]} — restore`} onClick={() => setWindowState("open")} /></div>}

      {windowState === "open" && (
        <section className={`portfolio-window ${maximized ? "window-maximized" : ""}`} aria-label="Labish's portfolio desktop">
          <div className="window-chrome">
            <div className="window-brand"><span>LB</span> {pageTitles[page]}</div>
            <div className="window-controls">
              <button type="button" onClick={() => setWindowState("minimized")} aria-label="Minimise portfolio window" title="Minimise"><Minus size={12} /></button>
              <button type="button" onClick={() => setMaximized((value) => !value)} aria-label={maximized ? "Restore portfolio window" : "Maximise portfolio window"} title={maximized ? "Restore" : "Maximise"}>{maximized ? <Square size={11} /> : <Maximize2 size={12} />}</button>
              <button type="button" className="window-close" onClick={() => setWindowState("closed")} aria-label="Close portfolio window" title="Close"><X size={13} /></button>
            </div>
          </div>
          <div className="window-scroll">
            <div className="window-content"><PagePanel page={page} onOpen={openPage} projects={projects} /></div>
            <footer className="window-footer"><p>Want to collaborate? Check out my <a href="https://github.com/labishbardiya" target="_blank" rel="noreferrer">GitHub</a>.</p><p>Jaipur, India · 2026</p></footer>
          </div>
        </section>
      )}
    </main>
  );
}
