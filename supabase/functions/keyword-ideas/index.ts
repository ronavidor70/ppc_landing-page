// ============================================================
//  Edge Function: keyword-ideas
//  פרוקסי ל-Google Suggest — מחזיר רעיונות מילות מפתח אמיתיים
//  (מה שאנשים באמת מקלידים בגוגל), בלי מפתח ובלי עלות.
//  הפרוקסי נחוץ כי הדפדפן חוסם קריאה ישירה (CORS).
//
//  פריסה:  supabase functions deploy keyword-ideas --no-verify-jwt
// ============================================================

// מרחיבים את מילת הזרע במרחיבים נפוצים כדי לקבל יותר רעיונות,
// בדיוק כמו שכלי מחקר מילים עובד מאחורי הקלעים.
const HE_MODIFIERS = ["", "איך", "כמה עולה", "מחיר", "הכי טוב", "מומלץ", "ל", "עם", "בלי", "מה זה"];
const EN_MODIFIERS = ["", "how", "best", "cheap", "price", "top", "for", "with", "vs", "near me"];
const ALPHA_HE = ["א", "ב", "ג", "ד", "ה", "מ", "ר", "ש", "ת"];
const ALPHA_EN = ["a", "b", "c", "d", "e", "s", "t", "m", "p"];

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, "Content-Type": "application/json; charset=utf-8" },
  });
}

async function suggest(query: string, hl: string, gl: string): Promise<string[]> {
  const url =
    `https://suggestqueries.google.com/complete/search?client=firefox` +
    `&hl=${encodeURIComponent(hl)}&gl=${encodeURIComponent(gl)}&q=${encodeURIComponent(query)}`;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return [];
    // התשובה: ["query", ["sugg1","sugg2",...]]
    const data = await res.json();
    return Array.isArray(data?.[1]) ? data[1] : [];
  } catch {
    return [];
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  const { searchParams } = new URL(req.url);
  const seed = (searchParams.get("q") || "").trim();
  const hl = (searchParams.get("hl") || "he").toLowerCase() === "en" ? "en" : "he";
  const gl = "il"; // שוק ישראל

  if (!seed) return json({ ok: false, error: "missing_query" }, 400);
  if (seed.length > 60) return json({ ok: false, error: "query_too_long" }, 400);

  const isHe = hl === "he";
  const modifiers = isHe ? HE_MODIFIERS : EN_MODIFIERS;
  const alpha = isHe ? ALPHA_HE : ALPHA_EN;

  // בונים סט שאילתות: הזרע לבד, זרע+מרחיב, זרע+אות ראשונה
  const queries = new Set<string>([seed]);
  for (const m of modifiers) queries.add(isHe ? `${m} ${seed}`.trim() : `${seed} ${m}`.trim());
  for (const a of alpha) queries.add(isHe ? `${seed} ${a}` : `${seed} ${a}`);

  const results = await Promise.all([...queries].map((q) => suggest(q, hl, gl)));

  // מיזוג + ניקוי כפילויות (case-insensitive), פסילת הזרע עצמו
  const seen = new Set<string>();
  const keywords: string[] = [];
  for (const list of results) {
    for (const kw of list) {
      const clean = (kw || "").trim();
      const key = clean.toLowerCase();
      if (!clean || seen.has(key)) continue;
      seen.add(key);
      keywords.push(clean);
    }
  }

  // מפרידים שאלות (מכילות מילות שאלה) משאר הרעיונות — נחמד לתצוגה
  const QWORDS = isHe
    ? ["איך", "כמה", "מה", "מתי", "למה", "האם", "מי", "איפה", "כדאי"]
    : ["how", "what", "why", "when", "who", "where", "is", "can", "should", "does"];
  const questions: string[] = [];
  const general: string[] = [];
  for (const kw of keywords) {
    const first = kw.split(/\s+/)[0].toLowerCase();
    (QWORDS.includes(first) ? questions : general).push(kw);
  }

  return json({
    ok: true,
    seed,
    hl,
    total: keywords.length,
    keywords: keywords.slice(0, 60),
    questions: questions.slice(0, 20),
    general: general.slice(0, 40),
  });
});
