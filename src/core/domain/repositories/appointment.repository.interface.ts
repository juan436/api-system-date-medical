import { Appointment } from '../entities/appointment.entity';

export interface PaginatedAppointments {
  data: Appointment[];
  total: number;
  page: number;
  limit: number;
}

export interface IAppointmentRepository {
  create(appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Appointment>;
  findById(id: string): Promise<Appointment | null>;
  findByDate(date: Date): Promise<Appointment[]>;
  findByDatePaginated(date: Date, page: number, limit: number, status?: string): Promise<PaginatedAppointments>;
  findByPacienteId(pacienteId: string): Promise<Appointment[]>;
  countByDate(date: Date): Promise<number>;
  update(id: string, data: Partial<Appointment>): Promise<Appointment | null>;
}

export const APPOINTMENT_REPOSITORY = Symbol('IAppointmentRepository');
