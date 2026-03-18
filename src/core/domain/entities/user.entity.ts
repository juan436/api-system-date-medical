export enum UserRole {
  ADMIN = 'admin',
  PACIENTE = 'paciente',
}

export enum UserStatus {
  ACTIVE = 'activo',
  INACTIVE = 'inactivo',
}

export interface User {
  id?: string;
  nombre: string;
  apellido: string;
  email: string;
  passwordHash: string;
  telefono: string;
  whatsapp?: string;
  fechaNacimiento?: Date;
  rol: UserRole;
  estado: UserStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
