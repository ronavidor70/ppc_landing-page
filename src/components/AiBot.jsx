import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  Bot,
  CalendarCheck,
  Check,
  CheckCheck,
  Flame,
  Funnel,
  Handshake,
  MessageCircle,
  MessagesSquare,
  MousePointerClick,
  Phone,
  RotateCcw,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import { waLink } from "../config.js";
import { useLang } from "../i18n.jsx";

const ease = [0.22, 1, 0.36, 1];
const stepIcons = [MousePointerClick, Zap, Funnel, Handshake];
const featureIcons = [MessagesSquare, Zap, Funnel, Handshake];

/* ===== ציר הזמן של ההדגמה (מילישניות) ===== */
const TICK = 100;
const FORM = { name: 300, phone: 1000, interest: 1800, press: 2300, sent: 2700 };
const LEAD_IN = 2800; // הליד נכנס ללוח
const MSG_AT = [4600, 6400, 8000, 9800, 11400, 13000, 14800, 16400, 18000]; // זוגי = הבוט, אי-זוגי = הלקוח
const TYPING_LEAD = 1300; // כמה זמן "מקליד/ה..." לפני הודעת בוט
const CHECK_AT = [6400, 9800, 13000, 18000]; // מתי כל סעיף סינון מתמלא
const SCORE_STEPS = [
  [LEAD_IN, 12],
  [6400, 38],
  [9800, 64],
  [13000, 82],
  [18000, 96],
];
const HOT_AT = 18900;
const TOTAL = 27000;
const STAGE_AT = [0, LEAD_IN + 200, 6400, 18000];

const typed = (text, start, t, speed = 55) => {
  if (t < start) return "";
  return text.slice(0, Math.min(text.length, Math.floor((t - start) / speed) + 1));
};

