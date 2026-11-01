/* כל קובץ ב-src/content/blog הוא מאמר. שם הקובץ הוא הכתובת של המאמר. */
const metaModules = import.meta.glob("../content/blog/*.md", { query: "?post-meta", import: "default", eager: true });
const bodyLoaders = import.meta.glob("../content/blog/*.md", { query: "?post-body", import: "default" });

export const posts = Object.values(metaModules).sort((a, b) => b.date.localeCompare(a.date));

export const categories = [...new Set(posts.map((post) => post.category))];

export const loadPostBody = (slug) => bodyLoaders[`../content/blog/${slug}.md`]();

export const postPath = (post) => `/blog/${post.slug}`;

/* מאמרים מאותה קטגוריה קודם, ואחריהם האחרונים שפורסמו */
export function relatedPosts(post, limit = 3) {
  const others = posts.filter((other) => other.slug !== post.slug);
  const sameCategory = others.filter((other) => other.category === post.category);
  const rest = others.filter((other) => other.category !== post.category);
  return [...sameCategory, ...rest].slice(0, limit);
}

/* מחזיר איזה עמוד להציג לפי הכתובת */
export function matchRoute(pathname) {
  const path = pathname.replace(/\/+$/, "");
  if (path === "/blog") return { page: "index" };
  const slug = path.match(/^\/blog\/([^/]+)$/)?.[1];
  const post = posts.find((candidate) => candidate.slug === slug);
  return post ? { page: "post", post } : { page: "not-found" };
}

const MONTHS = ["בינואר", "בפברואר", "במרץ", "באפריל", "במאי", "ביוני", "ביולי", "באוגוסט", "בספטמבר", "באוקטובר", "בנובמבר", "בדצמבר"];

/* פורמט קבוע, כדי שהתאריך בדף הסטטי ובדפדפן יהיה זהה */
export function formatDate(date) {
  const [year, month, day] = date.split("-").map(Number);
  return `${day} ${MONTHS[month - 1]} ${year}`;
}
