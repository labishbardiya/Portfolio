export type TimelineItem = {
  period: string;
  title: string;
  organisation: string;
  description: string;
};

export type SocialLink = {
  label: "LinkedIn" | "X" | "GitHub" | "YouTube" | "Instagram";
  href: string;
};

export type HomeContent = {
  typewriterPhrases: string[];
  experience: TimelineItem[];
  awards: TimelineItem[];
  socialLinks: SocialLink[];
  currentFocus: { items: string[]; caption: string };
};

export const typewriterPhrases = [
  "Curious by default, building by instinct.",
  "Thinking in systems, building with heart.",
  "Finding the human side of technology.",
  "Turning research into things people can use.",
  "Chasing ideas worth making real.",
  "Somewhere between code, care, and curiosity.",
  "Learning in public, making things real.",
] satisfies string[];

export const experience: TimelineItem[] = [
  {
    period: "Now",
    title: "Founder & CEO",
    organisation: "Bruxlix",
    description: "Building a patent-pending ML wearable for at-home sleep bruxism detection.",
  },
  {
    period: "Now",
    title: "Research Intern",
    organisation: "STRIDE Lab · University of South Carolina",
    description: "Exploring agentic AI and multi-agent reinforcement learning.",
  },
  {
    period: "2025",
    title: "Inventor in Residence",
    organisation: "InventX · IIT Gandhinagar",
    description: "Prototyping, validating, and taking early ideas seriously.",
  },
  {
    period: "2025",
    title: "Website Developer",
    organisation: "HackJKLU v4.0",
    description: "Led a 10-person team building the event’s digital experience.",
  },
];

export const awards: TimelineItem[] = [
  {
    period: "2026",
    title: "1st Place",
    organisation: "SDG Innovation Challenge · MUJ",
    description: "Recognised for Bruxlix’s potential SDG 3 impact.",
  },
  {
    period: "2025",
    title: "Special Jury Award",
    organisation: "InventX · IIT Gandhinagar",
    description: "For turning a difficult health problem into a real prototype.",
  },
  {
    period: "2025",
    title: "ISRO Challenge Finalist",
    organisation: "Immersion Startup Challenge",
    description: "Selected among 16 innovators nationwide.",
  },
  {
    period: "2025",
    title: "Samsung ISWDP Fellow",
    organisation: "Cohort 5",
    description: "Selected from more than 3,000 applicants.",
  },
];

export const socialLinks: SocialLink[] = [
  { label: "LinkedIn", href: "https://linkedin.com/in/labishbardiya" },
  { label: "X", href: "https://x.com/labishbardiya" },
  { label: "GitHub", href: "https://github.com/labishbardiya" },
  { label: "YouTube", href: "https://youtube.com/@Labishbardiya" },
  { label: "Instagram", href: "https://www.instagram.com/labish.bardiya/" },
];

export const defaultHomeContent: HomeContent = {
  typewriterPhrases,
  experience,
  awards,
  socialLinks,
  currentFocus: {
    items: [
      "Building products that leave the lab.",
      "Researching agents that work together.",
      "Learning loudly, making carefully.",
    ],
    caption: "open tabs / code · care · curiosity",
  },
};
