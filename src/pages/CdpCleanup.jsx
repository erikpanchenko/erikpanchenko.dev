import fm from "front-matter";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

import raw from "../content/pages/cdp-cleanup.md?raw";
import { usePageMeta } from "../lib/usePageMeta.js";

export default function CdpCleanup() {
  const parsed = fm(raw);
  const data = parsed.attributes || {};
  const content = parsed.body || "";

  usePageMeta({
    title: data.title || "Tealium CDP Clean-ups & Remediation",
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
