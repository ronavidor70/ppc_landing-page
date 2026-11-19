import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import {
  ArrowUp,
  ChartLine,
  Check,
  CodeXml,
  FlaskConical,
  Gauge,
  LoaderCircle,
  MessageCircle,
  MousePointerClick,
  Phone,
  Rocket,
  Split,
  Star,
  Target,
  Turtle,
  X,
} from "lucide-react";
import { waLink } from "../config.js";
import { useLang } from "../i18n.jsx";

const ease = [0.22, 1, 0.36, 1];
const featureIcons = [Gauge, Target, MousePointerClick, ChartLine, Split, FlaskConical];

/* מספר שמתגלגל בין ערכים כשהמצב מתחלף */
function RollingNumber({ value, decimals = 0 }) {
  const [shown, setShown] = useState(value);
  const fromRef = useRef(value);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) {
      setShown(value);
      fromRef.current = value;
      return;
    }
    const controls = animate(fromRef.current, value, {
      duration: 1.1,
      ease,
      onUpdate: (v) => {
        fromRef.current = v;
        setShown(v);
      },
    });
    return () => controls.stop();
  }, [value, reduceMotion]);

  return <>{shown.toFixed(decimals)}</>;
}

/* ===== פיתוח דפי נחיתה ב-React: תבנית רגילה מול דף של CTR ===== */
export default function LandingPages() {
  const { t } = useLang();
  const L = t.lp;
  const D = L.demo;
  const reduceMotion = useReducedMotion();
  const stageRef = useRef(null);
  const inView = useInView(stageRef, { once: true, amount: 0.4 });
  const [mode, setMode] = useState("old");
  const [loading, setLoading] = useState(false);
  const touched = useRef(false);

  const isNew = mode === "new";
  const M = isNew ? D.new : D.old;

  // כשהבמה נכנסת למסך: מציגים את התבנית הרגילה נטענת, ואז עוברים לדף של CTR
  useEffect(() => {
    if (!inView || touched.current) return;
    if (reduceMotion) {
      setMode("new");
      return;
    }
    setLoading(true);
    const t1 = setTimeout(() => setLoading(false), 1700);
    const t2 = setTimeout(() => {
      if (!touched.current) setMode("new");
    }, 3600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [inView, reduceMotion]);

  // כל מעבר לתבנית הרגילה מראה שוב את הטעינה האיטית
  const choose = (next) => {
    touched.current = true;
    if (next === mode) return;
    setMode(next);
    if (next === "old" && !reduceMotion) {
      setLoading(true);
      setTimeout(() => setLoading(false), 1700);
    } else {
      setLoading(false);
    }
  };

  return (
    <section className="section lpd" id="landing-pages">
      <div className="blob lpd__blob" aria-hidden="true" />

      <div className="container">
        <motion.div
          className="center lpd__head"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
        >
          <span className="section-tag">
            <CodeXml size={16} />
            {L.tag}
          </span>
          <h2 className="section-title">
            {L.titleA}
            <br />
            {L.titleB}
            <span className="grad-text">{L.titleMark}</span>
          </h2>
          <p className="section-sub">{L.sub}</p>
        </motion.div>

        {/* ===== הבמה: לפני / אחרי ===== */}
        <div className="lpd__stage" ref={stageRef}>
          <div className="lpd__toggle" role="group" aria-label={D.toggleLabel}>
            <span className={`lpd__thumb${isNew ? " is-new" : ""}`} aria-hidden="true" />
            <button type="button" aria-pressed={!isNew} onClick={() => choose("old")}>
              <Turtle size={16} />
              {D.old.tab}
            </button>
            <button type="button" aria-pressed={isNew} onClick={() => choose("new")}>
              <Rocket size={16} />
              {D.new.tab}
            </button>
          </div>

          <div className="lpd__grid">
            <div className="lpd__side">
              <p className={`lpd__verdict${isNew ? " is-new" : ""}`} aria-live="polite">
                {isNew ? <Check size={18} strokeWidth={3} /> : <X size={18} strokeWidth={3} />}
                {M.verdict}
              </p>

              <ul className="lpd__metrics">
                {D.metrics.map((m, i) => {
                  const v = isNew ? m.new : m.old;
                  return (
                    <li key={m.label} className={isNew ? "is-new" : "is-old"}>
                      <span className="lpd__metric-label">{m.label}</span>
                      <span className="lpd__metric-val">
                        {typeof v === "number" ? (
                          <>
                            <RollingNumber value={v} decimals={m.decimals || 0} />
                            {m.unit ? <small>{m.unit}</small> : null}
                          </>
                        ) : (
                          <span className="lpd__metric-text">{v}</span>
                        )}
                      </span>
                      <span className="lpd__metric-track">
                        <span
                          className="lpd__metric-fill"
                          style={{
                            transform: `scaleX(${(isNew ? m.newPct : m.oldPct) / 100})`,
                            transitionDelay: `${i * 0.08}s`,
                          }}
                        />
                      </span>
                    </li>
                  );
                })}
              </ul>
              <span className="lpd__note">{D.note}</span>
            </div>

            <div className="lpd__phone-wrap">
              {/* תוויות שמסבירות מה רואים */}
              {M.pins.map((p, i) => (
                <span
                  key={`${mode}-${p}`}
                  className={`lpd__pin lpd__pin--${i + 1} ${isNew ? "is-new" : "is-old"}`}
                  aria-hidden="true"
                >
                  {isNew ? <Check size={13} strokeWidth={3} /> : <X size={13} strokeWidth={3} />}
                  {p}
                </span>
              ))}

              <div className="lpd__phone" aria-label={isNew ? D.new.a11y : D.old.a11y} role="img">
                <span className="lpd__island" aria-hidden="true" />
                <div className="lpd__screen" aria-hidden="true">
                  {isNew ? <NewPage P={D.newPage} /> : <OldPage P={D.oldPage} loading={loading} />}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== מה נכנס לכל דף ===== */}
        <div className="lpd__features">
          {L.features.map((f, i) => {
            const Icon = featureIcons[i];
            return (
              <motion.div
                key={f.title}
                className="lpd__feature card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, ease, delay: (i % 3) * 0.08 }}
              >
                <span className="lpd__feature-icon">
                  <Icon size={20} />
                </span>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* ===== ההוכחה: הדף הזה ===== */}
        <motion.div
          className="lpd__proof"
          initial={{ opacity: 0, y: 30, rotate: 0 }}
          whileInView={{ opacity: 1, y: 0, rotate: -0.6 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, ease }}
        >
          <span className="lpd__proof-arrow" aria-hidden="true">
            <ArrowUp size={26} strokeWidth={2.6} />
          </span>
          <div className="lpd__proof-text">
            <span className="lpd__proof-kicker">{L.proof.kicker}</span>
            <h3>{L.proof.title}</h3>
            <p>{L.proof.desc}</p>
            <ul>
              {L.proof.chips.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        </motion.div>

        <div className="lpd__cta">
          <a href="#lead" className="btn btn-primary btn-lg">
            <Rocket size={20} />
            {L.cta}
          </a>
          <a href={waLink(L.waMsg)} target="_blank" rel="noreferrer" className="btn btn-whatsapp">
            <MessageCircle size={19} />
            {L.waBtn}
          </a>
        </div>
        <p className="lpd__cta-note">{L.ctaNote}</p>
      </div>
    </section>
  );
}

/* תבנית רגילה: איטית, עמוסה ומסתירה את הפעולה */
function OldPage({ P, loading }) {
  return (
    <div className="lpd-old">
      <div className="lpd-old__url">{P.url}</div>
      {loading ? (
        <div className="lpd-old__loading">
          <LoaderCircle size={30} className="lpd-old__spin" />
          <span>{P.loading}</span>
        </div>
      ) : (
        <div className="lpd-old__page">
          <div className="lpd-old__menu">
            <span className="lpd-old__logo">{P.logo}</span>
            <span className="lpd-old__links">
              <i />
              <i />
              <i />
              <i />
            </span>
          </div>
          <div className="lpd-old__img">
            <span>{P.img}</span>
          </div>
          <h4>{P.title}</h4>
          <p>{P.text}</p>
          <span className="lpd-old__lines">
            <i />
            <i />
            <i />
          </span>
          <div className="lpd-old__form">
            {P.fields.map((f) => (
              <span key={f}>{f}</span>
            ))}
          </div>
          <span className="lpd-old__btn">{P.btn}</span>
          <div className="lpd-old__popup">
            <b>{P.popupTitle}</b>
            <span>{P.popupText}</span>
            <i>
              <X size={10} />
            </i>
          </div>
          <div className="lpd-old__cookie">
            {P.cookie}
            <span>{P.cookieBtn}</span>
          </div>
        </div>
      )}
    </div>
  );
}

/* הדף של CTR: מהיר, ממוקד, פעולה אחת ברורה */
function NewPage({ P }) {
  return (
    <div className="lpd-new">
      <div className="lpd-new__hero">
        <div className="lpd-new__top">
          <span className="lpd-new__logo">
            <i>{P.logoMark}</i>
            {P.logo}
          </span>
          <span className="lpd-new__rating">
            <Star size={11} fill="currentColor" />
            {P.rating}
          </span>
        </div>
        <span className="lpd-new__kicker">{P.kicker}</span>
        <h4>
          {P.titleA}
          <mark>{P.titleMark}</mark>
        </h4>
        <p>{P.sub}</p>
        <div className="lpd-new__form">
          <span>{P.name}</span>
          <span className="lpd-new__ltr">{P.phone}</span>
          <b className="lpd-new__cta">{P.cta}</b>
        </div>
        <small className="lpd-new__micro">
          <Check size={11} strokeWidth={3} />
          {P.micro}
        </small>
      </div>

      <div className="lpd-new__proof">
        {P.stats.map((s) => (
          <span key={s.label}>
            <b>{s.value}</b>
            <small>{s.label}</small>
          </span>
        ))}
      </div>

      <div className="lpd-new__review">
        <span className="lpd-new__stars">
          {[0, 1, 2, 3, 4].map((i) => (
            <Star key={i} size={10} fill="currentColor" />
          ))}
        </span>
        <p>{P.review}</p>
        <small>{P.reviewer}</small>
      </div>

      <div className="lpd-new__sticky">
        <span className="lpd-new__sticky-wa">
          <MessageCircle size={13} />
          {P.stickyWa}
        </span>
        <span className="lpd-new__sticky-call">
          <Phone size={13} />
          {P.stickyCall}
        </span>
      </div>
    </div>
  );
}
