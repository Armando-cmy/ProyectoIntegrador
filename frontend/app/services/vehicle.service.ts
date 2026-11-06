import { AuthApiError, requestApi } from "./auth.service";
import type { FleetVehicle, VehicleInput } from "../models/vehicle";

function isFleetVehicle(value: unknown): value is FleetVehicle {
  if (typeof value !== "object" || value === null) return false;
  const vehicle = value as Record<string, unknown>;
  return (
    typeof vehicle.placa === "string" &&
    (typeof vehicle.anio === "number" || vehicle.anio === null) &&
    (typeof vehicle.color === "string" || vehicle.color === null) &&
    (typeof vehicle.kilometraje_actual === "number" || vehicle.kilometraje_actual === null) &&
    (typeof vehicle.monto_garantia === "number" || vehicle.monto_garantia === null) &&
    (typeof vehicle.sector_estacionamiento === "string" || vehicle.sector_estacionamiento === null) &&
    (typeof vehicle.estado === "string" || vehicle.estado === null) &&
    typeof vehicle.id_modelo === "number" &&
    typeof vehicle.id_sucursal === "number" &&
    typeof vehicle.id_categoria === "number" &&
    (typeof vehicle.id_seguro === "number" || vehicle.id_seguro === null) &&
    (typeof vehicle.imagen_url === "string" || vehicle.imagen_url === null) &&
    typeof vehicle.marca === "string" &&
    typeof vehicle.modelo === "string" &&
    typeof vehicle.categoria === "string" &&
    typeof vehicle.sucursal === "string"
  );
}

export async function getVehicles(): Promise<FleetVehicle[]> {
  const payload = await requestApi("/vehicles", { method: "GET" });
  if (!Array.isArray(payload) || !payload.every(isFleetVehicle)) {
    throw new AuthApiError("El backend devolvió una lista de vehículos inválida.", 502);
  }
  return payload;
}

export async function createVehicle(vehicle: VehicleInput): Promise<FleetVehicle> {
  const payload = await requestApi("/vehicles", {
    method: "POST",
    body: JSON.stringify(vehicle),
  });
  if (!isFleetVehicle(payload)) {
    throw new AuthApiError("El backend devolvió un vehículo inválido.", 502);
  }
  return payload;
}

export async function updateVehicle(vehicle: VehicleInput): Promise<FleetVehicle> {
  const payload = await requestApi(`/vehicles/${encodeURIComponent(vehicle.placa)}`, {
    method: "PUT",
    body: JSON.stringify(vehicle),
  });
  if (!isFleetVehicle(payload)) {
    throw new AuthApiError("El backend devolvió un vehículo inválido.", 502);
  }
  return payload;
}

export async function deleteVehicle(plate: string): Promise<void> {
  await requestApi(`/vehicles/${encodeURIComponent(plate)}`, { method: "DELETE" });
}

export async function uploadVehicleImage(plate: string, image: File): Promise<string> {
  const body = new FormData();
  body.append("file", image);
  const payload = await requestApi(
    `/vehicles/${encodeURIComponent(plate)}/image`,
    { method: "POST", body },
  );
  if (
    typeof payload !== "object" ||
    payload === null ||
    !("imagen_url" in payload) ||
    typeof payload.imagen_url !== "string"
  ) {
    throw new AuthApiError("El backend no devolvió la URL de la imagen.", 502);
  }
  return payload.imagen_url;
}
