import { useParams, Link } from "react-router-dom";
import fm from "front-matter";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

import { postsBySlug } from "../posts/posts.js";
import { usePageMeta } from "../lib/usePageMeta.js";

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

  let title = "Post Not Found | Erik Panchenko";
  let description = "The requested blog post could not be found.";

  if (post) {
    const raw = getRawByFilename(post.file);

    if (raw) {
      const parsed = fm(raw);
      const data = parsed.attributes || {};

      title = `${data.title || post.title} | Erik Panchenko`;
      description = data.description || post.description || "";
    }
  }

  usePageMeta({
    title,
    description,
  });

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

  const titleText = data.title || post.title;
  const date = data.date || post.date;

  return (
    <article className="prose">
      {/* <p className="kicker">
        <Link to="/blog" className="text-link">← Back to Blog</Link>
      </p> */}

      <header className="post-heading">
        <h1>{titleText}</h1>
        <p className="post-meta">{date}</p>
      </header>

      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
      >
        {body}
      </ReactMarkdown>
      <section className="contact-block">
        <h2>Contact</h2>

        <p>
          If you need help with Tealium CDP architecture, identity strategy,
          or a clean-up project, get in touch:
        </p>

        <ul>
          <li>Email: <a href="mailto:hello@erikpanchenko.dev">hello@erikpanchenko.dev</a></li>
          <li>LinkedIn: <a href="https://www.linkedin.com/in/erik-panchenko/">linkedin.com/in/erik-panchenko/</a></li>
        </ul>
      </section>
    </article>
  );
}
