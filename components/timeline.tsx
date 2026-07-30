import type { TimelineItem } from "@/data/home";

export function Timeline({ title, items }: { title: string; items: TimelineItem[] }) {
  return (
    <section className="timeline-section" aria-labelledby={`${title.toLowerCase()}-heading`}>
      <h2 id={`${title.toLowerCase()}-heading`}>{title}</h2>
      <ol className="timeline">
        {items.map((item) => (
          <li key={`${item.title}-${item.organisation}`}>
            <p className="timeline-period">{item.period}</p>
            <div>
              <h3>{item.title}</h3>
              <p className="timeline-organisation">{item.organisation}</p>
              <p>{item.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
