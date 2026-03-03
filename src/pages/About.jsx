import fm from "front-matter";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

import raw from "../content/pages/about.md?raw";
import { usePageMeta } from "../lib/usePageMeta.js";

export default function About() {
  const parsed = fm(raw);
  const data = parsed.attributes || {};
  const content = parsed.body || "";

  usePageMeta({
    title: data.title || "About | Erik Panchenko",
    description: data.description || "",
  });

  return (
    <article className="prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}
