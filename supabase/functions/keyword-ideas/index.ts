// ============================================================
//  Edge Function: keyword-ideas
//  פרוקסי ל-Google Suggest — מחזיר רעיונות מילות מפתח אמיתיים
//  (מה שאנשים באמת מקלידים בגוגל), בלי מפתח ובלי עלות.
//  הפרוקסי נחוץ כי הדפדפן חוסם קריאה ישירה (CORS).
//
//  הגנות: CORS מוגבל לדומיינים שלך, cache (חוסך בקשות לגוגל),
//  הגבלת קצב ל-IP, ודיווח שגיאה כשגוגל לא זמין.
//
//  פריסה:  supabase functions deploy keyword-ideas --no-verify-jwt
// ============================================================

// רק הדפים האלה יכולים לקרוא לפונקציה מהדפדפן.
const ALLOWED_ORIGINS = new Set([
  "https://ppc.ctrmedia.co.il",
  "https://ctrmedia.co.il",
  "https://www.ctrmedia.co.il",
  "http://localhost:5173",
  "http://localhost:5174",
]);

// מרחיבים את מילת הזרע כמו שכלי מחקר מילים עובד מאחורי הקלעים.
// בעברית מחפשים "עורך דין גירושין מחיר" (סיומת), ושאלות מתחילות במילת שאלה (תחילית).
const LANG = {
  he: {
    prefix: ["איך", "כמה עולה", "מה זה", "למה", "האם", "מתי"],
    suffix: ["מחיר", "מומלץ", "הכי טוב", "בתל אביב", "אונליין", "זול", "ביקורות", "מחירון"],
    letters: ["א", "ב", "ל", "מ", "ש", "ת"],
    questionWords: ["איך", "כמה", "מה", "מתי", "למה", "האם", "מי", "איפה", "כדאי"],
  },
  en: {
    prefix: ["how", "what", "why", "best", "is", "can"],
    suffix: ["price", "cost", "near me", "vs", "reviews", "online", "free", "for beginners"],
    letters: ["a", "b", "c", "m", "s", "t"],
    questionWords: ["how", "what", "why", "when", "who", "where", "is", "can", "should", "does"],
  },
} as const;

const BATCH_SIZE = 7; // בקשות מקבילות לגוגל בכל פעם (מונע פרצי בקשות)
const MAX_QUESTIONS = 20;
const MAX_GENERAL = 40;

// ---- cache בזיכרון (חי כל עוד המופע של הפונקציה חי) ----
const CACHE_TTL_MS = 6 * 60 * 60 * 1000;
const CACHE_MAX = 300;
const cache = new Map<string, { at: number; body: Record<string, unknown> }>();

// ---- הגבלת קצב ל-IP ----
const RATE_LIMIT_PER_MIN = 12;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 60_000);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 2000) {
    for (const [k, v] of hits) if (!v.some((t) => now - t < 60_000)) hits.delete(k);
  }
  return recent.length > RATE_LIMIT_PER_MIN;
}

function cors(origin: string | null) {
  const allow = origin && ALLOWED_ORIGINS.has(origin) ? origin : "https://ppc.ctrmedia.co.il";
  return {
    "Access-Control-Allow-Origin": allow,
    Vary: "Origin",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };
}

function json(body: unknown, status: number, origin: string | null, extra: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors(origin), "Content-Type": "application/json; charset=utf-8", ...extra },
  });
}

async function fetchText(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      signal: AbortSignal.timeout(4000),
    });
    return res.ok ? await res.text() : null;
  } catch {
    return null;
  }
}

// gws-wiz מחזיר הצעות עם הדגשות <b>…</b> ו-HTML entities — מנקים
function stripTags(s: string): string {
  return s
    .replace(/<[^>]*>/g, "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");
}

