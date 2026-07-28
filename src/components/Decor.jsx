import { motion } from "framer-motion";

/* ===== אלמנטים דקורטיביים משותפים ===== */

/* כוכב 4 קצוות — נצנוץ */
export function Sparkle({ size = 26, color = "#FFC913", className = "", delay = 0 }) {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={`sparkle ${className}`}
      aria-hidden="true"
      initial={{ scale: 0, rotate: -30 }}
      whileInView={{ scale: [0, 1.25, 1], rotate: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay, ease: [0.34, 1.56, 0.64, 1] }}
    >
      <path d="M12 0 C13 7 17 11 24 12 C17 13 13 17 12 24 C11 17 7 13 0 12 C7 11 11 7 12 0 Z" fill={color} />
    </motion.svg>
  );
}

/* קו מרקר מתפתל שמצייר את עצמו מתחת למילה */
export function Squiggle({ color = "#FFB020", delay = 0.8 }) {
  return (
    <svg className="squiggle" viewBox="0 0 220 26" aria-hidden="true" preserveAspectRatio="none">
      <motion.path
        d="M4 18 C40 8 60 22 95 14 C130 6 150 20 216 10"
        fill="none"
        stroke={color}
        strokeWidth="7"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  );
}

/* מטבע ₪ צף */
export function Coin({ size = 44, className = "", float = 12, duration = 4, delay = 0 }) {
  return (
    <motion.div
      className={`coin ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
      animate={{ y: [0, -float, 0], rotate: [0, 8, 0] }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
    >
      <svg viewBox="0 0 48 48" width="100%" height="100%">
        <circle cx="24" cy="24" r="22" fill="#FFC913" stroke="#161310" strokeWidth="2.5" />
        <circle cx="24" cy="24" r="15.5" fill="none" stroke="#161310" strokeWidth="1.8" strokeDasharray="3 4" />
        <text x="24" y="31" textAnchor="middle" fontSize="19" fontWeight="900" fill="#161310" fontFamily="Heebo, sans-serif">
          ₪
        </text>
      </svg>
    </motion.div>
  );
}

/* תג עגול מסתובב עם טקסט היקפי — קורא לפעולה */
export function RotatingBadge({ href = "#lead", text = "בדיקת התאמה · בלי התחייבות · " }) {
  return (
    <a href={href} className="rot-badge" aria-label={text.trim()}>
      <motion.svg
        viewBox="0 0 120 120"
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      >
        <defs>
          <path id="circlePath" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
        </defs>
        <circle cx="60" cy="60" r="58" fill="#161310" />
        <text fontSize="12.5" fontWeight="700" fill="#FFC913" letterSpacing="1.5">
          <textPath href="#circlePath">{text}</textPath>
        </text>
      </motion.svg>
      <span className="rot-badge__center">
        <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#161310" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      </span>
    </a>
  );
}

/* חץ שרבוט מצויר ביד */
export function DoodleArrow({ className = "", flip = false }) {
  return (
    <svg
      className={`doodle-arrow ${className}`}
      viewBox="0 0 90 70"
      aria-hidden="true"
      style={flip ? { transform: "scaleX(-1)" } : undefined}
    >
      <motion.path
        d="M6 8 C30 14 52 30 60 56 M60 56 L46 46 M60 56 L66 40"
        fill="none"
        stroke="#161310"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
      />
    </svg>
  );
}

/* איור משפך המרות עם מטבעות שנופלים פנימה */
export function FunnelIllustration() {
  return (
    <div className="funnel-ill" aria-hidden="true">
      <svg viewBox="0 0 260 240" width="100%">
        {/* עיגול רקע */}
        <circle cx="130" cy="120" r="105" fill="#FFF3D6" />
        <circle cx="130" cy="120" r="105" fill="none" stroke="#F5DFAF" strokeWidth="2" strokeDasharray="4 8" />

        {/* משפך */}
        <path d="M55 55 L205 55 L150 130 L150 178 L110 196 L110 130 Z" fill="#fff" stroke="#161310" strokeWidth="3.5" strokeLinejoin="round" />
        <path d="M55 55 L205 55 L185 82 L75 82 Z" fill="#FFC913" stroke="#161310" strokeWidth="3.5" strokeLinejoin="round" />

        {/* חיצי כניסה */}
        <g stroke="#161310" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.75">
          <path d="M40 28 q14 8 24 18" />
          <path d="M220 28 q-14 8 -24 18" />
        </g>
      </svg>

      {/* מטבעות מונפשים שנופלים למשפך */}
      <motion.div
        className="funnel-ill__coin funnel-ill__coin--1"
        animate={{ y: [0, 46, 46], opacity: [1, 1, 0], scale: [1, 0.82, 0.7] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeIn", times: [0, 0.75, 1] }}
      >
        <Coin size={34} float={0} duration={999} />
      </motion.div>
      <motion.div
        className="funnel-ill__coin funnel-ill__coin--2"
        animate={{ y: [0, 52, 52], opacity: [1, 1, 0], scale: [1, 0.8, 0.66] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeIn", delay: 1.1, times: [0, 0.75, 1] }}
      >
        <Coin size={28} float={0} duration={999} />
      </motion.div>

      {/* מטבע שיוצא מלמטה — הרווח */}
      <motion.div
        className="funnel-ill__coin funnel-ill__coin--out"
        animate={{ y: [0, 26], opacity: [0, 1, 1], scale: [0.7, 1] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut", delay: 0.6 }}
      >
        <Coin size={40} float={0} duration={999} />
      </motion.div>
    </div>
  );
}

/* בלוב רקע רך */
export function Blob({ className = "" }) {
  return <div className={`blob ${className}`} aria-hidden="true" />;
}
