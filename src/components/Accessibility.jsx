import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Accessibility as A11yIcon,
  X,
  Plus,
  Minus,
  Contrast,
  Link2,
  Type,
  MousePointer2,
  PauseCircle,
  RotateCcw,
  Sun,
} from "lucide-react";
import { useLang } from "../i18n.jsx";
import { PHONE_DISPLAY } from "../config.js";

const STORAGE = "ctr-a11y";
const FONT_STEPS = [100, 112, 125, 140, 160];

/* טקסט הצהרת הנגישות — דו-לשוני. עדכן את פרטי רכז הנגישות! */
const STATEMENT = {
  he: {
    title: "הצהרת נגישות",
    updated: "עודכן לאחרונה: יולי 2026",
    body: [
      "אתר זה של CTR media שואף לאפשר שימוש נוח ונגיש לכלל המשתמשים, לרבות אנשים עם מוגבלות, מתוך מחויבות לעיקרון של שוויון זכויות.",
      "הושקעו מאמצים ומשאבים על מנת להנגיש את האתר בהתאם לתקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע\"ג-2013, ובהתאם לתקן הישראלי ת\"י 5568 המבוסס על הנחיות WCAG 2.0 ברמת AA.",
      "האתר תומך בניווט מקלדת מלא, במבנה סמנטי תקין, בטקסט חלופי לתמונות, בניגודיות צבעים נאותה, ובתפריט נגישות המאפשר התאמות אישיות (הגדלת טקסט, ניגודיות, הדגשת קישורים, עצירת אנימציות ועוד).",
      "למרות מאמצינו, ייתכן שיימצאו חלקים באתר שטרם הונגשו במלואם. אנו ממשיכים לשפר את הנגישות באופן שוטף.",
      "נתקלתם בבעיית נגישות? נשמח שתפנו אלינו ונטפל בכך בהקדם:",
    ],
    coordinatorTitle: "רכז הנגישות",
    coordinatorName: "שם רכז הנגישות: [למילוי]",
    phoneLabel: "טלפון",
    emailLabel: 'דוא"ל',
    email: "accessibility@ctrmedia.co.il",
    note: "* יש לעדכן את שם רכז הנגישות והדוא\"ל לפרטים אמיתיים. מומלץ לבצע בדיקת נגישות ע\"י מורשה נגישות מוסמך.",
  },
  en: {
    title: "Accessibility Statement",
    updated: "Last updated: July 2026",
    body: [
      "This CTR media website strives to provide a convenient and accessible experience for all users, including people with disabilities, out of a commitment to equal rights.",
      "Efforts and resources have been invested to make the site accessible in accordance with the Israeli Equal Rights for Persons with Disabilities Regulations (2013) and the Israeli Standard SI 5568, based on the WCAG 2.0 Level AA guidelines.",
      "The site supports full keyboard navigation, proper semantic structure, alternative text for images, adequate color contrast, and an accessibility menu allowing personal adjustments (text enlargement, contrast, link highlighting, motion pause and more).",
      "Despite our efforts, some parts of the site may not yet be fully accessible. We continue to improve accessibility on an ongoing basis.",
      "Encountered an accessibility issue? Please reach out and we'll address it promptly:",
    ],
    coordinatorTitle: "Accessibility Coordinator",
    coordinatorName: "Coordinator name: [to be filled]",
    phoneLabel: "Phone",
    emailLabel: "Email",
    email: "accessibility@ctrmedia.co.il",
    note: "* Update the coordinator name and email to real details. A professional accessibility audit is recommended.",
  },
};

function loadState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE) || "{}");
  } catch {
    return {};
  }
}

