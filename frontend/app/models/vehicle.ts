export type FleetVehicle = {
  placa: string;
  anio: number | null;
  color: string | null;
  kilometraje_actual: number | null;
  monto_garantia: number | null;
  sector_estacionamiento: string | null;
  estado: string | null;
  id_modelo: number;
  id_sucursal: number;
  id_categoria: number;
  id_seguro: number | null;
  imagen_url: string | null;
  marca: string;
  modelo: string;
  categoria: string;
  sucursal: string;
};

export type VehicleInput = {
  placa: string;
  anio: number;
  color: string;
  kilometraje_actual: number;
  monto_garantia: number;
  sector_estacionamiento: string;
  estado: string;
  id_modelo: number;
  id_sucursal: number;
  id_categoria: number;
  id_seguro: number | null;
  imagen_url: string | null;
};
