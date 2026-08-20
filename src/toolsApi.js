// ============================================================
//  קריאה ל-Edge Function של מחקר המילים (Google Suggest proxy).
//  אם TOOLS_API_URL לא מוגדר — מחזיר notConfigured והווידג'ט
//  עובר למצב fallback (דיפ-לינקים לגוגל טרנדס וכו').
// ============================================================
import { SUPABASE_ANON_KEY, TOOLS_API_URL } from "./config.js";

export async function fetchKeywordIdeas(seed, lang = "he") {
  const q = (seed || "").trim();
  if (!q) return { ok: false, error: "empty" };
  if (!TOOLS_API_URL) return { ok: false, notConfigured: true };

  const base = TOOLS_API_URL.replace(/\/+$/, "");
  const url = `${base}/keyword-ideas?q=${encodeURIComponent(q)}&hl=${lang === "en" ? "en" : "he"}`;

  try {
    const res = await fetch(url, {
      headers: SUPABASE_ANON_KEY
        ? { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` }
        : {},
      signal: AbortSignal.timeout(9000),
    });
    if (!res.ok) return { ok: false, error: `http_${res.status}` };
    const data = await res.json();
    return data?.ok ? data : { ok: false, error: data?.error || "bad_response" };
  } catch (e) {
    return { ok: false, error: String(e?.name || e) };
  }
}
