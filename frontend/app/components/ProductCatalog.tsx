"use client";

import type { Product, Vehicle } from "./catalog-data";

type ProductCatalogProps = {
  title: string;
  description: string;
  products: Product[];
  selectedVehicle: Vehicle | null;
  onAdd: (product: Product) => void;
  onChooseVehicle: () => void;
  requireVehicle?: boolean;
};

export function ProductCatalog({ title, description, products, selectedVehicle, onAdd, onChooseVehicle, requireVehicle = true }: ProductCatalogProps) {
  if (!selectedVehicle && requireVehicle) {
    return (
      <section className="gc-empty-state">
        <span className="gc-empty-icon">◈</span>
        <span className="gc-kicker">COMPATIBILIDAD PRECISA</span>
        <h2>Selecciona tu automóvil</h2>
        <p>Para mostrarte repuestos compatibles, primero elige un vehículo del catálogo.</p>
        <button className="gc-gold-button" type="button" onClick={onChooseVehicle}>VER AUTOMÓVILES <span>→</span></button>
      </section>
    );
  }

  if (selectedVehicle?.isFleetVehicle) {
    return (
      <section className="gc-empty-state">
        <span className="gc-empty-icon">◈</span>
        <span className="gc-kicker">VEHÍCULO SELECCIONADO</span>
        <h2>Compatibilidad pendiente</h2>
        <p>La base de datos de productos todavía no está conectada al modelo de este vehículo. No mostraremos repuestos como compatibles hasta contar con esa relación.</p>
        <button className="gc-gold-button" type="button" onClick={onChooseVehicle}>VOLVER AL CATÁLOGO <span>→</span></button>
      </section>
    );
  }

  const vehicleLabel = selectedVehicle
    ? `${selectedVehicle.brand.toUpperCase()} ${selectedVehicle.model.toUpperCase()}`
    : "VARIOS MODELOS";

  return (
    <div className="gc-content-stack">
      <div className="gc-section-intro">
        <div><span className="gc-kicker">SELECCIÓN COMPATIBLE CON {vehicleLabel}</span><h2>{title}</h2><p>{description}</p></div>
        {selectedVehicle && <button className="gc-vehicle-chip" type="button" onClick={onChooseVehicle}>◈ {selectedVehicle.brand} {selectedVehicle.model} <span>⌄</span></button>}
      </div>
      {products.length === 0 ? <p className="gc-empty-copy">No hay productos disponibles en esta categoría.</p> : (
        <div className="gc-product-grid">
          {products.map((product) => (
            <article className="gc-product-card" key={product.id}>
              <div className="gc-product-photo" style={{ backgroundImage: `linear-gradient(0deg,rgba(14,15,14,.15),transparent 55%),url("${product.image}")` }}>
                <span className={`gc-stock${product.available < 6 ? " is-low" : ""}`}><i />{product.available > 0 ? `${product.available} disponibles` : "Agotado"}</span>
              </div>
              <div className="gc-product-info">
                <div className="gc-product-topline"><span>{product.brand}</span><span>{product.code}</span></div>
                <h3>{product.name}</h3>
                <p className="gc-compatibility">✓ {selectedVehicle ? `Compatible con ${selectedVehicle.brand} ${selectedVehicle.model}` : "Compatible con varios modelos"}</p>
                <div className="gc-product-bottom"><strong>Bs. {product.price.toLocaleString("es-BO")}</strong><button type="button" disabled={product.available === 0} onClick={() => onAdd(product)} aria-label={`Agregar ${product.name} a la reserva`}>+</button></div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
