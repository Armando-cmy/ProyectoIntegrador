"use client";

import GlobalCarLogo from "./brand/GlobalCarLogo";
import type { LoginTheme } from "../services/theme.service";

export type SectionId =
  | "inicio"
  | "automoviles"
  | "repuestos"
  | "categorias"
  | "accesorios"
  | "bebes"
  | "reservaciones"
  | "verificar"
  | "contacto"
  | "usuarios";

type SidebarProps = {
  activeSection: SectionId;
  onNavigate: (section: SectionId) => void;
  onSignOut: () => void;
  showUserManagement: boolean;
  theme: LoginTheme;
};

const navigation: { id: SectionId; label: string; icon: string }[] = [
  { id: "inicio", label: "Inicio", icon: "⌂" },
  { id: "automoviles", label: "Catálogo de automóviles", icon: "◈" },
  { id: "repuestos", label: "Repuestos", icon: "⚙" },
  { id: "categorias", label: "Categorías", icon: "▦" },
  { id: "accesorios", label: "Accesorios", icon: "✧" },
  { id: "bebes", label: "Asientos para bebés", icon: "♡" },
  { id: "reservaciones", label: "Reservaciones", icon: "▤" },
  { id: "verificar", label: "Verificar reserva", icon: "✓" },
  { id: "contacto", label: "Contacto", icon: "✉" },
];

export default function Sidebar({ activeSection, onNavigate, onSignOut, showUserManagement, theme }: SidebarProps) {
  const visibleNavigation = showUserManagement
    ? [...navigation, { id: "usuarios" as const, label: "Usuarios", icon: "♙" }]
    : navigation;

  return (
    <aside className="gc-sidebar">
      <a className="gc-brand" href="#inicio" onClick={(event) => { event.preventDefault(); onNavigate("inicio"); }}>
        <GlobalCarLogo theme={theme} className="gc-sidebar-logo" />
        <span>GLOBAL <b>CAR</b><small>PREMIUM AUTOMOTIVE</small></span>
      </a>
      <div className="gc-side-label">MENÚ PRINCIPAL</div>
      <nav className="gc-navigation" aria-label="Menú principal">
        {visibleNavigation.map((item) => (
          <button
            type="button"
            key={item.id}
            className={`gc-nav-item${activeSection === item.id ? " is-active" : ""}`}
            onClick={() => onNavigate(item.id)}
            aria-current={activeSection === item.id ? "page" : undefined}
          >
            <span className="gc-nav-icon" aria-hidden="true">{item.icon}</span>
            <span>{item.label}</span>
            {item.id === "reservaciones" && <span className="gc-nav-dot" />}
          </button>
        ))}
      </nav>
      <div className="gc-sidebar-bottom">
        <div className="gc-help-card">
          <span className="gc-help-icon">✦</span>
          <strong>¿Necesitas ayuda?</strong>
          <span>Estamos para acompañarte.</span>
          <a href="mailto:contacto@globalcar.bo">Contactar asesor <b>↗</b></a>
        </div>
        <button className="gc-logout" type="button" onClick={onSignOut}><span aria-hidden="true">↗</span> Cerrar sesión</button>
      </div>
    </aside>
  );
}
