import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { MessageCircle, ArrowDown, TrendingUp, ShoppingCart, MousePointerClick, Bell } from "lucide-react";
import { waLink } from "../config.js";
import { useLang } from "../i18n.jsx";
import useCountUp from "../hooks/useCountUp.js";
import { Sparkle, Squiggle, Coin, RotatingBadge } from "./Decor.jsx";

const ease = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease, delay: 0.1 * i },
  }),
};

function Stat({ value, suffix, prefix, label, decimals = 0, locale }) {
  const { ref, formatted } = useCountUp(value, { decimals, locale });
  return (
    <div className="hero__stat" ref={ref}>
      <span className="hero__stat-num">
        {prefix}
        {formatted}
        {suffix}
      </span>
      <span className="hero__stat-label">{label}</span>
    </div>
  );
}

/* דשבורד — גרף קו + עמודות שצומחות */
function DashboardCard({ t }) {
  const bars = [34, 52, 40, 66, 58, 84, 74, 100];
  return (
    <div className="dash card-pop">
      <div className="dash__head">
        <div className="dash__dots" aria-hidden="true">
          <span /><span /><span />
        </div>
        <span className="dash__title">{t.hero.dashTitle}</span>
        <span className="dash__badge">
          <TrendingUp size={13} />
          ‎+312%
        </span>
      </div>

      <div className="dash__bars" aria-hidden="true">
        {bars.map((h, i) => (
          <motion.span
            key={i}
            initial={{ scaleY: 0.08 }}
            whileInView={{ scaleY: h / 100 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.5 + i * 0.09, ease }}
            className={i >= bars.length - 2 ? "is-hot" : ""}
          />
        ))}
      </div>

      <svg viewBox="0 0 320 90" className="dash__line" aria-hidden="true">
        <defs>
          <linearGradient id="dl" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#FFB020" />
            <stop offset="1" stopColor="#0E9F6E" />
          </linearGradient>
        </defs>
        <motion.path
          d="M0 74 C36 68 52 58 78 56 C110 53 122 62 150 48 C178 34 196 42 224 28 C252 14 286 20 320 8"
          fill="none"
          stroke="url(#dl)"
          strokeWidth="4"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, delay: 0.7, ease }}
        />
        <motion.circle
          cx="320" cy="8" r="6" fill="#0E9F6E" stroke="#fff" strokeWidth="2.5"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 2.2, type: "spring", stiffness: 300 }}
        />
      </svg>

      <div className="dash__metrics">
        <div>
          <span className="m-label">{t.hero.dashRoas}</span>
          <span className="m-value green-text">9.2</span>
        </div>
        <div>
          <span className="m-label">{t.hero.dashPurchases}</span>
          <span className="m-value">788</span>
        </div>
        <div>
          <span className="m-label">{t.hero.dashCpa}</span>
          <span className="m-value">₪6.17</span>
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  const { t, locale } = useLang();
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  /* parallax בגלילה — שכבות במהירויות שונות */
  const visualY = useTransform(scrollYProgress, [0, 1], [0, 130]);
  const coinsY = useTransform(scrollYProgress, [0, 1], [0, -140]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  /* הטיה תלת־ממדית לפי מיקום העכבר */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 120, damping: 16 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), { stiffness: 120, damping: 16 });

  const onMouseMove = (e) => {
    const r = sectionRef.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onMouseLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <section className="hero" id="top" ref={sectionRef} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
      <div className="hero__mesh" aria-hidden="true" />
      <div className="hero__grid-bg" aria-hidden="true" />

      <div className="container hero__inner">
        <motion.div className="hero__content" style={{ y: contentY, opacity: contentOpacity }}>
          <motion.div className="hero__badge" variants={fadeUp} initial="hidden" animate="show" custom={0}>
            <span className="hero__badge-pulse" />
            {t.hero.badge}
          </motion.div>

          <motion.h1 className="hero__title" variants={fadeUp} initial="hidden" animate="show" custom={1}>
            {t.hero.titleA}
            <br />
            {t.hero.titleB}
            <br />
            <span className="hero__title-mark">
              {t.hero.titleMark}
              <Squiggle />
            </span>
            <Sparkle className="hero__spark-1" size={30} delay={1.4} />
          </motion.h1>

          <motion.p className="hero__sub" variants={fadeUp} initial="hidden" animate="show" custom={2}>
            {t.hero.sub1}
            <strong>{t.hero.subStrong}</strong>
          </motion.p>

          <motion.div className="hero__ctas" variants={fadeUp} initial="hidden" animate="show" custom={3}>
            <a href="#lead" className="btn btn-primary btn-lg">
              {t.hero.ctaPrimary}
              <ArrowDown size={18} />
            </a>
            <a href={waLink()} target="_blank" rel="noreferrer" className="btn btn-whatsapp">
              <MessageCircle size={19} />
              {t.hero.ctaWa}
            </a>
          </motion.div>

          <motion.p className="hero__micro" variants={fadeUp} initial="hidden" animate="show" custom={4}>
            {t.hero.micro}
          </motion.p>

          <motion.div className="hero__stats" variants={fadeUp} initial="hidden" animate="show" custom={5}>
            <Stat value={13} suffix="+" label={t.hero.stats[0].label} locale={locale} />
            <div className="hero__stats-divider" />
            <Stat value={28} label={t.hero.stats[1].label} locale={locale} />
            <div className="hero__stats-divider" />
            <Stat value={2500} suffix="+" label={t.hero.stats[2].label} locale={locale} />
          </motion.div>
        </motion.div>

        {/* ===== ויזואל: דשבורד עם הטיה תלת־ממדית ===== */}
        <motion.div className="hero__visual" style={{ y: visualY }}>
          <motion.div
            className="hero__scene"
            style={{ rotateX, rotateY, transformPerspective: 1100 }}
            initial={{ opacity: 0, y: 60, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease, delay: 0.45 }}
          >
            <DashboardCard t={t} />

            <motion.div
              className="pop-card pop-card--sales card-pop"
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="pop-icon pop-icon--green">
                <ShoppingCart size={18} />
              </div>
              <div>
                <span className="m-label">{t.hero.popSales}</span>
                <span className="m-value">₪138,240</span>
              </div>
            </motion.div>

            <motion.div
              className="pop-card pop-card--lead card-pop"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
              <div className="pop-icon pop-icon--yellow">
                <Bell size={18} />
              </div>
              <div>
                <span className="m-label">{t.hero.popNow}</span>
                <span className="m-value m-value--sm">{t.hero.popLead}</span>
              </div>
            </motion.div>

            <motion.div
              className="pop-card pop-card--cpc card-pop"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
              <div className="pop-icon pop-icon--blue">
                <MousePointerClick size={18} />
              </div>
              <div>
                <span className="m-label">{t.hero.popCpc}</span>
                <span className="m-value">₪3.16</span>
              </div>
            </motion.div>
          </motion.div>

          {/* מטבעות בפרלקס הפוך */}
          <motion.div className="hero__coins" style={{ y: coinsY }} aria-hidden="true">
            <Coin size={52} className="hero__coin-1" duration={4.5} />
            <Coin size={34} className="hero__coin-2" duration={5.5} delay={0.8} />
            <Coin size={26} className="hero__coin-3" duration={5} delay={1.6} />
          </motion.div>

          <Sparkle className="hero__spark-2" size={22} color="#FF6B4A" delay={1.8} />
          <Sparkle className="hero__spark-3" size={34} delay={2.1} />

          <div className="hero__rot-badge">
            <RotatingBadge text={t.badge} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
