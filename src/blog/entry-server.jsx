import { renderToString } from "react-dom/server";
import BlogApp from "./BlogApp.jsx";
import { posts, postPath, matchRoute, loadPostBody } from "./posts.js";
import { buildHead } from "./seo.js";

export { buildSitemap, buildRobots } from "./seo.js";

export const paths = ["/blog", ...posts.map(postPath)];

export async function render(path) {
  const route = matchRoute(path);
  const body = route.post ? await loadPostBody(route.post.slug) : "";
  return {
    html: renderToString(<BlogApp route={route} body={body} />),
    head: buildHead(route),
  };
}
