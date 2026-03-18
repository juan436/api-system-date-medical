import { Appointment, AppointmentStatus } from '../../domain/entities/appointment.entity';
import { IAppointmentRepository } from '../../domain/repositories/appointment.repository.interface';
import { IServiceRepository } from '../../domain/repositories/service.repository.interface';
import { CheckAvailabilityUseCase } from './check-availability.use-case';

export interface BookAppointmentInput {
  pacienteId: string;
  servicioId: string;
  fechaCita: Date;
  notasPaciente?: string;
}

export class BookAppointmentUseCase {
  constructor(
    private readonly appointmentRepository: IAppointmentRepository,
    private readonly serviceRepository: IServiceRepository,
    private readonly checkAvailability: CheckAvailabilityUseCase,
  ) {}

  async execute(input: BookAppointmentInput): Promise<Appointment> {
    const service = await this.serviceRepository.findById(input.servicioId);
    if (!service) {
      throw new Error('El servicio no existe');
    }
    if (service.estado !== 'activo') {
      throw new Error('El servicio no está disponible');
    }

    const availability = await this.checkAvailability.execute(input.fechaCita);
    if (!availability.disponible) {
      throw new Error('No hay disponibilidad para la fecha seleccionada');
    }

    return this.appointmentRepository.create({
      pacienteId: input.pacienteId,
      servicioId: input.servicioId,
      fechaCita: input.fechaCita,
      estado: AppointmentStatus.PENDIENTE,
      notasPaciente: input.notasPaciente,
    });
  }
}
