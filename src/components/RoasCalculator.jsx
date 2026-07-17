import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Store, Users, TrendingUp, Sparkles, ArrowLeft } from "lucide-react";
import { waLink } from "../config.js";
import { useLang } from "../i18n.jsx";
import { Coin } from "./Decor.jsx";

const ease = [0.22, 1, 0.36, 1];

/* ==== הגדרות השדות לכל מצב (label = key בתוך t.calc.fields) ==== */
const FIELDS = {
  ecom: [
    { key: "budget", label: "budget", min: 2000, max: 100000, step: 500, unit: "currency", default: 15000 },
    { key: "cpa", label: "cpaField", min: 10, max: 1000, step: 5, unit: "currency", default: 100 },
    { key: "aov", label: "aov", min: 50, max: 3000, step: 10, unit: "currency", default: 320 },
  ],
  leads: [
    { key: "budget", label: "budget", min: 2000, max: 100000, step: 500, unit: "currency", default: 12000 },
    { key: "cpl", label: "cplField", min: 10, max: 2000, step: 5, unit: "currency", default: 75 },
    { key: "close", label: "close", min: 2, max: 60, step: 1, unit: "%", default: 20 },
    { key: "deal", label: "deal", min: 200, max: 50000, step: 100, unit: "currency", default: 3500 },
  ],
};

function defaultsFor(mode) {
  return Object.fromEntries(FIELDS[mode].map((f) => [f.key, f.default]));
}

/* ==== סליידר בעיצוב מותאם ==== */
function Slider({ f, label, value, onChange, fmt, currencySymbol }) {
  const pct = ((value - f.min) / (f.max - f.min)) * 100;
  return (
    <div className="calc-field">
      <div className="calc-field__top">
        <label htmlFor={`calc-${f.key}`}>{label}</label>
        <span className="calc-field__val">
          {f.unit === "currency" ? currencySymbol : ""}
          {fmt(value, f.decimals || 0)}
          {f.unit === "%" ? "%" : ""}
        </span>
      </div>
      <input
        id={`calc-${f.key}`}
        type="range"
        min={f.min}
        max={f.max}
        step={f.step}
        value={value}
        onChange={(e) => onChange(f.key, parseFloat(e.target.value))}
        style={{ "--pct": `${pct}%` }}
        className="calc-slider"
      />
    </div>
  );
}

/* ==== ספרה מונפשת ל-ROAS ==== */
function RoasNumber({ roas, fmt }) {
  return (
    <AnimatePresence mode="popLayout">
      <motion.span
        key={roas.toFixed(1)}
        initial={{ y: 14, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -14, opacity: 0 }}
        transition={{ duration: 0.35, ease }}
        className="calc__roas__num"
      >
        {fmt(roas, 1)}
      </motion.span>
    </AnimatePresence>
  );
}

