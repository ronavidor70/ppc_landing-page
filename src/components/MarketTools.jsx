import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles, Copy, Check, Eye, ArrowLeft, ExternalLink, KeyRound, Target } from "lucide-react";
import { waLink } from "../config.js";
import { useLang } from "../i18n.jsx";
import { fetchKeywordIdeas } from "../toolsApi.js";

const ease = [0.22, 1, 0.36, 1];

/* ==== בוני דיפ-לינקים לכלים החיצוניים (נפתחים בטאב חדש) ==== */
const metaAdLibrary = (q) =>
  `https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=IL&media_type=all&search_type=keyword_unordered&q=${encodeURIComponent(q)}`;
const googleTransparency = (q) =>
  `https://adstransparency.google.com/?region=IL&query=${encodeURIComponent(q)}`;
const googleTrends = (q) =>
  `https://trends.google.com/trends/explore?geo=IL&q=${encodeURIComponent(q)}`;

export default function MarketTools() {
  const { t, lang } = useLang();
  const T = t.tools;
  const [tab, setTab] = useState("kw");

  return (
    <section className="section tools" id="tools">
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
              {T.tag}
            </span>
            <h2 className="section-title">
              {T.titleA}
              <span className="grad-text">{T.titleMark}</span>
            </h2>
            <p className="section-sub">{T.sub}</p>
          </motion.div>
        </div>

        <motion.div
          className="tools__box card-pop"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease }}
        >
          {/* בורר כלי */}
          <div className="calc__toggle tools__toggle" role="tablist" aria-label={T.tag}>
            <button
              role="tab"
              aria-selected={tab === "kw"}
              className={tab === "kw" ? "is-active" : ""}
              onClick={() => setTab("kw")}
            >
              <KeyRound size={18} />
              {T.tabKw}
            </button>
            <button
              role="tab"
              aria-selected={tab === "spy"}
              className={tab === "spy" ? "is-active" : ""}
              onClick={() => setTab("spy")}
            >
              <Eye size={18} />
              {T.tabSpy}
            </button>
            <motion.span
              className="calc__toggle-pill"
              animate={{ x: tab === "kw" ? "0%" : "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
            />
          </div>

          <div className="tools__body">
            {tab === "kw" ? <KeywordTool T={T} lang={lang} /> : <SpyTool T={T} />}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ============================================================
   כלי 1 — מחקר מילים (Google Suggest)
   ============================================================ */
function KeywordTool({ T, lang }) {
  const K = T.kw;
  const [seed, setSeed] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | done | error | notConfigured
  const [data, setData] = useState(null);
  const [copied, setCopied] = useState(false);
  const lastSeed = useRef("");

  async function run(e) {
    e?.preventDefault();
    const q = seed.trim();
    if (!q || status === "loading") return;
    lastSeed.current = q;
    setStatus("loading");
    setCopied(false);
    const res = await fetchKeywordIdeas(q, lang);
    if (res.ok) {
      setData(res);
      setStatus(res.total ? "done" : "empty");
    } else if (res.notConfigured) {
      setStatus("notConfigured");
    } else {
      setStatus("error");
    }
  }

  function copyAll() {
    const all = [...(data?.questions || []), ...(data?.general || [])].join("\n");
    if (!all) return;
    navigator.clipboard?.writeText(all).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  const hasResults = status === "done" && data;

  return (
    <motion.div key="kw" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, ease }}>
      <label className="tools__label" htmlFor="kw-seed">{K.label}</label>
      <form className="tools__search" onSubmit={run}>
        <input
          id="kw-seed"
          type="text"
          className="tools__input"
          placeholder={K.placeholder}
          value={seed}
          onChange={(e) => setSeed(e.target.value)}
          maxLength={60}
          autoComplete="off"
        />
        <button type="submit" className="btn btn-primary tools__go" disabled={!seed.trim() || status === "loading"}>
          {status === "loading" ? <span className="tools__spinner" aria-label={K.loading} /> : <Search size={18} />}
          <span className="tools__go-txt">{K.btn}</span>
        </button>
      </form>
      <p className="tools__hint">{K.hint}</p>

      <AnimatePresence mode="wait">
        {hasResults && (
          <motion.div
            key={"res-" + lastSeed.current}
            className="tools__results"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease }}
          >
            <div className="tools__results-top">
              <span className="tools__count">{K.resultsTitle.replace("{n}", data.total)}</span>
              <button className="tools__copy" onClick={copyAll} type="button">
                {copied ? <Check size={15} /> : <Copy size={15} />}
                {copied ? K.copied : K.copyAll}
              </button>
            </div>

            {data.questions?.length > 0 && (
              <div className="tools__group">
                <h4 className="tools__group-title">{K.questionsTitle}</h4>
                <div className="tools__chips">
                  {data.questions.map((kw) => (
                    <Chip key={kw} text={kw} hot />
                  ))}
                </div>
              </div>
            )}

            {data.general?.length > 0 && (
              <div className="tools__group">
                <h4 className="tools__group-title">{K.generalTitle}</h4>
                <div className="tools__chips">
                  {data.general.map((kw) => (
                    <Chip key={kw} text={kw} />
                  ))}
                </div>
              </div>
            )}

            <KwCta K={K} seed={lastSeed.current} />
          </motion.div>
        )}

        {(status === "empty" || status === "error" || status === "notConfigured") && (
          <motion.div
            key="fallback"
            className="tools__fallback"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease }}
          >
            <p>{status === "empty" ? K.empty : K.error}</p>
            <a className="tools__ext" href={googleTrends(lastSeed.current || seed || "פרסום ממומן")} target="_blank" rel="noreferrer">
              <ExternalLink size={16} />
              {K.trends}
            </a>
            <KwCta K={K} seed={lastSeed.current || seed} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function KwCta({ K, seed }) {
  return (
    <div className="tools__cta">
      <span className="tools__cta-txt">{K.ctaTitle}</span>
      <a
        href={waLink(`${K.waMsg} "${seed || ""}"`)}
        target="_blank"
        rel="noreferrer"
        className="btn btn-primary tools__cta-btn"
      >
        {K.ctaBtn}
        <ArrowLeft size={18} className="calc__cta-arrow" />
      </a>
    </div>
  );
}

/* צ'יפ מילת מפתח — קליק מעתיק ללוח */
function Chip({ text, hot }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className={`tools__chip ${hot ? "is-hot" : ""} ${copied ? "is-copied" : ""}`}
      onClick={() => {
        navigator.clipboard?.writeText(text).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1200);
        });
      }}
      title={text}
    >
      {copied ? <Check size={13} /> : null}
      {text}
    </button>
  );
}

