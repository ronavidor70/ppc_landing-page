import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, BadgeCheck } from "lucide-react";
import { useLang } from "../i18n.jsx";
import useCountUp from "../hooks/useCountUp.js";

const ease = [0.22, 1, 0.36, 1];

/* נתונים קבועים — התוויות מגיעות מקובץ התרגום לפי key */
const cases = [
  {
    key: "ecomFb",
    platform: "Facebook Ads",
    img: "/results/ecom-facebook.png",
    value: 28.4,
    decimals: 1,
    metrics: [
      { label: "spent", value: "₪4,859" },
      { label: "purchases", value: "788" },
      { label: "revenue", value: "₪138,240" },
    ],
  },
  {
    key: "ecomGoogle",
    platform: "Google Ads",
    img: "/results/ecom2-google.png",
    value: 13.4,
    decimals: 1,
    metrics: [
      { label: "spent", value: "₪6,860" },
      { label: "conversions", value: "196" },
      { label: "sales", value: "₪92,100" },
    ],
  },
  {
    key: "cyber",
    platform: "Google Ads",
    img: "/results/cyber-google.png",
    value: 623,
    decimals: 0,
    metrics: [
      { label: "conversions", value: "623" },
      { label: "cpa", value: "₪73" },
      { label: "clicks", value: "1,520" },
    ],
  },
  {
    key: "insurance",
    platform: "Google Ads",
    img: "/results/insurance-google.png",
    value: 340,
    decimals: 0,
    metrics: [
      { label: "conversions", value: "340" },
      { label: "cpa", value: "₪63.7" },
      { label: "cpc", value: "₪3.16" },
    ],
  },
  {
    key: "finance",
    platform: "Google Ads",
    img: "/results/finance-google.png",
    value: 281,
    decimals: 0,
    metrics: [
      { label: "conversions", value: "281" },
      { label: "cpa", value: "₪29.5" },
      { label: "clicks", value: "2,470" },
    ],
  },
  {
    key: "ecomFbUs",
    platform: "Facebook Ads",
    img: "/results/ecom2-facebook.png",
    value: 9.25,
    decimals: 2,
    metrics: [
      { label: "spent", value: "$732" },
      { label: "purchases", value: "97" },
      { label: "revenue", value: "$6,771" },
    ],
  },
];

function HeadlineNumber({ value, decimals, locale }) {
  const { ref, formatted } = useCountUp(value, { decimals, duration: 2, locale });
  return (
    <span ref={ref} className="case__big-num">
      {formatted}
    </span>
  );
}

function CaseCard({ c, i, onZoom, t, locale }) {
  const info = t.results.cases[c.key];
  const ml = t.results.metricsLabels;
  return (
    <motion.article
      className="case card"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease, delay: (i % 3) * 0.12 }}
    >
      <div className="case__head">
        <span className={`case__platform ${c.platform.includes("Google") ? "is-google" : "is-meta"}`}>
          {c.platform}
        </span>
        <span className="case__industry">{info.industry}</span>
      </div>

      <div className="case__headline">
        <HeadlineNumber value={c.value} decimals={c.decimals} locale={locale} />
        <p>{info.headline}</p>
      </div>

      <div className="case__metrics">
        {c.metrics.map((m) => (
          <div key={m.label} className="case__metric">
            <span className="m-value">{m.value}</span>
            <span className="m-label">{ml[m.label]}</span>
          </div>
        ))}
      </div>

      <button className="case__shot" onClick={() => onZoom(c)} aria-label={info.industry}>
        <span className="case__shot-bar" aria-hidden="true">
          <span /><span /><span />
        </span>
        <img src={c.img} alt={`${c.platform}, ${info.industry}`} loading="lazy" />
        <span className="case__shot-overlay">
          <ZoomIn size={18} />
          {t.results.shotOverlay}
        </span>
      </button>
    </motion.article>
  );
}

export default function Results() {
  const { t, locale } = useLang();
  const [zoomed, setZoomed] = useState(null);

  return (
    <section className="section results" id="results">
      <div className="container">
        <div className="center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease }}
          >
            <span className="section-tag">
              <BadgeCheck size={15} />
              {t.results.tag}
            </span>
            <h2 className="section-title">
              {t.results.titleA}
              <span className="grad-text">{t.results.titleMark}</span>
            </h2>
            <p className="section-sub">{t.results.sub}</p>
          </motion.div>
        </div>

        <div className="results__grid">
          {cases.map((c, i) => (
            <CaseCard key={c.key} c={c} i={i} onZoom={setZoomed} t={t} locale={locale} />
          ))}
        </div>

        <motion.div
          className="results__cta center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
        >
          <p>{t.results.ctaText}</p>
          <a href="#lead" className="btn btn-primary">
            {t.results.ctaBtn}
          </a>
        </motion.div>
      </div>

      <AnimatePresence>
        {zoomed && (
          <motion.div
            className="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomed(null)}
            role="dialog"
            aria-modal="true"
            aria-label={t.results.cases[zoomed.key].industry}
          >
            <motion.div
              className="lightbox__inner"
              initial={{ scale: 0.9, y: 24 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 24 }}
              transition={{ duration: 0.35, ease }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="lightbox__close" onClick={() => setZoomed(null)} aria-label="close">
                <X size={20} />
              </button>
              <img src={zoomed.img} alt={t.results.cases[zoomed.key].industry} />
              <div className="lightbox__caption">
                {zoomed.platform} · {t.results.cases[zoomed.key].industry}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
