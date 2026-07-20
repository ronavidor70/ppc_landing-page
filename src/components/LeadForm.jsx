import { useState } from "react";
import { motion } from "framer-motion";
import { Send, ShieldCheck, Clock, MessageCircle, CheckCircle2 } from "lucide-react";
import { waLink, CRM_WEBHOOK_URL } from "../config.js";
import { useLang } from "../i18n.jsx";
import { attributionLines, sendLeadToCrm } from "../attribution.js";
import { insertLeadToSupabase } from "../supabase.js";
import { FunnelIllustration } from "./Decor.jsx";

const ease = [0.22, 1, 0.36, 1];
const pointIcons = [Clock, ShieldCheck, CheckCircle2];

export default function LeadForm({ onOpenPrivacy }) {
  const { t, lang } = useLang();
  const L = t.lead;
  const [form, setForm] = useState({ name: "", phone: "", business: "", website: "", budget: "" });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !/^0\d{1,2}-?\d{7}$/.test(form.phone.replace(/[\s-]/g, ""))) {
      setError(L.error);
      return;
    }
    setError("");
    const m = L.waMsg;
    // שורות הליד + שורות הייחוס (מקור הקמפיין) — מסומן PPC אוטומטית
    const msg = [
      m.intro,
      `${m.name}: ${form.name}`,
      `${m.phone}: ${form.phone}`,
      `${m.biz}: ${form.business || m.none}`,
      `${m.website}: ${form.website || m.none}`,
      `${m.budget}: ${form.budget || m.none}`,
      "———",
      ...attributionLines(m.attr),
    ].join("\n");

    // הכנסה ישירה ל-CRM (Supabase) — כולל כל נתוני הייחוס
    insertLeadToSupabase({
      name: form.name,
      phone: form.phone,
      business: form.business,
      website: form.website,
      budget: form.budget,
      lang,
    });

    // שליחה ל-webhook נוסף אם הוגדר (אופציונלי)
    sendLeadToCrm(CRM_WEBHOOK_URL, {
      name: form.name,
      phone: form.phone,
      business: form.business,
      website: form.website,
      budget: form.budget,
    });

    window.open(waLink(msg), "_blank");
    setSent(true);
  };

  return (
    <section className="section lead" id="lead">
      <div className="container">
        <motion.div
          className="lead__box card"
          initial={{ opacity: 0, y: 48 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.85, ease }}
        >
          <div className="lead__content">
            <FunnelIllustration />
            <span className="section-tag">{L.tag}</span>
            <h2 className="section-title">
              {L.titleA}
              <br />
              <span className="grad-text">{L.titleMark}</span>
            </h2>
            <p className="section-sub">{L.sub}</p>
            <ul className="lead__points">
              {L.points.map((p, i) => {
                const Icon = pointIcons[i];
                return (
                  <li key={i}>
                    <Icon size={17} /> {p}
                  </li>
                );
              })}
            </ul>
          </div>

          {sent ? (
            <motion.div
              className="lead__thanks"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease }}
            >
              <div className="lead__thanks-icon">
                <CheckCircle2 size={44} />
              </div>
              <h3>{L.thanksTitle}</h3>
              <p>{L.thanksDesc}</p>
              <a href={waLink()} target="_blank" rel="noreferrer" className="btn btn-whatsapp">
                <MessageCircle size={19} />
                {L.thanksWa}
              </a>
            </motion.div>
          ) : (
            <form className="lead__form" onSubmit={submit} noValidate>
              <div className="field">
                <label htmlFor="lead-name">{L.nameLabel}</label>
                <input id="lead-name" type="text" placeholder={L.namePh} value={form.name} onChange={update("name")} required />
              </div>
              <div className="field">
                <label htmlFor="lead-phone">{L.phoneLabel}</label>
                <input id="lead-phone" type="tel" inputMode="tel" placeholder={L.phonePh} value={form.phone} onChange={update("phone")} required />
              </div>
              <div className="field">
                <label htmlFor="lead-biz">{L.bizLabel}</label>
                <input id="lead-biz" type="text" placeholder={L.bizPh} value={form.business} onChange={update("business")} />
              </div>
              <div className="field">
                <label htmlFor="lead-website">{L.websiteLabel}</label>
                <input id="lead-website" type="url" inputMode="url" placeholder={L.websitePh} value={form.website} onChange={update("website")} />
              </div>
              <div className="field">
                <label htmlFor="lead-budget">{L.budgetLabel}</label>
                <select id="lead-budget" value={form.budget} onChange={update("budget")}>
                  <option value="">{L.budgetDefault}</option>
                  {L.budgets.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              {error && <p className="lead__error" role="alert">{error}</p>}

              <button type="submit" className="btn btn-primary lead__submit">
                <Send size={18} />
                {L.submit}
              </button>
              <p className="lead__privacy">
                {L.privacy}{" "}
                <button type="button" className="privacy-link" onClick={onOpenPrivacy}>
                  {L.privacyLink}
                </button>
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
