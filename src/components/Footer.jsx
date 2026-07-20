import { MessageCircle } from "lucide-react";
import { waLink } from "../config.js";
import { useLang } from "../i18n.jsx";

export default function Footer({ onOpenPrivacy, onOpenCookies }) {
  const { t } = useLang();
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <img src="/logo.webp" alt="CTR media" />
          <p>{t.footer.desc}</p>
        </div>
        <nav className="footer__links" aria-label="footer navigation">
          {t.nav.links.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
          <a href="#lead">{t.nav.cta}</a>
        </nav>
        <a href={waLink()} target="_blank" rel="noreferrer" className="btn btn-whatsapp footer__wa">
          <MessageCircle size={18} />
          {t.footer.wa}
        </a>
      </div>
      <div className="footer__bottom">
        <span>© {new Date().getFullYear()} CTR media. {t.footer.rights}</span>
        <button type="button" className="privacy-link footer__privacy" onClick={onOpenPrivacy}>
          {t.footer.privacy}
        </button>
        <button type="button" className="privacy-link footer__privacy" onClick={onOpenCookies}>
          {t.footer.cookies}
        </button>
        <button
          type="button"
          className="privacy-link footer__privacy"
          onClick={() => window.dispatchEvent(new CustomEvent("open-a11y-statement"))}
        >
          {t.a11y.statement}
        </button>
      </div>
    </footer>
  );
}
