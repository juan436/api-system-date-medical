export interface DoctorProfile {
  id?: string;
  userId: string;
  nombreCompleto: string;
  titulo: string;
  biografia: string;
  especialidad: string;
  logrosAcademicos: string[];
  experienciaAnios: number;
  fotoPerfil?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
