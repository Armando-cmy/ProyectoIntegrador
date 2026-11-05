"use client";

import { vehicles, type Vehicle } from "./catalog-data";

type VehicleCatalogProps = {
  selectedVehicleId: string | null;
  onSelect: (vehicle: Vehicle) => void;
};

export default function VehicleCatalog({ selectedVehicleId, onSelect }: VehicleCatalogProps) {
  return (
    <div className="gc-content-stack">
      <div className="gc-section-intro">
        <div><span className="gc-kicker">ENCUENTRA TU PRÓXIMO DESTINO</span><h2>Catálogo de automóviles</h2><p>Elige tu vehículo para descubrir repuestos y accesorios compatibles.</p></div>
        <span className="gc-count-badge">{vehicles.length} VEHÍCULOS</span>
      </div>
      <div className="gc-vehicle-grid">
        {vehicles.map((vehicle) => (
          <article className={`gc-vehicle-card${selectedVehicleId === vehicle.id ? " is-selected" : ""}`} key={vehicle.id}>
            <div className="gc-vehicle-photo" style={{ backgroundImage: `linear-gradient(0deg,rgba(14,15,14,.82),transparent 58%),url("${vehicle.image}")` }}>
              <span className="gc-vehicle-type">{vehicle.type}</span>
              <span className="gc-vehicle-year">{vehicle.year}</span>
            </div>
            <div className="gc-vehicle-info">
              <span className="gc-vehicle-brand">{vehicle.brand}</span>
              <h3>{vehicle.model}</h3>
              <button type="button" className="gc-outline-button" onClick={() => onSelect(vehicle)}>
                {selectedVehicleId === vehicle.id ? "AUTOMÓVIL SELECCIONADO" : "SELECCIONAR AUTOMÓVIL"} <span>→</span>
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
