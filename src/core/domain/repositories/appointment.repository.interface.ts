import { Appointment } from '../entities/appointment.entity';

export interface IAppointmentRepository {
  create(appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Appointment>;
  findById(id: string): Promise<Appointment | null>;
  findByDate(date: Date): Promise<Appointment[]>;
  findByPacienteId(pacienteId: string): Promise<Appointment[]>;
  countByDate(date: Date): Promise<number>;
  update(id: string, data: Partial<Appointment>): Promise<Appointment | null>;
}

export const APPOINTMENT_REPOSITORY = Symbol('IAppointmentRepository');
