export function ExternalPostLink({ href }: { href: string | null }) {
  if (!href) return null;
  return <p className="external-post-link">Originally shared elsewhere: <a href={href} target="_blank" rel="noreferrer">open the post ↗</a></p>;
}
