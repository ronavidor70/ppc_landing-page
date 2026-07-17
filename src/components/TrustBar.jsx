const platforms = [
  "Google Ads",
  "Meta Ads",
  "YouTube Ads",
  "TikTok Ads",
  "LinkedIn Ads",
  "Taboola",
  "Outbrain",
  "Google Shopping",
  "Performance Max",
  "Instagram Ads",
];

/* טיקר נטוי בסגנון SaaS — פס צהוב עם כוכביות (שמות מותגים זהים בשתי השפות) */
export default function TrustBar() {
  const items = [...platforms, ...platforms];
  return (
    <section className="ticker" aria-label="platforms">
      <div className="ticker__strip">
        <div className="ticker__track">
          {items.map((p, i) => (
            <span className="ticker__item" key={i} aria-hidden={i >= platforms.length}>
              {p}
              <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                <path d="M12 0 C13 7 17 11 24 12 C17 13 13 17 12 24 C11 17 7 13 0 12 C7 11 11 7 12 0 Z" fill="currentColor" />
              </svg>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
