export enum AppointmentStatus {
  PENDIENTE = 'pendiente',
  CONFIRMADA = 'confirmada',
  CANCELADA = 'cancelada',
  COMPLETADA = 'completada',
  REPROGRAMADA = 'reprogramada',
}

export interface Appointment {
  id?: string;
  pacienteId: string;
  servicioId: string;
  fechaCita: Date;
  estado: AppointmentStatus;
  notasPaciente?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
