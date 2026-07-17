import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { useLang } from "../i18n.jsx";

const ease = [0.22, 1, 0.36, 1];

function FaqItem({ item, open, onToggle }) {
  return (
    <div className={`faq__item ${open ? "is-open" : ""}`}>
      <button className="faq__q" onClick={onToggle} aria-expanded={open}>
        <span>{item.q}</span>
        <motion.span className="faq__plus" animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.3 }}>
          <Plus size={20} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="faq__a-wrap"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease }}
          >
            <p className="faq__a">{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Faq() {
  const { t } = useLang();
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <section className="section faq" id="faq">
      <div className="container faq__inner">
        <motion.div
          className="faq__head"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
        >
          <span className="section-tag">{t.faq.tag}</span>
          <h2 className="section-title">
            {t.faq.titleA}
            <span className="grad-text">{t.faq.titleMark}</span>
          </h2>
          <p className="section-sub">{t.faq.sub}</p>
        </motion.div>

        <motion.div
          className="faq__list"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease, delay: 0.15 }}
        >
          {t.faq.items.map((f, i) => (
            <FaqItem key={i} item={f} open={openIdx === i} onToggle={() => setOpenIdx(openIdx === i ? -1 : i)} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
