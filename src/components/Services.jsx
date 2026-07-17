import { motion } from "framer-motion";
import { Search, Share2, Filter, LineChart } from "lucide-react";
import { useLang } from "../i18n.jsx";

const ease = [0.22, 1, 0.36, 1];
const icons = [Search, Share2, Filter, LineChart];

export default function Services() {
  const { t } = useLang();
  return (
    <section className="section services" id="services">
      <div className="container">
        <div className="center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease }}
          >
            <span className="section-tag">{t.services.tag}</span>
            <h2 className="section-title">
              {t.services.titleA}
              <span className="grad-text">{t.services.titleMark}</span>
            </h2>
            <p className="section-sub">{t.services.sub}</p>
          </motion.div>
        </div>

        <div className="services__grid">
          {t.services.items.map((s, i) => {
            const Icon = icons[i];
            return (
              <motion.article
                key={i}
                className="service card"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, ease, delay: (i % 2) * 0.12 }}
              >
                <div className="service__icon">
                  <Icon size={24} />
                </div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <ul>
                  {s.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
