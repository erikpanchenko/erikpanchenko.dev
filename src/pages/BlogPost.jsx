import { useParams, Link } from "react-router-dom";
import fm from "front-matter";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

import { postsBySlug } from "../posts/posts.js";

// Load all blog markdown files at build-time (Vite)
const mdFiles = import.meta.glob("../content/blog/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

function getRawByFilename(filename) {
  const match = Object.entries(mdFiles).find(([path]) => path.endsWith(`/${filename}`));
  return match ? match[1] : null;
}

export default function BlogPost() {
  const { slug } = useParams();
  const post = postsBySlug[slug];

  if (!post) {
    return (
      <article className="prose">
        <h1>Not found</h1>
        <p>That post doesn’t exist.</p>
        <p>
          <Link to="/blog" className="text-link">Back to Blog</Link>
        </p>
      </article>
    );
  }

  const raw = getRawByFilename(post.file);

  if (!raw) {
    return (
      <article className="prose">
        <h1>Missing post file</h1>
        <p>
          Could not find <code>{post.file}</code> in <code>src/content/blog/</code>.
        </p>
        <p>
          <Link to="/blog" className="text-link">Back to Blog</Link>
        </p>
      </article>
    );
  }

  const parsed = fm(raw);
  const data = parsed.attributes || {};
  const body = parsed.body || "";

  const title = data.title || post.title;
  const date = data.date || post.date;

  return (
    <article className="prose">
      <p className="kicker">
        <Link to="/blog" className="text-link">← Back to Blog</Link>
      </p>

      <h1>{title}</h1>
      <p className="post-meta">{date}</p>

      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
      >
        {body}
      </ReactMarkdown>
    </article>
  );
}