// gws-wiz = אותו endpoint של דף החיפוש של גוגל (הכי עשיר; firefox מחזיר 0 להרבה
// חיפושים תקינים). firefox נשאר כגיבוי.
// null = כשל בקריאה לגוגל, [] = גוגל ענה אבל אין הצעות
async function suggest(query: string, hl: string): Promise<string[] | null> {
  const base = `https://suggestqueries.google.com/complete/search?hl=${hl}&gl=il&q=${encodeURIComponent(query)}`;

  const wiz = await fetchText(`${base}&client=gws-wiz`);
  if (wiz !== null) {
    try {
      // window.google.ac.h([[["הצעה",0,[...]], ...], {...}])
      const data = JSON.parse(wiz.slice(wiz.indexOf("(") + 1, wiz.lastIndexOf(")")));
      if (Array.isArray(data?.[0])) {
        return data[0].map((e: unknown[]) => stripTags(String(e?.[0] ?? "")).trim()).filter(Boolean);
      }
    } catch {
      /* פורמט לא צפוי — ננסה את הגיבוי */
    }
  }

  const ff = await fetchText(`${base}&client=firefox`);
  if (ff === null) return null;
  try {
    const data = JSON.parse(ff); // ["query", ["sugg1","sugg2",...]]
    return Array.isArray(data?.[1]) ? data[1] : [];
  } catch {
    return null;
  }
}

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin");
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors(origin) });
  if (origin && !ALLOWED_ORIGINS.has(origin)) return json({ ok: false, error: "forbidden_origin" }, 403, origin);

  const params = new URL(req.url).searchParams;
  // מנקים תווי בקרה ורווחים כפולים
  const seed = (params.get("q") || "").replace(/[\u0000-\u001f]/g, " ").replace(/\s+/g, " ").trim();
  const hl = (params.get("hl") || "he").toLowerCase() === "en" ? "en" : "he";

  if (seed.length < 2) return json({ ok: false, error: "missing_query" }, 400, origin);
  if (seed.length > 60) return json({ ok: false, error: "query_too_long" }, 400, origin);

  // cache קודם — בקשה חוזרת לא עולה כלום ולא נספרת להגבלת הקצב
  const cacheKey = `${hl}:${seed.toLowerCase()}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) {
    return json(cached.body, 200, origin, { "Cache-Control": "public, max-age=3600", "X-Cache": "HIT" });
  }

  const ip = (req.headers.get("x-forwarded-for") || "unknown").split(",")[0].trim();
  if (rateLimited(ip)) return json({ ok: false, error: "rate_limited" }, 429, origin, { "Retry-After": "60" });

  const L = LANG[hl];
  // הזרע לבד + הזרע עם רווח בסוף (גוגל מחזיר "המילה הבאה" ומוסיף הצעות)
  const queries = new Set<string>([seed, `${seed} `]);
  for (const p of L.prefix) queries.add(`${p} ${seed}`);
  for (const s of L.suffix) queries.add(`${seed} ${s}`);
  for (const a of L.letters) queries.add(`${seed} ${a}`);

  const list = [...queries];
  const results: (string[] | null)[] = [];
  for (let i = 0; i < list.length; i += BATCH_SIZE) {
    results.push(...(await Promise.all(list.slice(i, i + BATCH_SIZE).map((q) => suggest(q, hl)))));
  }

  // גוגל לא זמין (חסם/תקלה) — לא מחזירים "אין תוצאות" שקרי ולא שומרים ב-cache
  if (results.every((r) => r === null)) return json({ ok: false, error: "upstream_failed" }, 502, origin);

  // מיזוג + ניקוי כפילויות, בלי הזרע עצמו
  const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ");
  const seedKey = norm(seed);
  const seen = new Set<string>([seedKey]);
  const questions: string[] = [];
  const general: string[] = [];
  const questionWords: readonly string[] = L.questionWords;
  for (const r of results) {
    for (const kw of r || []) {
      const clean = (kw || "").trim();
      const key = norm(clean);
      if (!clean || seen.has(key)) continue;
      seen.add(key);
      (questionWords.includes(key.split(" ")[0]) ? questions : general).push(clean);
    }
  }

  const q = questions.slice(0, MAX_QUESTIONS);
  const g = general.slice(0, MAX_GENERAL);
  const body = { ok: true, seed, hl, total: q.length + g.length, questions: q, general: g };

  if (cache.size >= CACHE_MAX) cache.delete(cache.keys().next().value as string);
  cache.set(cacheKey, { at: Date.now(), body });

  return json(body, 200, origin, { "Cache-Control": "public, max-age=3600", "X-Cache": "MISS" });
});
