import { useState } from "react";
import "./sections.css";
import Nav from "./components/Nav.jsx";
import Hero from "./components/Hero.jsx";
import TrustBar from "./components/TrustBar.jsx";
import Results from "./components/Results.jsx";
import ClientsMarquee from "./components/ClientsMarquee.jsx";
import RoasCalculator from "./components/RoasCalculator.jsx";
import LeakGame from "./components/LeakGame.jsx";
// import MarketTools from "./components/MarketTools.jsx"; // מוסתר זמנית — להחזרה: בטל הערה כאן ובשורת <MarketTools /> למטה, והחזר את קישור "#tools" בתפריט (i18n.jsx)
import Services from "./components/Services.jsx";
import Process from "./components/Process.jsx";
import WhyUs from "./components/WhyUs.jsx";
import Veymu from "./components/Veymu.jsx";
import Faq from "./components/Faq.jsx";
import LeadForm from "./components/LeadForm.jsx";
import Footer from "./components/Footer.jsx";
import FloatingCta from "./components/FloatingCta.jsx";
import PrivacyPolicyModal from "./components/PrivacyPolicyModal.jsx";
import CookieConsent from "./components/CookieConsent.jsx";
import Accessibility from "./components/Accessibility.jsx";
import { useLang } from "./i18n.jsx";

export default function App() {
  const { t } = useLang();
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [cookiesOpen, setCookiesOpen] = useState(false);

  return (
    <div>
      <a href="#main-content" className="skip-link">
        {t.a11y.skip}
      </a>
      <Nav />
      <main id="main-content">
        <Hero />
        <TrustBar />
        <Results />
        <ClientsMarquee />
        <RoasCalculator />
        <LeakGame onOpenPrivacy={() => setPrivacyOpen(true)} />
        {/* <MarketTools /> */}
        <Services />
        <Process />
        <WhyUs />
        <Veymu />
        <Faq />
        <LeadForm onOpenPrivacy={() => setPrivacyOpen(true)} />
      </main>
      <Footer onOpenPrivacy={() => setPrivacyOpen(true)} onOpenCookies={() => setCookiesOpen(true)} />
      <FloatingCta />
      <Accessibility />
      <PrivacyPolicyModal open={privacyOpen} onClose={() => setPrivacyOpen(false)} />
      <CookieConsent
        settingsOpen={cookiesOpen}
        onSettingsChange={setCookiesOpen}
        onOpenPrivacy={() => setPrivacyOpen(true)}
      />
    </div>
  );
}
