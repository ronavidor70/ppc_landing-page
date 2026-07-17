import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Menu, X, Globe } from "lucide-react";
import { waLink } from "../config.js";
import { useLang } from "../i18n.jsx";

export default function Nav() {
  const { t, toggle } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const links = t.nav.links;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* נעילת גלילת רקע כשהתפריט פתוח */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [open]);

  return (
    <header className={`nav ${scrolled || open ? "nav--scrolled" : ""}`}>
      <div className="container nav__inner">
        <a href="#top" className="nav__logo" aria-label="CTR media" onClick={() => setOpen(false)}>
          <img src="/logo.webp" alt="CTR media" />
        </a>

        <nav className="nav__links" aria-label="navigation">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="nav__link">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="nav__actions">
          <button className="nav__lang" onClick={toggle} aria-label="Switch language">
            <Globe size={17} />
            {t.nav.langLabel}
          </button>
          <a
            href={waLink()}
            target="_blank"
            rel="noreferrer"
            className="nav__wa"
            aria-label={t.nav.waAria}
          >
            <MessageCircle size={20} />
          </a>
          <a href="#lead" className="btn btn-primary nav__cta">
            {t.nav.cta}
          </a>
          <button
            className="nav__burger"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
            aria-expanded={open}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* תפריט מובייל */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="nav__overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.nav
              className="nav__mobile"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              aria-label="mobile navigation"
            >
              {links.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  className="nav__mobile-link"
                  onClick={() => setOpen(false)}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.04 * i + 0.05 }}
                >
                  {l.label}
                </motion.a>
              ))}
              <a href="#lead" className="btn btn-primary nav__mobile-cta" onClick={() => setOpen(false)}>
                {t.nav.cta}
              </a>
              <a href={waLink()} target="_blank" rel="noreferrer" className="btn btn-whatsapp nav__mobile-wa" onClick={() => setOpen(false)}>
                <MessageCircle size={19} />
                {t.nav.waBtn}
              </a>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
