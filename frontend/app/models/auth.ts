export type UserProfile = {
  id_usuario: number;
  nombre: string;
  usuario: string;
  rol: string;
  sucursal: string;
};

export type LoginCredentials = {
  username: string;
  password: string;
  rememberMe: boolean;
};

export type UserCatalogOption = {
  id: number;
  nombre: string;
};

export type ManagedUser = {
  id_usuario: number;
  nombre: string;
  usuario: string;
  rol: string;
  sucursal: string;
};

export type NewUser = {
  nombre: string;
  usuario: string;
  password: string;
  id_rol: number;
  id_sucursal: number;
};
