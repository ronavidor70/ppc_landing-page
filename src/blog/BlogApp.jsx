import { useEffect, useState } from "react";
import BlogNav from "./BlogNav.jsx";
import BlogIndex from "./BlogIndex.jsx";
import BlogPost from "./BlogPost.jsx";
import { pageTitle } from "./seo.js";
import LeadForm from "../components/LeadForm.jsx";
import Footer from "../components/Footer.jsx";
import FloatingCta from "../components/FloatingCta.jsx";
import PrivacyPolicyModal from "../components/PrivacyPolicyModal.jsx";
import CookieConsent from "../components/CookieConsent.jsx";
import Accessibility from "../components/Accessibility.jsx";
import { LangContext, dict } from "../i18n.jsx";

/* הבלוג בעברית בלבד, והקישורים של הפוטר המשותף מתאימים לעמודי הבלוג */
const he = dict.he;
const blogLang = {
  lang: "he",
  setLang: () => {},
  toggle: () => {},
  dir: he.dir,
  locale: he.locale,
  t: {
    ...he,
    nav: {
      ...he.nav,
      links: [
        { href: "/", label: "דף הבית" },
        { href: "/blog/", label: "בלוג" },
      ],
    },
  },
};

function NotFound() {
  return (
    <section className="blog-hero center">
      <div className="container">
        <h1 className="section-title">המאמר לא נמצא</h1>
        <a href="/blog/" className="btn btn-primary">
          לכל המאמרים
        </a>
      </div>
    </section>
  );
}

export default function BlogApp({ route, body }) {
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [cookiesOpen, setCookiesOpen] = useState(false);
  /* שכבות שקוראות העדפות מהדפדפן — מוצגות רק אחרי הטעינה, כדי שהדף הסטטי יישאר זהה */
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.title = pageTitle(route);
  }, [route]);

  return (
    <LangContext.Provider value={blogLang}>
      <div>
        <a href="#main-content" className="skip-link">
          {he.a11y.skip}
        </a>
        <BlogNav />
        <main id="main-content">
          {route.page === "index" && <BlogIndex />}
          {route.page === "post" && <BlogPost post={route.post} body={body} />}
          {route.page === "not-found" && <NotFound />}
          {route.page !== "not-found" && <LeadForm onOpenPrivacy={() => setPrivacyOpen(true)} />}
        </main>
        <Footer onOpenPrivacy={() => setPrivacyOpen(true)} onOpenCookies={() => setCookiesOpen(true)} />
        {mounted && (
          <>
            <FloatingCta />
            <Accessibility />
            <PrivacyPolicyModal open={privacyOpen} onClose={() => setPrivacyOpen(false)} />
            <CookieConsent
              settingsOpen={cookiesOpen}
              onSettingsChange={setCookiesOpen}
              onOpenPrivacy={() => setPrivacyOpen(true)}
            />
          </>
        )}
      </div>
    </LangContext.Provider>
  );
}
