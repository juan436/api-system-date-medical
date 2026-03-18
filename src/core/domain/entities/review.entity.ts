export interface Review {
  id?: string;
  pacienteId: string;
  calificacion: number;
  comentario: string;
  createdAt?: Date;
  updatedAt?: Date;
}
