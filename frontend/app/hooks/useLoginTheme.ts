"use client";

import { useEffect, useState } from "react";
import { getSavedTheme, saveTheme, type LoginTheme } from "../services/theme.service";

export default function useLoginTheme() {
  const [theme, setTheme] = useState<LoginTheme>("dark");

  useEffect(() => {
    setTheme(getSavedTheme() ?? "dark");
  }, []);

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    saveTheme(nextTheme);
  }

  return { theme, toggleTheme };
}
