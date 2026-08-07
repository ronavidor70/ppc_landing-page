import { motion } from "framer-motion";
import { Search, Share2 } from "lucide-react";
import { useLang } from "../i18n.jsx";

const ease = [0.22, 1, 0.36, 1];
const platformIcons = [Search, Share2];

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

        <div className="method__grid">
          {t.services.method.map((m, i) => (
            <motion.div
              key={m.num}
              className="method__step"
              initial={{ opacity: 0, y: 34 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, ease, delay: (i % 4) * 0.08 }}
            >
              <span className="method__num">{m.num}</span>
              <h3 className="method__title">{m.title}</h3>
              <p className="method__desc">{m.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="center">
          <span className="services__channels-tag">{t.services.channelsTag}</span>
        </div>

        <div className="services__grid services__grid--platforms">
          {t.services.items.map((s, i) => {
            const Icon = platformIcons[i];
            return (
              <motion.article
                key={s.title}
                className="service card"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, ease, delay: (i % 2) * 0.12 }}
              >
                <div className="service__icon">
                  {Icon ? <Icon size={24} /> : null}
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
