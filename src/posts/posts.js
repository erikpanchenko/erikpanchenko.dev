export const posts = [
  {
    slug: "reducing-tealium-visitor-attributes-optimisation-pattern",
    title: "Reducing Tealium Visitor Attributes from 700 to 350: A Practical Optimisation Pattern",
    date: "20 Sep 2025",
    file: "reducing-tealium-visitor-attributes-optimisation-pattern.md",
    description: "A practical optimisation pattern for mature Tealium AudienceStream implementations that reduces attribute sprawl and improves performance without sacrificing functionality.",
  },
];

export const postsBySlug = Object.fromEntries(posts.map((p) => [p.slug, p]));
