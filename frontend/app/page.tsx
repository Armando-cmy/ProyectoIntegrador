"use client";

import GlobalCarLogo from "./components/brand/GlobalCarLogo";
import LoginForm from "./components/login/LoginForm";
import LoginShowcase from "./components/login/LoginShowcase";
import ThemeToggle from "./components/login/ThemeToggle";
import useLoginTheme from "./hooks/useLoginTheme";
import "./styles/login-theme.css";

export default function Home() {
  const { theme, toggleTheme } = useLoginTheme();

  return (
    <main className="login-page" data-theme={theme}>
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <header className="topbar">
        <a className="brand" href="#inicio" aria-label="Global Car inicio">
          <GlobalCarLogo theme={theme} className="global-car-logo" />
          <span className="brand-name">
            GLOBAL <b>CAR</b>
            <small>PREMIUM AUTOMOTIVE</small>
          </span>
        </a>
        <div className="topbar-right">
          <span className="status-dot" />
          EXPERIENCIA EXCLUSIVA
          <i />
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </div>
      </header>

      <div className="main-grid" id="inicio">
        <LoginShowcase />
        <LoginForm theme={theme} />
      </div>

      <footer className="page-footer">
        <span>© 2025 GLOBAL CAR</span>
        <div>
          <a href="#privacidad">PRIVACIDAD</a>
          <i />
          <a href="#ayuda">CENTRO DE AYUDA</a>
        </div>
        <span className="footer-location">LA PAZ, BOLIVIA <b>·</b> 16°29′S 68°08′O</span>
      </footer>
    </main>
  );
}
