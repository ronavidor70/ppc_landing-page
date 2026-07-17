import { motion } from "framer-motion";
import { useLang } from "../i18n.jsx";

const ease = [0.22, 1, 0.36, 1];

/* לוגואים של לקוחות — קבצים ב-public/clients */
const logos = [
  { src: "/clients/triple-a.png", alt: "Triple A Jewelry" },
  { src: "/clients/lila.webp", alt: "Lila" },
  { src: "/clients/pil.avif", alt: "PIL" },
  { src: "/clients/cyber.webp", alt: "Cyber" },
  { src: "/clients/dearmug.avif", alt: "Dear Mug" },
  { src: "/clients/online-justice.webp", alt: "Online Justice" },
  { src: "/clients/agency.png", alt: "Agency" },
  { src: "/clients/polak.jpg", alt: "Polak" },
  { src: "/clients/client7.jpeg", alt: "HaMila HaAcharona" },
  { src: "/clients/client8.webp", alt: "Client" },
];

export default function ClientsMarquee() {
  const { t } = useLang();
  /* יחידה רחבה מספיק כדי שגם במסכים רחבים לא ייחשף שטח ריק */
  const groupLogos = [...logos, ...logos];

  return (
    <section className="clients" id="clients" aria-label={t.clients.label}>
      <div className="container">
        <motion.p
          className="clients__label"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
        >
          {t.clients.label}
        </motion.p>
      </div>

      <div className="clients__viewport">
        <div className="clients__track">
          {[false, true].map((isDuplicate) => (
            <div className="clients__group" key={String(isDuplicate)} aria-hidden={isDuplicate || undefined}>
              {groupLogos.map((logo, index) => (
                <div className="clients__item" key={`${logo.src}-${index}`}>
                  <img
                    src={logo.src}
                    alt={isDuplicate || index >= logos.length ? "" : logo.alt}
                    draggable="false"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
