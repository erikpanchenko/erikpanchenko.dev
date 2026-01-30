import fm from "front-matter";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import raw from "../content/pages/home.md?raw";
import { usePageMeta } from "../lib/usePageMeta.js";
import { Link } from "react-router-dom";
import { posts } from "../posts/posts.js";


export default function Home() {
  const parsed = fm(raw);
  const data = parsed.attributes || {};
  const content = parsed.body || "";
  const latest = posts
  .slice()
  .sort((a, b) => (a.date < b.date ? 1 : -1))
  .slice(0, 3);


  usePageMeta({
    title: data.title || "Erik Panchenko",
    description: data.description || "",
  });

  return (
    <article className="prose">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{content}</ReactMarkdown>

      <h2>Latest blog posts</h2>

      <ul className="post-list">
        {latest.map((p) => (
          <li key={p.slug} className="post-list__item">
            <Link to={`/blog/${p.slug}`} className="post-link">
              <span className="post-link__title">{p.title}</span>
              <span className="post-link__meta">{p.date}</span>
            </Link>
          </li>
        ))}
      </ul>

      <section className="contact-block">
        <h2>Contact</h2>

        <p>
          If you want help with a Tealium/CDP audit, consent architecture,
          or a clean-up project, get in touch:
        </p>

        <ul>
          <li>Email: <a href="mailto:hello@erikpanchenko.dev">hello@erikpanchenko.dev</a></li>
          <li>LinkedIn: <a href="https://linkedin.com/in/YOUR_HANDLE">LinkedIn</a></li>
        </ul>
      </section>
    </article>
  );
}
