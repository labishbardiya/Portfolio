export type ProjectLink = {
  label: string;
  href: string;
};

export type Project = {
  number: string;
  name: string;
  stage: string;
  description: string;
  tags: string[];
  links: ProjectLink[];
  coverUrl?: string | null;
};

// Kept deliberately short: these are the projects with a public home or source
// that someone can inspect today. More detail belongs in individual case studies.
export const projects: Project[] = [
  {
    number: "01",
    name: "Bruxlix",
    stage: "Building",
    description:
      "A patent-pending ML wearable for detecting sleep bruxism at home.",
    tags: ["Healthtech", "ML", "Wearables"],
    links: [
      { label: "Code", href: "https://github.com/labishbardiya/Bruxlix" },
      { label: "Live", href: "https://bruxlix.vercel.app" },
    ],
  },
  {
    number: "02",
    name: "CureNet",
    stage: "Researching",
    description:
      "Offline-first clinical intelligence that turns handwritten records into FHIR R4 data.",
    tags: ["Healthtech", "Edge AI", "FHIR R4"],
    links: [{ label: "Code", href: "https://github.com/labishbardiya/CureNet" }],
  },
  {
    number: "03",
    name: "LeverageAI",
    stage: "Shipped",
    description:
      "An AI negotiator for high-stakes services: parallel quotes, honest evidence, clearer decisions.",
    tags: ["Voice AI", "Agents", "Negotiation"],
    links: [
      { label: "Code", href: "https://github.com/labishbardiya/LeverageAI" },
      { label: "Live", href: "https://leverageai-tawny.vercel.app" },
    ],
  },
  {
    number: "04",
    name: "Hackotomate",
    stage: "Shipped",
    description:
      "An AI-powered web aggregator that discovers hackathons from public directories.",
    tags: ["Agents", "Research", "Automation"],
    links: [{ label: "Code", href: "https://github.com/labishbardiya/hackotomate" }],
  },
];
