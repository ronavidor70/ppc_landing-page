import { motion } from "framer-motion";
import { Award, Eye, UserCheck, Code2, MessageCircle } from "lucide-react";
import { waLink } from "../config.js";
import { useLang } from "../i18n.jsx";

const ease = [0.22, 1, 0.36, 1];
const icons = [Award, UserCheck, Eye, Code2];

export default function WhyUs() {
  const { t } = useLang();
  return (
    <section className="section whyus" id="why">
      <div className="container whyus__inner">
        <motion.div
          className="whyus__text"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease }}
        >
          <span className="section-tag">{t.whyus.tag}</span>
          <h2 className="section-title">
            {t.whyus.titleA}
            <span className="grad-text">{t.whyus.titleMark}</span>
            {t.whyus.titleB}
          </h2>
          <p className="section-sub">{t.whyus.sub}</p>
          <a href={waLink()} target="_blank" rel="noreferrer" className="btn btn-whatsapp whyus__btn">
            <MessageCircle size={19} />
            {t.whyus.btn}
          </a>
        </motion.div>

        <div className="whyus__grid">
          {t.whyus.reasons.map((rz, i) => {
            const Icon = icons[i];
            return (
              <motion.div
                key={i}
                className="reason card"
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.65, ease, delay: i * 0.1 }}
              >
                <div className="reason__icon">
                  <Icon size={20} />
                </div>
                <h3>{rz.title}</h3>
                <p>{rz.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
