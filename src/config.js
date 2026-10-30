// ==== פרטי יצירת קשר — עדכן כאן פעם אחת והכל מתעדכן בכל הדף ====
export const PHONE_DISPLAY = "053-488-1767";
export const WHATSAPP_NUMBER = "972534881767"; // פורמט בינלאומי בלי +

// ==== שילוח לידים ל-CRM ====
// הערכים נקראים מקובץ .env (VITE_...). ריק = הליד ממשיך רק לוואטסאפ.
export const CRM_WEBHOOK_URL = import.meta.env.VITE_CRM_WEBHOOK_URL || "";

// ==== Supabase (ה-CRM) — הכנסת לידים ישירה לטבלה ====
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
export const SUPABASE_LEADS_TABLE = import.meta.env.VITE_SUPABASE_LEADS_TABLE || "leads";
// עמודות המשחק (game_score / game_prize / coupon_code) — להפעיל רק אחרי ALTER TABLE
export const SUPABASE_GAME_COLUMNS = import.meta.env.VITE_SUPABASE_GAME_COLUMNS === "true";

// ==== כלים חינם (מחקר מילים) — כתובת ה-Edge Function של Supabase ====
// דוגמה: https://xxxx.supabase.co/functions/v1  (ריק = הווידג'ט עובר למצב fallback)
export const TOOLS_API_URL = import.meta.env.VITE_TOOLS_API_URL || "";
export const WHATSAPP_MESSAGE =
  "היי, הגעתי מדף הנחיתה של CTR ואשמח לבדיקת התאמה חינם לקמפיינים שלי";

export const waLink = (msg = WHATSAPP_MESSAGE) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