/* ============================================================
   כלי 2 — ריגול מתחרים (דיפ-לינק ל-Ad Library + Transparency)
   ============================================================ */
function SpyTool({ T }) {
  const S = T.spy;
  const [q, setQ] = useState("");
  const clean = q.trim();

  return (
    <motion.div key="spy" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, ease }}>
      <label className="tools__label" htmlFor="spy-q">{S.label}</label>
      <div className="tools__search">
        <input
          id="spy-q"
          type="text"
          className="tools__input"
          placeholder={S.placeholder}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          maxLength={80}
          autoComplete="off"
        />
      </div>

      <div className="tools__spy-btns">
        <a
          className={`tools__spy-btn is-meta ${clean ? "" : "is-disabled"}`}
          href={clean ? metaAdLibrary(clean) : undefined}
          target="_blank"
          rel="noreferrer"
          aria-disabled={!clean}
          onClick={(e) => !clean && e.preventDefault()}
        >
          <Eye size={18} />
          <span>{S.metaBtn}</span>
          <ExternalLink size={15} className="tools__spy-ext" />
        </a>
        <a
          className={`tools__spy-btn is-google ${clean ? "" : "is-disabled"}`}
          href={clean ? googleTransparency(clean) : undefined}
          target="_blank"
          rel="noreferrer"
          aria-disabled={!clean}
          onClick={(e) => !clean && e.preventDefault()}
        >
          <Target size={18} />
          <span>{S.googleBtn}</span>
          <ExternalLink size={15} className="tools__spy-ext" />
        </a>
      </div>
      {!clean && <p className="tools__hint">{S.needInput}</p>}

      <div className="tools__find">
        <h4 className="tools__group-title">{S.findTitle}</h4>
        <ul className="tools__find-list">
          {S.find.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </div>

      <div className="tools__cta">
        <span className="tools__cta-txt">{S.ctaTitle}</span>
        <a
          href={waLink(`${S.waMsg}${clean ? ` "${clean}"` : ""}`)}
          target="_blank"
          rel="noreferrer"
          className="btn btn-primary tools__cta-btn"
        >
          {S.ctaBtn}
          <ArrowLeft size={18} className="calc__cta-arrow" />
        </a>
      </div>
    </motion.div>
  );
}
