// ============================================================
//  הכנסת לידים ישירות ל-Supabase (ה-CRM)
//  משתמש ב-REST API של Supabase — בלי ספריות נוספות.
// ============================================================
import { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_LEADS_TABLE, SUPABASE_GAME_COLUMNS } from "./config.js";
import { getAttribution, getPpcAttribution } from "./attribution.js";

/* נרמול טלפון ישראלי לפורמט בינלאומי (972...) — כמו הלידים של הבוט */
function normalizePhone(raw) {
  const digits = (raw || "").replace(/\D/g, "");
  if (digits.startsWith("972")) return digits;
  if (digits.startsWith("0")) return "972" + digits.slice(1);
  return digits;
}

/* מכניס ליד חדש לטבלת leads עם כל נתוני הייחוס */
export async function insertLeadToSupabase(lead) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return { ok: false, skipped: true };

  const a = getAttribution();
  const ppc = getPpcAttribution();
  const row = {
    // ---- שדות מהטופס ----
    name: lead.name || null,
    phone: normalizePhone(lead.phone),
    niche: lead.business || null,
    website: lead.website || null,
    monthly_budget: lead.budget || null,
    lang: lead.lang || null,
    // ---- סימון מקור הליד ----
    service_interest: "landing_page",
    lead_status: "new",
    // ---- ייחוס קמפיין (PPC) ----
    source_channel: a.channel || null,
    source_platform: a.platform || null,
    utm_campaign: a.campaign || null,
    utm_adgroup: a.adgroup || null,
    utm_term: a.keyword || null,
    utm_content: a.ad || null,
    click_id: a.click_id || null,
    // ---- Google Ads first-touch (שמות העמודות ב-Supabase) ----
    attr_keyword: ppc.keyword,
    attr_matchtype: ppc.matchtype,
    attr_campaign: ppc.campaign,
    attr_adgroup: ppc.adgroup,
    attr_ad: ppc.ad,
    attr_gclid: ppc.gclid,
    attr_network: ppc.network,
    attr_device: ppc.device,
  };

  // ---- ליד מהמשחק "מצא את הדליפות" ----
  // העמודות נשלחות רק אחרי שנוספו לטבלה (VITE_SUPABASE_GAME_COLUMNS=true), אחרת ה-insert ייכשל
  if (lead.game && SUPABASE_GAME_COLUMNS) {
    row.game_score = lead.game.score;
    row.game_prize = lead.game.prize;
    row.coupon_code = lead.game.coupon;
  }

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${SUPABASE_LEADS_TABLE}`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(row),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.warn("Supabase lead insert failed:", res.status, text);
    }
    return { ok: res.ok, status: res.status };
  } catch (e) {
    console.warn("Supabase lead insert error:", e);
    return { ok: false, error: String(e) };
  }
}
