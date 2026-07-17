import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { waLink } from "../config.js";
import { useLang } from "../i18n.jsx";

/* כפתור וואטסאפ צף + פס CTA דביק במובייל — מופיעים אחרי גלילה ראשונה */
export default function FloatingCta() {
  const { t } = useLang();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <>
          <motion.a
            key="wa"
            href={waLink()}
            target="_blank"
            rel="noreferrer"
            className="float-wa"
            aria-label={t.nav.waAria}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <MessageCircle size={26} />
            <span className="float-wa__pulse" />
          </motion.a>

          <motion.div
            key="bar"
            className="sticky-cta"
            initial={{ y: 90 }}
            animate={{ y: 0 }}
            exit={{ y: 90 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <a href="#lead" className="btn btn-primary sticky-cta__btn">
              {t.sticky}
            </a>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
