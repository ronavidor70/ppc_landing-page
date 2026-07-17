// ==== פרטי יצירת קשר — עדכן כאן פעם אחת והכל מתעדכן בכל הדף ====
export const PHONE_DISPLAY = "053-488-1767";
export const WHATSAPP_NUMBER = "972534881767"; // פורמט בינלאומי בלי +
export const WHATSAPP_MESSAGE =
  "היי, הגעתי מדף הנחיתה של CTR ואשמח לבדיקת התאמה חינם לקמפיינים שלי";

export const waLink = (msg = WHATSAPP_MESSAGE) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
