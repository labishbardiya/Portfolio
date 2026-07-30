import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function MarkdownArticle({ markdown }: { markdown: string }) {
  return (
    <div className="markdown-article">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children }) => <a href={href} target="_blank" rel="noreferrer">{children}</a>,
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
