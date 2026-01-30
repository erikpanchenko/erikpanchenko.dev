export const posts = [
  {
    slug: "hello-world",
    title: "Hello world",
    date: "2026-01-20",
    file: "hello-world.md",
    description: "A placeholder post while the blog structure lands.",
  },
];

export const postsBySlug = Object.fromEntries(posts.map((p) => [p.slug, p]));
