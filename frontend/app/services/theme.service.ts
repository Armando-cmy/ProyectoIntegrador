export type LoginTheme = "light" | "dark";

const THEME_STORAGE_KEY = "global-car-theme";

export function getSavedTheme(): LoginTheme | null {
  const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  return savedTheme === "light" || savedTheme === "dark" ? savedTheme : null;
}

export function saveTheme(theme: LoginTheme): void {
  window.localStorage.setItem(THEME_STORAGE_KEY, theme);
}
