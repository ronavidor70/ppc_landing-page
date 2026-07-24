// ============================================================
//  ייחוס לידים (Lead Attribution)
//  לוכד מה-URL את מקור הקמפיין (פלטפורמה, קמפיין, קבוצת מודעות,
//  מודעה, מילת מפתח, click-id) ושומר לאורך הסשן — כדי לצרף לכל ליד.
// ============================================================

const STORAGE = "ctr-attribution";

/* כל הפרמטרים שאנחנו קולטים מה-URL */
const PARAMS = [
  "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term",
  "utm_adgroup", "adgroup", "adset", "adname", "keyword", "matchtype", "placement", "network", "device",
  "gclid", "gbraid", "wbraid", // Google
  "fbclid", // Meta
  "ttclid", // TikTok
  "twclid", // X/Twitter
  "msclkid", // Microsoft/Bing
  "li_fat_id", // LinkedIn
];

/* זיהוי הפלטפורמה לפי המקור / ה-click id */
function detectPlatform(d) {
  const s = (d.utm_source || "").toLowerCase();
  if (d.gclid || d.gbraid || d.wbraid || s.includes("google")) return "Google";
  if (d.fbclid || /facebook|meta|instagram|\bfb\b|\big\b/.test(s)) return "Facebook";
  if (d.ttclid || s.includes("tiktok")) return "TikTok";
  if (s.includes("taboola")) return "Taboola";
  if (s.includes("outbrain")) return "Outbrain";
  if (d.li_fat_id || s.includes("linkedin")) return "LinkedIn";
  if (d.msclkid || s.includes("bing") || s.includes("microsoft")) return "Bing";
  if (d.twclid || s.includes("twitter") || s.includes("x.com")) return "X (Twitter)";
  return d.utm_source || "";
}

/* קורא את הפרמטרים מה-URL. אם יש חדשים — שומר; אחרת מחזיר את מה ששמור */
export function captureAttribution() {
  const url = new URLSearchParams(window.location.search);
  const fresh = {};
  PARAMS.forEach((k) => {
    const v = url.get(k);
    if (v) fresh[k] = v;
  });

  let saved = {};
  try {
    saved = JSON.parse(localStorage.getItem(STORAGE) || "{}");
  } catch {
    saved = {};
  }

  // רק אם הגיע ביקור חדש עם פרמטרים — מעדכנים (first-touch נשמר עד ביקור ממומן חדש)
  if (Object.keys(fresh).length) {
    saved = {
      ...fresh,
      referrer: document.referrer || "",
      landing_page: window.location.pathname + window.location.search,
      first_seen: saved.first_seen || new Date().toISOString(),
    };
    try {
      localStorage.setItem(STORAGE, JSON.stringify(saved));
    } catch {
      /* אחסון חסום — נמשיך בלי לשמור */
    }
  }
  return saved;
}

/* מחזיר אובייקט ייחוס מנורמל ומוכן לשליחה ל-CRM */
export function getAttribution() {
  let d = {};
  try {
    d = JSON.parse(localStorage.getItem(STORAGE) || "{}");
  } catch {
    d = {};
  }

  const clickId = d.gclid || d.fbclid || d.ttclid || d.msclkid || d.li_fat_id || d.twclid || "";
  const isPaid =
    !!clickId || (d.utm_medium && /cpc|ppc|paid|cpm|paidsocial|display/i.test(d.utm_medium));

  return {
    channel: isPaid ? "PPC" : d.utm_source ? "Other" : "Direct/Organic",
    platform: detectPlatform(d),
    source: d.utm_source || "",
    medium: d.utm_medium || "",
    campaign: d.utm_campaign || "",
    adgroup: d.utm_adgroup || d.adgroup || d.adset || "",
    ad: d.utm_content || d.adname || "",
    keyword: d.utm_term || d.keyword || "",
    matchtype: d.matchtype || "",
    placement: d.placement || "",
    click_id: clickId,
    referrer: d.referrer || "",
    landing_page: d.landing_page || "",
    first_seen: d.first_seen || "",
  };
}

/* שורות ייחוס קומפקטיות לצירוף להודעת וואטסאפ (רק שדות שקיימים) */
export function attributionLines(labels) {
  const a = getAttribution();
  const lines = [`${labels.channel}: ${a.channel}${a.platform ? " · " + a.platform : ""}`];
  if (a.campaign) lines.push(`${labels.campaign}: ${a.campaign}`);
  if (a.adgroup) lines.push(`${labels.adgroup}: ${a.adgroup}`);
  if (a.ad) lines.push(`${labels.ad}: ${a.ad}`);
  if (a.keyword) lines.push(`${labels.keyword}: ${a.keyword}`);
  if (a.click_id) lines.push(`Click ID: ${a.click_id}`);
  return lines;
}

/* נרמול טלפון ישראלי ל-E.164 (עם +972) — הפורמט שנדרש ל-Enhanced Conversions */
function toE164IL(raw) {
  const d = (raw || "").replace(/\D/g, "");
  if (!d) return "";
  if (d.startsWith("972")) return "+" + d;
  if (d.startsWith("0")) return "+972" + d.slice(1);
  return "+" + d;
}

/* ------------------------------------------------------------
   דחיפת אירוע המרה ל-dataLayer עבור Google Tag Manager.
   • event: "form_success" → מפעיל את הטריגר "form success" (Google Ads + FB + GA4)
   • user_data              → Enhanced Conversions (GTM מצפין SHA-256 — לא מצפינים כאן)
   • click_id               → נשמר לשיוך עתידי ב-Offline Conversions
   ------------------------------------------------------------ */
export function pushLeadConversion(lead) {
  const a = getAttribution();
  const [firstName, ...rest] = (lead.name || "").trim().split(/\s+/);

  const user_data = {};
  if (lead.email && /.+@.+\..+/.test(lead.email)) {
    user_data.email = lead.email.trim().toLowerCase();
  }
  const phone = toE164IL(lead.phone);
  if (phone) user_data.phone_number = phone;
  if (firstName) user_data.address = { first_name: firstName, last_name: rest.join(" ") };

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "form_success",
    user_data,
    click_id: a.click_id || "",
    lead_platform: a.platform || "",
    lead_channel: a.channel || "",
  });
}

/* שולח את הליד + נתוני הייחוס ל-CRM webhook (אם הוגדר ב-config) */
export async function sendLeadToCrm(webhookUrl, lead) {
  if (!webhookUrl) return;
  const payload = {
    ...lead,
    lead_source: "landing_page",
    attribution: getAttribution(),
    page_url: window.location.href,
    submitted_at: new Date().toISOString(),
  };
  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      // no-cors מאפשר שליחה גם ל-Zapier/Make בלי בעיית CORS
      mode: "no-cors",
      keepalive: true,
    });
  } catch {
    /* לא חוסמים את חוויית המשתמש אם השליחה נכשלה */
  }
}
