import { posts, postPath } from "./posts.js";

export const SITE_URL = "https://ppc.ctrmedia.co.il";

const BLOG_TITLE = "הבלוג של CTR media | פרסום ממומן, מדידה וצמיחה";
const BLOG_DESCRIPTION =
  "מאמרים על Google Ads, Meta ומדידה מניסיון של מעל 13 שנה בניהול קמפיינים: איך לאתר דליפות תקציב, לקרוא נתונים נכון ולהגדיל רווח.";
const NOT_FOUND_TITLE = "המאמר לא נמצא | CTR media";

const escapeHtml = (value) =>
  String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const jsonLd = (data) => `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`;

const absolute = (path) => `${SITE_URL}${path}`;

export function pageTitle(route) {
  if (route.page === "post") return `${route.post.title} | CTR media`;
  return route.page === "index" ? BLOG_TITLE : NOT_FOUND_TITLE;
}

function postSchema(post) {
  const url = absolute(postPath(post));
  return [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      image: absolute(post.cover),
      datePublished: post.date,
      inLanguage: "he",
      mainEntityOfPage: url,
      author: { "@type": "Organization", name: "CTR media", url: SITE_URL },
      publisher: {
        "@type": "Organization",
        name: "CTR media",
        logo: { "@type": "ImageObject", url: absolute("/logo.webp") },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "בלוג", item: absolute("/blog/") },
        { "@type": "ListItem", position: 2, name: post.title, item: url },
      ],
    },
  ];
}

/* התגיות שנכנסות ל-<head> של כל דף סטטי */
export function buildHead(route) {
  const post = route.post;
  const title = pageTitle(route);
  const description = post ? post.description : BLOG_DESCRIPTION;
  const path = post ? postPath(post) : "/blog/";
  const image = absolute(post ? post.cover : posts[0].cover);

  const tags = [
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeHtml(description)}" />`,
    `<link rel="canonical" href="${absolute(path)}" />`,
    `<meta property="og:type" content="${post ? "article" : "website"}" />`,
    `<meta property="og:locale" content="he_IL" />`,
    `<meta property="og:site_name" content="CTR media" />`,
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
    `<meta property="og:url" content="${absolute(path)}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
  ];
  if (post) {
    tags.push(`<meta property="article:published_time" content="${post.date}" />`);
    postSchema(post).forEach((schema) => tags.push(jsonLd(schema)));
  }
  return tags.join("\n    ");
}

export function buildSitemap() {
  const urls = [
    { loc: absolute("/") },
    { loc: absolute("/blog/"), lastmod: posts[0].date },
    ...posts.map((post) => ({ loc: absolute(postPath(post)), lastmod: post.date })),
  ];
  const entries = urls.map(
    ({ loc, lastmod }) => `  <url><loc>${loc}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}</url>`
  );
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join("\n")}\n</urlset>\n`;
}

export const buildRobots = () => `User-agent: *\nAllow: /\n\nSitemap: ${absolute("/sitemap.xml")}\n`;
