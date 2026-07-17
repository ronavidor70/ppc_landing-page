import { useEffect, useRef, useState } from "react";
import { useInView, animate } from "framer-motion";

/**
 * מונה שרץ מ-0 לערך היעד כשהאלמנט נכנס למסך.
 * decimals — כמה ספרות אחרי הנקודה להציג.
 */
export default function useCountUp(target, { duration = 1.8, decimals = 0, locale = "he-IL" } = {}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, target, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setValue(v),
    });
    return () => controls.stop();
  }, [inView, target, duration]);

  const formatted = value.toLocaleString(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return { ref, formatted };
}
