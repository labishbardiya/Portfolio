"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faInstagram,
  faLinkedinIn,
  faXTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import type { SocialLink } from "@/data/home";

const icons = {
  LinkedIn: faLinkedinIn,
  X: faXTwitter,
  GitHub: faGithub,
  YouTube: faYoutube,
  Instagram: faInstagram,
};

export function SocialLinks({ links }: { links: SocialLink[] }) {
  function moveIcon(event: React.PointerEvent<HTMLAnchorElement>) {
    const target = event.currentTarget;
    const bounds = target.getBoundingClientRect();
    const magnetX = (event.clientX - bounds.left - bounds.width / 2) * 0.16;
    const magnetY = (event.clientY - bounds.top - bounds.height / 2) * 0.16;
    target.style.setProperty("--magnet-x", `${magnetX}px`);
    target.style.setProperty("--magnet-y", `${magnetY}px`);
  }

  function resetIcon(event: React.PointerEvent<HTMLAnchorElement>) {
    event.currentTarget.style.setProperty("--magnet-x", "0px");
    event.currentTarget.style.setProperty("--magnet-y", "0px");
  }

  return (
    <ul className="social-links" aria-label="Labish's social profiles">
      {links.map(({ label, href }) => (
        <li key={label}>
          <a href={href} target="_blank" rel="noreferrer" aria-label={label} title={label} onPointerMove={moveIcon} onPointerLeave={resetIcon}>
            <FontAwesomeIcon icon={icons[label]} />
          </a>
        </li>
      ))}
    </ul>
  );
}