export default function RoasCalculator() {
  const { t, locale, lang } = useLang();
  const [mode, setMode] = useState("ecom");
  const [vals, setVals] = useState({ ecom: defaultsFor("ecom"), leads: defaultsFor("leads") });

  /* פורמט מספרים לפי שפה */
  const currencySymbol = lang === "he" ? "₪" : "$";
  const money = (n) => currencySymbol + Math.round(n).toLocaleString(locale, { maximumFractionDigits: 0 });
  const num = (n, d = 0) =>
    n.toLocaleString(locale, { minimumFractionDigits: d, maximumFractionDigits: d });

  const v = vals[mode];
  const update = (key, value) =>
    setVals((prev) => ({ ...prev, [mode]: { ...prev[mode], [key]: value } }));

  /* ==== החישוב ==== */
  const r = useMemo(() => {
    const L = t.calc.rows;
    if (mode === "ecom") {
      const orders = v.cpa ? v.budget / v.cpa : 0;
      const revenue = orders * v.aov;
      return {
        roas: revenue / v.budget,
        revenue,
        profit: revenue - v.budget,
        rows: [
          { label: L.purchases, value: num(Math.round(orders)) },
          { label: L.revenue, value: money(revenue), hot: true },
        ],
      };
    }
    const leads = v.cpl ? v.budget / v.cpl : 0;
    const customers = leads * (v.close / 100);
    const revenue = customers * v.deal;
    return {
      roas: revenue / v.budget,
      revenue,
      profit: revenue - v.budget,
      rows: [
        { label: L.leads, value: num(Math.round(leads)) },
        { label: L.deals, value: num(Math.round(customers)) },
        { label: L.revenue, value: money(revenue), hot: true },
      ],
    };
  }, [v, mode, locale, t]);

  const profitable = r.profit >= 0;

  return (
    <section className="section calc" id="calculator">
      <div className="container">
        <div className="center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease }}
          >
            <span className="section-tag">
              <Sparkles size={15} />
              {t.calc.tag}
            </span>
            <h2 className="section-title">
              {t.calc.titleA}
              <span className="grad-text">{t.calc.titleMark}</span>
            </h2>
            <p className="section-sub">{t.calc.sub}</p>
          </motion.div>
        </div>

        <motion.div
          className="calc__box card-pop"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease }}
        >
          {/* בורר מצב */}
          <div className="calc__toggle" role="tablist" aria-label="business type">
            <button
              role="tab"
              aria-selected={mode === "ecom"}
              className={mode === "ecom" ? "is-active" : ""}
              onClick={() => setMode("ecom")}
            >
              <Store size={18} />
              {t.calc.modeEcom}
            </button>
            <button
              role="tab"
              aria-selected={mode === "leads"}
              className={mode === "leads" ? "is-active" : ""}
              onClick={() => setMode("leads")}
            >
              <Users size={18} />
              {t.calc.modeLeads}
            </button>
            <motion.span
              className="calc__toggle-pill"
              animate={{ x: mode === "ecom" ? "0%" : "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
            />
          </div>

          <div className="calc__grid">
            {/* צד קלט — remount לפי mode (בלי exit) כדי שהשדות תמיד מתחלפים מיד */}
            <div className="calc__inputs">
              <motion.div
                key={mode}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, ease }}
              >
                {FIELDS[mode].map((f) => (
                  <Slider key={f.key} f={f} label={t.calc.fields[f.label]} value={v[f.key]} onChange={update} fmt={num} currencySymbol={currencySymbol} />
                ))}
              </motion.div>
            </div>

            {/* צד תוצאה */}
            <div className="calc__result">
              <Coin size={40} className="calc__coin-1" duration={4.5} />
              <Coin size={26} className="calc__coin-2" duration={5.5} delay={0.7} />

              <div className="calc__roas">
                <span className="calc__roas-label">
                  <TrendingUp size={16} />
                  {t.calc.roasLabel}
                </span>
                <div className="calc__roas-big">
                  <span className="calc__roas-numwrap">
                    <RoasNumber roas={r.roas} fmt={num} />
                  </span>
                  <span className="calc__roas-x">×</span>
                </div>
                <span className="calc__roas-sub">
                  {t.calc.roasSubA}
                  <strong>{money(r.roas)}</strong>
                </span>
              </div>

              <div className="calc__rows">
                {r.rows.map((row) => (
                  <div className={`calc__row ${row.hot ? "is-hot" : ""}`} key={row.label}>
                    <span>{row.label}</span>
                    <strong>{row.value}</strong>
                  </div>
                ))}
              </div>

              <div className={`calc__profit ${profitable ? "is-good" : "is-bad"}`}>
                <span>{t.calc.profit}</span>
                <strong>{profitable ? "+" : ""}{money(r.profit)}</strong>
              </div>

              <a href={waLink(calcMessage(t, mode, v, r, num, money))} target="_blank" rel="noreferrer" className="btn btn-primary calc__cta">
                {t.calc.cta}
                <ArrowLeft size={18} className="calc__cta-arrow" />
              </a>
              <p className="calc__disclaimer">{t.calc.disclaimer}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* הודעת וואטסאפ מוכנה עם הנתונים מהמחשבון */
function calcMessage(t, mode, v, r, num, money) {
  const m = t.calc.waMsg;
  const kind = mode === "ecom" ? m.kindEcom : m.kindLeads;
  return [
    m.intro,
    `${m.kind}: ${kind}`,
    `${m.budget}: ${money(v.budget)}`,
    `${m.roas}: ${num(r.roas, 1)}`,
    `${m.revenue}: ${money(r.revenue)}`,
    m.outro,
  ].join("\n");
}
