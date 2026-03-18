export enum ServiceStatus {
  ACTIVE = 'activo',
  INACTIVE = 'inactivo',
}

export interface Service {
  id?: string;
  nombre: string;
  descripcion: string;
  duracionMinutos: number;
  precioReferencial: number;
  estado: ServiceStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