export default function Accessibility() {
  const { t, lang } = useLang();
  const a = t.a11y;
  const [open, setOpen] = useState(false);
  const [statementOpen, setStatementOpen] = useState(false);
  const [s, setS] = useState(loadState);
  const panelRef = useRef(null);

  /* החלת ההגדרות על ה-<html> + שמירה */
  useEffect(() => {
    const el = document.documentElement;
    const fontIdx = s.fontIdx || 0;
    el.style.setProperty("--a11y-font-scale", (FONT_STEPS[fontIdx] || 100) / 100);
    el.classList.toggle("a11y-contrast", !!s.contrast);
    el.classList.toggle("a11y-invert", !!s.invert);
    el.classList.toggle("a11y-grayscale", !!s.grayscale);
    el.classList.toggle("a11y-links", !!s.links);
    el.classList.toggle("a11y-readable", !!s.readable);
    el.classList.toggle("a11y-bigcursor", !!s.bigcursor);
    el.classList.toggle("a11y-stop-motion", !!s.stopMotion);
    try {
      localStorage.setItem(STORAGE, JSON.stringify(s));
    } catch {
      /* ignore */
    }
  }, [s]);

  /* פתיחת הצהרת הנגישות מהפוטר (אירוע גלובלי) */
  useEffect(() => {
    const openStatement = () => setStatementOpen(true);
    window.addEventListener("open-a11y-statement", openStatement);
    return () => window.removeEventListener("open-a11y-statement", openStatement);
  }, []);

  /* סגירה במקש Esc */
  useEffect(() => {
    if (!open && !statementOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        setStatementOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, statementOpen]);

  const toggle = (k) => setS((p) => ({ ...p, [k]: !p[k] }));
  const fontStep = (dir) =>
    setS((p) => {
      const next = Math.max(0, Math.min(FONT_STEPS.length - 1, (p.fontIdx || 0) + dir));
      return { ...p, fontIdx: next };
    });
  const reset = () => setS({});

  const controls = [
    { key: "contrast", label: a.contrast, Icon: Contrast },
    { key: "invert", label: a.invert, Icon: Sun },
    { key: "grayscale", label: a.grayscale, Icon: Contrast },
    { key: "links", label: a.links, Icon: Link2 },
    { key: "readable", label: a.readable, Icon: Type },
    { key: "bigcursor", label: a.bigCursor, Icon: MousePointer2 },
    { key: "stopMotion", label: a.stopMotion, Icon: PauseCircle },
  ];

  const st = STATEMENT[lang] || STATEMENT.he;

  return (
    <>
      {/* כפתור פתיחת התפריט */}
      <button
        className="a11y-fab"
        onClick={() => setOpen((o) => !o)}
        aria-label={a.openMenu}
        aria-expanded={open}
      >
        <A11yIcon size={26} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="a11y-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="a11y-panel"
              role="dialog"
              aria-label={a.title}
              ref={panelRef}
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="a11y-panel__head">
                <span>
                  <A11yIcon size={20} /> {a.title}
                </span>
                <button onClick={() => setOpen(false)} aria-label={a.close}>
                  <X size={20} />
                </button>
              </div>

              {/* גודל טקסט */}
              <div className="a11y-font">
                <span>{a.textSize}</span>
                <div className="a11y-font__btns">
                  <button onClick={() => fontStep(-1)} aria-label={a.textSmaller}>
                    <Minus size={18} />
                  </button>
                  <span className="a11y-font__val">{FONT_STEPS[s.fontIdx || 0]}%</span>
                  <button onClick={() => fontStep(1)} aria-label={a.textBigger}>
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              {/* כפתורי מצב */}
              <div className="a11y-grid">
                {controls.map(({ key, label, Icon }) => (
                  <button
                    key={key}
                    className={`a11y-toggle ${s[key] ? "is-on" : ""}`}
                    onClick={() => toggle(key)}
                    aria-pressed={!!s[key]}
                  >
                    <Icon size={20} />
                    {label}
                  </button>
                ))}
              </div>

              <div className="a11y-panel__foot">
                <button className="a11y-reset" onClick={reset}>
                  <RotateCcw size={16} /> {a.reset}
                </button>
                <button className="a11y-statement-link" onClick={() => setStatementOpen(true)}>
                  {a.statement}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* מודל הצהרת נגישות */}
      <AnimatePresence>
        {statementOpen && (
          <motion.div
            className="a11y-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setStatementOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label={st.title}
          >
            <motion.div
              className="a11y-modal card-pop"
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.97 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="a11y-modal__close" onClick={() => setStatementOpen(false)} aria-label={a.close}>
                <X size={22} />
              </button>
              <h2>{st.title}</h2>
              <p className="a11y-modal__updated">{st.updated}</p>
              {st.body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              <div className="a11y-modal__contact">
                <strong>{st.coordinatorTitle}</strong>
                <span>{st.coordinatorName}</span>
                <span>
                  {st.phoneLabel}: <a href={`tel:${PHONE_DISPLAY}`}>{PHONE_DISPLAY}</a>
                </span>
                <span>
                  {st.emailLabel}: <a href={`mailto:${st.email}`}>{st.email}</a>
                </span>
              </div>
              <p className="a11y-modal__note">{st.note}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
