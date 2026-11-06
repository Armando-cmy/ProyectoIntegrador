"use client";

import type { LoginTheme } from "../../services/theme.service";

type ThemeToggleProps = {
  theme: LoginTheme;
  onToggle: () => void;
  className?: string;
};

export default function ThemeToggle({ theme, onToggle, className = "theme-toggle" }: ThemeToggleProps) {
  const nextTheme = theme === "dark" ? "claro" : "oscuro";

  return (
    <button
      className={className}
      type="button"
      onClick={onToggle}
      aria-label={`Cambiar a modo ${nextTheme}`}
      title={`Cambiar a modo ${nextTheme}`}
    >
      <span className="theme-toggle-icon" aria-hidden="true">
        {theme === "dark" ? "☼" : "☾"}
      </span>
      <span className="theme-toggle-label">
        MODO {theme === "dark" ? "OSCURO" : "CLARO"}
      </span>
      <span className="theme-swatches" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
    </button>
  );
}
