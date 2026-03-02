import { Link } from "react-router-dom";
import { posts } from "../posts/posts.js";
import { usePageMeta } from "../lib/usePageMeta.js";

export default function BlogIndex() {
  usePageMeta({
    title: "Blog | Erik Panchenko",
    description: "Articles on Tealium, CDP architecture, and implementation clean-up patterns.",
  });

  return (
    <article className="prose">
      <h1>Blog</h1>

      <ul className="post-list">
        {posts.map((p) => (
          <li key={p.slug} className="post-list__item">
            <Link to={`/blog/${p.slug}`} className="post-link">
              <p className="post-link__title">{p.title}</p>
              <span className="post-link__meta">{p.date}</span>
            </Link>
          </li>
        ))}
      </ul>
    </article>
  );
}
