import type { ThemeChoice } from "../hooks/useTheme";

const OPTIONS: { value: ThemeChoice; label: string }[] = [
  { value: "system", label: "Auto" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

export default function ThemeToggle({
  choice,
  onChange,
}: {
  choice: ThemeChoice;
  onChange: (next: ThemeChoice) => void;
}) {
  return (
    <div className="toggle" role="group" aria-label="Colour theme">
      {OPTIONS.map((o) => (
        <button key={o.value} aria-pressed={choice === o.value} onClick={() => onChange(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}
