"use client";

import { useMemo, useState } from "react";
import Sidebar, { type SectionId } from "./Sidebar";
import VehicleCatalog from "./VehicleCatalog";
import { products, type Product, type Vehicle } from "./catalog-data";
import { ProductCatalog } from "./ProductCatalog";
import ReservationPanel, { type CartItem, type Reservation } from "./ReservationPanel";

const categoryNames = ["Repuestos", "Accesorios", "Asientos para bebés"] as const;

export default function GlobalCarDashboard() {
  const [activeSection, setActiveSection] = useState<SectionId>("inicio");
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const compatibleProducts = useMemo(
    () => products.filter((product) => !selectedVehicle || product.compatibleWith.includes(selectedVehicle.id)),
    [selectedVehicle],
  );

  function addToCart(product: Product) {
    setCart((current) => {
      const existing = current.find((item) => item.product.id === product.id);
      if (existing) {
        return current.map((item) => item.product.id === product.id
          ? { ...item, quantity: Math.min(item.quantity + 1, product.available) }
          : item);
      }
      return [...current, { product, quantity: 1 }];
    });
    setActiveSection("reservaciones");
  }

  function changeQuantity(productId: string, quantity: number) {
    setCart((current) => current
      .map((item) => item.product.id === productId ? { ...item, quantity: Math.min(quantity, item.product.available) } : item)
      .filter((item) => item.quantity > 0));
  }

  function createReservation() {
    if (cart.length === 0) return;
    const snapshot = cart.map((item) => ({ ...item }));
    const total = snapshot.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    setReservations((current) => [{
      code: `GC-${Date.now().toString().slice(-8)}`,
      createdAt: new Date().toISOString(),
      status: "Pendiente de confirmación",
      items: snapshot,
      total,
    }, ...current]);
    setCart([]);
    setActiveSection("verificar");
  }

  const pageTitle: Record<SectionId, string> = {
    inicio: "Inicio",
    automoviles: "Automóviles",
    repuestos: "Repuestos",
    categorias: "Categorías",
    accesorios: "Accesorios",
    bebes: "Asientos para bebés",
    reservaciones: "Reservaciones",
    verificar: "Verificar reserva",
    contacto: "Contacto",
  };

  function renderContent() {
    if (activeSection === "automoviles") {
      return <VehicleCatalog selectedVehicleId={selectedVehicle?.id ?? null} onSelect={(vehicle) => { setSelectedVehicle(vehicle); setActiveSection("repuestos"); }} />;
    }
    if (activeSection === "repuestos") {
      return <ProductCatalog title="Repuestos compatibles" description="Piezas seleccionadas para el rendimiento y cuidado de tu vehículo." products={compatibleProducts.filter((product) => product.category === "Repuestos")} selectedVehicle={selectedVehicle} onAdd={addToCart} onChooseVehicle={() => setActiveSection("automoviles")} />;
    }
    if (activeSection === "accesorios" || activeSection === "bebes" || activeSection === "categorias") {
      const category = activeSection === "bebes" ? "Asientos para bebés" : activeSection === "accesorios" ? "Accesorios" : null;
      const visibleProducts = compatibleProducts.filter((product) => category ? product.category === category : product.category !== "Repuestos");
      return (
        <div className="gc-content-stack">
          {activeSection === "categorias" && <div className="gc-category-tabs">{categoryNames.map((name) => <button key={name} type="button" className="gc-category-tab" onClick={() => setActiveSection(name === "Repuestos" ? "repuestos" : name === "Accesorios" ? "accesorios" : "bebes")}>{name}<span>→</span></button>)}</div>}
          <ProductCatalog title={category ?? "Explora por categoría"} description="Detalles que hacen cada viaje más cómodo, seguro y personal." products={visibleProducts} selectedVehicle={selectedVehicle} onAdd={addToCart} onChooseVehicle={() => setActiveSection("automoviles")} requireVehicle={activeSection !== "accesorios" && activeSection !== "bebes" && activeSection !== "categorias"} />
        </div>
      );
    }
    if (activeSection === "reservaciones" || activeSection === "verificar") {
      return <ReservationPanel items={cart} reservations={reservations} verificationOnly={activeSection === "verificar"} onChangeQuantity={changeQuantity} onReserve={createReservation} />;
    }
    if (activeSection === "contacto") {
      return <section className="gc-contact-card"><span className="gc-kicker">ESTAMOS PARA ACOMPAÑARTE</span><h2>Hablemos de tu próximo viaje.</h2><p>Nuestro equipo puede ayudarte a encontrar el vehículo, repuesto o accesorio ideal.</p><a className="gc-gold-button" href="mailto:contacto@globalcar.bo">CONTACTAR A UN ASESOR <span>↗</span></a><div className="gc-contact-details"><span><small>ESCRÍBENOS</small>contacto@globalcar.bo</span><span><small>VISÍTANOS</small>La Paz, Bolivia</span><span><small>HORARIO</small>Lun – Sáb · 09:00 a 18:00</span></div></section>;
    }
    return (
      <div className="gc-content-stack">
        <section className="gc-welcome-card">
          <div><span className="gc-kicker">BIENVENIDO A GLOBAL CAR</span><h2>Todo lo que necesitas<br />para <em>seguir avanzando.</em></h2><p>Automóviles, repuestos y accesorios elegidos para acompañar cada destino.</p><button className="gc-gold-button" type="button" onClick={() => setActiveSection("automoviles")}>EXPLORAR AUTOMÓVILES <span>→</span></button></div>
          <div className="gc-welcome-art" aria-hidden="true"><span>GC</span><div className="gc-art-line" /></div>
        </section>
        <div className="gc-section-intro gc-home-intro"><div><span className="gc-kicker">UNA SELECCIÓN PARA TI</span><h2>Automóviles destacados</h2></div><button className="gc-text-link" type="button" onClick={() => setActiveSection("automoviles")}>Ver catálogo completo <span>→</span></button></div>
        <VehicleCatalog selectedVehicleId={selectedVehicle?.id ?? null} onSelect={(vehicle) => { setSelectedVehicle(vehicle); setActiveSection("repuestos"); }} />
        <div className="gc-home-shortcuts">{categoryNames.map((name) => <button key={name} type="button" onClick={() => setActiveSection(name === "Repuestos" ? "repuestos" : name === "Accesorios" ? "accesorios" : "bebes")}><span className="gc-kicker">DESCUBRE</span><strong>{name}</strong><span>Explorar selección →</span></button>)}</div>
      </div>
    );
  }

  return (
    <main className="gc-app flex min-h-screen">
      <Sidebar activeSection={activeSection} onNavigate={setActiveSection} />
      <div className="gc-main">
        <header className="gc-topbar">
          <div className="gc-breadcrumb">GLOBAL CAR <span>/</span> <strong>{pageTitle[activeSection]}</strong></div>
          <div className="gc-topbar-actions"><span className="gc-open-status"><i /> ATENCIÓN DISPONIBLE</span><button className="gc-user-avatar" type="button" aria-label="Perfil de usuario">GC</button></div>
        </header>
        <div className="gc-page-content">
          {renderContent()}
          <footer className="gc-footer"><span>© 2025 GLOBAL CAR</span><span>LA PAZ, BOLIVIA <b>·</b> EXPERIENCIA PREMIUM</span></footer>
        </div>
      </div>
    </main>
  );
}
