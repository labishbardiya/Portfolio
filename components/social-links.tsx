import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faInstagram,
  faLinkedinIn,
  faXTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";

const socialLinks = [
  { label: "LinkedIn", href: "https://linkedin.com/in/labishbardiya", icon: faLinkedinIn },
  { label: "X", href: "https://x.com/labishbardiya", icon: faXTwitter },
  { label: "GitHub", href: "https://github.com/labishbardiya", icon: faGithub },
  { label: "YouTube", href: "https://youtube.com/@Labishbardiya", icon: faYoutube },
  { label: "Instagram", href: "https://www.instagram.com/labish.bardiya/", icon: faInstagram },
];

export function SocialLinks() {
  return (
    <ul className="social-links" aria-label="Labish's social profiles">
      {socialLinks.map(({ label, href, icon }) => (
        <li key={label}>
          <a href={href} target="_blank" rel="noreferrer" aria-label={label} title={label}>
            <FontAwesomeIcon icon={icon} />
          </a>
        </li>
      ))}
    </ul>
  );
}
