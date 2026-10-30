import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Timer, Target, Gift, Lock, Copy, Check, RotateCcw, MessageCircle, CircleCheck, CircleX, Search } from "lucide-react";
import { waLink, CRM_WEBHOOK_URL } from "../config.js";
import { useLang } from "../i18n.jsx";
import { sendLeadToCrm, pushLeadConversion } from "../attribution.js";
import { insertLeadToSupabase } from "../supabase.js";
import { Sparkle } from "./Decor.jsx";

const ease = [0.22, 1, 0.36, 1];

/* ==== הגדרות המשחק ==== */
const GAME_SECONDS = 60;
const PENALTY_SECONDS = 3; // לחיצה על משהו תקין
const COUPON_DAYS = 14;
const STORAGE = "ctr-leak-game";

/* מבנה החשבון המדומה — הטקסטים עצמם ב-t.game.items */
const PANELS = [
  { id: "settings", items: ["networks", "bidding", "budget", "location", "schedule", "conversion"] },
  { id: "keywords", items: ["kwExact", "kwPhrase"] },
  { id: "terms", items: ["termBad", "termGood"] },
  { id: "ads", items: ["adsCount", "assets"] },
];
const LEAKS = ["networks", "bidding", "location", "conversion", "termBad", "adsCount"];

/* דרגות פרס — מהגבוהה לנמוכה. הטקסט ב-t.game.prizes[id] */
const TIERS = [
  { id: "top", min: 5, code: "LEAK15" },
  { id: "mid", min: 3, code: "LEAK10" },
  { id: "low", min: 0, code: "AUDIT" },
];
const tierFor = (score) => TIERS.find((tr) => score >= tr.min);

function makeCode(tier) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let rand = "";
  for (let i = 0; i < 4; i++) rand += chars[Math.floor(Math.random() * chars.length)];
  return `CTR-${tier.code}-${rand}`;
}

function readClaim() {
  try {
    const c = JSON.parse(localStorage.getItem(STORAGE));
    return c && c.code && c.expires > Date.now() ? c : null;
  } catch {
    return null;
  }
}

function track(event, data = {}) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...data });
}