/* ===== בוט מכירות AI לוואטסאפ: מהליד בדף ועד ליד חם שמוכן לסגירה ===== */
export default function AiBot() {
  const { t, dir } = useLang();
  const B = t.aibot;
  const D = B.demo;
  const reduceMotion = useReducedMotion();
  const panelRef = useRef(null);
  const inView = useInView(panelRef, { amount: 0.35 });
  const [time, setTime] = useState(0);

  const isStatic = reduceMotion;
  const now = isStatic ? TOTAL - 1 : time;

  // השעון רץ רק כשהפאנל על המסך, ומתחיל מחדש בסוף
  useEffect(() => {
    if (isStatic || !inView) return;
    const id = setInterval(() => {
      if (document.documentElement.classList.contains("a11y-stop-motion")) {
        setTime(TOTAL - 1);
        return;
      }
      setTime((v) => (v + TICK >= TOTAL ? 0 : v + TICK));
    }, TICK);
    return () => clearInterval(id);
  }, [inView, isStatic]);

  const stage = STAGE_AT.reduce((acc, at, i) => (now >= at ? i : acc), 0);
  const visibleMsgs = D.chat.filter((_, i) => now >= MSG_AT[i]);
  const nextIdx = visibleMsgs.length;
  const botTyping =
    nextIdx < MSG_AT.length && nextIdx % 2 === 0 && now >= MSG_AT[nextIdx] - TYPING_LEAD && now >= LEAD_IN + 300;
  const leadIn = now >= LEAD_IN;
  const score = SCORE_STEPS.reduce((acc, [at, v]) => (now >= at ? v : acc), 0);
  const hot = now >= HOT_AT;
  const tier = hot ? D.crm.tierHot : score >= 50 ? D.crm.tierWarm : D.crm.tierCold;
  const sent = now >= FORM.sent;
  const pressing = now >= FORM.press && !sent;

  return (
    <section className="section aibot" id="ai-bot">
      <div className="aibot__dots" aria-hidden="true" />
      <div className="blob aibot__blob aibot__blob--a" aria-hidden="true" />
      <div className="blob aibot__blob aibot__blob--b" aria-hidden="true" />

      <div className="container">
        <motion.div
          className="center aibot__head"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
        >
          <span className="section-tag">
            <Bot size={16} />
            {B.tag}
          </span>
          <h2 className="section-title">
            {B.titleA}
            <br />
            {B.titleB}
            <span className="grad-text">{B.titleMark}</span>
          </h2>
          <p className="section-sub">{B.sub}</p>
          <ul className="aibot__tech">
            {B.tech.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </motion.div>

        {/* ===== הפאנל החי ===== */}
        <p className="sr-only">{B.demoA11y}</p>
        <motion.div
          ref={panelRef}
          className="aibot__panel"
          aria-hidden="true"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease }}
        >
          <div className="aibot__bar">
            <span className="aibot__lights">
              <i />
              <i />
              <i />
            </span>
            <span className="aibot__bar-title">
              <Bot size={15} />
              {D.window}
            </span>
            <span className="aibot__live">
              <span className="aibot__live-dot" />
              LIVE
            </span>
            <span className="aibot__demo-pill">{D.demoPill}</span>
            {!isStatic ? (
              <button type="button" className="aibot__replay" tabIndex={-1} onClick={() => setTime(0)}>
                <RotateCcw size={14} />
                <span>{D.replay}</span>
              </button>
            ) : null}
          </div>

          {/* שלבים */}
          <ol className="aibot__steps">
            {B.steps.map((s, i) => {
              const Icon = stepIcons[i];
              const state = i < stage ? "done" : i === stage ? "active" : "idle";
              return (
                <li key={s} className={`aibot__step aibot__step--${state}`}>
                  <span className="aibot__step-icon">{state === "done" ? <Check size={16} strokeWidth={3} /> : <Icon size={16} />}</span>
                  <span className="aibot__step-label">{s}</span>
                </li>
              );
            })}
            <span className="aibot__steps-track">
              <span className="aibot__steps-fill" style={{ transform: `scaleX(${stage / 3})` }} />
            </span>
          </ol>

          <div className="aibot__flow">
            {/* 1 — טופס בדף הנחיתה */}
            <div className={`aibot__col aibot__col--form${stage === 0 ? " is-active" : ""}`}>
              <span className="aibot__col-label">
                <b>1</b>
                {D.colForm}
              </span>
              <div className="aibot__lp">
                <div className="aibot__lp-hero">
                  <span className="aibot__lp-logo">{D.form.brand}</span>
                  <strong>{D.form.title}</strong>
                  <small>{D.form.sub}</small>
                </div>
                <div className="aibot__lp-form">
                  <label>
                    <span>{D.form.nameLabel}</span>
                    <span className="aibot__field">
                      {typed(D.form.name, FORM.name, now)}
                      {now >= FORM.name && now < FORM.phone ? <i className="aibot__caret" /> : null}
                    </span>
                  </label>
                  <label>
                    <span>{D.form.phoneLabel}</span>
                    <span className="aibot__field aibot__field--ltr">
                      {typed(D.form.phone, FORM.phone, now, 45)}
                      {now >= FORM.phone && now < FORM.interest ? <i className="aibot__caret" /> : null}
                    </span>
                  </label>
                  <label>
                    <span>{D.form.interestLabel}</span>
                    <span className={`aibot__field aibot__field--select${now >= FORM.interest ? " is-filled" : ""}`}>
                      {now >= FORM.interest ? D.form.interest : D.form.interestPh}
                    </span>
                  </label>
                  <span className={`aibot__submit${pressing ? " is-pressing" : ""}${sent ? " is-sent" : ""}`}>
                    {sent ? (
                      <>
                        <Check size={16} strokeWidth={3} />
                        {D.form.sent}
                      </>
                    ) : (
                      D.form.submit
                    )}
                    {pressing ? <MousePointerClick className="aibot__cursor" size={22} /> : null}
                  </span>
                </div>
              </div>
              <div className={`aibot__toast${leadIn ? " is-on" : ""}`}>
                <span className="aibot__toast-icon">
                  <Sparkles size={15} />
                </span>
                <span>
                  <b>{D.toastTitle}</b>
                  <small>{D.toastSub}</small>
                </span>
              </div>
            </div>

            <span className={`aibot__link${stage >= 1 ? " is-on" : ""}`}>
              <ArrowLeft size={18} />
            </span>

            {/* 2 — השיחה בוואטסאפ */}
            <div className={`aibot__col aibot__col--chat${stage === 1 || stage === 2 ? " is-active" : ""}`}>
              <span className="aibot__col-label">
                <b>2</b>
                {D.colChat}
              </span>
              <div className="aibot__phone">
                <div className="aibot__wa-head">
                  <span className="aibot__wa-avatar">{D.biz.initial}</span>
                  <span className="aibot__wa-who">
                    <b>
                      {D.biz.name}
                      <span className="aibot__wa-verified">
                        <Check size={9} strokeWidth={4} />
                      </span>
                    </b>
                    <small className={botTyping ? "is-typing" : ""}>{botTyping ? D.biz.typing : D.biz.online}</small>
                  </span>
                  <Phone size={17} className="aibot__wa-call" />
                </div>
                <div className="aibot__wa-body">
                  <span className="aibot__wa-day">{D.biz.today}</span>
                  {visibleMsgs.map((m, i) => {
                    const fromBot = i % 2 === 0;
                    return (
                      <div key={i} className={`aibot__msg ${fromBot ? "aibot__msg--in" : "aibot__msg--out"}`}>
                        <p>{m}</p>
                        <span className="aibot__msg-meta">
                          {D.times[i]}
                          {!fromBot ? <CheckCheck size={14} /> : null}
                        </span>
                      </div>
                    );
                  })}
                  {botTyping ? (
                    <div className="aibot__msg aibot__msg--in aibot__typing">
                      <i />
                      <i />
                      <i />
                    </div>
                  ) : null}
                </div>
                <div className="aibot__wa-input">
                  <span>{D.biz.inputPh}</span>
                  <i>
                    <MessageCircle size={15} />
                  </i>
                </div>
              </div>
              <span className="aibot__sticker">{D.sticker}</span>
            </div>

            <span className={`aibot__link${stage >= 3 ? " is-on" : ""}`}>
              <ArrowLeft size={18} />
            </span>

            {/* 3 — הלוח שלך */}
            <div className={`aibot__col aibot__col--crm${stage === 3 ? " is-active" : ""}`}>
              <span className="aibot__col-label">
                <b>3</b>
                {D.colCrm}
              </span>
              <div className={`aibot__crm${leadIn ? " is-in" : ""}`}>
                {leadIn ? (
                  <>
                    <div className="aibot__crm-top">
                      <span className="aibot__crm-avatar">{D.form.name.charAt(0)}</span>
                      <span className="aibot__crm-who">
                        <b>{D.form.name}</b>
                        <small>{D.crm.source}</small>
                      </span>
                      <span className={`aibot__tier${hot ? " is-hot" : score >= 50 ? " is-warm" : ""}`}>
                        {hot ? <Flame size={13} /> : null}
                        {tier}
                      </span>
                    </div>

                    <div className="aibot__score">
                      <span>{D.crm.scoreLabel}</span>
                      <b>{score}</b>
                      <span className="aibot__score-track">
                        <span className="aibot__score-fill" style={{ transform: `scaleX(${score / 100})` }} />
                      </span>
                    </div>

                    <div className="aibot__resp">
                      <Zap size={14} />
                      {now >= MSG_AT[0] ? D.crm.response : D.crm.responsePending}
                    </div>

                    <ul className="aibot__checks">
                      {D.crm.checks.map((c, i) => {
                        const ok = now >= CHECK_AT[i];
                        return (
                          <li key={c.label} className={ok ? "is-ok" : ""}>
                            <span className="aibot__check-icon">{ok ? <Check size={12} strokeWidth={3.5} /> : null}</span>
                            <span className="aibot__check-label">{c.label}</span>
                            <span className="aibot__check-val">{ok ? c.value : D.crm.pending}</span>
                          </li>
                        );
                      })}
                    </ul>

                    <div className={`aibot__handoff${hot ? " is-on" : ""}`}>
                      <span className="aibot__handoff-title">
                        <Flame size={16} />
                        {D.crm.hotTitle}
                      </span>
                      <p>{D.crm.summary}</p>
                      <span className="aibot__handoff-btns">
                        <span className="aibot__call">
                          <Phone size={14} />
                          {D.crm.call}
                        </span>
                        <span className="aibot__cal">
                          <CalendarCheck size={14} />
                          {D.crm.meeting}
                        </span>
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="aibot__crm-empty">
                    <span className="aibot__radar" />
                    {D.crm.waiting}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ===== יתרונות ===== */}
        <div className="aibot__features">
          {B.features.map((f, i) => {
            const Icon = featureIcons[i];
            return (
              <motion.div
                key={f.title}
                className="aibot__feature card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, ease, delay: i * 0.08 }}
              >
                <span className="aibot__feature-icon">
                  <Icon size={20} />
                </span>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* ===== הזווית של הפרפורמנס: סיגנל איכותי חוזר לקמפיינים ===== */}
        <motion.div
          className="aibot__signal"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, ease }}
        >
          <span className="aibot__signal-icon">
            <TrendingUp size={24} />
          </span>
          <div>
            <span className="aibot__signal-kicker">{B.signal.kicker}</span>
            <h3>{B.signal.title}</h3>
            <p>{B.signal.desc}</p>
          </div>
        </motion.div>

        <div className="aibot__cta">
          <a href="#lead" className="btn btn-primary btn-lg">
            <Bot size={20} />
            {B.cta}
          </a>
          <a href={waLink(B.waMsg)} target="_blank" rel="noreferrer" className="btn btn-whatsapp">
            <MessageCircle size={19} />
            {B.waBtn}
          </a>
        </div>
        <p className="aibot__cta-note" dir={dir}>
          {B.ctaNote}
        </p>
      </div>
    </section>
  );
}
