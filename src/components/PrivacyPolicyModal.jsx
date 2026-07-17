import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { PHONE_DISPLAY } from "../config.js";

const sections = [
  {
    title: "1. כללי ובעל השליטה במידע",
    body: <>CTR media (להלן: "החברה", "אנחנו") מכבדת את פרטיות המשתמשים באתר. מדיניות זו מסבירה איזה מידע נאסף בעת השימוש באתר ובפנייה אלינו, מדוע הוא נאסף, כיצד נעשה בו שימוש ומהן זכויותיך. בעל השליטה במידע הוא CTR media. ניתן לפנות אלינו בטלפון או ב-WhatsApp במספר <a href={`tel:${PHONE_DISPLAY}`}>{PHONE_DISPLAY}</a>.</>,
  },
  {
    title: "2. המידע שאנו אוספים",
    body: <>כאשר בוחרים להשאיר פרטים בטופס, עשויים להימסר לנו שם מלא, מספר טלפון, תחום העסק, כתובת אתר, תקציב פרסום והמידע שיופיע בהודעה. בנוסף, בעת גלישה עשוי להיאסף מידע טכני בסיסי בידי הדפדפן, ספק האחסון או שירותים חיצוניים, כגון כתובת IP, סוג מכשיר ודפדפן, זמני גישה ונתוני אבטחה. האתר שומר בדפדפן את בחירת השפה שלך.</>,
  },
  {
    title: "3. מסירת מידע והסכמה",
    body: <>מסירת המידע בטופס נעשית מרצונך החופשי ואינך מחויב/ת על פי דין למסרו. ללא שם ומספר טלפון תקין לא נוכל לחזור אליך ולספק את בדיקת ההתאמה; יתר השדות אינם חובה. בלחיצה על כפתור השליחה נפתחת WhatsApp והמידע נשלח רק לאחר פעולת השליחה שלך ובהתאם לתנאי ולמדיניות WhatsApp.</>,
  },
  {
    title: "4. מטרות השימוש במידע",
    body: <>המידע ישמש ליצירת קשר בעקבות פנייתך, לבחינת התאמה ומתן מידע על שירותינו, להכנת הצעה או המשך התקשרות לפי בקשתך, לתפעול ולאבטחת האתר, למניעת הונאה ושימוש לרעה, לשיפור השירות ולעמידה בדרישות הדין. לא נשתמש במידע למטרה שאינה תואמת מטרות אלה ללא הסכמה או סמכות בדין.</>,
  },
  {
    title: "5. העברת מידע לצדדים שלישיים",
    body: <>לא נמכור מידע אישי. מידע עשוי להימסר לספקים הדרושים להפעלת השירות, ובהם WhatsApp/Meta לצורך שליחת הפנייה, ספקי אחסון ותשתית ו-Google לצורך טעינת גופנים; לרשויות או לצדדים אחרים כאשר קיימת חובה או סמכות בדין; או במסגרת מחלוקת משפטית, הגנה על זכויות, שינוי מבני או העברת פעילות, בכפוף לדין. שירותים אלה עשויים לעבד מידע מחוץ לישראל בהתאם למדיניותם ולהוראות הדין החלות.</>,
  },
  {
    title: "6. קובצי Cookies ואחסון מקומי",
    body: <>בגרסה הנוכחית של האתר נשמרת באחסון המקומי בדפדפן העדפת השפה בלבד. שירותים חיצוניים שאליהם תבחר/י לעבור, כגון WhatsApp, עשויים להשתמש בטכנולוגיות מעקב בהתאם למדיניות שלהם. אם יתווספו בעתיד כלי מדידה, פרסום או Cookies שאינם חיוניים, המדיניות תעודכן ובמידת הצורך יוצג מנגנון הסכמה מתאים.</>,
  },
  {
    title: "7. שמירת מידע ואבטחתו",
    body: <>נשמור מידע רק למשך הזמן הדרוש לטיפול בפנייה, לניהול הקשר העסקי, להגנה על זכויות ולעמידה בחובות דין, ולאחר מכן נמחק או נהפוך אותו לאנונימי ככל שניתן. אנו נוקטים אמצעים סבירים ומקובלים לצמצום סיכוני אובדן, שימוש לרעה או גישה בלתי מורשית. עם זאת, שום מערכת מקוונת אינה חסינה לחלוטין ולא ניתן להבטיח אבטחה מוחלטת.</>,
  },
  {
    title: "8. זכויותיך",
    body: <>בכפוף לחוק הגנת הפרטיות, התשמ״א–1981, ניתן לפנות אלינו כדי לבקש לעיין במידע אישי המוחזק עליך, ולבקש לתקנו או למחקו כאשר הוא אינו נכון, שלם, ברור או מעודכן, וכן להעלות שאלה או התנגדות בקשר לשימוש במידע. לצורך הגנה על פרטיותך אנו עשויים לבקש פרטים סבירים לאימות זהותך לפני טיפול בבקשה.</>,
  },
  {
    title: "9. קטינים, קישורים ושינויים במדיניות",
    body: <>האתר מיועד לבגירים ולבעלי עסקים ואינו מכוון לקטינים. אין למסור לנו מידע על אדם אחר ללא הרשאה מתאימה. האתר עשוי לכלול קישורים לאתרים ושירותים חיצוניים שאיננו אחראים לנוהגי הפרטיות שלהם. אנו רשאים לעדכן מדיניות זו עקב שינוי בדין, בשירותים או באופן עיבוד המידע; הגרסה המעודכנת תפורסם כאן בציון מועד העדכון.</>,
  },
];

export default function PrivacyPolicyModal({ open, onClose }) {
  const closeRef = useRef(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab") {
        const focusable = dialogRef.current?.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])');
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      previousFocus?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="privacy-modal" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section ref={dialogRef} className="privacy-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="privacy-title" dir="rtl">
        <header className="privacy-modal__header">
          <div>
            <span className="section-tag">הפרטיות שלך חשובה לנו</span>
            <h2 id="privacy-title">מדיניות פרטיות</h2>
            <p>עודכן לאחרונה: 17 ביולי 2026</p>
          </div>
          <button ref={closeRef} type="button" className="privacy-modal__close" onClick={onClose} aria-label="סגירת מדיניות הפרטיות">
            <X size={24} />
          </button>
        </header>
        <div className="privacy-modal__content">
          <p className="privacy-modal__intro">המדיניות חלה על אתר CTR media ועל פניות המבוצעות באמצעותו. השימוש באתר לאחר הצגת המדיניות כפוף לנוסח המעודכן שלה.</p>
          {sections.map((section) => (
            <section key={section.title}>
              <h3>{section.title}</h3>
              <p>{section.body}</p>
            </section>
          ))}
          <div className="privacy-modal__contact">
            <strong>פניות בנושא פרטיות</strong>
            <span>CTR media · טלפון ו-WhatsApp: <a href={`tel:${PHONE_DISPLAY}`}>{PHONE_DISPLAY}</a></span>
          </div>
        </div>
      </section>
    </div>
  );
}