export default function LeakGame({ onOpenPrivacy }) {
  const { t, lang, locale } = useLang();
  const G = t.game;
  const [phase, setPhase] = useState("intro"); // intro | play | result
  const [deadline, setDeadline] = useState(0);
  const [now, setNow] = useState(0);
  const [found, setFound] = useState([]);
  const [wrong, setWrong] = useState([]);
  const [toast, setToast] = useState(null);
  const [penaltyKey, setPenaltyKey] = useState(0);
  const toastTimer = useRef(0);
  const frameRef = useRef(null);

  const left = phase === "play" ? Math.max(0, (deadline - now) / 1000) : GAME_SECONDS;
  const score = found.length;

  /* טיימר */
  useEffect(() => {
    if (phase !== "play") return;
    const id = setInterval(() => setNow(Date.now()), 100);
    return () => clearInterval(id);
  }, [phase]);

  /* סיום: נגמר הזמן או שכל הדליפות נמצאו (השהייה קצרה כדי לראות את ההסבר האחרון) */
  useEffect(() => {
    if (phase !== "play") return;
    if (found.length === LEAKS.length) {
      const id = setTimeout(() => finish(found.length), 1400);
      return () => clearTimeout(id);
    }
    if (left <= 0) finish(found.length);
  }, [phase, left, found]);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  /* מסך התוצאה קצר מהחשבון — מחזירים את הגולש לראש המסגרת (בעיקר בנייד) */
  useEffect(() => {
    const el = frameRef.current;
    if (phase === "result" && el && el.getBoundingClientRect().top < 0) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [phase]);

  const start = () => {
    const ts = Date.now();
    setFound([]);
    setWrong([]);
    setToast(null);
    setNow(ts);
    setDeadline(ts + GAME_SECONDS * 1000);
    setPhase("play");
    track("leak_game_start");
  };

  function finish(n) {
    setPhase("result");
    setToast(null);
    track("leak_game_complete", { game_score: n, game_tier: tierFor(n).id });
  }

  const showToast = (next) => {
    clearTimeout(toastTimer.current);
    setToast(next);
    toastTimer.current = setTimeout(() => setToast(null), next.type === "leak" ? 4200 : 1600);
  };

  const pick = (id) => {
    if (phase !== "play" || found.includes(id) || wrong.includes(id)) return;
    if (LEAKS.includes(id)) {
      setFound((f) => [...f, id]);
      showToast({ type: "leak", id, key: Date.now() });
    } else {
      setWrong((w) => [...w, id]);
      setDeadline((d) => d - PENALTY_SECONDS * 1000);
      setPenaltyKey((k) => k + 1);
      showToast({ type: "fine", id, key: Date.now() });
    }
  };

  return (
    <section className="section game" id="game">
      <div className="container">
        <div className="center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease }}
          >
            <span className="section-tag">
              <Target size={15} />
              {G.tag}
            </span>
            <h2 className="section-title">
              {G.titleA}
              <span className="grad-text">{G.titleMark}</span>
            </h2>
            <p className="section-sub">{G.sub}</p>
          </motion.div>
        </div>

        <motion.div
          ref={frameRef}
          className="game__frame card-pop"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease }}
        >
          {phase === "result" ? (
            <GameResult G={G} score={score} found={found} lang={lang} locale={locale} t={t} onReplay={start} onOpenPrivacy={onOpenPrivacy} />
          ) : (
            <>
              <Hud G={G} left={left} score={score} active={phase === "play"} penaltyKey={penaltyKey} onFinish={() => finish(found.length)} />
              <div className="game__stage">
                <AdAccount G={G} locked={phase !== "play"} found={found} wrong={wrong} onPick={pick} />

                <AnimatePresence>
                  {phase === "intro" && (
                    <motion.div className="game__intro" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                      <motion.div
                        className="game__intro-card"
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, ease, delay: 0.2 }}
                      >
                        <span className="game__intro-icon">
                          <Search size={28} />
                        </span>
                        <h3>{G.introTitle}</h3>
                        <ul className="game__rules">
                          {G.introRules.map((r, i) => (
                            <li key={i}>
                              <span>{i + 1}</span>
                              {r}
                            </li>
                          ))}
                        </ul>
                        <div className="game__prize-chips">
                          {TIERS.map((tr) => (
                            <span key={tr.id} className={`game__chip game__chip--${tr.id}`}>
                              <strong>{G.chipScore[tr.id]}</strong>
                              {G.chipPrize[tr.id]}
                            </span>
                          ))}
                        </div>
                        <button type="button" className="btn btn-primary btn-lg game__start" onClick={start}>
                          <Timer size={20} />
                          {G.start}
                        </button>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="game__toast-wrap" aria-live="polite">
                  <AnimatePresence mode="wait">
                    {toast && (
                      <motion.div
                        key={toast.key}
                        className={`game__toast game__toast--${toast.type}`}
                        initial={{ opacity: 0, y: 24, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 12 }}
                        transition={{ duration: 0.3, ease }}
                      >
                        {toast.type === "leak" ? (
                          <>
                            <strong>
                              <CircleX size={18} />
                              {G.leaks[toast.id].title}
                            </strong>
                            <p>{G.leaks[toast.id].why}</p>
                          </>
                        ) : (
                          <strong>
                            <CircleCheck size={18} />
                            {G.fine}
                            <span className="game__toast-pen">−{PENALTY_SECONDS}s</span>
                          </strong>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}

/* ==== שורת מצב: טיימר + מונה דליפות ==== */
function Hud({ G, left, score, active, penaltyKey, onFinish }) {
  const pct = left / GAME_SECONDS;
  const urgent = active && left <= 10;
  return (
    <div className={`game__hud ${urgent ? "is-urgent" : ""}`}>
      <div className="game__timer">
        <Timer size={18} />
        <motion.span key={penaltyKey} className="game__secs" animate={penaltyKey ? { scale: [1.35, 1] } : {}} transition={{ duration: 0.35 }}>
          {Math.ceil(left)}
        </motion.span>
        <span className="game__timer-bar">
          <span style={{ transform: `scaleX(${pct})` }} />
        </span>
      </div>
      <div className="game__count" aria-label={`${G.found} ${score}/${LEAKS.length}`}>
        <span className="game__count-label">{G.found}</span>
        {LEAKS.map((_, i) => (
          <span key={i} className={`game__dot ${i < score ? "is-on" : ""}`} />
        ))}
      </div>
      {active && (
        <button type="button" className="game__done" onClick={onFinish}>
          {G.finish}
        </button>
      )}
    </div>
  );
}

/* ==== החשבון המדומה ==== */
function AdAccount({ G, locked, found, wrong, onPick }) {
  const M = G.mock;
  return (
    <div className={`acct ${locked ? "is-locked" : ""}`} aria-hidden={locked}>
      <div className="acct__bar">
        <span className="acct__dots">
          <i />
          <i />
          <i />
        </span>
        <span className="acct__app">{M.app}</span>
        <span className="acct__camp">{M.campaign}</span>
        <span className="acct__status">● {M.status}</span>
      </div>

      <div className="acct__kpis">
        {M.kpis.map((k) => (
          <div key={k.label} className="acct__kpi">
            <span>{k.label}</span>
            <strong>{k.value}</strong>
          </div>
        ))}
      </div>

      <div className="acct__panels">
        {PANELS.map((p) => (
          <div key={p.id} className={`acct__panel acct__panel--${p.id}`}>
            <h4>{M.panels[p.id]}</h4>
            <div className="acct__rows">
              {p.items.map((id) => {
                const it = G.items[id];
                const isFound = found.includes(id);
                const isWrong = wrong.includes(id);
                return (
                  <button
                    key={id}
                    type="button"
                    tabIndex={locked ? -1 : 0}
                    className={`acct__row ${isFound ? "is-found" : ""} ${isWrong ? "is-wrong" : ""}`}
                    onClick={() => onPick(id)}
                  >
                    <span className="acct__label">{it.label}</span>
                    <span className="acct__value">{it.value}</span>
                    {isFound && (
                      <motion.span className="acct__mark acct__mark--leak" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 18 }}>
                        <CircleX size={16} />
                      </motion.span>
                    )}
                    {isWrong && (
                      <span className="acct__mark acct__mark--ok">
                        <Check size={14} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ==== מסך תוצאה + מתנה + טופס ליד ==== */
function GameResult({ G, score, found, lang, locale, t, onReplay, onOpenPrivacy }) {
  const tier = tierFor(score);
  const [claim, setClaim] = useState(readClaim);
  const [fresh, setFresh] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const L = t.lead;

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  /* מימוש — אם כבר יש קוד, משתמשים בדרגה ששמורה בו */
  const claimTier = claim ? TIERS.find((tr) => tr.id === claim.tier) || tier : tier;
  const expiresTxt = claim ? new Date(claim.expires).toLocaleDateString(locale, { day: "numeric", month: "long" }) : "";

  const waMsgFor = (c) => {
    const m = G.waMsg;
    return [m.intro, `${m.score}: ${c.score}/${LEAKS.length}`, `${m.prize}: ${G.prizes[c.tier]}`, `${m.code}: ${c.code}`, m.outro].join("\n");
  };

  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !/^0\d{1,2}-?\d{7}$/.test(form.phone.replace(/[\s-]/g, ""))) {
      setError(L.error);
      return;
    }
    setError("");
    const c = { code: makeCode(tier), tier: tier.id, score, expires: Date.now() + COUPON_DAYS * 864e5 };
    try {
      localStorage.setItem(STORAGE, JSON.stringify(c));
    } catch {
      /* Storage can be unavailable in private or embedded browsers. */
    }

    // מעקב המרות — אותו form_success של הטופס הראשי, מסומן כמקור "משחק"
    pushLeadConversion({ name: form.name, phone: form.phone, email: form.email, source: "leak_game" });

    insertLeadToSupabase({
      name: form.name,
      phone: form.phone,
      email: form.email,
      lang,
      game: { score: c.score, prize: c.tier, coupon: c.code },
    });

    sendLeadToCrm(CRM_WEBHOOK_URL, {
      name: form.name,
      phone: form.phone,
      email: form.email,
      form: "leak_game",
      game_score: c.score,
      game_prize: G.prizes[c.tier],
      coupon_code: c.code,
    });

    setClaim(c);
    setFresh(true);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(claim.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked — the code is visible anyway */
    }
  };

  return (
    <motion.div className="gres" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }}>
      <div className="gres__head">
        <span className="gres__score">
          <strong>{score}</strong>/{LEAKS.length}
        </span>
        <div>
          <h3>{G.resultTitle[tier.id]}</h3>
          <p>{G.resultSub}</p>
        </div>
      </div>

      <div className="gres__grid">
        {/* ---- המתנה ---- */}
        <div className="gres__prize">
          <Sparkle size={24} className="gres__sp-1" />
          <Sparkle size={16} className="gres__sp-2" delay={0.2} />
          <motion.span
            className="gres__gift"
            animate={claim ? { rotate: 0 } : { rotate: [0, -8, 8, -5, 0] }}
            transition={claim ? {} : { duration: 0.9, repeat: Infinity, repeatDelay: 1.6 }}
          >
            <Gift size={34} />
          </motion.span>
          <span className="gres__prize-label">{claim && !fresh ? G.alreadyClaimed : G.prizeLabel}</span>
          <p className="gres__prize-text">{G.prizes[claimTier.id]}</p>

          {claim ? (
            <motion.div className="gres__claimed" initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.45, ease }}>
              <div className="gres__code">
                <code>{claim.code}</code>
                <button type="button" onClick={copy} aria-label={G.copy}>
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? G.copied : G.copy}
                </button>
              </div>
              <span className="gres__valid">
                {G.validUntil} {expiresTxt}
              </span>
              {fresh && <p className="gres__note">{G.claimedNote}</p>}
              <a href={waLink(waMsgFor(claim))} target="_blank" rel="noreferrer" className="btn btn-whatsapp gres__wa">
                <MessageCircle size={19} />
                {G.redeemWa}
              </a>
            </motion.div>
          ) : (
            <form className="gres__form" onSubmit={submit} noValidate>
              <div className="gres__code gres__code--locked" aria-hidden="true">
                <Lock size={16} />
                <code>CTR-••••••-••••</code>
              </div>
              <span className="gres__form-title">{G.claimTitle}</span>
              <div className="field">
                <label htmlFor="game-name">{L.nameLabel}</label>
                <input id="game-name" type="text" autoComplete="name" placeholder={L.namePh} value={form.name} onChange={update("name")} required />
              </div>
              <div className="field">
                <label htmlFor="game-phone">{L.phoneLabel}</label>
                <input id="game-phone" type="tel" inputMode="tel" autoComplete="tel" placeholder={L.phonePh} value={form.phone} onChange={update("phone")} required />
              </div>
              <div className="field">
                <label htmlFor="game-email">{L.emailLabel}</label>
                <input id="game-email" type="email" inputMode="email" autoComplete="email" placeholder={L.emailPh} value={form.email} onChange={update("email")} />
              </div>
              {error && (
                <p className="lead__error" role="alert">
                  {error}
                </p>
              )}
              <button type="submit" className="btn btn-primary gres__submit">
                <Gift size={18} />
                {G.claimBtn}
              </button>
              <p className="lead__privacy">
                {L.privacy}{" "}
                <button type="button" className="privacy-link" onClick={onOpenPrivacy}>
                  {L.privacyLink}
                </button>
              </p>
            </form>
          )}
          <p className="gres__terms">{G.terms}</p>
        </div>

        {/* ---- פירוט הדליפות ---- */}
        <div className="gres__list">
          {LEAKS.map((id, i) => {
            const ok = found.includes(id);
            return (
              <motion.div
                key={id}
                className={`gres__leak ${ok ? "is-found" : "is-missed"}`}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, ease, delay: 0.15 + i * 0.07 }}
              >
                <span className="gres__leak-tag">{ok ? G.foundTag : G.missedTag}</span>
                <strong>{G.leaks[id].title}</strong>
                <p>{G.leaks[id].why}</p>
              </motion.div>
            );
          })}
          <button type="button" className="gres__replay" onClick={onReplay}>
            <RotateCcw size={16} />
            {G.replay}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
