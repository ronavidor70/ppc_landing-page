import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "../index.css";
import "../a11y.css";
import "../sections.css";
import "./blog.css";
import BlogApp from "./BlogApp.jsx";
import { matchRoute, loadPostBody } from "./posts.js";
import { captureAttribution, capturePpcAttribution } from "../attribution.js";

// כמו בדף הנחיתה: לוכד את נתוני הקמפיין מה-URL, כדי שליד מהבלוג ישויך למקור שלו
capturePpcAttribution();
captureAttribution();

const route = matchRoute(window.location.pathname);
const body = route.post ? await loadPostBody(route.post.slug) : "";
const app = (
  <StrictMode>
    <BlogApp route={route} body={body} />
  </StrictMode>
);

// בדף שנבנה מראש כבר יש תוכן ב-root. בפיתוח הוא ריק.
const root = document.getElementById("root");
if (root.firstElementChild) hydrateRoot(root, app);
else createRoot(root).render(app);
