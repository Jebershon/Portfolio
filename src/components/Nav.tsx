import { brand, nav } from "../content";
import ThemeToggle from "./ThemeToggle";
import type { ThemeChoice } from "../hooks/useTheme";

export default function Nav({
  theme,
  onTheme,
}: {
  theme: ThemeChoice;
  onTheme: (next: ThemeChoice) => void;
}) {
  return (
    <nav>
      <div className="wrap nav-in">
        <a className="brand" href="#top">
          {brand.left}
          <b>/</b>
          {brand.right}
        </a>
        <div className="nav-links">
          {nav.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </div>
        <ThemeToggle choice={theme} onChange={onTheme} />
      </div>
    </nav>
  );
}
