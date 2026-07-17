import { motion } from "framer-motion";
import { PhoneCall, ClipboardCheck, Rocket, BarChart3 } from "lucide-react";
import { useLang } from "../i18n.jsx";

const ease = [0.22, 1, 0.36, 1];
const icons = [PhoneCall, ClipboardCheck, Rocket, BarChart3];

export default function Process() {
  const { t } = useLang();
  return (
    <section className="section process" id="process">
      <div className="container">
        <div className="center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease }}
          >
            <span className="section-tag">{t.process.tag}</span>
            <h2 className="section-title">
              {t.process.titleA}
              <span className="grad-text">{t.process.titleMark}</span>
            </h2>
            <p className="section-sub">{t.process.sub}</p>
          </motion.div>
        </div>

        <div className="process__grid">
          <div className="process__line" aria-hidden="true" />
          {t.process.steps.map((s, i) => {
            const Icon = icons[i];
            const num = String(i + 1).padStart(2, "0");
            return (
              <motion.div
                key={i}
                className="step"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, ease, delay: i * 0.14 }}
              >
                <div className="step__icon-wrap">
                  <div className="step__icon">
                    <Icon size={22} />
                  </div>
                  <span className="step__num">{num}</span>
                </div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
