import { useEffect, useRef, useState } from "react";
import { Check, Cookie, Settings2, ShieldCheck, X } from "lucide-react";
import { useLang } from "../i18n.jsx";

const STORAGE_KEY = "ctr-cookie-consent-v1";

const copy = {
  he: {
    dir: "rtl",
    title: "הפרטיות שלך, הבחירה שלך",
    text: "אנחנו משתמשים באחסון חיוני להפעלת האתר ולשמירת השפה. עוגיות מדידה ושיווק יופעלו רק אם תבחרו לאשר אותן.",
    accept: "אישור הכול",
    reject: "רק חיוניות",
    customize: "התאמה אישית",
    settingsTitle: "העדפות Cookies",
    settingsText: "אפשר לבחור אילו קטגוריות לאפשר ולשנות את הבחירה בכל עת דרך הקישור בתחתית האתר.",
    necessary: "חיוניות",
    necessaryDesc: "נדרשות לתפעול בסיסי ולשמירת העדפת השפה. לא ניתן לכבות אותן.",
    analytics: "מדידה וסטטיסטיקה",
    analyticsDesc: "יסייעו להבין באופן מצרפי כיצד משתמשים באתר. כרגע לא מותקן באתר כלי מדידה.",
    marketing: "שיווק ופרסום",
    marketingDesc: "מאפשרות מדידת קמפיינים והתאמת פרסום. כרגע לא מותקן באתר כלי פרסום.",
    always: "פעיל תמיד",
    save: "שמירת הבחירה",
    privacy: "למדיניות הפרטיות המלאה",
    close: "סגירת העדפות Cookies",
  },
  en: {
    dir: "ltr",
    title: "Your privacy, your choice",
    text: "We use essential storage to operate the site and remember your language. Analytics and marketing cookies will run only if you allow them.",
    accept: "Accept all",
    reject: "Essential only",
    customize: "Customize",
    settingsTitle: "Cookie preferences",
    settingsText: "Choose which categories to allow. You can change your choice at any time from the link in the footer.",
    necessary: "Essential",
    necessaryDesc: "Required for basic operation and remembering your language. These cannot be disabled.",
    analytics: "Analytics",
    analyticsDesc: "Helps us understand aggregate site usage. No analytics tool is currently installed.",
    marketing: "Marketing",
    marketingDesc: "Enables campaign measurement and ad personalization. No advertising tool is currently installed.",
    always: "Always active",
    save: "Save choices",
    privacy: "Read the full privacy policy",
    close: "Close cookie preferences",
  },
};

const readConsent = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
};

export default function CookieConsent({ settingsOpen, onSettingsChange, onOpenPrivacy }) {
  const { lang } = useLang();
  const C = copy[lang] || copy.he;
  const [consent, setConsent] = useState(readConsent);
  const [choices, setChoices] = useState(() => readConsent() || { analytics: false, marketing: false });
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const showBanner = !consent && !settingsOpen;

  const save = (next) => {
    const value = { necessary: true, analytics: next.analytics, marketing: next.marketing, updatedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    setConsent(value);
    setChoices(value);
    onSettingsChange(false);
    window.dispatchEvent(new CustomEvent("ctr:consent", { detail: value }));
  };

  useEffect(() => {
    if (!settingsOpen) return undefined;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKeyDown = (event) => {
      if (event.key === "Escape") onSettingsChange(false);
      if (event.key === "Tab") {
        const items = dialogRef.current?.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])');
        if (!items?.length) return;
        const first = items[0];
        const last = items[items.length - 1];
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
  }, [settingsOpen, onSettingsChange]);

  return (
    <>
      {showBanner && (
        <aside className="cookie-banner" aria-label={C.title} dir={C.dir}>
          <div className="cookie-banner__icon"><Cookie size={26} /></div>
          <div className="cookie-banner__copy">
            <h2>{C.title}</h2>
            <p>{C.text} <button type="button" className="privacy-link" onClick={onOpenPrivacy}>{C.privacy}</button></p>
          </div>
          <div className="cookie-banner__actions">
            <button type="button" className="cookie-btn cookie-btn--primary" onClick={() => save({ analytics: true, marketing: true })}>
              <Check size={18} /> {C.accept}
            </button>
            <button type="button" className="cookie-btn" onClick={() => save({ analytics: false, marketing: false })}>{C.reject}</button>
            <button type="button" className="cookie-btn cookie-btn--text" onClick={() => onSettingsChange(true)}>
              <Settings2 size={17} /> {C.customize}
            </button>
          </div>
        </aside>
      )}

      {settingsOpen && (
        <div className="cookie-settings" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onSettingsChange(false)}>
          <section ref={dialogRef} className="cookie-settings__dialog" role="dialog" aria-modal="true" aria-labelledby="cookie-settings-title" dir={C.dir}>
            <header className="cookie-settings__header">
              <div className="cookie-settings__heading">
                <span className="cookie-settings__mark"><ShieldCheck size={22} /></span>
                <div><h2 id="cookie-settings-title">{C.settingsTitle}</h2><p>{C.settingsText}</p></div>
              </div>
              <button ref={closeRef} type="button" className="cookie-settings__close" onClick={() => onSettingsChange(false)} aria-label={C.close}><X size={23} /></button>
            </header>
            <div className="cookie-settings__body">
              <PreferenceRow title={C.necessary} description={C.necessaryDesc} locked label={C.always} />
              <PreferenceRow title={C.analytics} description={C.analyticsDesc} checked={choices.analytics} onChange={(value) => setChoices((current) => ({ ...current, analytics: value }))} />
              <PreferenceRow title={C.marketing} description={C.marketingDesc} checked={choices.marketing} onChange={(value) => setChoices((current) => ({ ...current, marketing: value }))} />
              <button type="button" className="privacy-link cookie-settings__privacy" onClick={() => { onSettingsChange(false); onOpenPrivacy(); }}>{C.privacy}</button>
            </div>
            <footer className="cookie-settings__footer">
              <button type="button" className="cookie-btn" onClick={() => save({ analytics: false, marketing: false })}>{C.reject}</button>
              <button type="button" className="cookie-btn cookie-btn--primary" onClick={() => save(choices)}><Check size={18} /> {C.save}</button>
            </footer>
          </section>
        </div>
      )}
    </>
  );
}

function PreferenceRow({ title, description, checked, onChange, locked, label }) {
  return (
    <div className="cookie-option">
      <div><h3>{title}</h3><p>{description}</p></div>
      {locked ? <span className="cookie-option__always">{label}</span> : (
        <label className="cookie-switch">
          <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
          <span aria-hidden="true" />
          <span className="sr-only">{title}</span>
        </label>
      )}
    </div>
  );
}
