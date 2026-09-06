import { useEffect, useState } from "react";

// Reports which section sits under the middle of the viewport, for nav highlighting.
export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState("");

  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      // A thin band across the viewport's middle: the section crossing it is "active".
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids.join(",")]);

  return active;
}
