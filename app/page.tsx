"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

function CompassMark() {
  return (
    <svg className="compass-mark" viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <circle cx="32" cy="32" r="27" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="32" cy="32" r="20" stroke="currentColor" strokeWidth=".8" opacity=".55" />
      <path d="M32 7v7M32 50v7M7 32h7M50 32h7M14.3 14.3l5 5m25.4 25.4 5 5m0-35.4-5 5M19.3 44.7l-5 5" stroke="currentColor" strokeWidth="1.2" />
      <path d="m38.5 24.5-4.1 11.1-8.9 4 4-9 9-6.1Z" fill="currentColor" />
      <circle cx="32" cy="32" r="2.2" fill="#1E1E1E" />
      <path d="M32 2v5m0 50v5m25-30h5M2 32h5" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export default function Home() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);

  return (
    <main className="login-page">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <header className="topbar">
        <a className="brand" href="#inicio" aria-label="Global Car inicio">
          <CompassMark />
          <span className="brand-name">GLOBAL <b>CAR</b><small>PREMIUM AUTOMOTIVE</small></span>
        </a>
        <div className="topbar-right"><span className="status-dot" /> EXPERIENCIA EXCLUSIVA <i /></div>
      </header>

      <section className="main-grid" id="inicio">
        <div className="story-panel">
          <div className="eyebrow"><span /> EL CAMINO EMPIEZA AQUÍ</div>
          <h1>Tu próximo<br />destino <em>te espera.</em></h1>
          <p className="story-copy">Todo lo que necesitas para avanzar,<br />en un solo lugar.</p>
          <div className="car-art" aria-hidden="true">
            <div className="car-glow" />
            <svg viewBox="0 0 760 310" className="car-svg" fill="none">
              <defs>
                <linearGradient id="body" x1="160" y1="120" x2="550" y2="275" gradientUnits="userSpaceOnUse"><stop stopColor="#F0F0ED"/><stop offset=".28" stopColor="#828282"/><stop offset=".52" stopColor="#D6D6D2"/><stop offset=".72" stopColor="#5A5A5A"/><stop offset="1" stopColor="#C0C0C0"/></linearGradient>
                <linearGradient id="glass" x1="310" y1="96" x2="420" y2="185" gradientUnits="userSpaceOnUse"><stop stopColor="#555B60"/><stop offset="1" stopColor="#151719"/></linearGradient>
                <linearGradient id="rim" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#D4AF37"/><stop offset="1" stopColor="#5A5A5A"/></linearGradient>
                <filter id="shadow" x="70" y="40" width="630" height="280" colorInterpolationFilters="sRGB"><feGaussianBlur stdDeviation="12"/></filter>
              </defs>
              <ellipse cx="382" cy="256" rx="260" ry="22" fill="#000" opacity=".75" filter="url(#shadow)" />
              <path d="m115 222 19-44c8-17 21-29 40-35l99-31 65-70c10-10 23-15 37-15h113c15 0 29 7 38 19l56 75 46 17c17 6 29 20 34 38l12 43-12 24H125l-10-21Z" fill="url(#body)" stroke="#D0D0CE" strokeWidth="2" />
              <path d="m290 108 59-62c7-7 16-11 26-11h52v73H290Zm151-73h47c11 0 21 5 27 14l43 59H441V35Z" fill="url(#glass)" stroke="#B7B7B4" strokeWidth="2" />
              <path d="m349 46-57 63h142V35h-59c-10 0-19 4-26 11Zm92-11v74h110l-43-59c-6-9-16-15-27-15h-40Z" stroke="#858581" strokeWidth="2" />
              <path d="M137 180h52m359 0h60" stroke="#F0E2B6" strokeWidth="4" strokeLinecap="round" opacity=".8" />
              <path d="m119 218 24-2m493 0 33 2" stroke="#B07A50" strokeWidth="5" strokeLinecap="round" />
              <path d="M211 222h368" stroke="#333" strokeWidth="2" />
              <circle cx="238" cy="239" r="47" fill="#171819" stroke="#777" strokeWidth="4"/><circle cx="238" cy="239" r="34" fill="#242526" stroke="url(#rim)" strokeWidth="3"/><circle cx="238" cy="239" r="9" fill="#B9B9B6" stroke="#333" strokeWidth="3"/>
              <circle cx="548" cy="239" r="47" fill="#171819" stroke="#777" strokeWidth="4"/><circle cx="548" cy="239" r="34" fill="#242526" stroke="url(#rim)" strokeWidth="3"/><circle cx="548" cy="239" r="9" fill="#B9B9B6" stroke="#333" strokeWidth="3"/>
              <path d="m238 207 5 18m27 14-18-5m-14 37-5-18m-27-14 18 5m324-37 5 18m27 14-18-5m-14 37-5-18m-27-14 18 5" stroke="#9D9D98" strokeWidth="3" strokeLinecap="round" />
              <path d="M189 141h64m223 2h53" stroke="#F6F5F0" strokeWidth="2" opacity=".45" />
            </svg>
          </div>
          <div className="story-footer"><span>01</span><div className="story-rule" /><span>DISEÑADO PARA LLEGAR MÁS LEJOS</span></div>
        </div>

        <div className="form-panel">
          <div className="form-heading"><div className="mini-mark"><CompassMark /></div><div className="eyebrow">BIENVENIDO DE NUEVO</div><h2>Inicia sesión</h2><p>Ingresa a tu cuenta para continuar.</p></div>
          <form onSubmit={(event) => { event.preventDefault(); router.push("/catalogo"); }}>
            <label htmlFor="email">CORREO ELECTRÓNICO</label>
            <div className="input-wrap"><svg viewBox="0 0 20 20" aria-hidden="true"><rect x="2.5" y="4" width="15" height="12" rx="2"/><path d="m3.5 5 6.5 5 6.5-5"/></svg><input id="email" type="email" placeholder="nombre@ejemplo.com" autoComplete="email" required /></div>
            <div className="label-row"><label htmlFor="password">CONTRASEÑA</label><a href="#recuperar">¿Olvidaste tu contraseña?</a></div>
            <div className="input-wrap"><svg viewBox="0 0 20 20" aria-hidden="true"><rect x="3.5" y="8.5" width="13" height="9" rx="2"/><path d="M6.5 8.5V6a3.5 3.5 0 0 1 7 0v2.5"/></svg><input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••••" autoComplete="current-password" required /><button type="button" className="visibility" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}><svg viewBox="0 0 20 20"><path d="M2 10s2.8-5 8-5 8 5 8 5-2.8 5-8 5-8-5-8-5Z"/><circle cx="10" cy="10" r="2.2"/></svg></button></div>
            <div className="form-options"><label className="remember"><input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} /><span className="checkmark">✓</span>Recordarme</label></div>
            <button className="submit-button" type="submit">ACCEDER A MI CUENTA <span>→</span></button>
          </form>
          <div className="signup">¿Aún no tienes una cuenta? <a href="#crear-cuenta">Crear cuenta <span>↗</span></a></div>
          <div className="secure-note"><svg viewBox="0 0 16 16"><path d="M4 7V5a4 4 0 1 1 8 0v2m-9 0h10v7H3V7Z"/></svg> CONEXIÓN SEGURA Y ENCRIPTADA</div>
        </div>
      </section>
      <footer className="page-footer"><span>© 2025 GLOBAL CAR</span><div><a href="#privacidad">PRIVACIDAD</a><i /><a href="#ayuda">CENTRO DE AYUDA</a></div><span className="footer-location">LA PAZ, BOLIVIA <b>·</b> 16°29′S 68°08′O</span></footer>
    </main>
  );
}
