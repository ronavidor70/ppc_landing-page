import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, FlaskConical, Flame, Gift, Play, Smartphone, Volume2, VolumeX } from "lucide-react";
import { useLang } from "../i18n.jsx";

const ease = [0.22, 1, 0.36, 1];
const perkIcons = [Flame, Smartphone, FlaskConical];
const VEYMU_URL = "https://veymu.io/";

/* ===== Veymu: סטודיו הווידאו שלנו, במתנה לכל לקוח ===== */
export default function Veymu() {
  const { t, dir } = useLang();
  const V = t.veymu;
  const reduceMotion = useReducedMotion();
  const stageRef = useRef(null);
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);

  // הטלפון מסתובב לעבר הטקסט בזמן גלילה ומתיישר כשהוא מגיע למרכז
  const { scrollYProgress } = useScroll({ target: stageRef, offset: ["start end", "center center"] });
  const tilt = reduceMotion ? 0 : dir === "rtl" ? -22 : 22;
  const rotateY = useTransform(scrollYProgress, [0, 1], [tilt, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [reduceMotion ? 1 : 0.9, 1]);

  // הווידאו נטען ומתנגן רק כשהוא על המסך, ונעצר כשיוצאים ממנו
  useEffect(() => {
    const video = videoRef.current;
    if (!video || reduceMotion) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        const stopMotion = document.documentElement.classList.contains("a11y-stop-motion");
        if (entry.isIntersecting && !stopMotion) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.25 }
    );
    io.observe(video);
    return () => io.disconnect();
  }, [reduceMotion]);

  const toggleSound = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
    if (video.paused) video.play().catch(() => {});
  };

  const playManually = () => {
    videoRef.current?.play().catch(() => {});
  };

  return (
    <section className="section veymu" id="veymu">
      <div className="veymu__glow veymu__glow--violet" aria-hidden="true" />
      <div className="veymu__glow veymu__glow--amber" aria-hidden="true" />

      <div className="container">
        <motion.div
          className="center veymu__head"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
        >
          <span className="section-tag">
            <Gift size={16} />
            {V.tag}
          </span>
          <h2 className="section-title">
            {V.titleA}
            <br />
            <span className="veymu__grad">{V.titleB}</span>
          </h2>
          <p className="section-sub">{V.sub}</p>
        </motion.div>

        <div className="veymu__stage" ref={stageRef}>
          {/* מודעת ריילס אמיתית שנוצרה ב-Veymu, בתוך מסגרת טלפון */}
          <div className="veymu__phone-wrap">
            <img className="veymu__ambient" src="/veymu/veymu-reel.webp" alt="" aria-hidden="true" loading="lazy" />

            <motion.div className="veymu__phone" style={{ rotateY, scale }}>
              <div className="veymu__screen">
                <video
                  ref={videoRef}
                  className="veymu__video"
                  src="/veymu/veymu-reel.mp4"
                  poster="/veymu/veymu-reel.webp"
                  muted
                  loop
                  playsInline
                  preload="none"
                  aria-label={V.videoLabel}
                  onPlay={() => setPlaying(true)}
                  onPause={() => setPlaying(false)}
                />

                <span className="veymu__island" aria-hidden="true" />

                <span className="veymu__ai-badge">
                  <span className="veymu__rec" aria-hidden="true" />
                  {V.aiBadge}
                </span>

                <button
                  type="button"
                  className="veymu__sound"
                  onClick={toggleSound}
                  aria-pressed={!muted}
                  aria-label={muted ? V.soundOn : V.soundOff}
                  title={muted ? V.soundOn : V.soundOff}
                >
                  {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>

                {!playing && reduceMotion ? (
                  <button type="button" className="veymu__play" onClick={playManually} aria-label={V.videoLabel}>
                    <Play size={30} fill="currentColor" />
                  </button>
                ) : null}

                <div className="veymu__adbar" aria-hidden="true">
                  <span className="veymu__adbar-brand">
                    <i>L</i>
                    <span>
                      <b>LUMÉ</b>
                      <small>{V.adSponsored}</small>
                    </span>
                  </span>
                  <span className="veymu__adbar-cta">{V.adShop}</span>
                </div>
              </div>
            </motion.div>

            <p className="veymu__caption">{V.adCaption}</p>
          </div>

          <div className="veymu__side">
            <motion.div
              className="veymu__ticket"
              initial={{ opacity: 0, y: 40, rotate: 0 }}
              whileInView={{ opacity: 1, y: 0, rotate: -3 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1], delay: 0.2 }}
            >
              <div className="veymu__ticket-main">
                <span className="veymu__ticket-kicker">
                  <Gift size={14} />
                  {V.ticket.kicker}
                </span>
                <div className="veymu__ticket-title">
                  <img src="/veymu/veymu-mark.webp" alt="" width="34" height="25" />
                  {V.ticket.title}
                </div>
                <div className="veymu__ticket-price">
                  <strong>{V.ticket.price}</strong>
                  <span>{V.ticket.note}</span>
                </div>
                <span className="veymu__ticket-valid">{V.ticket.valid}</span>
              </div>
              <div className="veymu__ticket-stub" aria-hidden="true">
                <span>{V.ticket.admit}</span>
                <i className="veymu__barcode" />
              </div>
            </motion.div>

            <div className="veymu__perks">
              {V.perks.map((p, i) => {
                const Icon = perkIcons[i];
                return (
                  <motion.div
                    key={p.title}
                    className="veymu__perk"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.6, ease, delay: 0.15 + i * 0.1 }}
                  >
                    <div className="veymu__perk-icon">
                      <Icon size={20} />
                    </div>
                    <div>
                      <h3>{p.title}</h3>
                      <p>{p.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        <p className="veymu__models">
          <img src="/veymu/veymu-mark.webp" alt="" width="22" height="16" />
          {V.models}
        </p>

        <div className="veymu__cta">
          <a href="#lead" className="btn btn-primary btn-lg">
            <Gift size={19} />
            {V.cta}
          </a>
          <a href={VEYMU_URL} target="_blank" rel="noreferrer" className="veymu__link">
            {V.link}
            <ArrowUpRight size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}
