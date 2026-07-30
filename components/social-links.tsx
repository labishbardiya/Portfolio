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
  return (
    <ul className="social-links" aria-label="Labish's social profiles">
      {links.map(({ label, href }) => (
        <li key={label}>
          <a href={href} target="_blank" rel="noreferrer" aria-label={label} title={label}>
            <FontAwesomeIcon icon={icons[label]} />
          </a>
        </li>
      ))}
    </ul>
  );
}
