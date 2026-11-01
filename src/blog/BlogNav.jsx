import { useEffect, useState } from "react";
import { MessageCircle, Menu, X } from "lucide-react";
import { waLink } from "../config.js";
import { useLang } from "../i18n.jsx";

const links = [
  { href: "/", label: "דף הבית" },
  { href: "/blog", label: "בלוג", current: true },
];

/* התפריט של הבלוג: אותו עיצוב כמו בדף הראשי. קישור כמו /#faq פותח את הדף הראשי בראש שלו, ולכן אין כאן קישורים לאזורים. */
export default function BlogNav() {
  const { t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

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
        <a href="/" className="nav__logo" aria-label="CTR media">
          <img src="/logo.webp" alt="CTR media" />
        </a>

        <nav className="nav__links" aria-label="navigation">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="nav__link" aria-current={l.current ? "page" : undefined}>
              {l.label}
            </a>
          ))}
        </nav>

        <div className="nav__actions">
          <a href={waLink()} target="_blank" rel="noreferrer" className="nav__wa" aria-label={t.nav.waAria}>
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
      {open && (
        <>
          <div className="nav__overlay" onClick={() => setOpen(false)} />
          <nav className="nav__mobile" aria-label="mobile navigation">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="nav__mobile-link" onClick={() => setOpen(false)}>
                {l.label}
              </a>
            ))}
            <a href="#lead" className="btn btn-primary nav__mobile-cta" onClick={() => setOpen(false)}>
              {t.nav.cta}
            </a>
            <a
              href={waLink()}
              target="_blank"
              rel="noreferrer"
              className="btn btn-whatsapp nav__mobile-wa"
              onClick={() => setOpen(false)}
            >
              <MessageCircle size={19} />
              {t.nav.waBtn}
            </a>
          </nav>
        </>
      )}
    </header>
  );
}
