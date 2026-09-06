import { useCallback, useEffect, useState } from "react";

export type ThemeChoice = "system" | "light" | "dark";

const STORAGE_KEY = "theme";

function readSaved(): ThemeChoice {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === "light" || v === "dark") return v;
  } catch {
    // localStorage can throw in private windows; fall through to the default
  }
  return "system";
}

/**
 * The theme is the single source of truth for colour, and it lives in CSS.
 * The owner's choice is written to <body data-mode>, which the CSS reads; "system"
 * removes the attribute and lets prefers-color-scheme decide. `onChange` fires
 * whenever the resolved palette could have changed, so the WebGL can re-read it.
 */
export function useTheme(onChange?: () => void) {
  const [choice, setChoice] = useState<ThemeChoice>(readSaved);

  const apply = useCallback((next: ThemeChoice) => {
    setChoice(next);
    if (next === "system") document.body.removeAttribute("data-mode");
    else document.body.setAttribute("data-mode", next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore: not being able to persist the choice is harmless
    }
  }, []);

  // Keep the DOM in sync with the initial choice on mount.
  useEffect(() => {
    if (choice === "system") document.body.removeAttribute("data-mode");
    else document.body.setAttribute("data-mode", choice);
  }, [choice]);

  // Re-notify when the OS theme flips (only matters while on "system"), or when a
  // host restamps <html data-theme> (e.g. inside an embed) — either can change our colours.
  useEffect(() => {
    if (!onChange) return;
    const media = matchMedia("(prefers-color-scheme: dark)");
    const html = new MutationObserver(onChange);
    media.addEventListener("change", onChange);
    html.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => {
      media.removeEventListener("change", onChange);
      html.disconnect();
    };
  }, [onChange]);

  // A theme choice change also changes the palette.
  useEffect(() => {
    onChange?.();
  }, [choice, onChange]);

  return { choice, setChoice: apply };
}
